import React, { useState } from 'react';
import { PostMortem, VulnerabilityReport, SeverityRating } from '../types';
import { getSeverityBadge } from '../utils/cvssCalculator';
import { 
  Award, BookOpen, Compass, AlertCircle, CheckCircle2, 
  Lightbulb, ArrowUpRight, Copy, Check, Plus, ShieldCheck, ChevronRight 
} from 'lucide-react';

interface PostMortemStudioProps {
  postMortems: PostMortem[];
  reports: VulnerabilityReport[];
  onSavePostMortem: (pm: PostMortem) => void;
  selectedReportForPostMortem?: VulnerabilityReport | null;
}

export const PostMortemStudio: React.FC<PostMortemStudioProps> = ({
  postMortems,
  reports,
  onSavePostMortem,
  selectedReportForPostMortem,
}) => {
  const [selectedPmId, setSelectedPmId] = useState<string>(
    selectedReportForPostMortem 
      ? postMortems.find(p => p.reportId === selectedReportForPostMortem.id)?.id || postMortems[0]?.id || ''
      : postMortems[0]?.id || ''
  );
  const [isAuthoringNew, setIsAuthoringNew] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Form state for creating a new post-mortem
  const [newPmData, setNewPmData] = useState<Partial<PostMortem>>({
    reportId: reports[0]?.id || '',
    reportTitle: reports[0]?.title || '',
    programName: reports[0]?.programName || '',
    severity: reports[0]?.severityRating || 'P3',
    targetSelectionRationale: '',
    reconnaissanceProcess: [''],
    testingTechniquesUsed: [''],
    challengesAndBottlenecks: [''],
    duplicatePreventionStrategy: '',
    whyAcknowledgedByCompany: '',
    lessonsLearned: [''],
    futureHuntImprovements: [''],
  });

  const activePm = postMortems.find(p => p.id === selectedPmId) || postMortems[0];

  const handleStartNew = () => {
    setIsAuthoringNew(true);
    const targetReport = selectedReportForPostMortem || reports[0];
    setNewPmData({
      id: `pm-${Date.now()}`,
      reportId: targetReport.id,
      reportTitle: targetReport.title,
      programName: targetReport.programName,
      severity: targetReport.severityRating,
      targetSelectionRationale: 'Selected this lesser-known target to minimize automated scanner competition and focus on nuanced business-logic flaws.',
      reconnaissanceProcess: [
        'Reviewed in-scope assets and verified Safe Harbor protections.',
        'Performed passive reconnaissance using Certificate Transparency and OpenAPI docs.',
        'Mapped multi-role user flows across two independent test accounts.'
      ],
      testingTechniquesUsed: [
        'Differential authorization matrix testing between low and high privilege test roles.',
        'Non-destructive validation of object-level access boundaries.'
      ],
      challengesAndBottlenecks: [
        'Encountered rate-limiting and WAF restrictions during automated fuzzing.',
        'Overcame by slowing request pacing and conducting manual HTTP manipulation.'
      ],
      duplicatePreventionStrategy: 'Focused on newly deployed v3 endpoints and unlinked API parameters not covered in standard documentation.',
      whyAcknowledgedByCompany: 'Provided clear non-destructive reproduction steps, isolated test tenant proof, and immediate defensive code fixes.',
      lessonsLearned: [
        'Manual deep-dive testing on lesser-known targets yields higher validation rates than mass automated scanning.',
        'Providing clean remediation code builds strong rapport with triage teams.'
      ],
      futureHuntImprovements: [
        'Build automated test rigs to pre-configure paired test tenants for rapid IDOR verification.'
      ],
      completedDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleSave = () => {
    if (!newPmData.targetSelectionRationale || !newPmData.reportTitle) {
      alert('Please fill out the Target Selection Rationale and Title.');
      return;
    }

    const pmToSave: PostMortem = {
      ...(newPmData as PostMortem),
      id: newPmData.id || `pm-${Date.now()}`,
      completedDate: newPmData.completedDate || new Date().toISOString().split('T')[0],
    };

    onSavePostMortem(pmToSave);
    setIsAuthoringNew(false);
    setSelectedPmId(pmToSave.id);
  };

  const copyPostMortemMarkdown = (pm: PostMortem) => {
    const text = `# Post-Mortem & Hunt Retrospective: ${pm.reportTitle}

**Target Program:** ${pm.programName}
**Severity Rating:** ${pm.severity}
**Analysis Date:** ${pm.completedDate}

---

## 1. Target Selection Rationale
${pm.targetSelectionRationale}

## 2. Reconnaissance & Target Mapping
${pm.reconnaissanceProcess.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## 3. Testing Techniques Applied
${pm.testingTechniquesUsed.map((step, i) => `- ${step}`).join('\n')}

## 4. Challenges & Bottlenecks Overcome
${pm.challengesAndBottlenecks.map((ch, i) => `- ${ch}`).join('\n')}

## 5. Duplicate Prevention Strategy
${pm.duplicatePreventionStrategy}

## 6. Why Acknowledged & Validated by Security Team
${pm.whyAcknowledgedByCompany}

## 7. Lessons Learned
${pm.lessonsLearned.map((l, i) => `- ${l}`).join('\n')}

## 8. Strategies for Future Hunt Improvements
${pm.futureHuntImprovements.map((imp, i) => `- ${imp}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Context and requirement mapping */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <span>RESEARCH POST-MORTEM STUDIO</span>
            <span aria-hidden="true">·</span>
            <span>LESSONS LEARNED & METHODOLOGY RETROSPECTIVE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Vulnerability Hunt Post-Mortem Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyze target selection strategy, challenges faced during testing, reasons for triage confirmation, and tactical improvements for future bug bounty engagements.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Post-Mortem</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Post-Mortem Records List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
            <span>Verified Hunt Retrospectives ({postMortems.length})</span>
            <span className="text-[11px] text-amber-400 font-mono">P1–P4 Validated</span>
          </div>

          <div className="space-y-2">
            {postMortems.map((pm) => {
              const badge = getSeverityBadge(pm.severity);
              const isSelected = pm.id === selectedPmId && !isAuthoringNew;

              return (
                <div
                  key={pm.id}
                  onClick={() => {
                    setSelectedPmId(pm.id);
                    setIsAuthoringNew(false);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/60 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono text-slate-400 truncate max-w-[170px]">
                      {pm.programName}
                    </span>
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {pm.severity}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200 line-clamp-2 leading-snug">
                    {pm.reportTitle}
                  </h4>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2 font-mono">
                    <span>Date: {pm.completedDate}</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-sans">
                      <ShieldCheck className="w-3 h-3" /> Acknowledged
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Post-Mortem View / Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Header & Export */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                  <span>POST-MORTEM REPORT</span>
                  <span aria-hidden="true">·</span>
                  <span>{isAuthoringNew ? newPmData.programName : activePm.programName}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {isAuthoringNew ? (newPmData.reportTitle || 'New Retrospective Analysis') : activePm.reportTitle}
                </h3>
              </div>

              {!isAuthoringNew && (
                <button
                  onClick={() => copyPostMortemMarkdown(activePm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Full Analysis' : 'Export Retrospective'}</span>
                </button>
              )}
            </div>

            {/* Section 1: Target Selection Rationale */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> 1. Target Selection Strategy & Rationale
              </h4>
              {isAuthoringNew ? (
                <textarea
                  rows={3}
                  value={newPmData.targetSelectionRationale || ''}
                  onChange={(e) => setNewPmData(prev => ({ ...prev, targetSelectionRationale: e.target.value }))}
                  placeholder="Explain why this lesser-known target was selected (low hunter saturation, API complexity, fast triage)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                  {activePm.targetSelectionRationale}
                </p>
              )}
            </div>

            {/* Section 2: Reconnaissance Process */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" /> 2. Reconnaissance & Asset Discovery Process
              </h4>
              <ul className="space-y-1.5">
                {(isAuthoringNew ? (newPmData.reconnaissanceProcess || []) : activePm.reconnaissanceProcess).map((step, idx) => (
                  <li key={idx} className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-400 font-mono font-bold shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: Testing Techniques Used */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" /> 3. Testing Techniques & Exploit Methodology
              </h4>
              <ul className="space-y-1.5">
                {(isAuthoringNew ? (newPmData.testingTechniquesUsed || []) : activePm.testingTechniquesUsed).map((tech, idx) => (
                  <li key={idx} className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-mono font-bold shrink-0">✦</span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 4: Challenges & Bottlenecks */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" /> 4. Challenges & Bottlenecks Encountered
              </h4>
              <ul className="space-y-1.5">
                {(isAuthoringNew ? (newPmData.challengesAndBottlenecks || []) : activePm.challengesAndBottlenecks).map((ch, idx) => (
                  <li key={idx} className="bg-slate-950/80 p-2.5 rounded-lg border border-rose-900/30 text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-rose-400 font-mono font-bold shrink-0">!</span>
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 5: Duplicate Prevention Strategy */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5. Duplicate Prevention Strategy
              </h4>
              {isAuthoringNew ? (
                <textarea
                  rows={2}
                  value={newPmData.duplicatePreventionStrategy || ''}
                  onChange={(e) => setNewPmData(prev => ({ ...prev, duplicatePreventionStrategy: e.target.value }))}
                  placeholder="How did you verify this finding was original and avoid duplicates?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                  {activePm.duplicatePreventionStrategy}
                </p>
              )}
            </div>

            {/* Section 6: Why Acknowledged by Company */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> 6. Why Confirmed & Acknowledged by the Security Team
              </h4>
              {isAuthoringNew ? (
                <textarea
                  rows={2}
                  value={newPmData.whyAcknowledgedByCompany || ''}
                  onChange={(e) => setNewPmData(prev => ({ ...prev, whyAcknowledgedByCompany: e.target.value }))}
                  placeholder="Key factors leading to validation (clear reproduction, non-destructive proof, code patch)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                  {activePm.whyAcknowledgedByCompany}
                </p>
              )}
            </div>

            {/* Section 7 & 8: Lessons Learned & Future Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase text-purple-400 tracking-wider">
                  7. Key Lessons Learned
                </h4>
                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  {(isAuthoringNew ? (newPmData.lessonsLearned || []) : activePm.lessonsLearned).map((lesson, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{lesson}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">
                  8. Improvements for Future Hunts
                </h4>
                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  {(isAuthoringNew ? (newPmData.futureHuntImprovements || []) : activePm.futureHuntImprovements).map((imp, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">→</span>
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar when authoring */}
            {isAuthoringNew && (
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setIsAuthoringNew(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm"
                >
                  Save Post-Mortem Retrospective
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
