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
        <div className="deal-card bg-[#151515] rounded-xl p-6 border border-gray-800/50 hover:border-[#A9F804]/30 transition-all">
            {/* Funnel Badge */}
            {funnelName && (
                <div className="mb-4">
                    <span className="text-xs font-medium text-[#A9F804] bg-[#A9F804]/10 px-3 py-1.5 rounded-lg">
                        {funnelName}
                    </span>
                </div>
            )}

            {/* Nome da Empresa */}
            <div className="flex items-start gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl bg-[#1E1E1E] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-white leading-snug line-clamp-2">
                        {cleanTitle(deal.companyTitle || deal.title)}
                    </p>
                </div>
            </div>

            {/* Valor e Data */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                <span className="text-xl font-bold text-[#A9F804]">
                    {formatCurrency(deal.opportunity)}
                </span>
                <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{timeAgo}</span>
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
        "Projeto Residencial"
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
