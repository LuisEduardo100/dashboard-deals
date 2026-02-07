import { NextResponse } from "next/server";
import { fetchAllDeals, fetchClosedDeals } from "@/lib/bitrix";
import {
    DashboardData,
    Salesman,
    SALESMEN_CONFIG,
    FUNNELS,
    Deal,
} from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/deals
 * Fetches deals from Bitrix24 and returns organized dashboard data
 */
export async function GET() {
    try {
        // Fetch directly from Bitrix24
        const deals = await fetchAllDeals();

        // Fetch closed deals for the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const closedDeals = await fetchClosedDeals(startOfMonth, endOfMonth);

        // Organize data by salesman
        const dashboardData = organizeDashboardData(deals, closedDeals);

        return NextResponse.json({
            success: true,
            data: dashboardData,
            fromCache: false,
        });
    } catch (error) {
        console.error("Error fetching from Bitrix24:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch deals",
            },
            { status: 500 }
        );
    }
}

/**
 * Organize deals into dashboard display structure
 */
function organizeDashboardData(deals: Deal[], closedDeals: Deal[]): DashboardData {
    const salesmen: Salesman[] = SALESMEN_CONFIG.map((config) => {
        const salesmanDeals = deals.filter((d) => d.assignedById === config.id);
        const salesmanClosedDeals = closedDeals.filter((d) => d.assignedById === config.id);

        // Calculate totals by funnel
        const totalByFunnel: { [key: string]: number } = {};
        FUNNELS.forEach((funnel) => {
            const funnelDeals = salesmanDeals.filter(
                (d) => d.stageId === funnel.stageId
            );
            totalByFunnel[funnel.stageId] = funnelDeals.reduce(
                (sum, d) => sum + d.opportunity,
                0
            );
        });

        const grandTotal = Object.values(totalByFunnel).reduce(
            (sum, val) => sum + val,
            0
        );

        // Calculate Won/Lost metrics
        const wonDeals = salesmanClosedDeals.filter((d) => d.stageId.includes("WON"));
        const lostDeals = salesmanClosedDeals.filter((d) => d.stageId.includes("LOSE"));

        const wonCount = wonDeals.length;
        const wonValue = wonDeals.reduce((sum, d) => sum + d.opportunity, 0);

        const lostCount = lostDeals.length;
        const lostValue = lostDeals.reduce((sum, d) => sum + d.opportunity, 0);

        return {
            id: config.id,
            name: config.name,
            deals: salesmanDeals,
            totalByFunnel,
            grandTotal,
            wonCount,
            lostCount,
            wonValue,
            lostValue,
        };
    });

    // Calculate overall funnel totals
    const funnelTotals: { [key: string]: number } = {};
    FUNNELS.forEach((funnel) => {
        funnelTotals[funnel.stageId] = salesmen.reduce(
            (sum, s) => sum + (s.totalByFunnel[funnel.stageId] || 0),
            0
        );
    });

    const grandTotal = Object.values(funnelTotals).reduce(
        (sum, val) => sum + val,
        0
    );

    return {
        salesmen,
        funnelTotals,
        grandTotal,
        lastUpdated: new Date(),
    };
}
