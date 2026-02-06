"use client";

import { Deal, FUNNELS } from "@/types";
import { formatCurrency } from "@/lib/bitrix";
import { Briefcase, Clock } from "lucide-react";

interface DealCardProps {
    deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
    const lastUpdated = new Date(deal.lastUpdated);
    const timeAgo = getTimeAgo(lastUpdated);

    // Get funnel short name
    const funnel = FUNNELS.find(f => f.stageId === deal.stageId);
    const funnelName = funnel?.shortName || "";

    return (
        <div
            className="deal-card bg-[#151515] rounded-xl border border-gray-800/50 hover:border-[#A9F804]/30 transition-all p-4 lg:p-2.5"
        >
            {/* Funnel Badge */}


            {/* Nome da Empresa */}
            <div className="flex items-start gap-3 lg:gap-2 mb-3 lg:mb-1.5">
                <div className="w-10 h-10 lg:w-8 lg:h-8 rounded-lg bg-[#1E1E1E] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm lg:text-[13px] font-semibold text-white leading-snug line-clamp-2">
                        {cleanTitle(deal.companyTitle || deal.title)}
                    </p>
                </div>
                {funnelName && (
                    <span className="flex-shrink-0 text-[10px] lg:text-[10px] font-medium text-[#A9F804] bg-[#A9F804]/10 px-1.5 py-0.5 rounded-md">
                        {funnelName}
                    </span>
                )}
            </div>

            {/* Valor e Data */}
            <div className="flex items-center justify-between pt-3 lg:pt-1.5 border-t border-gray-800/50">
                <span className="text-lg lg:text-base font-bold text-[#A9F804]">
                    {formatCurrency(deal.opportunity)}
                </span>
                <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5 lg:w-3 lg:h-3" />
                    <span className="text-xs lg:text-[11px]">{timeAgo}</span>
                </div>
            </div>
        </div>
    );
}

function cleanTitle(title: string): string {
    if (!title) return "";

    // Lista de prefixos para remover
    const prefixesToRemove = [
        "Venda Direta Residencial",
        "Lista de Projeto Residencial",
        "Venda Direta Corporativo", // Ordem importa: mais específico antes
        "Venda Direta",
        "Decorativo Comercial",
        "Lista de Projeto Comercial",
        "Projeto Residencial",
        "Projeto Corporativo",
        "Projeto Comercial",
        "Projeto Residencial",
    ];

    let cleaned = title;

    for (const prefix of prefixesToRemove) {
        // Remove o prefixo (case insensitive) e possíveis separadores como " - " ou " "
        const regex = new RegExp(`^${prefix}\\s*(-)?\\s*`, 'i');
        cleaned = cleaned.replace(regex, '');
    }

    return cleaned.trim();
}

function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
    });
}
