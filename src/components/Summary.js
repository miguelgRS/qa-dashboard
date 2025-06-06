export default function Summary({ stats }) {
  const qaUrl = "https://qa.claims.compcorrect.com/";

  return (
    <div className="flex flex-wrap space-x-6 items-center text-sm">
      <div className="flex items-center space-x-2 text-green-700">
        <span>✅</span><span>{stats.passes} Passed</span>
      </div>
      <div className="flex items-center space-x-2 text-red-700">
        <span>❌</span><span>{stats.failures} Failed</span>
      </div>
      <div className="flex items-center space-x-2 text-gray-500">
        <span>⏸️</span><span>{stats.pending} Skipped (no executed)</span>
      </div>
      <div className="font-bold">Total: {stats.tests}</div>
      <div className="flex items-center space-x-2 text-blue-700 underline">
        <span>🌐 Environment:</span>
        <a href={qaUrl} target="_blank" rel="noopener noreferrer" className="font-semibold">
          QA
        </a>
      </div>
    </div>
  );
}
