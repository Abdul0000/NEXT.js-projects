import { ChartConfig, SankeyData } from '@/types/dashboard/types';
import React from 'react';

interface SankeyChartProps {
  config: ChartConfig;
  className?: string;
}

const SankeyChart: React.FC<SankeyChartProps> = ({ config, className = '' }) => {
  const { title, description, trend } = config;
  const data = config.data as SankeyData;

  const getNodeColor = (index: number): string => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return colors[index % colors.length];
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="relative h-64">
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Nodes */}
          {data.nodes.map((node, index) => (
            <g key={node.id}>
              <rect
                x={index * 120 + 20}
                y={80}
                width={80}
                height={40}
                fill={getNodeColor(index)}
                rx={8}
                opacity={0.8}
              />
              <text
                x={index * 120 + 60}
                y={105}
                textAnchor="middle"
                className="text-sm font-medium fill-white"
              >
                {node.name.split(' ')[0]}
              </text>
              <text
                x={index * 120 + 60}
                y={120}
                textAnchor="middle"
                className="text-xs fill-white"
              >
                {node.name.split(' ').slice(1).join(' ')}
              </text>
            </g>
          ))}

          {/* Links */}
          {data.links.map((link, index) => {
            const sourceIndex = data.nodes.findIndex(n => n.id === link.source);
            const targetIndex = data.nodes.findIndex(n => n.id === link.target);
            
            return (
              <path
                key={index}
                d={`M ${sourceIndex * 120 + 100} 100 Q ${(sourceIndex + targetIndex) * 60 + 80} 60 ${targetIndex * 120 + 20} 100`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={link.value * 8}
                opacity={0.6}
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#94a3b8"
                opacity={0.6}
              />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Stages: {data.nodes.length}</span>
          <span className="text-gray-600">Connections: {data.links.length}</span>
        </div>
      </div>

      {trend && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Flow:</span>
            <span className="text-sm text-gray-600">{trend}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SankeyChart;