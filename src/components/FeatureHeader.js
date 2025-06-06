import React from 'react';

export default function FeatureHeader({ activeFeature, onClearFilters, searchQuery, setSearchQuery, hasActiveFilters }) {
    return (
        
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-black">
                    {activeFeature || 'All Features'}
                </h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClearFilters}
                        disabled={!hasActiveFilters}
                        className={`h-10 px-4 py-2 rounded-md outline outline-1 outline-offset-[-1px] flex items-center gap-1.5 transition 
    ${hasActiveFilters
                                ? 'bg-white text-slate-900 hover:bg-slate-100 outline-slate-200'
                                : 'opacity-50 cursor-not-allowed bg-white text-slate-400 outline-slate-200'
                            }`}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        <span className="text-base">Clear Filters</span>
                    </button>

                    <div className="w-60">
                        <div className="flex items-center border border-slate-300 rounded-md px-3 py-2">
                            <svg
                                className="w-5 h-5 text-slate-400 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search features or test cases..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 text-sm text-slate-700 focus:outline-none bg-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
    );
}
