import React, { useState } from 'react';
import { VULNERABILITY_KNOWLEDGE } from '../data/mockData';
import { VulnerabilityKnowledgeItem, SeverityRating } from '../types';
import { getSeverityBadge } from '../utils/cvssCalculator';
import { BookOpen, ShieldCheck, Code, AlertTriangle, Lightbulb, Search } from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<VulnerabilityKnowledgeItem>(VULNERABILITY_KNOWLEDGE[0]);

  const filtered = VULNERABILITY_KNOWLEDGE.filter(
    k => k.title.toLowerCase().includes(search.toLowerCase()) ||
         k.cweId.toLowerCase().includes(search.toLowerCase()) ||
         k.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
          <span>BUGCROWD VRT & CWE SECURITY KNOWLEDGEBASE</span>
          <span aria-hidden="true">·</span>
          <span>ETHICAL EXPLOIT PATHS & DEFENSIVE MITIGATION</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Vulnerability Classification & Remediation Standards
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Understand the mechanics of high-yield bug bounty vulnerability classes, safe testing boundaries to preserve program Safe Harbor, and architectural defensive mitigations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by CWE, IDOR, SSRF..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            {filtered.map((item) => {
              const badge = getSeverityBadge(item.defaultVrtPriority);
              const isSelected = item.cweId === selectedItem.cweId;

              return (
                <div
                  key={item.cweId}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500/60 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono text-purple-400 font-semibold">
                      {item.cweId}
                    </span>
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {item.defaultVrtPriority}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 leading-snug">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {item.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details */}
        <div className="lg:col-span-8 space-y-5 bg-slate-900/70 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                <span>{selectedItem.cweId}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedItem.category}</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {selectedItem.title}
              </h3>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs text-slate-400">Default VRT Priority:</span>
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${getSeverityBadge(selectedItem.defaultVrtPriority).bg} ${getSeverityBadge(selectedItem.defaultVrtPriority).text} ${getSeverityBadge(selectedItem.defaultVrtPriority).border}`}>
                {selectedItem.defaultVrtPriority}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
              Vulnerability Overview & Scope
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
              {selectedItem.summary}
            </p>
          </div>

          {/* Exploit Mechanics */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-amber-400 tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Exploit Path Mechanics
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
              {selectedItem.exploitMechanics}
            </p>
          </div>

          {/* Safe Testing Advice */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-emerald-400 tracking-wider mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Safe Testing Tip (Safe Harbor Compliance)
            </h4>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-900/40">
              {selectedItem.safeTestingTip}
            </p>
          </div>

          {/* Defensive Mitigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-cyan-400 tracking-wider mb-1.5 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-cyan-400" /> Recommended Defensive Architecture
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
              {selectedItem.defensiveMitigation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
