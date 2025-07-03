import { ChartConfig } from '@/types/dashboard/types';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface LineChartProps {
  config: ChartConfig;
  className?: string;
}

const CustomLineChart: React.FC<LineChartProps> = ({ config, className = '' }) => {
  const { data, title, description, unit, normalRange, trend } = config;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              className="text-gray-600"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="text-gray-600"
              label={{ value: unit, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f8fafc', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
            
            {normalRange && (
              <>
                <ReferenceLine 
                  y={normalRange[0]} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5" 
                  label="Min Normal"
                />
                <ReferenceLine 
                  y={normalRange[1]} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5" 
                  label="Max Normal"
                />
              </>
            )}
            
            <Line 
              type="monotone" 
              dataKey="systolic" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Systolic"
            />
            <Line 
              type="monotone" 
              dataKey="diastolic" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Diastolic"
            />
          </LineChart>
        </ResponsiveContainer>
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

export default CustomLineChart;