import { ChartConfig } from '@/types/dashboard/types';
import React from 'react';

interface DashboardLayoutProps {
  charts: ChartConfig[];
  layoutView: 'grid' | 'masonry' | 'full';
  renderChart: (chart: ChartConfig, index: number) => React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  charts, 
  layoutView, 
  renderChart 
}) => {
  const getLayoutClasses = () => {
    switch (layoutView) {
      case 'grid':
        return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6';
      case 'masonry':
        return 'columns-1 lg:columns-2 xl:columns-3 gap-6 space-y-6';
      case 'full':
        return 'grid grid-cols-1 gap-6';
      default:
        return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6';
    }
  };

  if (charts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No charts found</h3>
        <p className="text-gray-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className={getLayoutClasses()}>
      {charts.map((chart, index) => (
        <div 
          key={index}
          className={`${layoutView === 'masonry' ? 'break-inside-avoid' : ''} 
                     transition-all duration-300 hover:scale-105`}
        >
          {renderChart(chart, index)}
        </div>
      ))}
    </div>
  );
};

export default DashboardLayout;