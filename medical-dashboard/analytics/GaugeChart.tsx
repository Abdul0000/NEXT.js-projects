import { ChartConfig, GaugeData } from '@/types/dashboard/types';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  config: ChartConfig;
  className?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ config, className = '' }) => {
  const { title, description, unit, trend } = config;
  const data = config.data as GaugeData;

  const createGaugeData = () => {
    const { current, min, max } = data;
    const total = max - min;
    const currentValue = current - min;
    const remaining = total - currentValue;

    return [
      { name: 'current', value: currentValue, color: getCurrentColor() },
      { name: 'remaining', value: remaining, color: '#e5e7eb' }
    ];
  };

  const getCurrentColor = (): string => {
    const { current, thresholds } = data;
    for (const threshold of thresholds) {
      if (current >= threshold.min && current <= threshold.max) {
        return threshold.color;
      }
    }
    return '#6b7280';
  };

  const getCurrentStatus = (): string => {
    const { current, thresholds } = data;
    for (const threshold of thresholds) {
      if (current >= threshold.min && current <= threshold.max) {
        return threshold.label;
      }
    }
    return 'Unknown';
  };

  const gaugeData = createGaugeData();

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="relative">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: getCurrentColor() }}>
              {data.current}
            </div>
            <div className="text-sm text-gray-500">{unit}</div>
            <div className="text-xs font-medium mt-1" style={{ color: getCurrentColor() }}>
              {getCurrentStatus()}
            </div>
          </div>
        </div>
      </div>

      {/* Threshold legend */}
      <div className="mt-4 space-y-2">
        {data.thresholds.map((threshold, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: threshold.color }}
              ></div>
              <span className="text-gray-700">{threshold.label}</span>
            </div>
            <span className="text-gray-500">
              {threshold.min} - {threshold.max} {unit}
            </span>
          </div>
        ))}
      </div>

      {trend && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Assessment:</span>
            <span className="text-sm text-gray-600">{trend}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaugeChart;