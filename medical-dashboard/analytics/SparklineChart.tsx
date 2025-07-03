import { ChartConfig } from '@/types/dashboard/types';
import React from 'react';
import { LineChart, Line, ResponsiveContainer, ReferenceLine } from 'recharts';

interface SparklineChartProps {
  config: ChartConfig;
  className?: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ config, className = '' }) => {
  const { title, description, unit, normalRange, trend, data } = config;

  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;

  const isInNormalRange = normalRange ? 
    currentValue >= normalRange[0] && currentValue <= normalRange[1] : true;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-3xl font-bold text-gray-800">
            {currentValue.toFixed(1)}
            <span className="text-lg text-gray-500 ml-1">{unit}</span>
          </div>
          <div className={`flex items-center space-x-1 ${
            change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-500'
          }`}>
            {change > 0 ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : change < 0 ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 112 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : null}
            <span className="text-sm font-medium">
              {Math.abs(changePercent).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isInNormalRange ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isInNormalRange ? 'Normal' : 'Abnormal'}
        </div>
      </div>

      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {normalRange && (
              <>
                <ReferenceLine y={normalRange[0]} stroke="#ef4444" strokeDasharray="2 2" />
                <ReferenceLine y={normalRange[1]} stroke="#ef4444" strokeDasharray="2 2" />
              </>
            )}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {normalRange && (
        <div className="mt-2 text-xs text-gray-500">
          Normal range: {normalRange[0]} - {normalRange[1]} {unit}
        </div>
      )}

      {trend && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Clinical Insight:</p>
          <p className="text-sm text-blue-700">{trend}</p>
        </div>
      )}
    </div>
  );
};

export default SparklineChart;