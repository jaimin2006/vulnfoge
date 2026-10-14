import React, { useState } from 'react';
import { VulnerabilityReport, BugBountyProgram, SeverityRating, CvssMetrics, ReportStatus } from '../types';
import { calculateCvss31, getSeverityBadge } from '../utils/cvssCalculator';
import { 
  FileText, ShieldAlert, CheckCircle, Copy, Download, AlertTriangle, 
  Sparkles, Check, ChevronRight, Code2, Award, ExternalLink, Plus, Trash2, Eye 
} from 'lucide-react';

interface ReportStudioProps {
  reports: VulnerabilityReport[];
  programs: BugBountyProgram[];
  onSaveReport: (report: VulnerabilityReport) => void;
  onViewPostMortem: (report: VulnerabilityReport) => void;
  initialSelectedProgram?: BugBountyProgram | null;
}

export const ReportStudio: React.FC<ReportStudioProps> = ({
  reports,
  programs,
  onSaveReport,
  onViewPostMortem,
  initialSelectedProgram,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [isEditingNew, setIsEditingNew] = useState<boolean>(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Form State for active editing
  const [formData, setFormData] = useState<Partial<VulnerabilityReport>>(() => {
    const defaultProg = initialSelectedProgram || programs[0];
    return {
      programId: defaultProg.id,
      programName: defaultProg.name,
      platform: defaultProg.platform,
      title: '',
      cweId: 'CWE-639',
      cweName: 'Authorization Bypass Through User-Controlled Key (IDOR)',
      owaspCategory: 'A01:2021 - Broken Access Control',
      targetAsset: defaultProg.inScopeAssets[0] || '',
      vulnerableEndpoint: '/api/v1/resource/{id}',
      severityRating: 'P3',
      cvssScore: 6.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
      cvssMetrics: {
        attackVector: 'NETWORK',
        attackComplexity: 'LOW',
        privilegesRequired: 'LOW',
        userInteraction: 'NONE',
        scope: 'UNCHANGED',
        confidentiality: 'HIGH',
        integrity: 'NONE',
        availability: 'NONE'
      },
      attackSurfaceSummary: '',
      reproductionSteps: [
        'Authenticate as low-privileged test user Account A and capture session token.',
        'Send request to retrieve user profile or private asset record.',
        'Change target identifier parameter to Account B ID using interception proxy.',
        'Submit request and observe 200 OK containing Account B private data without authorization check.'
      ],
      proofOfConceptRaw: 'GET /api/v1/resource/target-id HTTP/1.1\nHost: target-api.com\nAuthorization: Bearer <TEST_TOKEN_A>\nAccept: application/json',
      impactAnalysis: '',
      recommendedMitigation: 'Enforce tenant and ownership check at the data-access layer using verified session claims.',
      defensiveCodeSnippet: '// Enforce session context:\nif (req.user.tenantId !== resource.tenantId) {\n  return res.status(403).json({ error: "Access denied" });\n}',
      status: 'Ready for Submission'
    };
  });

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  // Helper to update CVSS metric and recalculate score + severity
  const handleCvssChange = (metricName: keyof CvssMetrics, value: any) => {
    const currentMetrics = formData.cvssMetrics || activeReport.cvssMetrics;
    const newMetrics = { ...currentMetrics, [metricName]: value };
    const { score, vector, severity } = calculateCvss31(newMetrics);

    setFormData(prev => ({
      ...prev,
      cvssMetrics: newMetrics,
      cvssScore: score,
      cvssVector: vector,
      severityRating: severity,
    }));
  };

  const startNewReport = (prog?: BugBountyProgram) => {
    const targetProg = prog || programs[0];
    setIsEditingNew(true);
    setFormData({
      id: `rep-${Date.now()}`,
      programId: targetProg.id,
      programName: targetProg.name,
      platform: targetProg.platform,
      title: '',
      cweId: 'CWE-639',
      cweName: 'Authorization Bypass Through User-Controlled Key (IDOR)',
      owaspCategory: 'A01:2021 - Broken Access Control',
      targetAsset: targetProg.inScopeAssets[0] || '',
      vulnerableEndpoint: '',
      severityRating: 'P3',
      cvssScore: 6.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
      cvssMetrics: {
        attackVector: 'NETWORK',
        attackComplexity: 'LOW',
        privilegesRequired: 'LOW',
        userInteraction: 'NONE',
        scope: 'UNCHANGED',
        confidentiality: 'HIGH',
        integrity: 'NONE',
        availability: 'NONE'
      },
      attackSurfaceSummary: '',
      reproductionSteps: [
        'Authenticate as researcher test account A.',
        'Intercept the API call to target resource.',
        'Substitute identifier belonging to researcher test account B.',
        'Verify unauthorized data disclosure.'
      ],
      proofOfConceptRaw: '',
      impactAnalysis: '',
      recommendedMitigation: '',
      defensiveCodeSnippet: '',
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleSave = () => {
    if (!formData.title || !formData.targetAsset) {
      alert('Please provide at least a Report Title and Target Asset.');
      return;
    }

    // Strict P4 minimum verification
    if (formData.severityRating === 'P5') {
      alert('Policy Warning: Vulnerabilities with severity P5 (Informational) are not accepted. Please demonstrate quantifiable security impact (P4 or higher).');
      return;
    }

    const reportToSave: VulnerabilityReport = {
      ...(formData as VulnerabilityReport),
      id: formData.id || `rep-${Date.now()}`,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveReport(reportToSave);
    setIsEditingNew(false);
    setSelectedReportId(reportToSave.id);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Generate standard platform-compliant markdown
  const generateHackerOneMarkdown = (rep: VulnerabilityReport) => {
    return `# ${rep.title}

## Summary:
${rep.attackSurfaceSummary}

## Vulnerability Details:
- **CWE:** ${rep.cweId} - ${rep.cweName}
- **OWASP Category:** ${rep.owaspCategory}
- **Vulnerable Asset:** \`${rep.targetAsset}\`
- **Endpoint:** \`${rep.vulnerableEndpoint}\`
- **Severity Rating:** **${rep.severityRating}** (CVSS: ${rep.cvssScore})
- **CVSS v3.1 Vector:** \`${rep.cvssVector}\`

---

## Step-by-Step Reproduction:
${rep.reproductionSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

---

## Technical Proof of Concept:
\`\`\`http
${rep.proofOfConceptRaw}
\`\`\`

---

## Impact Analysis:
${rep.impactAnalysis}

---

## Remediation & Defensive Patch:
${rep.recommendedMitigation}

\`\`\`typescript
${rep.defensiveCodeSnippet}
\`\`\`

---
*Reported in strict compliance with Safe Harbor rules and coordinated disclosure policies.*
`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Navigation between reports and creation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span>BUG BOUNTY REPORT STUDIO</span>
            <span aria-hidden="true">·</span>
            <span>HACKERONE & BUGCROWD VRT COMPLIANT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Vulnerability Report Writer & Severity Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Format reports with technical depth, non-destructive reproduction steps, CVSS v3.1 scoring, and defensive remediation code.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => startNewReport()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Report</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Report List Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
            <span>Verified Reports & Drafts ({reports.length})</span>
            <span className="text-[11px] text-emerald-400 font-mono">Min. P4 Threshold</span>
          </div>

          <div className="space-y-2">
            {reports.map((rep) => {
              const badge = getSeverityBadge(rep.severityRating);
              const isSelected = rep.id === selectedReportId && !isEditingNew;

              return (
                <div
                  key={rep.id}
                  onClick={() => {
                    setSelectedReportId(rep.id);
                    setIsEditingNew(false);
                    setFormData(rep);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500/60 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono text-slate-400 truncate max-w-[170px]">
                      {rep.programName}
                    </span>
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {rep.severityRating} · {rep.cvssScore}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200 line-clamp-2 leading-snug">
                    {rep.title}
                  </h4>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                    <span className="truncate">{rep.cweId}</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle className="w-3 h-3" /> {rep.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Report View / Interactive Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Policy Compliance Warning / Banner */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-slate-100 flex items-center gap-2">
                <span>Responsible Disclosure & Policy Compliance Standards</span>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[10px]">P4 Minimum</span>
              </div>
              <p className="text-slate-400">
                Submissions must demonstrate valid security impact. Disclosures rated P5 (informational) or duplicates will be rejected. Reports must include reproducible steps, non-destructive PoC, and defensive remediation patches.
              </p>
            </div>
          </div>

          {/* Form / Report Content Container */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Header: Title & Severity Badge */}
            <div className="space-y-3 pb-4 border-b border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-400">
                    {isEditingNew ? 'NEW SUBMISSION DRAFT' : activeReport.platform}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400">
                    {isEditingNew ? formData.programName : activeReport.programName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditingNew && (
                    <>
                      <button
                        onClick={() => copyToClipboard(generateHackerOneMarkdown(activeReport), 'markdown')}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                      >
                        {copiedType === 'markdown' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedType === 'markdown' ? 'Copied Markdown' : 'Copy H1 / Bugcrowd Report'}</span>
                      </button>

                      {activeReport.acknowledgement && (
                        <button
                          onClick={() => onViewPostMortem(activeReport)}
                          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded transition-colors"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>View Post-Mortem</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Title input or heading */}
              {isEditingNew ? (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Vulnerability Report Title
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Insecure Direct Object Reference (IDOR) in Multi-Tenant Organization Settings API"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              ) : (
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {activeReport.title}
                </h3>
              )}
            </div>

            {/* Target Asset & Endpoint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Target In-Scope Asset
                </label>
                {isEditingNew ? (
                  <input
                    type="text"
                    value={formData.targetAsset || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAsset: e.target.value }))}
                    placeholder="e.g. api.v3.apex-telemetry.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white font-mono"
                  />
                ) : (
                  <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs sm:text-sm font-mono text-indigo-300 truncate">
                    {activeReport.targetAsset}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Vulnerable Endpoint / Route
                </label>
                {isEditingNew ? (
                  <input
                    type="text"
                    value={formData.vulnerableEndpoint || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, vulnerableEndpoint: e.target.value }))}
                    placeholder="/api/v3/organizations/{org_id}/telemetry-dispatch-keys"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white font-mono"
                  />
                ) : (
                  <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs sm:text-sm font-mono text-slate-300 truncate">
                    {activeReport.vulnerableEndpoint}
                  </div>
                )}
              </div>
            </div>

            {/* Classification & Severity Calculator */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-indigo-400" />
                  CVSS v3.1 & Bugcrowd VRT Priority Calculator
                </span>
                
                {/* Severity Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Calculated Severity:</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(isEditingNew ? (formData.severityRating || 'P3') : activeReport.severityRating).bg} ${getSeverityBadge(isEditingNew ? (formData.severityRating || 'P3') : activeReport.severityRating).text} ${getSeverityBadge(isEditingNew ? (formData.severityRating || 'P3') : activeReport.severityRating).border}`}>
                    {isEditingNew ? formData.severityRating : activeReport.severityRating} · CVSS {isEditingNew ? formData.cvssScore : activeReport.cvssScore}
                  </span>
                </div>
              </div>

              {/* Vector display */}
              <div className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded border border-slate-800 truncate">
                {isEditingNew ? formData.cvssVector : activeReport.cvssVector}
              </div>

              {/* Interactive CVSS Controls (Active when editing or testing) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Attack Vector (AV)</span>
                  <select
                    value={(isEditingNew ? formData.cvssMetrics : activeReport.cvssMetrics)?.attackVector || 'NETWORK'}
                    onChange={(e) => handleCvssChange('attackVector', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
                  >
                    <option value="NETWORK">Network (N)</option>
                    <option value="ADJACENT">Adjacent (A)</option>
                    <option value="LOCAL">Local (L)</option>
                    <option value="PHYSICAL">Physical (P)</option>
                  </select>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Complexity (AC)</span>
                  <select
                    value={(isEditingNew ? formData.cvssMetrics : activeReport.cvssMetrics)?.attackComplexity || 'LOW'}
                    onChange={(e) => handleCvssChange('attackComplexity', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
                  >
                    <option value="LOW">Low (L)</option>
                    <option value="HIGH">High (H)</option>
                  </select>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Privileges (PR)</span>
                  <select
                    value={(isEditingNew ? formData.cvssMetrics : activeReport.cvssMetrics)?.privilegesRequired || 'LOW'}
                    onChange={(e) => handleCvssChange('privilegesRequired', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
                  >
                    <option value="NONE">None (N)</option>
                    <option value="LOW">Low (L)</option>
                    <option value="HIGH">High (H)</option>
                  </select>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Confidentiality (C)</span>
                  <select
                    value={(isEditingNew ? formData.cvssMetrics : activeReport.cvssMetrics)?.confidentiality || 'HIGH'}
                    onChange={(e) => handleCvssChange('confidentiality', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
                  >
                    <option value="NONE">None (N)</option>
                    <option value="LOW">Low (L)</option>
                    <option value="HIGH">High (H)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Official Company Acknowledgment Box (If verified) */}
            {!isEditingNew && activeReport.acknowledgement && (
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Company Acknowledgment & Validation Receipt
                  </span>
                  <span className="text-xs font-mono text-emerald-300">
                    Ref: {activeReport.acknowledgement.referenceTicketId}
                  </span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-emerald-900/40">
                  <div className="text-emerald-300 font-semibold mb-1">
                    Verified By: {activeReport.acknowledgement.verifiedBy} ({activeReport.acknowledgement.triageRole})
                  </div>
                  <p className="italic text-slate-300">
                    "{activeReport.acknowledgement.officialNote}"
                  </p>
                  <div className="mt-2 pt-2 border-t border-emerald-900/30 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Acknowledged Severity: <strong className="text-emerald-400">{activeReport.acknowledgement.confirmedSeverity}</strong></span>
                    {activeReport.acknowledgement.bountyAwarded && (
                      <span className="text-emerald-300 font-mono font-bold">
                        Bounty Awarded: {activeReport.acknowledgement.bountyAwarded}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Attack Surface Summary */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                Attack Surface & Vulnerability Mechanics
              </label>
              {isEditingNew ? (
                <textarea
                  rows={3}
                  value={formData.attackSurfaceSummary || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, attackSurfaceSummary: e.target.value }))}
                  placeholder="Explain how the endpoint processes data and where the security control fails..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {activeReport.attackSurfaceSummary}
                </p>
              )}
            </div>

            {/* Step-by-Step Reproduction Guide */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Step-by-Step Reproduction Guide (Non-Destructive)
                </label>
                {isEditingNew && (
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      reproductionSteps: [...(prev.reproductionSteps || []), '']
                    }))}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Step
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {(isEditingNew ? (formData.reproductionSteps || []) : activeReport.reproductionSteps).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-xs font-mono font-bold text-indigo-400 shrink-0 w-5 text-right">
                      {idx + 1}.
                    </span>
                    {isEditingNew ? (
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const updated = [...(formData.reproductionSteps || [])];
                          updated[idx] = e.target.value;
                          setFormData(prev => ({ ...prev, reproductionSteps: updated }));
                        }}
                        className="flex-1 bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none"
                      />
                    ) : (
                      <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {step}
                      </span>
                    )}
                    {isEditingNew && (formData.reproductionSteps?.length || 0) > 1 && (
                      <button
                        onClick={() => {
                          const updated = formData.reproductionSteps?.filter((_, i) => i !== idx);
                          setFormData(prev => ({ ...prev, reproductionSteps: updated }));
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Proof of Concept Raw HTTP / cURL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-cyan-400" /> Technical Proof of Concept (Sanitized)
                </label>
                <button
                  onClick={() => copyToClipboard(isEditingNew ? (formData.proofOfConceptRaw || '') : activeReport.proofOfConceptRaw, 'poc')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3 h-3" /> {copiedType === 'poc' ? 'Copied' : 'Copy Raw PoC'}
                </button>
              </div>

              {isEditingNew ? (
                <textarea
                  rows={6}
                  value={formData.proofOfConceptRaw || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, proofOfConceptRaw: e.target.value }))}
                  placeholder="Paste raw HTTP request / response or cURL script with redacted tokens..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed max-h-64">
                  {activeReport.proofOfConceptRaw}
                </pre>
              )}
            </div>

            {/* Impact Analysis */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                Security Impact & Exploit Path Analysis
              </label>
              {isEditingNew ? (
                <textarea
                  rows={3}
                  value={formData.impactAnalysis || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, impactAnalysis: e.target.value }))}
                  placeholder="Detail the business risk, data sensitivity, and threat scenarios..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {activeReport.impactAnalysis}
                </p>
              )}
            </div>

            {/* Defensive Remediation & Patch */}
            <div>
              <label className="block text-xs font-semibold uppercase text-emerald-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Recommended Remediation & Defensive Code Patch
              </label>
              <div className="space-y-2">
                {isEditingNew ? (
                  <>
                    <input
                      type="text"
                      value={formData.recommendedMitigation || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, recommendedMitigation: e.target.value }))}
                      placeholder="High-level engineering remediation advice..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <textarea
                      rows={5}
                      value={formData.defensiveCodeSnippet || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, defensiveCodeSnippet: e.target.value }))}
                      placeholder="// Secure code patch implementation..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      {activeReport.recommendedMitigation}
                    </p>
                    {activeReport.defensiveCodeSnippet && (
                      <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto text-xs font-mono text-emerald-300 leading-relaxed max-h-64">
                        {activeReport.defensiveCodeSnippet}
                      </pre>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {isEditingNew ? (
                <>
                  <button
                    onClick={() => setIsEditingNew(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel Draft
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                  >
                    Save & Validate Report
                  </button>
                </>
              ) : (
                <>
                  <div className="text-xs text-slate-400 font-mono">
                    Status: <span className="text-emerald-400 font-bold">{activeReport.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsEditingNew(true);
                        setFormData(activeReport);
                      }}
                      className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                    >
                      Edit Report
                    </button>
                    <button
                      onClick={() => copyToClipboard(generateHackerOneMarkdown(activeReport), 'markdown')}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
                    >
                      Export Submission
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
