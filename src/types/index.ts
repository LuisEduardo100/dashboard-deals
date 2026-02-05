// Types for the Bitrix24 Dashboard

export interface BitrixDeal {
  ID: string;
  TITLE: string;
  OPPORTUNITY: string;
  ASSIGNED_BY_ID: string;
  STAGE_ID: string;
  COMPANY_TITLE?: string;
  DATE_MODIFY?: string;
}

export interface Deal {
  id: number;
  title: string;
  opportunity: number;
  assignedById: number;
  stageId: string;
  companyTitle: string;
  lastUpdated: Date;
}

export interface Salesman {
  id: number;
  name: string;
  deals: Deal[];
  totalByFunnel: {
    [key: string]: number;
  };
  grandTotal: number;
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
    id: "306",
    stageId: "C306:UC_GZ70P4",
    name: "Barão (Fechamento Semana)",
    shortName: "Barão",
  },
];

export const SALESMEN_CONFIG: { id: number; name: string; photo: string }[] = [
  { id: 52, name: "Yuri Queiroz", photo: "/salesman_photos/yuri.png" },
  { id: 190, name: "Mateus Martins", photo: "/salesman_photos/matheus_martins.png" },
  { id: 70, name: "Raquel Freitas", photo: "/salesman_photos/raquel.png" },
  { id: 364, name: "Paulo César", photo: "/salesman_photos/paulo_cesar.png" },
  { id: 286, name: "Victor Jorge", photo: "/salesman_photos/victor.png" },
];

export const SALESMAN_IDS = SALESMEN_CONFIG.map((s) => s.id);
