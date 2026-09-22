import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UserPlus,
  Save,
  Upload,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { Employee, BloodGroup, EmploymentType, EmployeeStatus } from '../../types';
import { StorageService } from '../../services/storageService';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (emp: Employee) => Promise<void> | void;
  existingEmployee?: Employee | null;
  departments?: string[];
  totalEmployeesCount?: number;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingEmployee,
  departments = ['Technology', 'Operations', 'Human Resources', 'Finance', 'Marketing', 'Product', 'Design'],
  totalEmployeesCount = 0,
}) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    fullName: '',
    preferredName: '',
    profilePhoto: '',
    dateOfBirth: '1998-01-01',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    employeeId: '',
    designation: '',
    department: 'Technology',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-Time',
    workLocation: 'Bengaluru HQ',
    reportingManager: 'Rishika Priya (COO)',
    status: 'Active',
    emergencyContact: {
      name: '',
      relationship: 'Family',
      phone: '',
    },
    idCardGenerated: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingEmployee) {
      setFormData(existingEmployee);
    } else {
      // Auto-generate official ID format: UIG-EMP-0001, UIG-EMP-0002...
      const nextSequence = String(totalEmployeesCount + 1).padStart(4, '0');
      setFormData({
        fullName: '',
        preferredName: '',
        profilePhoto: '',
        dateOfBirth: '1998-01-01',
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '',
        email: '',
        address: '',
        employeeId: `UIG-EMP-${nextSequence}`,
        designation: '',
        department: departments[0] || 'Technology',
        joiningDate: new Date().toISOString().split('T')[0],
        employmentType: 'Full-Time',
        workLocation: 'Bengaluru HQ',
        reportingManager: 'Rishika Priya (COO)',
        status: 'Active',
        emergencyContact: {
          name: '',
          relationship: 'Family',
          phone: '',
        },
        idCardGenerated: false,
      });
    }
    setError(null);
    setUploadProgress(0);
  }, [existingEmployee, isOpen, totalEmployeesCount]);

  if (!isOpen) return null;

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo file size must be less than 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setError(null);
    setIsUploadingPhoto(true);
    setUploadProgress(10);

    const empId = formData.employeeId?.trim() || `EMP-${Date.now()}`;

    try {
      const downloadUrl = await StorageService.uploadEmployeePhoto(
        empId,
        file,
        (progress) => setUploadProgress(Math.round(progress))
      );
      setFormData((prev) => ({ ...prev, profilePhoto: downloadUrl }));
      setIsUploadingPhoto(false);
    } catch (err: any) {
      console.warn('Storage upload error, using local data URL fallback:', err);
      // Fallback to local DataURL for preview & storage if direct storage bucket offline
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, profilePhoto: reader.result as string }));
        setIsUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName?.trim()) {
      setError('Please provide the employee full legal name.');
      return;
    }
    if (!formData.employeeId?.trim()) {
      setError('Please provide a unique Employee ID.');
      return;
    }
    if (!formData.email?.trim()) {
      setError('Please provide a valid company email.');
      return;
    }
    if (!formData.designation?.trim()) {
      setError('Please provide the designation / job title.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const finalEmployee: Employee = {
      id: existingEmployee?.id || formData.employeeId!,
      employeeId: formData.employeeId!.toUpperCase(),
      fullName: formData.fullName!.trim(),
      preferredName: formData.preferredName?.trim() || '',
      profilePhoto:
        formData.profilePhoto ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          formData.fullName!
        )}&background=0B2545&color=fff&size=200`,
      dateOfBirth: formData.dateOfBirth || '1998-01-01',
      gender: formData.gender as any,
      bloodGroup: (formData.bloodGroup as BloodGroup) || 'O+',
      phone: formData.phone || '',
      email: formData.email!.trim().toLowerCase(),
      address: formData.address || '',
      designation: formData.designation!.trim(),
      department: formData.department || 'Technology',
      joiningDate: formData.joiningDate || new Date().toISOString().split('T')[0],
      employmentType: (formData.employmentType as EmploymentType) || 'Full-Time',
      workLocation: formData.workLocation || 'Bengaluru HQ',
      reportingManager: formData.reportingManager || 'Rishika Priya (COO)',
      status: (formData.status as EmployeeStatus) || 'Active',
      emergencyContact: formData.emergencyContact || {
        name: '',
        relationship: 'Family',
        phone: '',
      },
      idCardGenerated: existingEmployee ? existingEmployee.idCardGenerated : false,
      idCardGeneratedAt: existingEmployee?.idCardGeneratedAt,
    };

    try {
      await onSave(finalEmployee);
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to save employee to Firestore.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-[#0B2545] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {existingEmployee ? 'Edit Employee Record' : 'Register New Employee'}
              </h3>
              <p className="text-xs text-slate-300">
                Official UniGrova Personnel Database Entry • Firestore Synced
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Photo Upload Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center shadow-xs">
              {formData.profilePhoto ? (
                <img
                  src={formData.profilePhoto}
                  alt="Employee Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-400" />
              )}
              {isUploadingPhoto && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <h4 className="text-xs font-bold text-slate-800">Professional Employee Photo</h4>
              <p className="text-[11px] text-slate-500">
                Upload to Firebase Storage for ID Card and directory records. Max 5MB (JPG, PNG).
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{formData.profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
                </button>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    Uploading: {uploadProgress}%
                  </span>
                )}
                {formData.profilePhoto && (
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ready
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 1: Personal Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-100">
              1. Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh"
                  value={formData.preferredName}
                  onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@unigrova.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98000 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Group *</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State, PIN"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Employment Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-100">
              2. Employment Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee ID *</label>
                <input
                  type="text"
                  required
                  placeholder="UIG-EMP-0001"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operations Lead"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  {departments.map((deptName) => (
                    <option key={deptName} value={deptName}>
                      {deptName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Joining Date *</label>
                <input
                  type="date"
                  required
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Executive">Executive</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru HQ"
                  value={formData.workLocation}
                  onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reporting Manager</label>
                <input
                  type="text"
                  placeholder="e.g. Rishika Priya (COO)"
                  value={formData.reportingManager}
                  onChange={(e) => setFormData({ ...formData, reportingManager: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Onboarding">Onboarding</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: Emergency Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-100">
              3. Emergency Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="Emergency contact name"
                  value={formData.emergencyContact?.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: {
                        ...formData.emergencyContact!,
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="Spouse / Parent / Sibling"
                  value={formData.emergencyContact?.relationship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: {
                        ...formData.emergencyContact!,
                        relationship: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Phone</label>
                <input
                  type="text"
                  placeholder="+91 98000 00000"
                  value={formData.emergencyContact?.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: {
                        ...formData.emergencyContact!,
                        phone: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingPhoto}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Firestore...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{existingEmployee ? 'Save Changes' : 'Create Employee Record'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
