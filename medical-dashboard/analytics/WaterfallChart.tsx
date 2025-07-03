import { ChartConfig, WaterfallData } from '@/types/dashboard/types';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
// import { ChartConfig, WaterfallData } from '../../types';

interface WaterfallChartProps {
  config: ChartConfig;
  className?: string;
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({ config, className = '' }) => {
  const { title, description, unit, normalRange, trend } = config;
  const data = config.data as (WaterfallData & { cumulative: number })[];

  const getBarColor = (type: string): string => {
    switch (type) {
      case 'start': return '#3b82f6';
      case 'increase': return '#ef4444';
      case 'decrease': return '#22c55e';
      case 'end': return '#6b7280';
      default: return '#94a3b8';
    }
  };

  const formatTooltip = (value: number, name: string, props: any) => {
    const { payload } = props;
    return [
      `${Math.abs(value).toFixed(1)} ${unit}`,
      `${payload.type === 'increase' ? 'Increases' : payload.type === 'decrease' ? 'Decreases' : 'Value'}`
    ];
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: unit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip formatter={formatTooltip} />
            
            {normalRange && (
              <ReferenceLine 
                y={normalRange[1]} 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                label={{ value: "Upper Limit", position: "top" }}
              />
            )}
            
            {/* <Bar 
              dataKey="value" 
              fill={(entry) => getBarColor(entry.type)}
            >
              {data.map((entry, index) => (
                <Bar key={`bar-${index}`} fill={getBarColor(entry.type)} />
              ))}
            </Bar> */}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-gray-600">Start</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-600">Increase</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-600">Decrease</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
            <span className="text-gray-600">End</span>
          </div>
        </div>
        <span className="text-gray-500">
          Final: {data[data.length - 1]?.cumulative.toFixed(1)} {unit}
        </span>
      </div>

      {trend && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Analysis:</span>
            <span className="text-sm text-gray-600">{trend}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterfallChart;