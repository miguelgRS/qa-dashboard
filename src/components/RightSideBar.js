// src/components/RightSidebar.js
import React from 'react';
import PassFailChartPanel from './PassFailChartPanel';
import FeatureMiniBarChart from './FeatureMiniBarChart';

export default function RightSidebar({ stats, summary, onFilter, groupedTests, onFeatureSelect, activeFeature }) {
  if (!stats || !summary) return null;

  return (
    <aside className="w-80 px-6 py-8 bg-white border-l border-slate-200 flex flex-col justify-start items-start gap-10 overflow-y-auto">
      {/* Header Section */}
      <div className="w-full">
        <div className="text-xl font-semibold text-black">Statistics</div>
      </div>

      {/* Pie Chart Section */}
      <div className="w-full">
        <PassFailChartPanel stats={stats} summary={summary} onFilter={onFilter} />
      </div>

      {/* Bar Chart Section */}
      <div className="w-full">
        <FeatureMiniBarChart groupedTests={groupedTests} onFeatureSelect={onFeatureSelect} activeFeature={activeFeature} />
      </div>
    </aside>
  );
}
