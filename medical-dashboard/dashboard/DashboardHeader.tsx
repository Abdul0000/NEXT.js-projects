import React from 'react';
import { ClockIcon, UserIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface DashboardHeaderProps {
  patientName: string;
  patientId: string;
  totalCharts: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  patientName, 
  patientId, 
  totalCharts 
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="mb-8">
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Medical Dashboard
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Comprehensive patient monitoring and analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-6 mt-4 lg:mt-0">
          <div className="flex items-center text-gray-500">
            <ClockIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">
              {currentDate} at {currentTime}
            </span>
          </div>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{patientName}</h2>
              <p className="text-sm text-gray-600 font-medium">Patient ID: {patientId}</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-600 font-medium">Active Monitoring</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-gray-500 mb-2">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Active Charts</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{totalCharts}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;