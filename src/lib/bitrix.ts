import {
    BitrixDeal,
    BitrixListResponse,
    Deal,
    FUNNELS,
    SALESMAN_IDS,
} from "@/types";

const BITRIX_WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL || "";

/**
 * Retry with exponential backoff for rate limit handling
 */
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 5,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            // Check if it's a rate limit error (503)
            if (error instanceof Error && error.message.includes("503")) {
                const delay = baseDelay * Math.pow(2, attempt);
                console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }

    throw lastError;
}

/**
 * Fetch all deals from a specific stage with pagination handling
 */
async function fetchDealsFromStage(stageId: string): Promise<BitrixDeal[]> {
    const allDeals: BitrixDeal[] = [];
    let start = 0;
    const limit = 50;

    while (true) {
        const response = await retryWithBackoff(async () => {
            const url = `${BITRIX_WEBHOOK_URL}crm.deal.list.json`;
            const params = new URLSearchParams({
                "filter[STAGE_ID]": stageId,
                "filter[CLOSED]": "N",
                "select[]": "ID",
                start: start.toString(),
            });

            // Add select fields
            ["TITLE", "OPPORTUNITY", "ASSIGNED_BY_ID", "STAGE_ID", "COMPANY_TITLE", "DATE_MODIFY", "CLOSEDATE"].forEach(
                (field) => params.append("select[]", field)
            );

            // Add salesman filter
            SALESMAN_IDS.forEach((id) =>
                params.append("filter[ASSIGNED_BY_ID][]", id.toString())
            );

            const res = await fetch(`${url}?${params.toString()}`, {
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            return res.json() as Promise<BitrixListResponse>;
        });

        allDeals.push(...response.result);

        // Check if there are more pages
        if (response.next) {
            start = response.next;
        } else {
            break;
        }
    }

    return allDeals;
}

/**
 * Transform Bitrix deal to our Deal format
 */
function transformDeal(bitrixDeal: BitrixDeal): Deal {
    return {
        id: parseInt(bitrixDeal.ID),
        title: bitrixDeal.TITLE || "Sem título",
        opportunity: parseFloat(bitrixDeal.OPPORTUNITY) || 0,
        assignedById: parseInt(bitrixDeal.ASSIGNED_BY_ID),
        stageId: bitrixDeal.STAGE_ID,
        companyTitle: bitrixDeal.COMPANY_TITLE || bitrixDeal.TITLE || "Sem empresa",
        closeDate: bitrixDeal.CLOSEDATE ? new Date(bitrixDeal.CLOSEDATE) : undefined,
        lastUpdated: bitrixDeal.DATE_MODIFY
            ? new Date(bitrixDeal.DATE_MODIFY)
            : new Date(),
    };
}

/**
 * Fetch all deals from all configured funnels
 */
export async function fetchAllDeals(): Promise<Deal[]> {
    const allDeals: Deal[] = [];

    // Fetch from all funnels in parallel (but respecting rate limits via retryWithBackoff)
    const promises = FUNNELS.map(async (funnel) => {
        const bitrixDeals = await fetchDealsFromStage(funnel.stageId);
        return bitrixDeals.map(transformDeal);
    });

    const results = await Promise.all(promises);
    results.forEach((deals) => allDeals.push(...deals));

    return allDeals;
}

/**
 * Fetch closed deals (Won/Lost) for a specific date range
 */
export async function fetchClosedDeals(startDate: Date, endDate: Date): Promise<Deal[]> {
    const allDeals: BitrixDeal[] = [];

    // Format dates for Bitrix filter (YYYY-MM-DD)
    const startStr = startDate.toISOString();
    const endStr = endDate.toISOString();

    const promises = FUNNELS.map(async (funnel) => {
        let start = 0;
        const funnelDeals: BitrixDeal[] = [];

        while (true) {
            const response = await retryWithBackoff(async () => {
                const url = `${BITRIX_WEBHOOK_URL}crm.deal.list.json`;
                const params = new URLSearchParams({
                    "filter[CATEGORY_ID]": funnel.id,
                    "filter[CLOSED]": "Y",
                    "filter[>CLOSEDATE]": startStr,
                    "filter[<CLOSEDATE]": endStr,
                    "select[]": "ID",
                    start: start.toString(),
                });

                // Add select fields
                ["TITLE", "OPPORTUNITY", "ASSIGNED_BY_ID", "STAGE_ID", "COMPANY_TITLE", "DATE_MODIFY", "CLOSEDATE"].forEach(
                    (field) => params.append("select[]", field)
                );

                // Add salesman filter
                SALESMAN_IDS.forEach((id) =>
                    params.append("filter[ASSIGNED_BY_ID][]", id.toString())
                );

                const res = await fetch(`${url}?${params.toString()}`, {
                    cache: "no-store",
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }

                return res.json() as Promise<BitrixListResponse>;
            });

            funnelDeals.push(...response.result);

            if (response.next) {
                start = response.next;
            } else {
                break;
            }
        }
        return funnelDeals;
    });

    const results = await Promise.all(promises);
    results.forEach((deals) => allDeals.push(...deals));

    return allDeals.map(transformDeal);
}

/**
 * Format currency in BRL
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}
