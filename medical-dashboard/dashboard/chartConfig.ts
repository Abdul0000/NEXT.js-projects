import { ChartConfig, BulletChartData, BarChartData, RadarChartData, DonutChartData, HeatmapData, TimelineData, GaugeData, SankeyData, WaterfallData, CorrelationData } from './types';

export const chartConfigs: ChartConfig[] = [
  {
    chartType: "lineChart",
    title: "7-Day Blood Pressure Trend",
    description: "Daily systolic and diastolic BP with hypertensive threshold indicators",
    unit: "mmHg",
    normalRange: [90, 140],
    data: [
      { timestamp: "2025-06-27", systolic: 145, diastolic: 95, date: "Jun 27" },
      { timestamp: "2025-06-28", systolic: 142, diastolic: 92, date: "Jun 28" },
      { timestamp: "2025-06-29", systolic: 148, diastolic: 98, date: "Jun 29" },
      { timestamp: "2025-06-30", systolic: 150, diastolic: 100, date: "Jun 30" },
      { timestamp: "2025-07-01", systolic: 147, diastolic: 96, date: "Jul 1" },
      { timestamp: "2025-07-02", systolic: 149, diastolic: 99, date: "Jul 2" },
      { timestamp: "2025-07-03", systolic: 152, diastolic: 102, date: "Jul 3" }
    ],
    trend: "Consistently elevated BP, trending upward over 7 days"
  },
  {
    chartType: "bulletChart",
    title: "Current Heart Rate Status",
    description: "Current heart rate against normal range with performance zones",
    unit: "bpm",
    normalRange: [60, 100],
    data: {
      current: 90,
      target: 80,
      ranges: [
        { label: "Low", min: 40, max: 60, color: "#ef4444" },
        { label: "Normal", min: 60, max: 100, color: "#22c55e" },
        { label: "High", min: 100, max: 120, color: "#f59e0b" },
        { label: "Critical", min: 120, max: 160, color: "#dc2626" }
      ]
    } as BulletChartData,
    trend: "Upper normal range, monitoring recommended"
  },
  {
    chartType: "groupedBarChart",
    title: "Blood Panel Results",
    description: "Complete blood count with normal range comparisons",
    unit: "Various",
    normalRange: null,
    data: [
      { parameter: "Hemoglobin", current: 11.2, normalMin: 12.0, normalMax: 16.0, unit: "g/dL", status: "low" as const },
      { parameter: "Hematocrit", current: 34.5, normalMin: 36.0, normalMax: 46.0, unit: "%", status: "low" as const },
      { parameter: "WBC", current: 12.8, normalMin: 4.0, normalMax: 11.0, unit: "K/μL", status: "high" as const },
      { parameter: "Platelets", current: 285, normalMin: 150, normalMax: 450, unit: "K/μL", status: "normal" as const }
    ] as BarChartData[],
    trend: "Anemia present, elevated WBC suggests infection"
  },
  {
    chartType: "radarChart",
    title: "Risk Assessment Profile",
    description: "Multi-domain risk scoring across key clinical areas",
    unit: "Score (0-10)",
    normalRange: [0, 5],
    data: [
      { domain: "Cardiovascular", score: 8.5, maxScore: 10, fullMark: 10 },
      { domain: "Infection", score: 6.2, maxScore: 10, fullMark: 10 },
      { domain: "Bleeding", score: 4.1, maxScore: 10, fullMark: 10 },
      { domain: "Mortality", score: 7.8, maxScore: 10, fullMark: 10 }
    ] as (RadarChartData & { fullMark: number })[],
    trend: "High cardiovascular and mortality risk requiring intervention"
  },
  {
    chartType: "donutChart",
    title: "Lab Results Distribution",
    description: "Proportion of abnormal vs normal lab values",
    unit: "Count",
    normalRange: null,
    data: [
      { category: "Normal", count: 4, percentage: 40, color: "#22c55e", value: 4 },
      { category: "Abnormal High", count: 4, percentage: 40, color: "#ef4444", value: 4 },
      { category: "Abnormal Low", count: 2, percentage: 20, color: "#f59e0b", value: 2 }
    ] as (DonutChartData & { value: number })[],
    trend: "60% of lab values abnormal, requires clinical attention"
  },
  {
    chartType: "heatmapChart",
    title: "Vital Signs Stability Matrix",
    description: "24-hour vital signs patterns with stability indicators",
    unit: "Stability Score",
    normalRange: [0, 1],
    data: [
      { hour: "00:00", heartRate: 0.8, bloodPressure: 0.3, temperature: 0.6, oxygenSat: 0.9 },
      { hour: "06:00", heartRate: 0.7, bloodPressure: 0.2, temperature: 0.4, oxygenSat: 0.8 },
      { hour: "12:00", heartRate: 0.6, bloodPressure: 0.1, temperature: 0.2, oxygenSat: 0.7 },
      { hour: "18:00", heartRate: 0.5, bloodPressure: 0.1, temperature: 0.3, oxygenSat: 0.8 }
    ] as HeatmapData[],
    trend: "Blood pressure most unstable, temperature declining"
  },
  {
    chartType: "sparklineChart",
    title: "Temperature Micro-Trend",
    description: "Recent temperature changes with fever threshold",
    unit: "°C",
    normalRange: [36.1, 37.2],
    data: [
      { timestamp: "2025-07-01", value: 37.2, date: "Jul 1" },
      { timestamp: "2025-07-02", value: 37.8, date: "Jul 2" },
      { timestamp: "2025-07-03", value: 38.1, date: "Jul 3" }
    ],
    trend: "Progressive fever development over 3 days"
  },
  {
    chartType: "timelineChart",
    title: "Clinical Events Timeline",
    description: "Chronological sequence of patient care events",
    unit: "Events",
    normalRange: null,
    data: [
      { timestamp: "2025-06-27", event: "Admission", type: "admission", importance: "high" as const, date: "Jun 27" },
      { timestamp: "2025-06-28", event: "Beta-blocker Started", type: "medication", importance: "medium" as const, date: "Jun 28" },
      { timestamp: "2025-06-29", event: "ECG Performed", type: "procedure", importance: "medium" as const, date: "Jun 29" },
      { timestamp: "2025-07-01", event: "Lab Collection", type: "lab", importance: "medium" as const, date: "Jul 1" },
      { timestamp: "2025-07-02", event: "Cardiology Consult", type: "consultation", importance: "high" as const, date: "Jul 2" },
      { timestamp: "2025-07-03", event: "Cardiac Monitoring", type: "monitoring", importance: "high" as const, date: "Jul 3" }
    ] as (TimelineData & { date: string })[],
    trend: "Escalating cardiac workup and monitoring"
  },
  {
    chartType: "gaugeChart",
    title: "Oxygen Saturation Monitor",
    description: "Current oxygen saturation with critical thresholds",
    unit: "%",
    normalRange: [95, 100],
    data: {
      current: 96,
      min: 85,
      max: 100,
      thresholds: [
        { label: "Critical", min: 85, max: 90, color: "#ef4444" },
        { label: "Low", min: 90, max: 95, color: "#f59e0b" },
        { label: "Normal", min: 95, max: 100, color: "#22c55e" }
      ]
    } as GaugeData,
    trend: "Borderline low, requires supplemental oxygen consideration"
  },
  {
    chartType: "sankeyChart",
    title: "Care Pathway Flow",
    description: "Patient journey through care stages and interventions",
    unit: "Flow",
    normalRange: null,
    data: {
      nodes: [
        { id: "admission", name: "Emergency Admission" },
        { id: "assessment", name: "Initial Assessment" },
        { id: "diagnostics", name: "Diagnostic Tests" },
        { id: "treatment", name: "Treatment Plan" },
        { id: "monitoring", name: "Continuous Monitoring" }
      ],
      links: [
        { source: "admission", target: "assessment", value: 1 },
        { source: "assessment", target: "diagnostics", value: 1 },
        { source: "diagnostics", target: "treatment", value: 1 },
        { source: "treatment", target: "monitoring", value: 1 }
      ]
    } as SankeyData,
    trend: "Standard care pathway progression"
  },
  {
    chartType: "waterfallChart",
    title: "Risk Score Evolution",
    description: "How risk factors contribute to overall patient risk",
    unit: "Risk Points",
    normalRange: [0, 5],
    data: [
      { category: "Baseline", value: 2.0, type: "start" as const, cumulative: 2.0 },
      { category: "Age Factor", value: 1.5, type: "increase" as const, cumulative: 3.5 },
      { category: "Hypertension", value: 2.0, type: "increase" as const, cumulative: 5.5 },
      { category: "Lab Abnormalities", value: 1.8, type: "increase" as const, cumulative: 7.3 },
      { category: "Medication Response", value: -0.5, type: "decrease" as const, cumulative: 6.8 },
      { category: "Current Risk", value: 6.8, type: "end" as const, cumulative: 6.8 }
    ] as (WaterfallData & { cumulative: number })[],
    trend: "Multiple risk factors accumulating to high-risk status"
  },
  {
    chartType: "correlationMatrix",
    title: "Vital Signs Correlation",
    description: "Relationship strength between different vital parameters",
    unit: "Correlation (-1 to 1)",
    normalRange: [-1, 1],
    data: [
      { x: "Heart Rate", y: "Blood Pressure", correlation: 0.72 },
      { x: "Heart Rate", y: "Temperature", correlation: 0.58 },
      { x: "Heart Rate", y: "Oxygen Sat", correlation: -0.45 },
      { x: "Blood Pressure", y: "Temperature", correlation: 0.41 },
      { x: "Blood Pressure", y: "Oxygen Sat", correlation: -0.33 },
      { x: "Temperature", y: "Oxygen Sat", correlation: -0.67 }
    ] as CorrelationData[],
    trend: "Strong positive correlation between HR and BP, negative with O2 sat"
  }
];