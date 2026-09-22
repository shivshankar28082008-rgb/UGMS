import React, { useState } from 'react';
import {
  Code2,
  GitBranch,
  Calendar,
  User,
  ExternalLink,
  Plus,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { TechProject, UserSession } from '../../types';
import { StorageService } from '../../services/storageService';

interface ProjectsViewProps {
  session: UserSession;
  projects: TechProject[];
  onRefresh: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  session,
  projects,
  onRefresh,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    lead: 'Rehan Raja',
    techStack: 'React, TypeScript, Tailwind CSS',
    repo: 'github.com/unigrova/',
    deadline: '2026-12-31',
    progress: 50,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;

    const created: TechProject = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      name: newProject.name,
      description: newProject.description,
      lead: newProject.lead,
      teamMembers: ['Rehan Raja', 'Tannu Kumari', 'Staff Engineers'],
      techStack: newProject.techStack.split(',').map((s) => s.trim()),
      repo: newProject.repo,
      deadline: newProject.deadline,
      status: 'Active',
      progress: Number(newProject.progress) || 50,
    };

    StorageService.addProject(created, session);
    setIsAddOpen(false);
    setNewProject({
      name: '',
      description: '',
      lead: 'Rehan Raja',
      techStack: 'React, TypeScript, Tailwind CSS',
      repo: 'github.com/unigrova/',
      deadline: '2026-12-31',
      progress: 50,
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Technology Projects & Product Pipelines</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
              {projects.length} Repositories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Software architectures, sprint milestones, tech stacks, and source repositories across UniGrova initiatives.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Tech Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-slate-900 truncate">{proj.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                  {proj.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">{proj.description}</p>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-50 p-2 rounded-lg border border-slate-200 truncate">
                <GitBranch className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{proj.repo}</span>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Sprint Completion</span>
                  <span className="font-bold text-slate-800">{proj.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>

              {/* Tech stack badges */}
              <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100">
                {proj.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Lead: <strong className="text-slate-700">{proj.lead}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Target: {proj.deadline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-[#0B2545] p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">New Technology Project</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UniGrova AI Hub"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="System scope and deliverable goals..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technical Lead</label>
                <input
                  type="text"
                  value={newProject.lead}
                  onChange={(e) => setNewProject({ ...newProject, lead: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="Next.js, Python, PostgreSQL, Redis"
                  value={newProject.techStack}
                  onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Repository URL</label>
                <input
                  type="text"
                  placeholder="github.com/unigrova/ai-engine"
                  value={newProject.repo}
                  onChange={(e) => setNewProject({ ...newProject, repo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl"
                >
                  Initialize Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
