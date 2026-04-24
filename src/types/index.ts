// Types for the Bitrix24 Dashboard

export interface BitrixDeal {
  ID: string;
  TITLE: string;
  OPPORTUNITY: string;
  ASSIGNED_BY_ID: string;
  STAGE_ID: string;
  COMPANY_TITLE?: string;
  DATE_MODIFY?: string;
  CLOSEDATE?: string;
}

export interface Deal {
  id: number;
  title: string;
  opportunity: number;
  assignedById: number;
  stageId: string;
  companyTitle: string;
  lastUpdated: Date;
  closeDate?: Date;
}

export interface Salesman {
  id: number;
  name: string;
  deals: Deal[];
  totalByFunnel: {
    [key: string]: number;
  };
  grandTotal: number;
  wonCount: number;
  lostCount: number;
  wonValue: number;
  lostValue: number;
}

export interface FunnelConfig {
  id: string;
  stageId: string;
  name: string;
  shortName: string;
}

export interface DashboardData {
  salesmen: Salesman[];
  funnelTotals: {
    [key: string]: number;
  };
  grandTotal: number;
  lastUpdated: Date;
}

export interface ApiResponse {
  success: boolean;
  data?: DashboardData;
  error?: string;
  fromCache?: boolean;
}

// Bitrix24 API response types
export interface BitrixListResponse {
  result: BitrixDeal[];
  next?: number;
  total?: number;
}

// Configuration constants - Only SMB and Barão (Corporativo removed)
export const FUNNELS: FunnelConfig[] = [
  {
    id: "8",
    stageId: "C8:NEW",
    name: "Negociações SMB (Fechamento Mês)",
    shortName: "SMB",
  },
  {
    id: "304",
    stageId: "C304:FINAL_INVOICE",
    name: "Corporativo (Formalização)",
    shortName: "Corporativo",
  },
  {
    id: "221",
    stageId: "C221:UC_BJEHYC",
    name: "[Lojas] Lumentech (Fechamento Semana)",
    shortName: "Lumentech",
  },
];

export const SALESMEN_CONFIG: { id: number; name: string; photo: string }[] = [
  { id: 52, name: "Yuri Queiroz", photo: "/salesman_photos/yuri.png" },
  { id: 190, name: "Mateus Martins", photo: "/salesman_photos/matheus_martins.png" },
  { id: 364, name: "Paulo César", photo: "/salesman_photos/paulo_cesar.png" },
  { id: 286, name: "Victor Jorge", photo: "/salesman_photos/victor.png" },
  { id: 2258, name: "Aderúcia Pereira", photo: "/salesman_photos/aderucia_pereira.png" },
  { id: 100, name: "Renato Campos", photo: "/salesman_photos/renato_campos.png" },
  { id: 2894, name: "Suênia Andrade", photo: "/salesman_photos/suenia.png" },
];

export const SALESMAN_IDS = SALESMEN_CONFIG.map((s) => s.id);
