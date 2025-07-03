import { ChartConfig, BulletChartData } from '@/types/dashboard/types';

interface BulletChartProps {
  config: ChartConfig;
  className?: string;
}

const BulletChart: React.FC<BulletChartProps> = ({ config, className = '' }) => {
  const { title, description, unit, trend } = config;
  const data = config.data as BulletChartData;

  const getPositionPercentage = (value: number, min: number, max: number): number => {
    return ((value - min) / (max - min)) * 100;
  };

  const totalRange = Math.max(...data.ranges.map(r => r.max));
  const currentPosition = getPositionPercentage(data.current, 0, totalRange);
  const targetPosition = getPositionPercentage(data.target, 0, totalRange);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="relative h-16 mb-4">
        {/* Background ranges */}
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          {data.ranges.map((range, index) => (
            <div
              key={index}
              className="absolute top-0 h-full"
              style={{
                left: `${getPositionPercentage(range.min, 0, totalRange)}%`,
                width: `${getPositionPercentage(range.max - range.min, 0, totalRange)}%`,
                backgroundColor: range.color,
                opacity: 0.7
              }}
            />
          ))}
        </div>

        {/* Target line */}
        <div
          className="absolute top-0 w-1 h-8 bg-gray-800"
          style={{ left: `${targetPosition}%` }}
        />

        {/* Current value bar */}
        <div
          className="absolute top-2 h-4 bg-gray-900 rounded-r-full"
          style={{ width: `${currentPosition}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-900 rounded mr-2"></div>
            <span>Current: {data.current} {unit}</span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-4 bg-gray-800 mr-2"></div>
            <span>Target: {data.target} {unit}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {data.ranges.map((range, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: range.color }}
            />
            <span className="text-xs text-gray-600">{range.label}</span>
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

export default BulletChart;