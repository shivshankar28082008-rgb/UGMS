import React from 'react';
import {
  X,
  CreditCard,
  Edit,
  ShieldCheck,
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Briefcase,
  User,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (emp: Employee) => void;
  onGenerateID: (emp: Employee) => void;
  onOpenVerification: (emp: Employee) => void;
  onToggleStatus: (emp: Employee) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit,
  onGenerateID,
  onOpenVerification,
  onToggleStatus,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-[#0B2545] to-[#113B68] text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={employee.profilePhoto}
              alt={employee.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/80 shadow-md bg-slate-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  employee.fullName
                )}&background=0B2545&color=fff&size=200`;
              }}
            />
            <div className="text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-extrabold text-white truncate">{employee.fullName}</h3>
                {employee.preferredName && (
                  <span className="text-xs text-slate-300 font-medium">
                    ({employee.preferredName})
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    employee.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-400 mt-0.5">
                {employee.designation}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300 mt-2 font-mono">
                <span>{employee.employeeId}</span>
                <span>•</span>
                <span>{employee.department}</span>
                <span>•</span>
                <span>{employee.workLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action quick buttons */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(employee)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Edit className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={() => onGenerateID(employee)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{employee.idCardGenerated ? 'View ID Card' : 'Generate ID Card'}</span>
            </button>
            <button
              onClick={() => onOpenVerification(employee)}
              className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Verify QR</span>
            </button>
          </div>

          <button
            onClick={() => onToggleStatus(employee)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
          >
            Mark as {employee.status === 'Active' ? 'Inactive' : 'Active'}
          </button>
        </div>

        {/* Information Grid */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto text-xs">
          {/* Employment Specs */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2 pb-1 border-b border-slate-100">
              Employment Details
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-medium block text-[11px]">Type</span>
                <span className="font-bold text-slate-900">{employee.employmentType}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-medium block text-[11px]">Joining Date</span>
                <span className="font-bold text-slate-900">{employee.joiningDate}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-medium block text-[11px]">Reporting Manager</span>
                <span className="font-bold text-slate-900">{employee.reportingManager}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-medium block text-[11px]">Work Location</span>
                <span className="font-bold text-slate-900">{employee.workLocation}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-medium block text-[11px]">Blood Group</span>
                <span className="font-bold text-rose-600">{employee.bloodGroup}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-medium block text-[11px]">Official Badge</span>
                <span className="font-bold text-emerald-700">
                  {employee.idCardGenerated ? 'Authorized' : 'Pending Generation'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Address */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2 pb-1 border-b border-slate-100">
              Contact & Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-400 font-medium block text-[10px]">Email Address</span>
                  <span className="font-semibold text-slate-900 truncate block">{employee.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-400 font-medium block text-[10px]">Phone Number</span>
                  <span className="font-semibold text-slate-900 truncate block">{employee.phone}</span>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-medium block text-[10px]">Residential Address</span>
                  <span className="font-semibold text-slate-900">{employee.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2 pb-1 border-b border-slate-100">
              Emergency Contact (Printed on ID Card Back)
            </h4>
            <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{employee.emergencyContact.name}</p>
                <p className="text-[11px] text-slate-600">Relationship: {employee.emergencyContact.relationship}</p>
              </div>
              <div className="text-right font-mono font-bold text-rose-700">
                {employee.emergencyContact.phone}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
