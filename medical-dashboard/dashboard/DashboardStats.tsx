import React from 'react';
// import { ChartConfig } from '../types';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon,
//   TrendingUpIcon 
} from '@heroicons/react/24/outline';
import { ChartConfig } from '@/types/dashboard/types';
import { TrendingUpIcon } from 'lucide-react';

interface DashboardStatsProps {
  charts: ChartConfig[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ charts }) => {
  const stats = React.useMemo(() => {
    const criticalCount = charts.filter(chart => 
      chart.title.includes('Blood Pressure') || 
      chart.title.includes('Heart Rate') ||
      chart.title.includes('Oxygen')
    ).length;

    const normalCount = charts.filter(chart => 
      chart.trend && chart.trend.toLowerCase().includes('normal')
    ).length;

    const trendingCount = charts.filter(chart => 
      chart.trend && (chart.trend.toLowerCase().includes('trend') || 
                      chart.trend.toLowerCase().includes('increasing') ||
                      chart.trend.toLowerCase().includes('decreasing'))
    ).length;

    return {
      critical: criticalCount,
      normal: normalCount,
      trending: trendingCount,
      total: charts.length
    };
  }, [charts]);

  const statCards = [
    {
      title: 'Critical Vitals',
      value: stats.critical,
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Normal Range',
      value: stats.normal,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Trending Data',
      value: stats.trending,
      icon: TrendingUpIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Total Monitors',
      value: stats.total,
      icon: ClockIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div 
          key={index}
          className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;