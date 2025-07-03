export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#22c55e',
  info: '#06b6d4',
  muted: '#6b7280'
} as const;

export const MEDICAL_THRESHOLDS = {
  bloodPressure: {
    normal: { systolic: [90, 120], diastolic: [60, 80] },
    elevated: { systolic: [120, 129], diastolic: [60, 80] },
    stage1: { systolic: [130, 139], diastolic: [80, 89] },
    stage2: { systolic: [140, 180], diastolic: [90, 120] },
    crisis: { systolic: [180, 250], diastolic: [120, 150] }
  },
  heartRate: {
    bradycardia: [40, 60],
    normal: [60, 100],
    tachycardia: [100, 120],
    severe: [120, 160]
  },
  temperature: {
    hypothermia: [32, 35],
    normal: [36.1, 37.2],
    fever: [37.3, 38.3],
    highFever: [38.4, 40],
    hyperthermia: [40, 45]
  },
  oxygenSaturation: {
    critical: [85, 90],
    low: [90, 95],
    normal: [95, 100]
  }
} as const;

export const CHART_DIMENSIONS = {
  small: { width: 300, height: 200 },
  medium: { width: 400, height: 300 },
  large: { width: 600, height: 400 },
  extraLarge: { width: 800, height: 500 }
} as const;

export const RESPONSIVE_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;