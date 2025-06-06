import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AIAnalysis({ markdown }) {
  return (
    <div className="prose max-w-none prose-slate dark:prose-invert bg-white p-6 rounded-xl shadow-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown || 'Analysis not available.'}
      </ReactMarkdown>
    </div>
  );
}