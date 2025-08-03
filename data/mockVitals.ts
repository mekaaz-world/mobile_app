export interface VitalData {
  heartRate: number;
  spO2: number;
  temperature: number;
  steps: number;
  timestamp: Date;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  vitals: VitalData[];
}

export const generateMockVitals = (days: number = 30): VitalData[] => {
  const now = new Date();
  const data: VitalData[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    
    // Generate 24 hourly readings for each day
    for (let hour = 0; hour < 24; hour++) {
      const hourTimestamp = new Date(timestamp.getTime() + hour * 60 * 60 * 1000);
      
      // Base values with realistic variations
      const baseHeartRate = 70 + Math.sin(hour / 24 * Math.PI) * 10; // Lower at night
      const baseSpO2 = 97 + Math.random() * 2; // 97-99%
      const baseTemperature = 36.5 + Math.sin(hour / 24 * Math.PI) * 0.5; // Slight variation
      const baseSteps = hour < 6 ? 0 : Math.floor(Math.random() * 200) + 50; // No steps at night
      
      data.push({
        heartRate: Math.round(baseHeartRate + (Math.random() - 0.5) * 10),
        spO2: Math.round(baseSpO2 + (Math.random() - 0.5) * 2),
        temperature: +(baseTemperature + (Math.random() - 0.5) * 0.3).toFixed(1),
        steps: Math.max(0, baseSteps + Math.floor((Math.random() - 0.5) * 100)),
        timestamp: hourTimestamp,
      });
    }
  }

  return data;
};

export const generateFamilyVitals = (): FamilyMember[] => {
  return [
    {
      id: '1',
      name: 'Sarah Ahmed',
      role: 'Daughter',
      avatar: '👩‍💼',
      vitals: generateMockVitals(7), // 7 days of data
    },
    {
      id: '2',
      name: 'Omar Ahmed',
      role: 'Son',
      avatar: '👨‍💻',
      vitals: generateMockVitals(7),
    },
    {
      id: '3',
      name: 'Fatima Al-Zahra',
      role: 'Mother',
      avatar: '👵',
      vitals: generateMockVitals(7),
    },
  ];
};

export const mockDevices = [
  { id: '1', name: 'Mekaaz-1001', signal: 85 },
  { id: '2', name: 'Mekaaz-1002', signal: 72 },
  { id: '3', name: 'Mekaaz-1003', signal: 90 },
];

// Helper functions for data aggregation
export const getAverageVitals = (data: VitalData[]): VitalData => {
  if (data.length === 0) return { heartRate: 0, spO2: 0, temperature: 0, steps: 0, timestamp: new Date() };
  
  const sum = data.reduce((acc, curr) => ({
    heartRate: acc.heartRate + curr.heartRate,
    spO2: acc.spO2 + curr.spO2,
    temperature: acc.temperature + curr.temperature,
    steps: acc.steps + curr.steps,
    timestamp: new Date(),
  }), { heartRate: 0, spO2: 0, temperature: 0, steps: 0, timestamp: new Date() });

  return {
    heartRate: Math.round(sum.heartRate / data.length),
    spO2: Math.round(sum.spO2 / data.length),
    temperature: +(sum.temperature / data.length).toFixed(1),
    steps: Math.round(sum.steps / data.length),
    timestamp: new Date(),
  };
};

export const getVitalsByPeriod = (data: VitalData[], period: 'day' | 'week' | 'month'): VitalData[] => {
  const now = new Date();
  const periods = {
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
  };

  const cutoff = now.getTime() - periods[period];
  return data.filter(vital => vital.timestamp.getTime() >= cutoff);
};

export const getChartData = (data: VitalData[], metric: keyof Omit<VitalData, 'timestamp'>) => {
  return data.map(vital => ({
    value: vital[metric],
    timestamp: vital.timestamp,
  }));
};