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
            className="flex-1 min-w-[260px] flex flex-col bg-[#1E1E1E] rounded-2xl overflow-hidden animate-fade-in"
            style={{ animationDelay: `${animationDelay}ms` }}
        >
            {/* Header do Vendedor */}
            <div className="p-4 bg-gradient-to-r from-[#1E1E1E] to-[#252525] border-b border-gray-800">
                <div className="flex items-center gap-4 mb-4">
                    {/* Photo - bigger icon with object-contain to avoid cropping */}
                    <div className="w-16 h-16 rounded-full bg-[#A9F804]/10 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-[#A9F804]/30">
                        {photoUrl ? (
                            <Image
                                src={photoUrl}
                                alt={salesman.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-contain"
                                style={{ objectPosition: "center top" }}
                            />
                        ) : (
                            <User className="w-8 h-8 text-[#A9F804]" />
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
                <div className="flex items-center justify-between px-3 py-2 bg-[#121212] rounded-lg">
                    <span className="text-sm text-gray-400 font-medium">Total</span>
                    <span className="text-xl font-bold text-[#A9F804] glow-accent">
                        {formatCurrency(salesman.grandTotal)}
                    </span>
                </div>
            </div>

            {/* Cards de Negócios - padding e espaço entre cards */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-3">
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
