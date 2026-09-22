import React, { useState } from 'react';
import {
  Building2,
  Users,
  Briefcase,
  Layers,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Department, Venture, UserSession } from '../../types';
import { StorageService } from '../../services/storageService';

interface OperationsViewProps {
  session: UserSession;
  departments: Department[];
  ventures: Venture[];
  onRefresh: () => void;
  onNavigateEmployees: () => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  session,
  departments,
  ventures,
  onRefresh,
  onNavigateEmployees,
}) => {
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDept, setNewDept] = useState({
    name: '',
    code: '',
    head: '',
    description: '',
  });

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name || !newDept.code) return;

    const created: Department = {
      id: `dept-${Date.now().toString().slice(-4)}`,
      name: newDept.name,
      code: newDept.code.toUpperCase(),
      departmentHead: newDept.head || session.name,
      head: newDept.head || session.name,
      officerInCharge: session.name,
      employeeCount: 0,
      activeProjects: 1,
      status: 'Active',
      description: newDept.description || 'UniGrova Corporate Division',
    };

    StorageService.addDepartment(created, session);
    setIsAddDeptOpen(false);
    setNewDept({ name: '', code: '', head: '', description: '' });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Departments & Operational Divisions</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {departments.length} Operational Units
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organizational structure, department heads, project allocation, and multi-venture resource management.
          </p>
        </div>

        <button
          onClick={() => setIsAddDeptOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Department</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                  {dept.code}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {dept.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-1">{dept.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dept.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Head of Department:</span>
                  <span className="font-bold text-slate-800">{dept.head}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Officer in Charge:</span>
                  <span className="font-medium text-slate-700">{dept.officerInCharge}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <strong>{dept.employeeCount}</strong> staff
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                  <strong>{dept.activeProjects}</strong> projects
                </span>
              </div>

              <button
                onClick={onNavigateEmployees}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
              >
                <span>View Staff</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Venture Strategic Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900">UniGrova Multi-Venture Portfolio</h3>
          <p className="text-xs text-slate-500">Corporate subsidiaries and innovation hubs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ventures.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors"
            >
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                {v.code}
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">{v.name}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{v.description}</p>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Sector: <strong>{v.sector}</strong></span>
                <span className="font-bold text-emerald-700">{v.performanceScore}% Score</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Department Modal */}
      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-[#0B2545] p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Create New Department</h3>
              <button onClick={() => setIsAddDeptOpen(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateDept} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-LAB"
                  value={newDept.code}
                  onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Head</label>
                <input
                  type="text"
                  placeholder="e.g. Rehan Raja"
                  value={newDept.head}
                  onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Division operational mission and scope..."
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Establish Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
