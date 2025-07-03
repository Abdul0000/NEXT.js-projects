export interface PatientVital {
  timestamp: string;
  [key: string]: number | string;
}

export interface LabResult {
  value: number;
  unit: string;
  normalRange: [number, number];
}

export interface RiskScore {
  score: number;
  category: string;
  maxScore: number;
}

export interface PatientEvent {
  timestamp: string;
  type: string;
  description: string;
}

export interface PatientData {
  patientId: string;
  vitals: {
    bloodPressure: {
      timeSeries: Array<{ timestamp: string; systolic: number; diastolic: number }>;
      current: { systolic: number; diastolic: number };
    };
    heartRate: {
      timeSeries: Array<{ timestamp: string; bpm: number }>;
      current: number;
    };
    temperature: {
      timeSeries: Array<{ timestamp: string; celsius: number }>;
      current: number;
    };
    oxygenSaturation: {
      timeSeries: Array<{ timestamp: string; percentage: number }>;
      current: number;
    };
  };
  labResults: {
    bloodPanel: Record<string, LabResult>;
    metabolicPanel: Record<string, LabResult>;
    liverFunction: Record<string, LabResult>;
  };
  riskScores: Record<string, RiskScore>;
  events: PatientEvent[];
}

export type ChartType = 
  | "lineChart" 
  | "bulletChart" 
  | "groupedBarChart" 
  | "radarChart" 
  | "donutChart"
  | "heatmapChart" 
  | "sparklineChart" 
  | "timelineChart" 
  | "gaugeChart" 
  | "sankeyChart"
  | "waterfallChart" 
  | "correlationMatrix";

export interface ChartConfig {
  chartType: ChartType;
  title: string;
  description: string;
  unit: string | null;
  normalRange: [number, number] | null;
  data: any;
  trend?: string;
}

export interface BulletChartData {
  current: number;
  target: number;
  ranges: Array<{
    label: string;
    min: number;
    max: number;
    color: string;
  }>;
}

export interface BarChartData {
  parameter: string;
  current: number;
  normalMin: number;
  normalMax: number;
  unit: string;
  status: 'low' | 'normal' | 'high';
}

export interface RadarChartData {
  domain: string;
  score: number;
  maxScore: number;
}

export interface DonutChartData {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface HeatmapData {
  hour: string;
  heartRate: number;
  bloodPressure: number;
  temperature: number;
  oxygenSat: number;
}

export interface TimelineData {
  timestamp: string;
  event: string;
  type: string;
  importance: 'low' | 'medium' | 'high';
}

export interface GaugeData {
  current: number;
  min: number;
  max: number;
  thresholds: Array<{
    label: string;
    min: number;
    max: number;
    color: string;
  }>;
}

export interface SankeyData {
  nodes: Array<{ id: string; name: string }>;
  links: Array<{ source: string; target: string; value: number }>;
}

export interface WaterfallData {
  category: string;
  value: number;
  type: 'start' | 'increase' | 'decrease' | 'end';
}

export interface CorrelationData {
  x: string;
  y: string;
  correlation: number;
}