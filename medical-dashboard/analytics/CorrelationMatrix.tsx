import { ChartConfig, CorrelationData } from '@/types/dashboard/types';
import React from 'react';

interface CorrelationMatrixProps {
  config: ChartConfig;
  className?: string;
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ config, className = '' }) => {
  const { title, description, trend } = config;
  const data = config.data as CorrelationData[];

  const getCorrelationColor = (correlation: number): string => {
    const intensity = Math.abs(correlation);
    const hue = correlation > 0 ? 120 : 0; // Green for positive, red for negative
    return `hsl(${hue}, 70%, ${85 - intensity * 50}%)`;
  };

  const getCorrelationStrength = (correlation: number): string => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.5) return 'Moderate';
    if (abs >= 0.3) return 'Weak';
    return 'Very Weak';
  };

  const getTextColor = (correlation: number): string => {
    const intensity = Math.abs(correlation);
    return intensity > 0.5 ? 'white' : 'black';
  };

  // Create a matrix structure for display
  const variables = Array.from(new Set([...data.map(d => d.x), ...data.map(d => d.y)]));
  
  const getCorrelation = (x: string, y: string): number => {
    if (x === y) return 1;
    const item = data.find(d => (d.x === x && d.y === y) || (d.x === y && d.y === x));
    return item ? item.correlation : 0;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-24"></th>
              {variables.map(variable => (
                <th key={variable} className="p-2 text-xs font-medium text-gray-600 text-center min-w-20">
                  {variable.split(' ')[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variables.map(rowVar => (
              <tr key={rowVar}>
                <td className="p-2 text-xs font-medium text-gray-600 text-right pr-4">
                  {rowVar.split(' ')[0]}
                </td>
                {variables.map(colVar => {
                  const correlation = getCorrelation(rowVar, colVar);
                  return (
                    <td key={colVar} className="p-1">
                      <div
                        className="w-full h-12 flex items-center justify-center text-xs font-medium rounded"
                        style={{ 
                          backgroundColor: getCorrelationColor(correlation),
                          color: getTextColor(correlation)
                        }}
                      >
                        {correlation.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Correlation strength legend */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
            <span className="text-gray-600">Positive</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
            <span className="text-gray-600">Negative</span>
          </div>
        </div>
        <span className="text-gray-500">Range: -1.0 to 1.0</span>
      </div>

      {/* Strongest correlations */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Strongest Correlations:</h4>
        <div className="space-y-1">
          {data
            .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
            .slice(0, 3)
            .map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-600">{item.x} ↔ {item.y}</span>
                <span className={`font-medium ${item.correlation > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.correlation.toFixed(2)} ({getCorrelationStrength(item.correlation)})
                </span>
              </div>
            ))}
        </div>
      </div>

      {trend && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Key Finding:</span>
            <span className="text-sm text-gray-600">{trend}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrelationMatrix;