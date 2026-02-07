"use client";

import Image from "next/image";
import { Salesman, SALESMEN_CONFIG } from "@/types";
import { formatCurrency } from "@/lib/bitrix";
import DealCard from "@/components/DealCard";
import { User } from "lucide-react";

interface SalesmanColumnProps {
    salesman: Salesman;
    animationDelay: number;
}

export default function SalesmanColumn({
    salesman,
    animationDelay,
}: SalesmanColumnProps) {
    // Get salesman photo from config
    const salesmanConfig = SALESMEN_CONFIG.find((s) => s.id === salesman.id);
    const photoUrl = salesmanConfig?.photo;

    // Sort deals by lastUpdated - newest first
    const sortedDeals = [...salesman.deals].sort((a, b) => {
        const dateA = new Date(a.lastUpdated).getTime();
        const dateB = new Date(b.lastUpdated).getTime();
        return dateB - dateA;
    });

    return (
        <div
            className="flex flex-col bg-[#1E1E1E] rounded-2xl overflow-hidden animate-fade-in h-full"
            style={{ animationDelay: `${animationDelay}ms` }}
        >
            {/* Header do Vendedor */}
            <div className="p-3 lg:p-2 bg-gradient-to-r from-[#1E1E1E] to-[#252525] border-b border-gray-800">
                <div className="flex items-center gap-4 mb-4">
                    {/* Photo - cleaner look without borders, neutral bg for transparent pngs */}
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                        {photoUrl ? (
                            <Image
                                src={photoUrl}
                                alt={salesman.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-contain transition-transform"
                                style={{
                                    objectPosition: "center top",
                                    transform: salesman.id === 286 ? "scale(1.05) translateY(7px)" : "none",
                                    transformOrigin: "top center"
                                }}
                            />
                        ) : (
                            <User className="w-8 h-8 text-gray-400" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white truncate">
                            {salesman.name}
                        </h2>
                        <p className="text-sm text-gray-400">
                            {salesman.deals.length} negócio
                            {salesman.deals.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {/* Total do Vendedor */}
                {/* Métricas do Vendedor */}
                {/* Métricas do Vendedor */}
                <div className="flex items-center justify-between px-2 py-2 bg-[#121212] rounded-lg gap-2">
                    {/* Total Geral */}
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-[10px] text-gray-500 font-medium">Total</span>
                        <span className="text-sm font-bold text-[#A9F804] glow-accent">
                            {formatCurrency(salesman.grandTotal)}
                        </span>
                    </div>

                    {/* Divisor */}
                    <div className="w-[1px] h-6 bg-gray-800" />

                    {/* Ganho */}
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-[10px] text-[#A9F804] font-medium whitespace-nowrap">
                            Ganho ({salesman.wonCount})
                        </span>
                        <span className="text-sm font-bold text-[#A9F804]">
                            {formatCurrency(salesman.wonValue)}
                        </span>
                    </div>

                    {/* Divisor */}
                    <div className="w-[1px] h-6 bg-gray-800" />

                    {/* Perdido */}
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-[10px] text-red-900 font-medium whitespace-nowrap">
                            Perdido ({salesman.lostCount})
                        </span>
                        <span className="text-sm font-bold text-red-900">
                            {formatCurrency(salesman.lostValue)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Cards de Negócios - padding e espaço entre cards */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-2.5 lg:p-2 space-y-2 lg:space-y-1.5">
                {sortedDeals.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                        <p className="text-sm">Nenhum negócio</p>
                    </div>
                ) : (
                    sortedDeals.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                    ))
                )}
            </div>
        </div>
    );
}
