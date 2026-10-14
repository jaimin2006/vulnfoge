import React, { useState } from 'react';
import { WstgChecklistItem } from '../types';
import { CheckSquare, Square, Filter, Plus, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TestingMethodologyProps {
  checklist: WstgChecklistItem[];
  onToggleChecklist: (id: string) => void;
  onAddChecklistItem: (item: WstgChecklistItem) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const TestingMethodology: React.FC<TestingMethodologyProps> = ({
  checklist,
  onToggleChecklist,
  onAddChecklistItem,
  onUpdateNotes,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    wstgId: 'WSTG-CUSTOM-01',
    category: 'Target Selection & Recon' as const,
    testingGuide: '',
  });

  const categories = [
    'All',
    'Target Selection & Recon',
    'Authentication & Session',
    'Authorization & IDOR',
    'Input & API Security',
    'Server-Side & Cloud Logic'
  ];

  const filteredItems = checklist.filter(
    item => activeCategory === 'All' || item.category === activeCategory
  );

  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title) return;

    onAddChecklistItem({
      id: `wstg-${Date.now()}`,
      category: newItem.category,
      wstgId: newItem.wstgId,
      title: newItem.title,
      description: newItem.description,
      testingGuide: newItem.testingGuide,
      completed: false,
      notes: ''
    });

    setShowAddModal(false);
    setNewItem({
      title: '',
      description: '',
      wstgId: 'WSTG-CUSTOM-01',
      category: 'Target Selection & Recon',
      testingGuide: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>OWASP WSTG RECON & TESTING WORKFLOW</span>
            <span aria-hidden="true">·</span>
            <span>SYSTEMATIC METHODOLOGY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Target Testing Methodology & Verification Checklist
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Systematic coverage of OWASP Web Security Testing Guide categories to uncover non-trivial vulnerabilities on lesser-known targets.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Test Procedure</span>
        </button>
      </div>

      {/* Progress & Stats Bar */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-slate-400">Audit Completion</div>
            <div className="text-lg font-bold text-white font-mono">
              {completedCount} <span className="text-slate-500 text-sm font-normal">/ {checklist.length} Steps</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-slate-800 hidden sm:block" />
          <div>
            <div className="text-xs text-slate-400">Coverage Score</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all ${
              item.completed
                ? 'bg-slate-900/50 border-emerald-900/40'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleChecklist(item.id)}
                  className="mt-1 text-slate-400 hover:text-white transition-colors"
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="text-cyan-400 font-semibold">{item.wstgId}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.category}</span>
                  </div>
                  <h4 className={`text-sm sm:text-base font-semibold mt-0.5 ${item.completed ? 'text-slate-300 line-through' : 'text-white'}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                item.completed
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {item.completed ? 'Verified' : 'Pending Test'}
              </span>
            </div>

            {/* Guide & Notes Strip */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-semibold block mb-0.5">Testing Guidance:</span>
                <span className="text-slate-400 leading-normal">{item.testingGuide}</span>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Researcher Observation Notes:</span>
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                    placeholder="Log endpoints, parameter observations, or token behaviors..."
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding custom procedure */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form onSubmit={handleAddNew} className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Add Custom WSTG Testing Procedure</h3>
            
            <div>
              <label className="block text-xs text-slate-400 mb-1">Title</label>
              <input
                type="text"
                required
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="e.g. Test Webhook SSRF via HTTP 302 Redirection"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">WSTG Reference ID</label>
                <input
                  type="text"
                  value={newItem.wstgId}
                  onChange={(e) => setNewItem({ ...newItem, wstgId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
                >
                  <option value="Target Selection & Recon">Target Selection & Recon</option>
                  <option value="Authentication & Session">Authentication & Session</option>
                  <option value="Authorization & IDOR">Authorization & IDOR</option>
                  <option value="Input & API Security">Input & API Security</option>
                  <option value="Server-Side & Cloud Logic">Server-Side & Cloud Logic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Description</label>
              <textarea
                rows={2}
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="What security flaw or design invariant is evaluated?"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Testing Guidance</label>
              <textarea
                rows={2}
                value={newItem.testingGuide}
                onChange={(e) => setNewItem({ ...newItem, testingGuide: e.target.value })}
                placeholder="Specific headers, parameter modifications, or tools to use..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded"
              >
                Save Procedure
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
