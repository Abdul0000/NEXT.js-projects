import { BarChartData, ChartConfig } from '@/types/dashboard/types';
import { getStatusColor } from '@/types/dashboard/utils';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface GroupedBarChartProps {
  config: ChartConfig;
  className?: string;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ config, className = '' }) => {
  const { title, description, trend } = config;
  const data = config.data as BarChartData[];

  const chartData = data.map(item => ({
    name: item.parameter,
    current: item.current,
    normalMin: item.normalMin,
    normalMax: item.normalMax,
    status: item.status,
    unit: item.unit
  }));

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              className="text-gray-600"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="text-gray-600"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f8fafc', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
              formatter={(value: any, name: string, props: any) => [
                `${value} ${props.payload.unit}`,
                name === 'current' ? 'Current Value' : 
                name === 'normalMin' ? 'Normal Min' : 'Normal Max'
              ]}
            />
            <Legend />
            
            <Bar dataKey="current" name="Current Value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
              ))}
            </Bar>
            <Bar dataKey="normalMin" fill="#94a3b8" name="Normal Min" radius={[4, 4, 0, 0]} />
            <Bar dataKey="normalMax" fill="#cbd5e1" name="Normal Max" radius={[4, 4, 0, 0]} />
          </BarChart>
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

export default GroupedBarChart;