import { ChartConfig, HeatmapData } from "@/types/dashboard/types";
import React from "react";

interface HeatmapChartProps {
  config: ChartConfig;
  className?: string;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ config, className = '' }) => {
  const { title, description, trend } = config;
  const data = config.data as HeatmapData[];

  const metrics = ['heartRate', 'bloodPressure', 'temperature', 'oxygenSat'];
  const metricLabels = {
    heartRate: 'Heart Rate',
    bloodPressure: 'Blood Pressure',
    temperature: 'Temperature',
    oxygenSat: 'Oxygen Saturation'
  };

  const getIntensityColor = (value: number): string => {
    const intensity = Math.round(value * 255);
    const red = Math.max(0, 255 - intensity);
    const green = Math.max(0, intensity);
    return `rgb(${red}, ${green}, 0)`;
  };

  const getIntensityClass = (value: number): string => {
    if (value >= 0.8) return 'bg-green-500';
    if (value >= 0.6) return 'bg-yellow-500';
    if (value >= 0.4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-5 gap-1 min-w-max">
          {/* Header */}
          <div className="p-2 font-medium text-sm text-gray-700">Time</div>
          {metrics.map(metric => (
            <div key={metric} className="p-2 font-medium text-sm text-gray-700 text-center">
              {metricLabels[metric as keyof typeof metricLabels]}
            </div>
          ))}

          {/* Data rows */}
          {data.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div className="p-2 text-sm text-gray-600 font-medium">
                {row.hour}
              </div>
              {metrics.map(metric => (
                <div
                  key={`${rowIndex}-${metric}`}
                  className={`p-2 text-center text-sm text-white font-medium rounded ${
                    getIntensityClass(row[metric as keyof HeatmapData] as number)
                  }`}
                >
                  {((row[metric as keyof HeatmapData] as number) * 100).toFixed(0)}%
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Stability:</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs">Low</span>
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs">Medium</span>
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs">High</span>
          </div>
        </div>
      </div>

      {trend && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Clinical Insight:</p>
          <p className="text-sm text-blue-700">{trend}</p>
        </div>
      )}
    </div>
  );
};

export default HeatmapChart;