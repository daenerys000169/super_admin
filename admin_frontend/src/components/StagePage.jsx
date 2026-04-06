import React, { useState, useEffect } from 'react';
import { FileText, Users } from 'lucide-react';

// Stage configuration with colors matching Figma exactly
const STAGE_CONFIG = {
  pending: {
    title: 'Stage-1',
    subtitle: 'Application Evaluation',
    chartType: 'bar'
  },
  stage1: {
    title: 'Stage-1',
    subtitle: 'Application Evaluation',
    chartType: 'pie',
    colors: { iYogdan: '#2DD4BF', mahila: '#A855F7' } // Teal + Purple
  },
  stage2: {
    title: 'Stage-2',
    subtitle: 'Virtual Meeting',
    chartType: 'pie',
    colors: { iYogdan: '#EC4899', mahila: '#22D3EE' } // Pink + Cyan
  },
  stage3: {
    title: 'Stage-3',
    subtitle: 'Pitch deck Stage',
    chartType: 'pie',
    colors: { iYogdan: '#F97316', mahila: '#22C55E' } // Orange + Green
  },
  stage4: {
    title: 'Stage-4',
    subtitle: 'Due Diligence Process',
    chartType: 'pie',
    colors: { iYogdan: '#2DD4BF', mahila: '#A78BFA' } // Teal + Light Purple
  }
};

// Custom Pie Chart Component
const PieChart = ({ data, colors, size = 320 }) => {
  const [animated, setAnimated] = useState(false);
  const total = data.iYogdan + data.mahila;
  const iYogdanAngle = (data.iYogdan / total) * 360;
  const mahilaAngle = (data.mahila / total) * 360;
  
  const center = size / 2;
  const radius = size / 2 - 20;
  
  // Calculate pie slice paths
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };
  
  const createArc = (startAngle, endAngle, color) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return {
      path: `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`,
      color
    };
  };
  
  // Calculate label positions
  const getLabelPosition = (startAngle, endAngle, labelRadius) => {
    const midAngle = (startAngle + endAngle) / 2;
    return polarToCartesian(center, center, labelRadius, midAngle);
  };
  
  const iYogdanArc = createArc(0, iYogdanAngle, colors.iYogdan);
  const mahilaArc = createArc(iYogdanAngle, 360, colors.mahila);
  
  const iYogdanLabelPos = getLabelPosition(0, iYogdanAngle, radius * 0.6);
  const mahilaLabelPos = getLabelPosition(iYogdanAngle, 360, radius * 0.6);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  return (
    <div className="relative">
      <svg 
        width={size} 
        height={size} 
        className={`transform transition-all duration-1000 ${animated ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
      >
        {/* iYogdan slice */}
        <path
          d={iYogdanArc.path}
          fill={iYogdanArc.color}
          className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.1))' }}
        />
        {/* Mahila slice */}
        <path
          d={mahilaArc.path}
          fill={mahilaArc.color}
          className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.1))' }}
        />
        {/* iYogdan label */}
        <text
          x={iYogdanLabelPos.x}
          y={iYogdanLabelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white font-bold text-2xl"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
        >
          {data.iYogdan}
        </text>
        {/* Mahila label */}
        <text
          x={mahilaLabelPos.x}
          y={mahilaLabelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white font-bold text-2xl"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
        >
          {data.mahila}
        </text>
      </svg>
    </div>
  );
};

// Custom Bar Chart Component for Pending Applications
const BarChart = ({ data }) => {
  const [animated, setAnimated] = useState(false);
  const maxValue = Math.max(...data.map(d => d.iYogdan + d.mahila));
  const chartHeight = 280;
  const barWidth = 45;
  const gap = 60;

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-end justify-center gap-4" style={{ minWidth: '500px', height: chartHeight + 40 }}>
        {data.map((item, index) => {
          const totalHeight = ((item.iYogdan + item.mahila) / maxValue) * chartHeight;
          const iYogdanHeight = (item.iYogdan / (item.iYogdan + item.mahila)) * totalHeight;
          const mahilaHeight = totalHeight - iYogdanHeight;
          
          return (
            <div 
              key={item.day} 
              className="flex flex-col items-center"
              style={{ 
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div 
                className={`flex flex-col-reverse rounded-t-full overflow-hidden transition-all duration-700 ease-out ${animated ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  width: barWidth,
                  height: animated ? totalHeight : 0,
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* iYogdan (bottom - yellow) */}
                <div 
                  className="bg-primary transition-all duration-500 hover:brightness-110"
                  style={{ height: iYogdanHeight }}
                />
                {/* Mahila (top - dark) */}
                <div 
                  className="bg-secondary dark:bg-gray-700 transition-all duration-500 hover:brightness-110"
                  style={{ height: mahilaHeight }}
                />
              </div>
              <span className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Legend Component
const ChartLegend = ({ colors }) => (
  <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 inline-flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div 
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: colors.iYogdan }}
      />
      <span className="text-secondary dark:text-white font-medium">iYogdan</span>
    </div>
    <div className="flex items-center gap-3">
      <div 
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: colors.mahila }}
      />
      <span className="text-secondary dark:text-white font-medium">Mahila Empowerment</span>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ value, label, percentChange, bgColor = 'bg-[#FEE5D9]' }) => (
  <div className={`${bgColor} rounded-xl p-5 flex-1 min-w-[280px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-3xl font-bold text-secondary dark:text-secondary">{value}</h3>
        <p className="text-sm text-secondary dark:text-secondary font-medium mt-1">{label}</p>
      </div>
      <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
        <FileText className="w-5 h-5 text-red-500" />
      </div>
    </div>
    <p className="text-sm mt-3">
      <span className="text-green-500 font-semibold">+{percentChange}%</span>
      <span className="text-gray-600 ml-1">Form Last Month</span>
    </p>
  </div>
);

// Stage Info Sidebar Component
const StageSidebar = ({ stageConfig, data }) => (
  <div className="w-full lg:w-80 flex-shrink-0">
    <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 space-y-6 sticky top-4">
      {/* Stage Header */}
      <div className="border-b border-gray-100 dark:border-dark-border pb-4">
        <h3 className="text-2xl font-bold text-secondary dark:text-white">{stageConfig.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{stageConfig.subtitle}</p>
      </div>

      {/* IYogdan Applications Card */}
      <div className="bg-gray-50 dark:bg-dark-border rounded-xl p-5 transition-all duration-300 hover:shadow-md">
        <h4 className="text-lg font-semibold text-secondary dark:text-white mb-4">IYogdan Applications</h4>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-3xl font-bold text-secondary dark:text-white">{data.totalIYogdan}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total IYogdan</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-secondary dark:text-white">{data.pendingIYogdan}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pending Applications</p>
          </div>
        </div>
      </div>

      {/* Mahila Empowerment Applications Card */}
      <div className="bg-gray-50 dark:bg-dark-border rounded-xl p-5 transition-all duration-300 hover:shadow-md">
        <h4 className="text-lg font-semibold text-secondary dark:text-white mb-4">Mahila Empowerment Applications</h4>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-3xl font-bold text-secondary dark:text-white">{data.totalMahila}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Mahila Empowerment</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-secondary dark:text-white">{data.pendingMahila}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pending Applications</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StagePage = ({ applications = [] }) => {
  const [activeStage, setActiveStage] = useState('stage1');
  
  // Dynamic data calculation from applications
  const calculateStats = () => {
    const total = applications.length || 1120;
    const iYogdan = applications.filter(a => a.schemeName === 'iYogdan').length || 580;
    const mahila = applications.filter(a => a.schemeName === 'Mahila Empowerment Scheme').length || 540;
    
    return {
      totalApplications: total,
      totalIYogdan: iYogdan,
      totalMahila: mahila
    };
  };

  // Dynamic stage data
  const getStageData = (stage) => {
    // For demo, using dynamic mock data that changes per stage
    const baseData = {
      pending: {
        chartData: { iYogdan: 521, mahila: 230 },
        totalIYogdan: 920,
        pendingIYogdan: 521,
        totalMahila: 580,
        pendingMahila: 230
      },
      stage1: {
        chartData: { iYogdan: 521, mahila: 230 },
        totalIYogdan: 920,
        pendingIYogdan: 521,
        totalMahila: 580,
        pendingMahila: 230
      },
      stage2: {
        chartData: { iYogdan: 521, mahila: 108 },
        totalIYogdan: 920,
        pendingIYogdan: 521,
        totalMahila: 602,
        pendingMahila: 108
      },
      stage3: {
        chartData: { iYogdan: 521, mahila: 230 },
        totalIYogdan: 920,
        pendingIYogdan: 521,
        totalMahila: 580,
        pendingMahila: 230
      },
      stage4: {
        chartData: { iYogdan: 521, mahila: 230 },
        totalIYogdan: 920,
        pendingIYogdan: 521,
        totalMahila: 580,
        pendingMahila: 230
      }
    };
    
    return baseData[stage] || baseData.stage1;
  };

  // Bar chart data for pending applications
  const barChartData = [
    { day: 'MON', iYogdan: 80, mahila: 120 },
    { day: 'TUE', iYogdan: 100, mahila: 140 },
    { day: 'WED', iYogdan: 150, mahila: 200 },
    { day: 'THU', iYogdan: 130, mahila: 170 },
    { day: 'FRI', iYogdan: 140, mahila: 180 },
    { day: 'SAT', iYogdan: 120, mahila: 150 },
    { day: 'SUN', iYogdan: 90, mahila: 130 }
  ];

  const stats = calculateStats();
  const stageData = getStageData(activeStage);
  const stageConfig = STAGE_CONFIG[activeStage];

  const tabs = [
    { id: 'pending', label: 'Pending Applications' },
    { id: 'stage1', label: 'Stage - 1' },
    { id: 'stage2', label: 'Stage - 2' },
    { id: 'stage3', label: 'Stage - 3' },
    { id: 'stage4', label: 'Stage - 4' }
  ];

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      {/* Today's Overview Section */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 mb-6">
        <h2 className="text-lg font-semibold text-secondary dark:text-white mb-4">Today&apos;s Overview</h2>
        <div className="flex flex-wrap gap-4">
          <StatCard 
            value={stats.totalApplications} 
            label="Total Applications" 
            percentChange={12}
            bgColor="bg-[#FEE5D9]"
          />
          <StatCard 
            value={stats.totalIYogdan} 
            label="Total IYogdan" 
            percentChange={12}
            bgColor="bg-[#FFF7E2]"
          />
          <StatCard 
            value={stats.totalMahila} 
            label="Total Mahila Empowerment" 
            percentChange={12}
            bgColor="bg-[#FFF7E2]"
          />
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-2 mb-6 inline-flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStage(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              activeStage === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chart Section */}
        <div className="flex-1 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-6">
          {/* Stage Title */}
          <div className="mb-6 pb-4 border-b border-gray-100 dark:border-dark-border">
            <h3 className="text-2xl font-bold text-secondary dark:text-white">{stageConfig.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{stageConfig.subtitle}</p>
          </div>

          {/* Chart */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {stageConfig.chartType === 'pie' ? (
              <>
                <PieChart 
                  data={stageData.chartData} 
                  colors={stageConfig.colors}
                  size={320}
                />
                <ChartLegend colors={stageConfig.colors} />
              </>
            ) : (
              <div className="w-full">
                <BarChart data={barChartData} />
                <div className="flex justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary" />
                    <span className="text-sm text-secondary dark:text-gray-300">iYogdan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-secondary dark:bg-gray-600" />
                    <span className="text-sm text-secondary dark:text-gray-300">Mahila Empowerment</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <StageSidebar stageConfig={stageConfig} data={stageData} />
      </div>
    </div>
  );
};

export default StagePage;
