import { MEDICAL_THRESHOLDS } from './constants';

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status: 'low' | 'normal' | 'high'): string => {
  switch (status) {
    case 'low': return '#f59e0b';
    case 'normal': return '#22c55e';
    case 'high': return '#ef4444';
    default: return '#6b7280';
  }
};

export const getBloodPressureStatus = (systolic: number, diastolic: number): {
  status: string;
  color: string;
} => {
  if (systolic >= 180 || diastolic >= 120) {
    return { status: 'Crisis', color: '#dc2626' };
  } else if (systolic >= 140 || diastolic >= 90) {
    return { status: 'Stage 2', color: '#ef4444' };
  } else if (systolic >= 130 || diastolic >= 80) {
    return { status: 'Stage 1', color: '#f59e0b' };
  } else if (systolic >= 120 && diastolic < 80) {
    return { status: 'Elevated', color: '#fbbf24' };
  } else {
    return { status: 'Normal', color: '#22c55e' };
  }
};

export const getHeartRateStatus = (bpm: number): {
  status: string;
  color: string;
} => {
  if (bpm < 60) {
    return { status: 'Bradycardia', color: '#3b82f6' };
  } else if (bpm > 100) {
    return { status: 'Tachycardia', color: '#ef4444' };
  } else {
    return { status: 'Normal', color: '#22c55e' };
  }
};

export const getTemperatureStatus = (celsius: number): {
  status: string;
  color: string;
} => {
  if (celsius >= 38.3) {
    return { status: 'Fever', color: '#ef4444' };
  } else if (celsius >= 37.3) {
    return { status: 'Low Grade', color: '#f59e0b' };
  } else if (celsius < 36.1) {
    return { status: 'Hypothermia', color: '#3b82f6' };
  } else {
    return { status: 'Normal', color: '#22c55e' };
  }
};

export const getOxygenSaturationStatus = (percentage: number): {
  status: string;
  color: string;
} => {
  if (percentage < 90) {
    return { status: 'Critical', color: '#dc2626' };
  } else if (percentage < 95) {
    return { status: 'Low', color: '#f59e0b' };
  } else {
    return { status: 'Normal', color: '#22c55e' };
  }
};

export const calculateTrend = (values: number[]): {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
} => {
  if (values.length < 2) return { direction: 'stable', percentage: 0 };
  
  const first = values[0];
  const last = values[values.length - 1];
  const percentage = ((last - first) / first) * 100;
  
  if (Math.abs(percentage) < 2) {
    return { direction: 'stable', percentage: 0 };
  }
  
  return {
    direction: percentage > 0 ? 'up' : 'down',
    percentage: Math.abs(percentage)
  };
};

export const isValueInRange = (value: number, range: [number, number]): boolean => {
  return value >= range[0] && value <= range[1];
};

export const getCorrelationStrength = (correlation: number): string => {
  const abs = Math.abs(correlation);
  if (abs >= 0.7) return 'Strong';
  if (abs >= 0.5) return 'Moderate';
  if (abs >= 0.3) return 'Weak';
  return 'Very Weak';
};

export const getCorrelationColor = (correlation: number): string => {
  const abs = Math.abs(correlation);
  if (abs >= 0.7) return correlation > 0 ? '#22c55e' : '#ef4444';
  if (abs >= 0.5) return correlation > 0 ? '#84cc16' : '#f97316';
  if (abs >= 0.3) return correlation > 0 ? '#eab308' : '#f59e0b';
  return '#6b7280';
};

export const formatValue = (value: number, unit: string | null): string => {
  if (!unit) return value.toFixed(1);
  return `${value.toFixed(1)} ${unit}`;
};

export const generateMockTimeSeriesData = (
  baseValue: number,
  days: number,
  variance: number = 0.1
): Array<{ timestamp: string; value: number }> => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const variation = (Math.random() - 0.5) * 2 * variance;
    const value = baseValue * (1 + variation);
    
    data.push({
      timestamp: date.toISOString().split('T')[0],
      value: Math.round(value * 10) / 10
    });
  }
  
  return data;
};