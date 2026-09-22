import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Calendar,
  Terminal,
  Clock,
  User,
} from 'lucide-react';
import { ActivityLog, UserSession } from '../../types';

interface ActivityLogsViewProps {
  session: UserSession;
  activityLogs: ActivityLog[];
}

export const ActivityLogsView: React.FC<ActivityLogsViewProps> = ({
  session,
  activityLogs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.target || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || log.category === categoryFilter;
    const matchesRole = roleFilter === 'All' || log.role === roleFilter;
    return matchesSearch && matchesCat && matchesRole;
  });

  const exportCSV = () => {
    let csv = 'data:text/csv;charset=utf-8,ID,Timestamp,User,Role,Action,Category,Target,Terminal\n';
    filtered.forEach((l) => {
      csv += `"${l.id}","${l.time}","${l.user}","${l.role}","${l.action}","${l.category}","${l.target}","${l.ipAddress || 'Internal'}"\n`;
    });
    const encoded = encodeURI(csv);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `UniGrova-Audit-Log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Governance Audit Stream & Activity Trail</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Immutable Log
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time audit records for authentication, credential issuance, modifications, and executive clearances.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by user, action or target..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="Authentication">Authentication</option>
            <option value="IDCard">ID Card Generation</option>
            <option value="Employee">Employee Management</option>
            <option value="Approval">Approvals</option>
            <option value="Project">Projects</option>
            <option value="System">System Settings</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
          >
            <option value="All">All Roles</option>
            <option value="Founder">Founder</option>
            <option value="Co-Founder">Co-Founder</option>
            <option value="CEO">CEO</option>
            <option value="COO">COO</option>
          </select>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Officer / User</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Action Summary</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Terminal IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.time}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.user}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {log.role}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.category === 'IDCard'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.category === 'Authentication'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {log.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-800">
                    {log.action}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600">
                    {log.target}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {log.ipAddress || '10.240.0.1 (VPN)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
