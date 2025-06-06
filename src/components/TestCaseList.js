import React from 'react';
import TestCaseCard from './TestCaseCard';

export default function TestCaseList({ tests, comments }) {
  return (
    <div className="flex flex-wrap gap-6">
      {tests.map(test => (
        <div
          key={test.uuid}
          className="flex-grow max-w-full md:basis-[calc(50%-0.75rem)] md:max-w-[calc(50%-0.75rem)]"
        >
          <TestCaseCard
            test={test}
            comment={comments.find(c => c.scenarioName === test.title)}
          />
        </div>
      ))}
    </div>
  );
}
