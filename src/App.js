import { useEffect, useState } from 'react';
import Summary from './components/Summary';
import TestCaseList from './components/TestCaseList';
import Sidebar from './components/SideBar';


import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import FeatureHeader from './components/FeatureHeader';
import RightSidebar from './components/RightSideBar';


function App() {
  const [stats, setStats] = useState(null);
  const [tests, setTests] = useState([]);
  const [comments, setComments] = useState([]);
  const [groupedTests, setGroupedTests] = useState({});
  const [selectedTestTitle, setSelectedTestTitle] = useState(null);
  const [selectedFeatureName, setSelectedFeatureName] = useState(null);
  const [summaryReport, setSummaryReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('graphics');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/combined-report.json')
      .then(res => res.json())
      .then(json => {
        setStats(json.stats);
        const groupedByFeature = {};

        json.results.forEach(result => {
          const filePath = result.fullFile || result.file || '';
          const featureName = filePath.split(/[/\\]/).pop()?.replace('.feature', '') || 'Not found';

          const allTests = [];
          const traverseSuites = (suites = []) => {
            suites.forEach(suite => {
              if (suite.tests) allTests.push(...suite.tests);
              if (suite.suites?.length) traverseSuites(suite.suites);
            });
          };
          traverseSuites(result.suites);

          if (!groupedByFeature[featureName]) groupedByFeature[featureName] = [];
          groupedByFeature[featureName].push(...allTests);
        });

        setTests(Object.values(groupedByFeature).flat());
        setGroupedTests(groupedByFeature);
      });

    fetch(process.env.PUBLIC_URL + '/data/ai-comments.json')
      .then(res => res.json())
      .then(json => setComments(json));

    fetch(process.env.PUBLIC_URL + '/data/summary-report.json')
      .then(res => res.json())
      .then(json => setSummaryReport(json));
  }, []);

  const handleFilterByState = (state) => {
    setFilterStatus(state);
  };

  const handleClearFilter = () => {
    setFilterStatus(null);
    setSelectedFeatureName(null);
    setSelectedTestTitle(null);
    setSearchQuery('');
  };

  const handleFeatureSelect = (feature) => {
    setSelectedFeatureName(prev => (prev === feature ? null : feature));
    setSelectedTestTitle(null);
  };

  const hasActiveFilters = !!filterStatus || !!selectedFeatureName || !!selectedTestTitle || !!searchQuery;


  const filteredGrouped = Object.entries(groupedTests).reduce((acc, [feature, tests]) => {
    const matchesSearch =
      feature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tests.some(test => test.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return acc;

    const filteredTests = tests.filter(test => {
      const matchByFeature = selectedFeatureName ? feature === selectedFeatureName : true;
      const matchByTest = selectedTestTitle ? test.title === selectedTestTitle : true;
      const matchStatus = filterStatus ? test.state === filterStatus : true;
      const matchSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || feature.toLowerCase().includes(searchQuery.toLowerCase());

      return matchByFeature && matchByTest && matchStatus && matchSearch;
    });

    if (filteredTests.length > 0) acc[feature] = filteredTests;
    return acc;
  }, {});

  if (!stats) return <p className="p-4">Cargando...</p>;

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* left side bar (icons) */}
      <aside className="w-28 self-stretch px-2 py-4 bg-white border-r border-black/10 inline-flex flex-col justify-between items-center text-[10px] font-medium text-slate-900">
        <div className="flex flex-col items-center gap-2">
          <img src={process.env.PUBLIC_URL + "/revstarlogo.jpg"} alt="Logo" className="w-10 h-10" />
          <div className="text-center">
            <p className="text-xs font-semibold leading-tight">QA Automation</p>
            <p className="text-xs tracking-widest text-slate-600">DASHBOARD</p>
          </div>
          <div className="px-2 py-0.5 bg-emerald-100 rounded-xl text-xs font-medium text-slate-900">
            CompCorrect
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* Features */}
          <div className="relative group">
            <button
              className={`flex flex-col items-center gap-1 transition ${activeTab === 'graphics' ? 'text-slate-900 font-bold' : 'text-slate-500'} group`}
              onClick={() => setActiveTab('graphics')}
            >
              <div className="w-14 h-14 px-4 py-2 bg-white border border-slate-300 rounded-full flex items-center justify-center hover:bg-slate-100 transition">
                <span className="text-lg">&lt;/&gt;</span>
              </div>
              <span className="text-xs">Features</span>
            </button>
            <span className="absolute left-16 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
              View test features
            </span>
          </div>

          {/* AI Report */}
          <div className="relative group">
            <button
              className={`flex flex-col items-center gap-1 transition ${activeTab === 'analysis' ? 'text-slate-900 font-bold' : 'text-slate-500'} group`}
              onClick={() => setActiveTab('analysis')}
            >
              <div className="w-14 h-14 px-4 py-2 bg-white border border-slate-300 rounded-full flex items-center justify-center hover:bg-slate-100 transition">
                <span className="text-xl">✏️</span>
              </div>
              <span className="text-xs">AI Report</span>
            </button>
            <span className="absolute left-16 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
              Open AI analysis
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-slate-500">
        
          <div className="flex items-center gap-1">
            <span className="text-base">📅</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </aside>

      {/* Sidebar de Features tipo Figma */}
      {activeTab === 'graphics' && (
        <Sidebar
          groupedTests={groupedTests}
          onFeatureSelect={handleFeatureSelect}
          activeFeature={selectedFeatureName}
        />
      )}

      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <Summary stats={stats} />
        </div>

        <div className="mb-6">
          

          {activeTab === 'analysis' && summaryReport?.ai_analysis && (
            <div className="prose prose-sm max-w-none text-gray-800 bg-white p-6 rounded shadow">
              <h2 className="text-lg font-bold mb-2">Analysis from the test execution</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {summaryReport.ai_analysis}
              </ReactMarkdown>
            </div>
          )}
        </div>



        {/* Lista de test cases */}
        <div className="w-full p-6 bg-white rounded-[20px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.20)] mb-6">
          {activeTab === 'graphics' && (
            <>
              <FeatureHeader
                activeFeature={selectedFeatureName}
                onClearFilters={handleClearFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                hasActiveFilters={hasActiveFilters}
              />
              {Object.entries(filteredGrouped).map(([feature, tests]) => (
                <div key={feature} className="mb-6">
                  <h2 className="text-lg font-bold text-blue-700 mb-2">{feature}</h2>
                  <TestCaseList tests={tests} comments={comments} />
                </div>
              ))}
            </>
          )}
        </div>
      </main>
      {/* right Sidebar  */}
      <RightSidebar
        stats={stats}
        summary={summaryReport}
        onFilter={handleFilterByState}
        groupedTests={groupedTests}
        onFeatureSelect={handleFeatureSelect}
        activeFeature={selectedFeatureName}
      />
    </div>
  );
}

export default App;
