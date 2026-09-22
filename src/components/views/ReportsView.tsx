import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  TrendingUp,
  Users,
  CreditCard,
  Building2,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import {
  Employee,
  Department,
  Venture,
  TechProject,
  ApprovalItem,
  UserSession,
} from '../../types';
import { UniGrovaLogo } from '../common/UniGrovaLogo';

interface ReportsViewProps {
  session: UserSession;
  employees: Employee[];
  departments: Department[];
  ventures: Venture[];
  projects: TechProject[];
  approvals: ApprovalItem[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  session,
  employees,
  departments,
  ventures,
  projects,
  approvals,
}) => {
  const [selectedReport, setSelectedReport] = useState<string>('executive');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const activeEmployees = employees.filter((e) => e.status === 'Active').length;
  const idCardsIssued = employees.filter((e) => e.idCardGenerated).length;
  const coveragePercent = Math.round((idCardsIssued / (employees.length || 1)) * 100);

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (selectedReport === 'employees' || selectedReport === 'idcards') {
      csvContent += 'Employee ID,Full Name,Designation,Department,Status,ID Card Issued,Blood Group,Phone,Email\n';
      employees.forEach((e) => {
        csvContent += `"${e.employeeId}","${e.fullName}","${e.designation}","${e.department}","${e.status}","${e.idCardGenerated ? 'YES' : 'NO'}","${e.bloodGroup}","${e.phone}","${e.email}"\n`;
      });
    } else {
      csvContent += 'Metric,Value\n';
      csvContent += `"Total Headcount",${employees.length}\n`;
      csvContent += `"Active Staff",${activeEmployees}\n`;
      csvContent += `"ID Cards Issued",${idCardsIssued}\n`;
      csvContent += `"ID Card Coverage","${coveragePercent}%"\n`;
      csvContent += `"Departments",${departments.length}\n`;
      csvContent += `"Active Projects",${projects.length}\n`;
      csvContent += `"Ventures",${ventures.length}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UniGrova-${selectedReport}-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice('Report exported to CSV successfully.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <UniGrovaLogo size="md" variant="compact" className="mt-0.5 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Governance Analytics & Reports</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Q3 Audited
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Official operational intelligence, credential clearance statistics, and cross-department performance reports.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Report</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'executive', label: 'Executive Overview', icon: TrendingUp },
          { id: 'employees', label: 'Employee Headcount', icon: Users },
          { id: 'idcards', label: 'ID Card Issuance', icon: CreditCard },
          { id: 'departments', label: 'Department Audit', icon: Building2 },
          { id: 'tech', label: 'Technology Roadmap', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Content Panels */}
      {selectedReport === 'executive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Total Personnel</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{employees.length}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Active standing</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">ID Card Clearance</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{coveragePercent}%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{idCardsIssued} of {employees.length} badged</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Operations Units</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">{departments.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Across 4 ventures</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Cloud SLA Uptime</span>
              <p className="text-2xl font-black text-teal-600 mt-1">99.98%</p>
              <p className="text-[11px] text-teal-700 font-semibold mt-0.5">APAC nodes stable</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Executive Summary & Audit Highlights</h3>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                UniGrova Management System (UGMS) has operated under the executive leadership council comprising 
                <strong> Saurav Kumar (Founder)</strong>, <strong>Rehan Raja (Co-Founder)</strong>, <strong>Tannu Kumari (CEO)</strong>, 
                and <strong>Rishika Priya (COO)</strong>.
              </p>
              <p>
                All employee records comply with ISO/IEC 7810 ID-1 standard badges (85.60 × 53.98 mm) featuring encrypted 
                QR code verification and authorized executive seals signed by Chief Executive Officer Tannu Kumari.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'idcards' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">ID Card Issuance Audit Log</h3>
              <p className="text-xs text-slate-500">Official credentials issued under COO Rishika Priya</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              {idCardsIssued} / {employees.length} Issued ({coveragePercent}%)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2">Employee</th>
                  <th className="py-2">Officer ID</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Blood Group</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Issuance Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-900">{emp.fullName}</td>
                    <td className="py-2.5 font-mono text-slate-600">{emp.employeeId}</td>
                    <td className="py-2.5 text-slate-700">{emp.department}</td>
                    <td className="py-2.5 font-bold text-rose-600">{emp.bloodGroup}</td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          emp.idCardGenerated ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {emp.idCardGenerated ? 'Issued' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-500">{emp.idCardGeneratedAt || 'Pending Issue'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedReport === 'employees' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4">Departmental Headcount Breakdown</h3>
          <div className="space-y-4">
            {departments.map((d) => {
              const count = employees.filter((e) => e.department === d.name).length;
              const percent = Math.round((count / (employees.length || 1)) * 100);
              return (
                <div key={d.id}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{d.name} ({d.code})</span>
                    <span>{count} staff ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedReport === 'departments' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {departments.map((d) => (
            <div key={d.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {d.code}
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">{d.name}</h4>
              <p className="text-xs text-slate-500 mt-1">Head: {d.head}</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span>Active Projects: <strong>{d.activeProjects}</strong></span>
                <span className="text-emerald-700 font-bold">{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReport === 'tech' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Technology Systems & Pipelines</h3>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{p.repo}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800">{p.progress}% Complete</span>
                  <span className="block text-[10px] text-slate-400">Target: {p.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
