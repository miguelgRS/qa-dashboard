import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#16a34a', '#dc2626', '#facc15'];

export default function PassFailChartPanel({ stats, onFilter, summary }) {
  const data = [
    { name: 'Passed', value: stats.passes, state: 'passed' },
    { name: 'Failed', value: stats.failures, state: 'failed' },
    { name: 'Skipped', value: stats.pending, state: 'pending' },
  ];

  const handlePieClick = (entry) => {
    if (entry?.state && onFilter) {
      onFilter(entry.state);
    }
  };

  return (
    <div className="w-72 p-6 bg-white rounded-2xl shadow flex flex-col gap-4">
      <div>
        <div className="text-xl font-semibold text-black mb-2">All Features</div>
      </div>

      {/* Donut Chart */}
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={40}
              outerRadius={70}
              onClick={handlePieClick}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Feature Summary */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between items-center border-l-2 pl-2 border-slate-300">
          <span className="text-slate-500">Total executed</span>
          <span className="font-semibold text-slate-700">{summary.total_tests_without_pending || 0}</span>
        </div>
        <div className="flex justify-between items-center border-l-2 pl-2 border-emerald-300">
          <span className="text-slate-500">Passed</span>
          <span className="font-semibold text-slate-700">{summary.passed} ({summary.pass_percent}%)</span>
        </div>
        <div className="flex justify-between items-center border-l-2 pl-2 border-rose-300">
          <span className="text-slate-500">Failed</span>
          <span className="font-semibold text-slate-700">{summary.failed} ({summary.fail_percent}%)</span>
        </div>
        <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-slate-700">
          <span className="font-medium">🔔 Feature with most errors:</span><br />
          <span className="font-semibold">{summary.feature_with_most_errors}</span>
        </div>
      </div>
    </div>
  );
}
