import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { feature, passed, failed } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 rounded p-2 text-sm shadow">
        <p className="font-semibold text-gray-800">{feature}</p>
        <p className="text-emerald-600">✅ Passed: {passed}</p>
        <p className="text-rose-500">❌ Failed: {failed}</p>
      </div>
    );
  }
  return null;
};

export default function FeatureMiniBarChart({ groupedTests, onFeatureSelect, activeFeature }) {
  const data = Object.entries(groupedTests).map(([feature, tests]) => {
    const passed = tests.filter(t => t.state === 'passed').length;
    const failed = tests.filter(t => t.state === 'failed').length;
    return { feature, passed, failed };
  });

  return (
    <div className="w-72 p-6 bg-white rounded-2xl shadow flex flex-col gap-4">
      <div>
        <div className="text-xl font-semibold text-black mb-2">By Feature</div>
      </div>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
            barCategoryGap={30}
            onClick={(e) => {
              const featureClicked = e?.activePayload?.[0]?.payload?.feature;
              if (featureClicked) {
                onFeatureSelect(featureClicked === activeFeature ? null : featureClicked);
              }
            }}
          >
            <XAxis
              dataKey="feature"
              interval={0}
              angle={-40}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12, fill: '#334155' }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: '#334155' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="passed" stackId="a" fill="#6ee7b7" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`passed-${index}`}
                  fillOpacity={!activeFeature || activeFeature === entry.feature ? 1 : 0.2}
                />
              ))}
            </Bar>
            <Bar dataKey="failed" stackId="a" fill="#fca5a5" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`failed-${index}`}
                  fillOpacity={!activeFeature || activeFeature === entry.feature ? 1 : 0.2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
