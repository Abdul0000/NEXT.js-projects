import { ChartConfig, RadarChartData } from '@/types/dashboard/types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface RadarChartProps {
  config: ChartConfig;
  className?: string;
}

const CustomRadarChart: React.FC<RadarChartProps> = ({ config, className = '' }) => {
  const { title, description, trend } = config;
  const data = config.data as (RadarChartData & { fullMark: number })[];

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid />
            <PolarAngleAxis 
              dataKey="domain" 
              tick={{ fontSize: 12 }}
              className="text-gray-600"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 10]} 
              tick={{ fontSize: 10 }}
              className="text-gray-500"
            />
            <Radar
              name="Risk Score"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium text-gray-700">{item.domain}</span>
            <span className={`text-sm font-bold ${
              item.score >= 7 ? 'text-red-600' : 
              item.score >= 5 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {item.score.toFixed(1)}/10
            </span>
          </div>
        ))}
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

export default CustomRadarChart;