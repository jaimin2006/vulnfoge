import React from 'react';
import { ShieldCheck, Target, FileText, BookOpen, CheckSquare, Sparkles, Award } from 'lucide-react';

interface HeaderProps {
  activeTab: 'programs' | 'reports' | 'post-mortem' | 'methodology' | 'knowledge';
  setActiveTab: (tab: 'programs' | 'reports' | 'post-mortem' | 'methodology' | 'knowledge') => void;
  onNewReport: () => void;
  verifiedReportsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewReport,
  verifiedReportsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Brand Zone: Clean wordmark with security motif */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                VulnForge
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400 ml-2 font-mono">
                VDP & Bug Bounty Studio
              </span>
            </div>
          </div>

          {/* Navigation Zone: Single-line concise links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
            <button
              onClick={() => setActiveTab('programs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'programs'
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Target Scope</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'reports'
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Report Studio</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                {verifiedReportsCount} Valid
              </span>
            </button>

            <button
              onClick={() => setActiveTab('post-mortem')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'post-mortem'
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Post-Mortem Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('methodology')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'methodology'
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>WSTG Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'knowledge'
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>VRT Knowledge</span>
            </button>
          </nav>

          {/* Primary Action Zone: 1 Primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNewReport}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 border border-indigo-400/30 hover:shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Draft New Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('programs')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
            activeTab === 'programs' ? 'bg-indigo-600/30 text-indigo-300 font-medium' : 'text-slate-400'
          }`}
        >
          Targets
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
            activeTab === 'reports' ? 'bg-emerald-600/30 text-emerald-300 font-medium' : 'text-slate-400'
          }`}
        >
          Reports ({verifiedReportsCount})
        </button>
        <button
          onClick={() => setActiveTab('post-mortem')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
            activeTab === 'post-mortem' ? 'bg-amber-600/30 text-amber-300 font-medium' : 'text-slate-400'
          }`}
        >
          Post-Mortem
        </button>
        <button
          onClick={() => setActiveTab('methodology')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
            activeTab === 'methodology' ? 'bg-cyan-600/30 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          WSTG
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
            activeTab === 'knowledge' ? 'bg-purple-600/30 text-purple-300 font-medium' : 'text-slate-400'
          }`}
        >
          Knowledge
        </button>
      </div>
    </header>
  );
};
