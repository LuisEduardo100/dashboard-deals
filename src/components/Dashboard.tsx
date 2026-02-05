"use client";

import useSWR from "swr";
import { ApiResponse, DashboardData } from "@/types";
import TotalsHeader from "@/components/TotalsHeader";
import SalesmanColumn from "@/components/SalesmanColumn";
import { WifiOff } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
    const refreshInterval = 30000;

    const { data, error, isLoading, isValidating } = useSWR<ApiResponse>(
        "/api/deals",
        fetcher,
        {
            refreshInterval,
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    );

    if (isLoading && !data) {
        return <LoadingSkeleton />;
    }

    if (error || (data && !data.success)) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#121212] text-white">
                <WifiOff className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Erro de Conexão</h1>
                <p className="text-gray-400">
                    Não foi possível conectar ao Bitrix24. Tentando reconectar...
                </p>
            </div>
        );
    }

    const dashboardData = data?.data as DashboardData;

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-[#121212]">
            {/* Header com Totais */}
            <TotalsHeader
                funnelTotals={dashboardData.funnelTotals}
                grandTotal={dashboardData.grandTotal}
                lastUpdated={new Date(dashboardData.lastUpdated)}
                isValidating={isValidating}
                fromCache={data?.fromCache || false}
            />

            {/* Kanban por Vendedor - Grid fixo de 5 colunas para caber na TV 100% */}
            <div className="flex-1 grid grid-cols-5 p-2 gap-2 overflow-hidden">
                {dashboardData.salesmen.map((salesman, index) => (
                    <SalesmanColumn
                        key={salesman.id}
                        salesman={salesman}
                        animationDelay={index * 100}
                    />
                ))}
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-[#121212]">
            {/* Header skeleton */}
            <div className="px-6 py-5 border-b border-gray-800">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="h-10 w-10 loading-shimmer rounded-lg" />
                        <div className="h-8 w-48 loading-shimmer rounded" />
                        <div className="flex gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-14 w-32 loading-shimmer rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Columns skeleton */}
            <div className="flex-1 grid grid-cols-5 p-2 gap-2 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="flex-1 bg-[#1E1E1E] rounded-xl p-5"
                    >
                        <div className="h-8 w-32 loading-shimmer rounded mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((j) => (
                                <div
                                    key={j}
                                    className="h-32 loading-shimmer rounded-xl"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
