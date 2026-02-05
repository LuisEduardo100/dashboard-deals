"use client";

import { FUNNELS } from "@/types";
import { formatCurrency } from "@/lib/bitrix";
import { TrendingUp, Target, Wifi, RefreshCw } from "lucide-react";

interface TotalsHeaderProps {
    funnelTotals: { [key: string]: number };
    grandTotal: number;
    lastUpdated: Date;
    isValidating: boolean;
    fromCache: boolean;
}

const funnelIcons: { [key: string]: React.ReactNode } = {
    "C8:NEW": <TrendingUp className="w-5 h-5" />,
    "C306:UC_GZ70P4": <Target className="w-5 h-5" />,
};

export default function TotalsHeader({
    funnelTotals,
    grandTotal,
    lastUpdated,
    isValidating,
    fromCache,
}: TotalsHeaderProps) {
    const formattedTime = lastUpdated.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <header className="header-gradient px-5 py-3 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
                {/* Left side: Logo, Título e Totais por Funil */}
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-11 h-11 bg-[#A9F804] rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-black" />
                    </div>

                    {/* Título */}
                    <div className="mr-4">
                        <h1 className="text-2xl font-bold text-white">Dashboard Comercial</h1>
                        <p className="text-sm text-gray-400">
                            Atualizado às {formattedTime}
                        </p>
                    </div>

                    {/* Totais por Funil - ao lado do título */}
                    {FUNNELS.map((funnel) => (
                        <div
                            key={funnel.stageId}
                            className="flex items-center gap-2 px-3 py-2 bg-[#1E1E1E] rounded-lg border border-gray-800"
                        >
                            <div className="text-[#A9F804]">
                                {funnelIcons[funnel.stageId] || <Target className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">
                                    {funnel.shortName}
                                </p>
                                <p className="text-lg font-bold text-[#A9F804] glow-accent">
                                    {formatCurrency(funnelTotals[funnel.stageId] || 0)}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Total Geral */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#A9F804]/10 rounded-lg border-2 border-[#A9F804]/30">
                        <div>
                            <p className="text-xs text-[#A9F804] uppercase tracking-wider font-semibold">
                                Total Geral
                            </p>
                            <p className="text-xl font-black text-[#A9F804] glow-accent">
                                {formatCurrency(grandTotal)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side: Status indicators */}
                <div className="flex items-center gap-3">
                    {fromCache && (
                        <span className="text-xs text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-lg">
                            Cache
                        </span>
                    )}
                    {isValidating && (
                        <RefreshCw className="w-5 h-5 text-[#A9F804] animate-spin" />
                    )}
                    <div className="w-9 h-9 rounded-lg bg-[#1E1E1E] flex items-center justify-center">
                        <Wifi className="w-5 h-5 text-[#A9F804]" />
                    </div>
                </div>
            </div>
        </header>
    );
}
