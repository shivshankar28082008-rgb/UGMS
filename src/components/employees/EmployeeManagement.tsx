import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CreditCard,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Download,
  Building2,
  ShieldCheck,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';
import { Employee, Department, UserSession } from '../../types';
import { EmployeeService } from '../../services/employeeService';
import { StorageService } from '../../services/storageService';
import { EmployeeFormModal } from './EmployeeFormModal';
import { EmployeeProfileModal } from './EmployeeProfileModal';

interface EmployeeManagementProps {
  session: UserSession;
  employees: Employee[];
  departments: Department[];
  onRefresh: () => void;
  onNavigateGenerateID: (emp: Employee) => void;
  onOpenVerification: (emp: Employee) => void;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({
  session,
  employees,
  departments,
  onRefresh,
  onNavigateGenerateID,
  onOpenVerification,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  // Filters
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    const matchesType = typeFilter === 'All' || emp.employmentType === typeFilter;

    return matchesSearch && matchesDept && matchesStatus && matchesType;
  });

  const handleSaveEmployee = async (emp: Employee) => {
    try {
      const exists = employees.some((e) => e.id === emp.id || e.employeeId === emp.employeeId);
      if (exists) {
        await EmployeeService.updateEmployee(emp.id, emp, session);
      } else {
        await EmployeeService.createEmployee(emp, session);
      }
    } catch {
      StorageService.saveEmployee(emp, session);
    }
    onRefresh();
  };

  const handleToggleStatus = async (emp: Employee) => {
    const newStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
    const updated = { ...emp, status: newStatus as any };
    try {
      await EmployeeService.updateEmployee(updated.id, updated, session);
    } catch {
      StorageService.saveEmployee(updated, session);
    }
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Employee Records & Personnel Directory</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {employees.length} Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete lifecycle management, credential tracking, and department assignments under corporate governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingEmployee(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by full name, employee ID, role, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-700"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:inline-flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employees Output */}
      {employees.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
            <Users className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">No employees have been added yet.</h3>
            <p className="text-xs text-slate-500">
              The Firestore personnel database has 0 records. As COO, you can add verified employees and generate official ID cards.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingEmployee(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add First Employee</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Officer / Emp ID</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">ID Card Badge</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.profilePhoto}
                            alt={emp.fullName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-300 shrink-0 bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                emp.fullName
                              )}&background=0B2545&color=fff&size=100`;
                            }}
                          />
                          <div className="min-w-0">
                            <p
                              onClick={() => setViewingEmployee(emp)}
                              className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer truncate"
                            >
                              {emp.fullName}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {emp.employeeId}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{emp.designation}</p>
                        <p className="text-[11px] text-slate-500">{emp.department}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            emp.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : emp.status === 'Onboarding'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              emp.status === 'Active'
                                ? 'bg-emerald-500'
                                : emp.status === 'Onboarding'
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          {emp.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {emp.idCardGenerated ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Issued</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span>Pending Issue</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingEmployee(emp)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingEmployee(emp);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Employee"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onNavigateGenerateID(emp)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Generate / View ID Card"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      No employee records found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={emp.profilePhoto}
                      alt={emp.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          emp.fullName
                        )}&background=0B2545&color=fff&size=100`;
                      }}
                    />
                    <div className="min-w-0">
                      <h4
                        onClick={() => setViewingEmployee(emp)}
                        className="font-bold text-slate-900 truncate hover:text-emerald-700 cursor-pointer"
                      >
                        {emp.fullName}
                      </h4>
                      <p className="text-xs text-emerald-700 font-semibold truncate">{emp.designation}</p>
                      <p className="text-[10px] font-mono text-slate-400">{emp.employeeId}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      emp.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 my-3 pt-3 border-t border-slate-100">
                  <p className="truncate">Department: <strong className="text-slate-800">{emp.department}</strong></p>
                  <p className="truncate">Email: <span className="text-slate-700">{emp.email}</span></p>
                  <p>Location: <span className="text-slate-700">{emp.workLocation}</span></p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigateGenerateID(emp)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>ID Badge</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingEmployee(emp)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingEmployee(emp);
                      setIsFormOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Form Modal */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveEmployee}
        existingEmployee={editingEmployee}
        departments={departments.map((d) => d.name)}
        totalEmployeesCount={employees.length}
      />

      {/* Employee Profile Detail Modal */}
      <EmployeeProfileModal
        isOpen={!!viewingEmployee}
        onClose={() => setViewingEmployee(null)}
        employee={viewingEmployee}
        onEdit={(emp) => {
          setViewingEmployee(null);
          setEditingEmployee(emp);
          setIsFormOpen(true);
        }}
        onGenerateID={(emp) => {
          setViewingEmployee(null);
          onNavigateGenerateID(emp);
        }}
        onOpenVerification={(emp) => {
          onOpenVerification(emp);
        }}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};
