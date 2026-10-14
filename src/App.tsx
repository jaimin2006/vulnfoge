import React, { useState } from 'react';
import { 
  INITIAL_PROGRAMS, 
  INITIAL_REPORTS, 
  INITIAL_POST_MORTEMS, 
  INITIAL_CHECKLIST 
} from './data/mockData';
import { 
  BugBountyProgram, 
  VulnerabilityReport, 
  PostMortem, 
  WstgChecklistItem 
} from './types';
import { Header } from './components/Header';
import { ProgramDirectory } from './components/ProgramDirectory';
import { ReportStudio } from './components/ReportStudio';
import { PostMortemStudio } from './components/PostMortemStudio';
import { TestingMethodology } from './components/TestingMethodology';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ShieldCheck, Award, Target, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'programs' | 'reports' | 'post-mortem' | 'methodology' | 'knowledge'>('reports');
  const [programs] = useState<BugBountyProgram[]>(INITIAL_PROGRAMS);
  const [reports, setReports] = useState<VulnerabilityReport[]>(INITIAL_REPORTS);
  const [postMortems, setPostMortems] = useState<PostMortem[]>(INITIAL_POST_MORTEMS);
  const [checklist, setChecklist] = useState<WstgChecklistItem[]>(INITIAL_CHECKLIST);

  // Cross-component workflow state
  const [targetProgramForReport, setTargetProgramForReport] = useState<BugBountyProgram | null>(null);
  const [selectedReportForPostMortem, setSelectedReportForPostMortem] = useState<VulnerabilityReport | null>(null);

  // Workflow Handlers
  const handleSelectProgramForReport = (prog: BugBountyProgram) => {
    setTargetProgramForReport(prog);
    setActiveTab('reports');
  };

  const handleSaveReport = (newReport: VulnerabilityReport) => {
    setReports(prev => {
      const idx = prev.findIndex(r => r.id === newReport.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newReport;
        return updated;
      }
      return [newReport, ...prev];
    });
  };

  const handleViewPostMortem = (report: VulnerabilityReport) => {
    setSelectedReportForPostMortem(report);
    setActiveTab('post-mortem');
  };

  const handleSavePostMortem = (newPm: PostMortem) => {
    setPostMortems(prev => {
      const idx = prev.findIndex(p => p.id === newPm.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newPm;
        return updated;
      }
      return [newPm, ...prev];
    });
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleAddChecklistItem = (item: WstgChecklistItem) => {
    setChecklist(prev => [...prev, item]);
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, notes } : item
    ));
  };

  // Metrics
  const validReportsCount = reports.filter(r => r.severityRating !== 'P5').length;
  const acknowledgedCount = reports.filter(r => r.status === 'Acknowledged & Validated' || r.status === 'Resolved & Closed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Primary Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewReport={() => {
          setTargetProgramForReport(null);
          setActiveTab('reports');
        }}
        verifiedReportsCount={validReportsCount}
      />

      {/* Trust & Policy Compliance Banner */}
      <section className="bg-slate-900/40 border-b border-slate-800/80 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span className="text-slate-300 font-medium">Standard Compliance:</span>
            <span>HackerOne · Bugcrowd VRT · YesWeHack · Intigriti · Coordinated Disclosure</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>
              Validated Reports: <strong className="text-emerald-400">{acknowledgedCount}</strong>
            </span>
            <span>
              Min. Severity: <strong className="text-indigo-400">P4 (P5 Disqualified)</strong>
            </span>
            <span>
              Safe Harbor: <strong className="text-emerald-400">Enforced</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Viewport Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'programs' && (
          <ProgramDirectory
            programs={programs}
            onSelectProgramForReport={handleSelectProgramForReport}
          />
        )}

        {activeTab === 'reports' && (
          <ReportStudio
            reports={reports}
            programs={programs}
            onSaveReport={handleSaveReport}
            onViewPostMortem={handleViewPostMortem}
            initialSelectedProgram={targetProgramForReport}
          />
        )}

        {activeTab === 'post-mortem' && (
          <PostMortemStudio
            postMortems={postMortems}
            reports={reports}
            onSavePostMortem={handleSavePostMortem}
            selectedReportForPostMortem={selectedReportForPostMortem}
          />
        )}

        {activeTab === 'methodology' && (
          <TestingMethodology
            checklist={checklist}
            onToggleChecklist={handleToggleChecklist}
            onAddChecklistItem={handleAddChecklistItem}
            onUpdateNotes={handleUpdateNotes}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeBase />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>VulnForge Responsible Vulnerability Disclosure & Research Workspace</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>OWASP WSTG v4.2</span>
            <span aria-hidden="true">·</span>
            <span>Bugcrowd VRT v1.11</span>
            <span aria-hidden="true">·</span>
            <span>CVSS v3.1 Specification</span>
            <span aria-hidden="true">·</span>
            <span>90-Day Safe Harbor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
