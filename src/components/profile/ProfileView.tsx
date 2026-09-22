import React, { useState, useEffect } from 'react';
import {
  UserCircle2,
  ShieldCheck,
  KeyRound,
  ScanFace,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Sparkles,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { UserSession, ExecutiveLeader } from '../../types';
import { AuthService } from '../../services/authService';
import { StorageService } from '../../services/storageService';
import { FaceCaptureModal } from './FaceCaptureModal';
import { UniGrovaLogo } from '../common/UniGrovaLogo';

interface ProfileViewProps {
  session: UserSession;
  onRefreshSession?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ session, onRefreshSession }) => {
  const [leader, setLeader] = useState<
    (ExecutiveLeader & { devPasswordHash?: string }) | undefined
  >(undefined);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Face lock state
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [faceNotice, setFaceNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const loadLeaderData = async () => {
    const profile = await AuthService.getUserProfile(session.officerId);
    if (profile) {
      setLeader({
        officerId: profile.officerId || session.officerId,
        name: profile.name || session.name,
        preferredName: profile.preferredName || session.preferredName,
        position: profile.position || session.position,
        role: profile.role || session.role,
        profileImage: profile.photoUrl || profile.profileImage || session.profileImage,
        email: profile.email || session.email,
        phone: profile.phone || '+91 96930 20000',
        department: profile.department || 'Executive Leadership',
        location: profile.location || 'Corporate Headquarters',
        bio: profile.bio || 'UniGrova Executive Leadership',
        responsibilities: profile.responsibilities || [],
        faceLockEnabled: !!profile.faceLockEnabled,
        faceLockData: profile.faceLockData,
        faceLockEnrolledAt: profile.faceLockEnrolledAt,
      });
    } else {
      const fallback = StorageService.getLeaderByOfficerId(session.officerId);
      setLeader(fallback);
    }
  };

  useEffect(() => {
    loadLeaderData();
  }, [session.officerId]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    if (!currentPassword) {
      setPasswordNotice({ type: 'error', text: 'Please enter your current password.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordNotice({
        type: 'error',
        text: 'New password must be at least 6 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordNotice({
        type: 'error',
        text: 'New password and confirmation do not match.',
      });
      return;
    }

    const res = await AuthService.changePassword(
      session.officerId,
      currentPassword,
      newPassword,
      session
    );

    if (res.success) {
      setPasswordNotice({ type: 'success', text: res.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await loadLeaderData();
      if (onRefreshSession) onRefreshSession();
    } else {
      setPasswordNotice({ type: 'error', text: res.message });
    }
  };

  const handleFaceEnrollSuccess = async (faceDataUrl: string) => {
    setIsFaceModalOpen(false);
    const res = await AuthService.enrollFaceLock(session.officerId, faceDataUrl);
    if (res.success) {
      setFaceNotice({
        type: 'success',
        text: 'Face ID biometric lock enrolled successfully in Firestore! You can now log in using your face and Officer ID without a password.',
      });
      await loadLeaderData();
      if (onRefreshSession) onRefreshSession();
    } else {
      setFaceNotice({ type: 'error', text: res.message });
    }
  };

  const handleRemoveFaceLock = async () => {
    if (
      window.confirm(
        'Are you sure you want to disable Face ID? You will need to use your password to sign in.'
      )
    ) {
      const res = await AuthService.removeFaceLock(session.officerId);
      if (res.success) {
        setFaceNotice({ type: 'success', text: res.message });
        await loadLeaderData();
        if (onRefreshSession) onRefreshSession();
      } else {
        setFaceNotice({ type: 'error', text: res.message });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <UniGrovaLogo size="md" variant="compact" className="shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Executive Identity & Security Hub</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Authorized Officer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage your governance credentials, update security passwords, and configure Face ID biometric lock.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Biometric Protection Ready</span>
        </div>
      </div>

      {/* Main Profile & Security Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Officer Card & Responsibilities */}
        <div className="space-y-6 lg:col-span-1">
          {/* Identity Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center flex flex-col items-center">
            <div className="relative">
              <img
                src={leader?.faceLockData || leader?.profileImage || session.profileImage}
                alt={session.name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg bg-slate-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    session.name
                  )}&background=0B2545&color=fff&size=200`;
                }}
              />
              {leader?.faceLockEnabled && (
                <div
                  title="Face ID Enrolled & Active"
                  className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-md border-2 border-white"
                >
                  <ScanFace className="w-4 h-4" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-4">{session.name}</h3>
            <p className="text-xs font-semibold text-emerald-700">{session.position}</p>

            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-mono font-bold">
              <span>ID: {session.officerId}</span>
            </div>

            {/* Quick Details */}
            <div className="w-full mt-6 pt-5 border-t border-slate-100 space-y-3 text-left text-xs">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{leader?.department || 'Executive Office'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{leader?.email || session.email}</span>
              </div>
              {leader?.phone && (
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{leader.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{leader?.location || 'Corporate Headquarters'}</span>
              </div>
            </div>
          </div>

          {/* Governance Responsibilities */}
          {leader?.responsibilities && leader.responsibilities.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Key Responsibilities
              </h4>
              <ul className="space-y-2">
                {leader.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Columns: Security Settings (Change Password & Face Lock) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Card 1: Face Lock / Biometric Face ID */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <ScanFace className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Face Lock & Biometric Login</h3>
                  <p className="text-xs text-slate-500">
                    Authenticate instantly without password using your facial biometric geometry
                  </p>
                </div>
              </div>

              {leader?.faceLockEnabled ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enrolled & Active</span>
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-semibold">
                  Not Configured
                </span>
              )}
            </div>

            {faceNotice && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs font-bold flex items-start gap-2 ${
                  faceNotice.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {faceNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{faceNotice.text}</span>
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative flex items-center justify-center">
                  {leader?.faceLockData ? (
                    <img
                      src={leader.faceLockData}
                      alt="Enrolled Face Lock"
                      className="w-full h-full object-cover"
                    />
                  ) : leader?.profileImage ? (
                    <img
                      src={leader.profileImage}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <ScanFace className="w-8 h-8 text-slate-400" />
                  )}
                  {leader?.faceLockEnabled && (
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>

                <div className="text-xs">
                  <p className="font-bold text-slate-800">
                    {leader?.faceLockEnabled
                      ? 'Registered Biometric Face'
                      : 'No Face Registered'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {leader?.faceLockEnrolledAt
                      ? `Enrolled on ${leader.faceLockEnrolledAt}`
                      : 'Enroll your face to bypass password on login'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setIsFaceModalOpen(true)}
                  className="px-4 py-2.5 bg-[#0B2545] hover:bg-[#113B68] text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>
                    {leader?.faceLockEnabled ? 'Update Face Lock' : 'Enroll Face Lock Now'}
                  </span>
                </button>

                {leader?.faceLockEnabled && (
                  <button
                    type="button"
                    onClick={handleRemoveFaceLock}
                    className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    <span>Disable</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>
                <strong>How it works:</strong> Once your face is enrolled, simply enter your{' '}
                <strong>Officer ID ({session.officerId})</strong> on the login screen and tap{' '}
                <strong>"Sign In with Face ID"</strong>. The system scans your face and grants
                instant access without entering your password!
              </p>
            </div>
          </div>

          {/* Card 2: Change Security Password */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Change Executive Password</h3>
                <p className="text-xs text-slate-500">
                  Update your primary security password for Officer ID: {session.officerId}
                </p>
              </div>
            </div>

            {passwordNotice && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs font-bold flex items-start gap-2 ${
                  passwordNotice.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {passwordNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{passwordNotice.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Password must be at least 6 characters.
                </span>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Face Capture / Enrollment Modal */}
      <FaceCaptureModal
        isOpen={isFaceModalOpen}
        onClose={() => setIsFaceModalOpen(false)}
        mode="enroll"
        officerId={session.officerId}
        onSuccess={handleFaceEnrollSuccess}
      />
    </div>
  );
};
