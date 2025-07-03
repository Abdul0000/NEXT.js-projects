import React from 'react';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  RectangleGroupIcon
} from '@heroicons/react/24/outline';

interface DashboardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedPriorities: string[];
  onPrioritiesChange: (priorities: string[]) => void;
  layoutView: 'grid' | 'masonry' | 'full';
  onLayoutChange: (view: 'grid' | 'masonry' | 'full') => void;
  totalResults: number;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  selectedPriorities,
  onPrioritiesChange,
  layoutView,
  onLayoutChange,
  totalResults
}) => {
  const categories = ['Trends', 'Status', 'Comparisons', 'Assessments', 'Distributions', 'Patterns', 'Events', 'Monitoring'];
  const priorities = ['Critical', 'High', 'Medium', 'Low'];

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handlePriorityToggle = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      onPrioritiesChange(selectedPriorities.filter(p => p !== priority));
    } else {
      onPrioritiesChange([...selectedPriorities, priority]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search charts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Layout Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => onLayoutChange('grid')}
            className={`p-2 rounded-lg transition-colors ${
              layoutView === 'grid' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onLayoutChange('masonry')}
            className={`p-2 rounded-lg transition-colors ${
              layoutView === 'masonry' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <RectangleGroupIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onLayoutChange('full')}
            className={`p-2 rounded-lg transition-colors ${
              layoutView === 'full' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 space-y-4">
        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
            Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategories.includes(category)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Priorities */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Priority Levels</h3>
          <div className="flex flex-wrap gap-2">
            {priorities.map(priority => (
              <button
                key={priority}
                onClick={() => handlePriorityToggle(priority)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPriorities.includes(priority)
                    ? priority === 'Critical' ? 'bg-red-600 text-white shadow-md' :
                      priority === 'High' ? 'bg-orange-600 text-white shadow-md' :
                      priority === 'Medium' ? 'bg-yellow-600 text-white shadow-md' :
                      'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{totalResults}</span> charts
        </p>
      </div>
    </div>
  );
};

export default DashboardFilters;