import React from 'react';
import LineChart from './LineChart';
import BulletChart from './BulletChart';
import GroupedBarChart from './GroupedBarChart';
import RadarChart from './RadarChart';
import DonutChart from './DonutChart';
import HeatmapChart from './HeatmapChart';
import SparklineChart from './SparklineChart';
import TimelineChart from './TimelineChart';
import GaugeChart from './GaugeChart';
import SankeyChart from './SankeyChart';
import WaterfallChart from './WaterfallChart';
import CorrelationMatrix from './CorrelationMatrix';
import { ChartConfig } from '@/types/dashboard/types';

interface ChartProps {
  config: ChartConfig;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ config, className = '' }) => {
  const renderChart = () => {
    switch (config.chartType) {
      case 'lineChart':
        return <LineChart config={config} className={className} />;
      case 'bulletChart':
        return <BulletChart config={config} className={className} />;
      case 'groupedBarChart':
        return <GroupedBarChart config={config} className={className} />;
      case 'radarChart':
        return <RadarChart config={config} className={className} />;
      case 'donutChart':
        return <DonutChart config={config} className={className} />;
      case 'heatmapChart':
        return <HeatmapChart config={config} className={className} />;
      case 'sparklineChart':
        return <SparklineChart config={config} className={className} />;
      case 'timelineChart':
        return <TimelineChart config={config} className={className} />;
      case 'gaugeChart':
        return <GaugeChart config={config} className={className} />;
      case 'sankeyChart':
        return <SankeyChart config={config} className={className} />;
      case 'waterfallChart':
        return <WaterfallChart config={config} className={className} />;
      case 'correlationMatrix':
        return <CorrelationMatrix config={config} className={className} />;
      default:
        return <div className="p-4 text-gray-500">Unsupported chart type: {config.chartType}</div>;
    }
  };

  return renderChart();
};

export default Chart;