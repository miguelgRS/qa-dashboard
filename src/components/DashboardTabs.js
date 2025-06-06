import { useState } from 'react';
import PassFailChart from './PassFailChart';
import FeatureBarChart from './FeatureBarChart';
import ExecutionAnalysis from './components/ExecutionAnalysis';

export default function DashboardTabs({ stats, groupedTests, summaryReport, handleFilterByState, handleFeatureSelect, handleClearFilter, filterStatus, activeFeature }) {
  const [activeTab, setActiveTab] = useState('graphics');

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      
      <aside className="w-28 px-2 py-4 bg-white border-r border-black/10 flex flex-col justify-between items-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-slate-500 rounded-full" />
          <div className="px-2 py-0.5 bg-emerald-100 rounded-xl text-xs font-medium text-slate-900">
            CompCorrect
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center gap-6 mt-10">
          <button
            className={`w-14 h-14 flex items-center justify-center rounded-full ${activeTab === 'graphics' ? 'bg-slate-900' : ''}`}
            onClick={() => setActiveTab('graphics')}
            aria-label="Graphics"
          >
            <div className="w-6 h-6 bg-white rounded-sm" />
          </button>
          <button
            className={`w-14 h-14 flex items-center justify-center rounded-full ${activeTab === 'analysis' ? 'bg-slate-900' : ''}`}
            onClick={() => setActiveTab('analysis')}
            aria-label="AI Report"
          >
            <div className="w-6 h-6 bg-white rounded-sm" />
          </button>
        </div>

        {/* Footer  */}
        <div className="text-xs text-slate-500 mt-auto mb-2">
          {new Date().toLocaleDateString()}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'graphics' && (
          <div>
            <h2 className="text-lg font-bold mb-4">Graphics</h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <PassFailChart stats={stats} onFilter={handleFilterByState} summary={summaryReport} />
              </div>
              <div className="flex-1">
                <FeatureBarChart
                  groupedTests={groupedTests}
                  onFilter={handleFilterByState}
                  onFeatureSelect={handleFeatureSelect}
                  onClear={handleClearFilter}
                  activeFilter={filterStatus}
                  activeFeature={activeFeature}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div>
            <div className="mb-6">
              <ExecutionAnalysis summaryReport={summaryReport} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
