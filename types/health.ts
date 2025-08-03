
export interface VitalData {
  heartRate: number;
  spO2: number;
  temperature: number;
  steps: number;
  timestamp: Date;
}

export interface HistoricalData {
  metric: string;
  values: { value: number; timestamp: Date }[];
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  connectedAt: Date;
}

export interface Device {
  id: string;
  name: string;
  type: 'bracelet' | 'watch';
  batteryLevel: number;
  connected: boolean;
}

export type UserRole = 'patient' | 'family';
