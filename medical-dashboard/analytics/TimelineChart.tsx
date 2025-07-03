import { ChartConfig, TimelineData } from '@/types/dashboard/types';
import React from 'react';

interface TimelineChartProps {
  config: ChartConfig;
  className?: string;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ config, className = '' }) => {
  const { title, description, trend } = config;
  const data = config.data as (TimelineData & { date: string })[];

  const getImportanceColor = (importance: 'low' | 'medium' | 'high'): string => {
    switch (importance) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'admission': return '🏥';
      case 'medication': return '💊';
      case 'procedure': return '🔬';
      case 'lab': return '🧪';
      case 'consultation': return '👨‍⚕️';
      case 'monitoring': return '📊';
      default: return '📋';
    }
  };

  const getImportanceTextColor = (importance: 'low' | 'medium' | 'high'): string => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={index} className="relative flex items-start">
              {/* Timeline dot */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                getImportanceColor(item.importance)
              } relative z-10 shadow-md`}>
                <span className="text-lg">{getTypeIcon(item.type)}</span>
              </div>
              
              {/* Content */}
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{item.event}</h4>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 capitalize">{item.type}</p>
                <div className="flex items-center mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getImportanceTextColor(item.importance)
                  }`}>
                    {item.importance} priority
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">High Priority</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Medium Priority</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Low Priority</span>
          </div>
        </div>
        <span className="text-gray-500">Total Events: {data.length}</span>
      </div>

      {/* Trend */}
      {trend && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Trend:</span>
            <span className="text-sm text-gray-600">{trend}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineChart;