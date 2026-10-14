import React, { useState } from 'react';
import { BugBountyProgram, Platform, SeverityRating } from '../types';
import { Target, Shield, CheckCircle2, XCircle, AlertTriangle, ExternalLink, Filter, Search, ArrowRight, Zap, Info } from 'lucide-react';

interface ProgramDirectoryProps {
  programs: BugBountyProgram[];
  onSelectProgramForReport: (program: BugBountyProgram) => void;
}

export const ProgramDirectory: React.FC<ProgramDirectoryProps> = ({
  programs,
  onSelectProgramForReport,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProgramModal, setActiveProgramModal] = useState<BugBountyProgram | null>(null);

  const filteredPrograms = programs.filter(p => {
    const matchesPlatform = selectedPlatform === 'All' || p.platform === selectedPlatform;
    const matchesTier = selectedTier === 'All' || p.tier.includes(selectedTier);
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.inScopeAssets.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPlatform && matchesTier && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Editorial Header & Target Strategy Rationale */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-2">
            <span>TARGET SELECTION & RECON METHODOLOGY</span>
            <span aria-hidden="true">·</span>
            <span>POLICY COMPLIANCE VERIFIED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Target Scope & Program Directory
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Targeting lesser-known programs (niche B2B SaaS, supply chain logistics, and IoT cloud platforms) yields higher-impact findings due to reduced competition from automated scanner swarms. Always adhere strictly to Safe Harbor terms, in-scope asset lists, and the minimum severity threshold of <strong className="text-emerald-400">P4 or higher</strong>.
          </p>
        </div>

        {/* Quick Strategy Pills / Key Metrics */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
          <div>
            <div className="text-xs text-slate-400">Target Strategy</div>
            <div className="text-sm font-semibold text-slate-100 mt-0.5">Lesser-Known Focused</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Min. Severity Threshold</div>
            <div className="text-sm font-semibold text-emerald-400 font-mono mt-0.5">P4 (P5 Excluded)</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Safe Harbor Standard</div>
            <div className="text-sm font-semibold text-indigo-300 mt-0.5">Gold & Standard Only</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Avg. Acknowledgment Rate</div>
            <div className="text-sm font-semibold text-slate-100 font-mono mt-0.5">93.2% Validated</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs, assets (*.dispatch...), or categories..."
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-4 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Platform filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Platform:
          </span>
          {['All', 'Bugcrowd', 'HackerOne', 'YesWeHack', 'Intigriti'].map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                selectedPlatform === plat
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPrograms.map((prog) => (
          <div
            key={prog.id}
            className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all hover:bg-slate-900"
          >
            <div>
              {/* Header: Name, Platform & Tier */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-indigo-400">{prog.platform}</span>
                    <span aria-hidden="true">·</span>
                    <span>{prog.category}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                    {prog.name}
                  </h3>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    {prog.tier}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Safe Harbor: <strong className="text-emerald-400">{prog.safeHarbor}</strong>
                  </span>
                </div>
              </div>

              {/* Rationale Kicker */}
              <div className="mt-3 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-slate-300">
                <span className="text-indigo-400 font-medium">Target Selection Rationale: </span>
                {prog.selectionRationale}
              </div>

              {/* In-Scope Assets Preview */}
              <div className="mt-4 space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In-Scope Targets ({prog.inScopeAssets.length})
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Min. Severity: <span className="text-emerald-400 font-bold">{prog.minSeverityAccepted}</span>
                  </span>
                </div>
                <div className="space-y-1 font-mono text-xs text-slate-300">
                  {prog.inScopeAssets.slice(0, 3).map((asset, i) => (
                    <div key={i} className="bg-slate-950/80 px-2 py-1 rounded border border-slate-800/60 truncate">
                      {asset}
                    </div>
                  ))}
                  {prog.inScopeAssets.length > 3 && (
                    <div className="text-[11px] text-slate-500 pl-2">
                      + {prog.inScopeAssets.length - 3} more verified endpoints
                    </div>
                  )}
                </div>
              </div>

              {/* Prohibited Rules Warning */}
              <div className="mt-3 text-xs text-slate-400 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="truncate">
                  Strict Rule: {prog.prohibitedTestingRules[0]}
                </span>
              </div>
            </div>

            {/* Card Footer: Metrics & Action */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                <span>Avg. Triage: </span>
                <span className="text-white font-mono font-medium">{prog.averageTriageHours}h</span>
                <span className="mx-1.5 text-slate-600">|</span>
                <span>Ack Rate: </span>
                <span className="text-emerald-400 font-mono font-medium">{prog.acknowledgementRatePercent}%</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveProgramModal(prog)}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  View Scope
                </button>
                <button
                  onClick={() => onSelectProgramForReport(prog)}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
                >
                  <span>Draft Report</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Program Detailed Scope Modal */}
      {activeProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-indigo-400">{activeProgramModal.platform} Policy & Scope</span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeProgramModal.name}</h2>
              </div>
              <button
                onClick={() => setActiveProgramModal(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Policy Summary */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">
                Program Policy & Safe Harbor
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {activeProgramModal.policySummary}
              </p>
            </div>

            {/* In Scope */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-emerald-400 tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Eligible In-Scope Assets
              </h4>
              <ul className="space-y-1.5 font-mono text-xs text-slate-200">
                {activeProgramModal.inScopeAssets.map((asset, idx) => (
                  <li key={idx} className="bg-slate-950 p-2 rounded border border-slate-800/80 flex items-center justify-between">
                    <span>{asset}</span>
                    <span className="text-[10px] text-emerald-400 font-sans">Eligible for Bounty & Ack</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Out of Scope */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-rose-400 tracking-wider mb-2 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Strictly Out of Scope
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeProgramModal.outOfScopeAssets.map((asset, idx) => (
                  <li key={idx} className="bg-slate-950 p-2 rounded border border-rose-900/30 text-rose-300">
                    {asset}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prohibited Testing */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-amber-400 tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Prohibited Testing Rules
              </h4>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {activeProgramModal.prohibitedTestingRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Min. Valid Severity: <strong className="text-emerald-400">{activeProgramModal.minSeverityAccepted}</strong> (P5 rejected)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveProgramModal(null)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const prog = activeProgramModal;
                    setActiveProgramModal(null);
                    onSelectProgramForReport(prog);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded"
                >
                  Draft Report for this Target
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
