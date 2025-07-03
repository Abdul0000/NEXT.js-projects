"use client"
import React, { useState, useMemo } from 'react';
import Chart from '@/components/analytics/Chart';
import { chartConfigs } from '@/types/dashboard/chartConfig';
import { ChartConfig } from '@/types/dashboard/types';
// import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface DashboardProps {
  patientId?: string;
  patientName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  patientId = "PAT-2025-001", 
  patientName = "John Doe" 
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutView, setLayoutView] = useState<'grid' | 'masonry' | 'full'>('grid');

  // Filter and search logic
  const filteredCharts = useMemo(() => {
    return chartConfigs.filter(chart => {
      const matchesSearch = chart.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           chart.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(getChartCategory(chart.chartType));
      
      const matchesPriority = selectedPriorities.length === 0 || 
                             selectedPriorities.includes(getChartPriority(chart));
      
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [chartConfigs, searchQuery, selectedCategories, selectedPriorities]);

  const getChartCategory = (chartType: string): string => {
    const categories = {
      'lineChart': 'Trends',
      'bulletChart': 'Status',
      'groupedBarChart': 'Comparisons',
      'radarChart': 'Assessments',
      'donutChart': 'Distributions',
      'heatmapChart': 'Patterns',
      'sparklineChart': 'Micro-trends',
      'timelineChart': 'Events',
      'gaugeChart': 'Monitoring',
      'sankeyChart': 'Flows',
      'waterfallChart': 'Analysis',
      'correlationMatrix': 'Relationships'
    };
    return categories[chartType as keyof typeof categories] || 'Other';
  };

  const getChartPriority = (chart: ChartConfig): string => {
    // Logic to determine priority based on chart content
    if (chart.title.includes('Blood Pressure') || chart.title.includes('Heart Rate')) {
      return 'Critical';
    } else if (chart.title.includes('Risk') || chart.title.includes('Oxygen')) {
      return 'High';
    } else if (chart.title.includes('Lab') || chart.title.includes('Temperature')) {
      return 'Medium';
    }
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters and Controls */}
        <DashboardFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          selectedPriorities={selectedPriorities}
          onPrioritiesChange={setSelectedPriorities}
          layoutView={layoutView}
          onLayoutChange={setLayoutView}
          totalResults={filteredCharts.length}
        />
        <DashboardStats charts={filteredCharts} />

        {/* Charts Grid */}
        <DashboardLayout 
          charts={filteredCharts}
          layoutView={layoutView}
          renderChart={(chart, index) => (
            <div key={index} className="chart-container">
              <Chart config={chart} className="h-full" />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Dashboard;