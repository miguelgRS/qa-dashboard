import React from 'react';

export default function Sidebar({
  groupedTests,
  onFeatureSelect,
  activeFeature,
}) {
  return (
    <div className="w-56 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-l border-slate-200">
        <h2 className="text-black text-xl font-semibold mb-4">Features</h2>

        <div className="flex flex-col gap-2">
          {/* ALL FEATURES */}
          <button
            onClick={() => onFeatureSelect(null)}
            className={`px-4 py-3 rounded-xl flex justify-between items-center ${
              !activeFeature
                ? 'bg-slate-900 text-white'
                : 'text-emerald-900 hover:bg-slate-100'
            } transition`}
          >
            <span className="text-base font-normal">All Features</span>
            <span className="text-lg">{!activeFeature ? '✔' : '›'}</span>
          </button>

          {/* INDIVIDUAL FEATURES */}
          {Object.entries(groupedTests).map(([featureName]) => (
            <button
              key={featureName}
              onClick={() => onFeatureSelect(featureName)}
              className={`px-4 py-3 rounded-xl flex justify-between items-center ${
                activeFeature === featureName
                  ? 'bg-slate-900 text-white'
                  : 'text-emerald-900 hover:bg-slate-100'
              } transition`}
            >
              <span className="text-base font-normal">{featureName}</span>
              <span className="text-lg">
                {activeFeature === featureName ? '✔' : '›'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
