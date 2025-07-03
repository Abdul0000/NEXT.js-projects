import { PatientData } from './types';

export const patientData: PatientData = {
  patientId: "PT-2025-001",
  vitals: {
    bloodPressure: {
      timeSeries: [
        { timestamp: "2025-06-27", systolic: 145, diastolic: 95 },
        { timestamp: "2025-06-28", systolic: 142, diastolic: 92 },
        { timestamp: "2025-06-29", systolic: 148, diastolic: 98 },
        { timestamp: "2025-06-30", systolic: 150, diastolic: 100 },
        { timestamp: "2025-07-01", systolic: 147, diastolic: 96 },
        { timestamp: "2025-07-02", systolic: 149, diastolic: 99 },
        { timestamp: "2025-07-03", systolic: 152, diastolic: 102 }
      ],
      current: { systolic: 152, diastolic: 102 }
    },
    heartRate: {
      timeSeries: [
        { timestamp: "2025-06-27", bpm: 78 },
        { timestamp: "2025-06-28", bpm: 82 },
        { timestamp: "2025-06-29", bpm: 85 },
        { timestamp: "2025-06-30", bpm: 88 },
        { timestamp: "2025-07-01", bpm: 84 },
        { timestamp: "2025-07-02", bpm: 87 },
        { timestamp: "2025-07-03", bpm: 90 }
      ],
      current: 90
    },
    temperature: {
      timeSeries: [
        { timestamp: "2025-07-01", celsius: 37.2 },
        { timestamp: "2025-07-02", celsius: 37.8 },
        { timestamp: "2025-07-03", celsius: 38.1 }
      ],
      current: 38.1
    },
    oxygenSaturation: {
      timeSeries: [
        { timestamp: "2025-07-01", percentage: 98 },
        { timestamp: "2025-07-02", percentage: 97 },
        { timestamp: "2025-07-03", percentage: 96 }
      ],
      current: 96
    }
  },
  labResults: {
    bloodPanel: {
      hemoglobin: { value: 11.2, unit: "g/dL", normalRange: [12.0, 16.0] },
      hematocrit: { value: 34.5, unit: "%", normalRange: [36.0, 46.0] },
      whiteBloodCells: { value: 12.8, unit: "K/μL", normalRange: [4.0, 11.0] },
      platelets: { value: 285, unit: "K/μL", normalRange: [150, 450] }
    },
    metabolicPanel: {
      glucose: { value: 145, unit: "mg/dL", normalRange: [70, 100] },
      sodium: { value: 138, unit: "mEq/L", normalRange: [135, 145] },
      potassium: { value: 4.2, unit: "mEq/L", normalRange: [3.5, 5.0] },
      creatinine: { value: 1.4, unit: "mg/dL", normalRange: [0.6, 1.2] }
    },
    liverFunction: {
      alt: { value: 68, unit: "U/L", normalRange: [7, 35] },
      ast: { value: 72, unit: "U/L", normalRange: [8, 40] },
      bilirubin: { value: 2.1, unit: "mg/dL", normalRange: [0.3, 1.2] }
    }
  },
  riskScores: {
    cardiovascular: { score: 8.5, category: "High", maxScore: 10 },
    infection: { score: 6.2, category: "Moderate", maxScore: 10 },
    bleeding: { score: 4.1, category: "Low", maxScore: 10 },
    mortality: { score: 7.8, category: "High", maxScore: 10 }
  },
  events: [
    { timestamp: "2025-06-27", type: "admission", description: "Patient admitted with chest pain" },
    { timestamp: "2025-06-28", type: "medication", description: "Started on beta-blocker" },
    { timestamp: "2025-06-29", type: "procedure", description: "ECG performed" },
    { timestamp: "2025-07-01", type: "lab", description: "Blood work collected" },
    { timestamp: "2025-07-02", type: "consultation", description: "Cardiology consult" },
    { timestamp: "2025-07-03", type: "monitoring", description: "Continuous cardiac monitoring" }
  ]
};