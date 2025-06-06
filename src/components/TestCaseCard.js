import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function TestCaseCard({ test, comment }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [showPM, setShowPM] = useState(true);
  const [showDev, setShowDev] = useState(false);

  const screenshotUrls = [];

  if (test.state === 'failed' && test.context) {
    try {
      const ctx = JSON.parse(test.context);
      const rawPaths = ctx.value.flat(Infinity);
      rawPaths.forEach((rawPath) => {
        const trimmed = rawPath.replace(/^[\\/]+/, '');
        const normalized = trimmed.replace(/[\\/]+/g, '/');
        const relPath = normalized.replace(/^screenshots\/?/, '');
        screenshotUrls.push(process.env.PUBLIC_URL + '/screenshots/' + relPath);
      });
    } catch (e) {
      console.warn('Error parseando context de screenshot:', e);
    }
  }

  const statusStyles = {
    passed: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      label: 'Passed',
      labelBg: 'bg-green-500',
      text: 'text-green-800',
    },
    failed: {
      bg: 'bg-rose-50',
      border: 'border-rose-500',
      label: 'Failed',
      labelBg: 'bg-rose-500',
      text: 'text-rose-800',
    },
    pending: {
      bg: 'bg-amber-50',
      border: 'border-amber-500',
      label: 'Skipped',
      labelBg: 'bg-amber-500',
      text: 'text-amber-800',
    },
  };

  const style = statusStyles[test.state] || statusStyles['pending'];

  useEffect(() => {
    if (expanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded]);

  const canExpand = test.state === 'failed';

  return (
    <div className={`self-stretch p-3 ${style.bg} rounded-md border-l-[3px] ${style.border} shadow space-y-2`}>

      {/* Header */}
      <div
        className="inline-flex justify-start items-start gap-2 w-full cursor-pointer"
        onClick={() => canExpand && setExpanded(!expanded)}
      >
        <div className="pt-1">
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${expanded && canExpand ? 'rotate-90' : ''
              } ${style.text}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div className="flex-1 flex flex-col justify-center items-start">
          <div className="w-full flex justify-between items-center">
            <div className="text-slate-500 text-sm font-normal leading-normal">
              Execution Time: {(test.duration / 1000).toFixed(2)}s
            </div>
            <div className={`px-2 py-0.5 ${style.labelBg} rounded-md text-white text-xs font-semibold`}>
              {style.label}
            </div>
          </div>
          <div className="text-slate-900 text-base font-medium leading-normal">
            {test.title}
          </div>
        </div>
      </div>

      {/* content expanded only for failures */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: `${height}px`, opacity: expanded ? 1 : 0 }}
      >
        {canExpand && (
          <div className="mt-4 space-y-3">
            {test.err?.message && (
              <div className="bg-red-100 text-red-800 text-sm rounded p-2 space-y-1">
                <div>
                  <strong>Error:</strong> {test.err.message}
                </div>
              </div>
            )}

            {screenshotUrls.map((url, i) => (
              <img key={i} src={url} alt="Failure screenshot" className="rounded border mt-2" />
            ))}

            {comment && (() => {
              const [pmText, devText] = comment.aiExplanation.split(/\n\n🛠️ \*For Developer:\*/);
              return (
                <div className="bg-gray-100 text-gray-800 text-sm rounded p-3 space-y-4 max-h-[400px] overflow-auto">
                  <p className="font-bold text-blue-700">📡 IA Analysis</p>

                  {/* Product Manager */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPM(!showPM);
                      }}
                      className="text-sm font-medium text-left text-blue-600 hover:underline"
                    >
                      {showPM ? '🔽 Hide information for Product Manager' : '▶️ Show information for Product Manager'}
                    </button>
                    {showPM && (
                      <div className="prose prose-sm mt-2 break-words whitespace-pre-wrap">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {`\n\n${pmText?.trim()}`}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Developer */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDev(!showDev);
                      }}
                      className="text-sm font-medium text-left text-blue-600 hover:underline"
                    >
                      {showDev ? '🔽 Hide information for Developer' : '▶️ Show information for Developer'}
                    </button>
                    {showDev && (
                      <div className="prose prose-sm mt-2 break-words whitespace-pre-wrap">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {`🛠️ *For Developer:*\n\n${devText?.trim()}`}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
