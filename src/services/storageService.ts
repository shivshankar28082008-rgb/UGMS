import { ref, uploadBytesResumable, getDownloadURL, uploadString } from 'firebase/storage';
import { storage } from '../firebase/config';
import {
  Employee,
  Department,
  Venture,
  TechProject,
  ApprovalItem,
  ActivityLog,
  ExecutiveLeader,
  CompanySettings,
  IDCardSettings,
  OnboardingCandidate,
  NotificationItem,
  UserSession,
} from '../types';
import {
  INITIAL_LEADERS,
  INITIAL_DEPARTMENTS,
  INITIAL_VENTURES,
  INITIAL_PROJECTS,
  INITIAL_APPROVALS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_COMPANY_SETTINGS,
  INITIAL_ID_CARD_SETTINGS,
  INITIAL_ONBOARDING,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

const KEYS = {
  EMPLOYEES: 'ugms_employees_data_v2',
  DEPARTMENTS: 'ugms_departments_data_v2',
  VENTURES: 'ugms_ventures_data_v2',
  PROJECTS: 'ugms_projects_data_v2',
  APPROVALS: 'ugms_approvals_data_v2',
  ACTIVITY_LOGS: 'ugms_activity_logs_v2',
  LEADERS: 'ugms_executive_leaders_v2',
  COMPANY_SETTINGS: 'ugms_company_settings_v2',
  IDCARD_SETTINGS: 'ugms_idcard_settings_v2',
  ONBOARDING: 'ugms_onboarding_candidates_v2',
  NOTIFICATIONS: 'ugms_notifications_data_v2',
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn(`Error writing to local storage key ${key}:`, err);
  }
}

export const StorageService = {
  // ================= EMPLOYEES =================
  getEmployees(): Employee[] {
    return getLocal<Employee[]>(KEYS.EMPLOYEES, []);
  },

  saveEmployee(emp: Employee, session?: UserSession): void {
    const list = this.getEmployees();
    const idx = list.findIndex((e) => e.id === emp.id || e.employeeId === emp.employeeId);
    if (idx >= 0) {
      list[idx] = emp;
    } else {
      list.push(emp);
    }
    setLocal(KEYS.EMPLOYEES, list);
    if (session) {
      this.logActivity(`Saved employee record: ${emp.fullName} (${emp.employeeId})`, 'Employee', session);
    }
  },

  deleteEmployee(id: string, session?: UserSession): void {
    const list = this.getEmployees().filter((e) => e.id !== id && e.employeeId !== id);
    setLocal(KEYS.EMPLOYEES, list);
    if (session) {
      this.logActivity(`Deleted employee record: ${id}`, 'Employee', session);
    }
  },

  markIDCardGenerated(empId: string, session?: UserSession): void {
    const list = this.getEmployees();
    const idx = list.findIndex((e) => e.employeeId === empId || e.id === empId);
    if (idx >= 0) {
      list[idx].idCardGenerated = true;
      list[idx].idCardGeneratedAt = new Date().toISOString();
      setLocal(KEYS.EMPLOYEES, list);
      if (session) {
        this.logActivity(`Issued official ID Card for ${list[idx].fullName} (${empId})`, 'IDCard', session);
      }
    }
  },

  // ================= DEPARTMENTS =================
  getDepartments(): Department[] {
    return getLocal<Department[]>(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  addDepartment(dept: Department, session?: UserSession): void {
    const list = this.getDepartments();
    list.push(dept);
    setLocal(KEYS.DEPARTMENTS, list);
    if (session) {
      this.logActivity(`Created department: ${dept.name}`, 'Department', session);
    }
  },

  // ================= VENTURES =================
  getVentures(): Venture[] {
    return getLocal<Venture[]>(KEYS.VENTURES, INITIAL_VENTURES);
  },

  // ================= PROJECTS =================
  getProjects(): TechProject[] {
    return getLocal<TechProject[]>(KEYS.PROJECTS, INITIAL_PROJECTS);
  },

  addProject(project: TechProject, session?: UserSession): void {
    const list = this.getProjects();
    list.push(project);
    setLocal(KEYS.PROJECTS, list);
    if (session) {
      this.logActivity(`Created technical project: ${project.name}`, 'Project', session);
    }
  },

  // ================= APPROVALS =================
  getApprovals(): ApprovalItem[] {
    return getLocal<ApprovalItem[]>(KEYS.APPROVALS, INITIAL_APPROVALS);
  },

  updateApprovalStatus(
    id: string,
    status: 'Approved' | 'Rejected',
    reviewNotes?: string,
    session?: UserSession
  ): void {
    const list = this.getApprovals();
    const item = list.find((a) => a.id === id);
    if (item) {
      item.status = status;
      item.reviewedBy = session?.name || 'Executive Officer';
      item.reviewedAt = new Date().toLocaleString();
      if (reviewNotes) item.reviewNotes = reviewNotes;
      setLocal(KEYS.APPROVALS, list);
      if (session) {
        this.logActivity(`${status} approval request: ${item.title}`, 'Approval', session);
      }
    }
  },

  // ================= ACTIVITY LOGS =================
  getActivityLogs(): ActivityLog[] {
    return getLocal<ActivityLog[]>(KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
  },

  logActivity(
    action: string,
    category: ActivityLog['category'],
    session: UserSession
  ): void {
    const list = this.getActivityLogs();
    const now = new Date();
    const newLog: ActivityLog = {
      id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user: session.name,
      officerId: session.officerId,
      role: session.role,
      action,
      category,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
    };
    list.unshift(newLog);
    setLocal(KEYS.ACTIVITY_LOGS, list.slice(0, 100)); // retain last 100 logs
  },

  // ================= LEADERS & EXECUTIVE PROFILES =================
  getLeaders(): Record<string, ExecutiveLeader & { devPasswordHash?: string }> {
    const raw = getLocal<Record<string, ExecutiveLeader & { devPasswordHash?: string }>>(
      KEYS.LEADERS,
      {}
    );
    const merged: Record<string, ExecutiveLeader & { devPasswordHash?: string }> = { ...INITIAL_LEADERS };
    for (const [key, val] of Object.entries(raw || {})) {
      merged[key] = {
        ...(INITIAL_LEADERS[key] || {}),
        ...val,
        devPasswordHash: val.devPasswordHash || INITIAL_LEADERS[key]?.devPasswordHash,
      };
    }
    return merged;
  },

  getLeaderByOfficerId(
    officerId: string
  ): (ExecutiveLeader & { devPasswordHash?: string }) | undefined {
    const leaders = this.getLeaders();
    return leaders[officerId];
  },

  changePassword(
    officerId: string,
    oldPass: string,
    newPass: string,
    session?: UserSession
  ): { success: boolean; message: string } {
    const leaders = this.getLeaders();
    const leader = leaders[officerId];
    if (!leader) {
      return { success: false, message: 'Officer record not found in system.' };
    }

    if (leader.devPasswordHash && leader.devPasswordHash !== oldPass) {
      return { success: false, message: 'Current password provided is incorrect.' };
    }

    leader.devPasswordHash = newPass;
    leaders[officerId] = leader;
    setLocal(KEYS.LEADERS, leaders);

    if (session) {
      this.logActivity('Changed executive account password', 'Auth', session);
    }

    return { success: true, message: 'Password updated successfully!' };
  },

  enrollFaceLock(
    officerId: string,
    faceDataUrl: string,
    session?: UserSession
  ): { success: boolean; message: string } {
    const leaders = this.getLeaders();
    const leader = leaders[officerId];
    if (!leader) {
      return { success: false, message: 'Officer not found in executive registry.' };
    }

    leader.faceLockEnabled = true;
    leader.faceLockData = faceDataUrl;
    leader.faceLockEnrolledAt = new Date().toISOString();
    leaders[officerId] = leader;
    setLocal(KEYS.LEADERS, leaders);

    if (session) {
      this.logActivity('Enrolled Face ID biometric lock credential', 'Auth', session);
    }

    return { success: true, message: 'Face ID biometric lock registered successfully!' };
  },

  removeFaceLock(
    officerId: string,
    session?: UserSession
  ): { success: boolean; message: string } {
    const leaders = this.getLeaders();
    const leader = leaders[officerId];
    if (!leader) {
      return { success: false, message: 'Officer not found.' };
    }

    leader.faceLockEnabled = false;
    delete leader.faceLockData;
    delete leader.faceLockEnrolledAt;
    leaders[officerId] = leader;
    setLocal(KEYS.LEADERS, leaders);

    if (session) {
      this.logActivity('Disabled Face ID biometric lock', 'Auth', session);
    }

    return { success: true, message: 'Face ID biometric lock removed.' };
  },

  // ================= ONBOARDING =================
  getOnboardingCandidates(): OnboardingCandidate[] {
    return getLocal<OnboardingCandidate[]>(KEYS.ONBOARDING, INITIAL_ONBOARDING);
  },

  addOnboardingCandidate(candidate: OnboardingCandidate, session?: UserSession): void {
    const list = this.getOnboardingCandidates();
    list.unshift(candidate);
    setLocal(KEYS.ONBOARDING, list);
    if (session) {
      this.logActivity(`Initiated onboarding pipeline for ${candidate.fullName}`, 'Employee', session);
    }
  },

  advanceOnboardingStage(
    id: string,
    nextStageOrSession?: OnboardingCandidate['stage'] | UserSession,
    session?: UserSession
  ): void {
    const list = this.getOnboardingCandidates();
    const candidate = list.find((c) => c.id === id);
    const actualSession =
      session ||
      (nextStageOrSession && typeof nextStageOrSession === 'object' && 'officerId' in nextStageOrSession
        ? (nextStageOrSession as UserSession)
        : undefined);
    const explicitStage = typeof nextStageOrSession === 'string' ? nextStageOrSession : undefined;

    if (candidate) {
      if (explicitStage) {
        candidate.stage = explicitStage;
      } else {
        const stages: OnboardingCandidate['stage'][] = [
          'Candidate Created',
          'Document Verification',
          'ID Card Generation',
          'Asset Assignment',
          'Completed',
        ];
        const curIdx = stages.indexOf(candidate.stage);
        if (curIdx >= 0 && curIdx < stages.length - 1) {
          candidate.stage = stages[curIdx + 1];
        }
      }
      setLocal(KEYS.ONBOARDING, list);
      if (actualSession) {
        this.logActivity(
          `Advanced candidate ${candidate.fullName} to stage: ${candidate.stage}`,
          'Employee',
          actualSession
        );
      }
    }
  },

  // ================= NOTIFICATIONS =================
  getNotifications(): NotificationItem[] {
    return getLocal<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  markAllNotificationsRead(session?: UserSession): void {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    setLocal(KEYS.NOTIFICATIONS, list);
    if (session) {
      this.logActivity('Marked all notifications as read', 'System', session);
    }
  },

  clearAllNotifications(session?: UserSession): void {
    setLocal(KEYS.NOTIFICATIONS, []);
    if (session) {
      this.logActivity('Cleared notification center', 'System', session);
    }
  },

  // ================= SETTINGS =================
  getCompanySettings(): CompanySettings {
    return getLocal<CompanySettings>(KEYS.COMPANY_SETTINGS, INITIAL_COMPANY_SETTINGS);
  },

  saveCompanySettings(settings: CompanySettings, session?: UserSession): void {
    setLocal(KEYS.COMPANY_SETTINGS, settings);
    if (session) {
      this.logActivity('Updated corporate company metadata & settings', 'System', session);
    }
  },

  getIDCardSettings(): IDCardSettings {
    return getLocal<IDCardSettings>(KEYS.IDCARD_SETTINGS, INITIAL_ID_CARD_SETTINGS);
  },

  saveIDCardSettings(settings: IDCardSettings, session?: UserSession): void {
    setLocal(KEYS.IDCARD_SETTINGS, settings);
    if (session) {
      this.logActivity('Updated ID card format, issuer and CEO signature settings', 'System', session);
    }
  },

  // ================= FIREBASE STORAGE UPLOADERS =================
  async uploadEmployeePhoto(
    employeeId: string,
    fileOrDataUrl: File | string,
    onProgress?: (percent: number) => void
  ): Promise<string> {
    const fileExtension =
      typeof fileOrDataUrl !== 'string' && fileOrDataUrl.name
        ? fileOrDataUrl.name.split('.').pop() || 'jpg'
        : 'jpg';
    const storagePath = `employees/${employeeId}/profile.${fileExtension}`;
    const fileRef = ref(storage, storagePath);

    if (typeof fileOrDataUrl === 'string') {
      if (fileOrDataUrl.startsWith('data:image')) {
        await uploadString(fileRef, fileOrDataUrl, 'data_url');
        return await getDownloadURL(fileRef);
      }
      return fileOrDataUrl;
    }

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileRef, fileOrDataUrl);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.warn('Storage upload error, using fallback:', error);
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });
  },

  async uploadCeoSignature(fileOrDataUrl: File | string): Promise<string> {
    const storagePath = `settings/company/ceo-signature.png`;
    const fileRef = ref(storage, storagePath);

    if (typeof fileOrDataUrl === 'string') {
      if (fileOrDataUrl.startsWith('data:image')) {
        await uploadString(fileRef, fileOrDataUrl, 'data_url');
        return await getDownloadURL(fileRef);
      }
      return fileOrDataUrl;
    }

    const uploadTask = uploadBytesResumable(fileRef, fileOrDataUrl);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        undefined,
        (err) => reject(err),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  },

  async uploadCompanyLogo(fileOrDataUrl: File | string): Promise<string> {
    const storagePath = `settings/company/logo.png`;
    const fileRef = ref(storage, storagePath);

    if (typeof fileOrDataUrl === 'string') {
      if (fileOrDataUrl.startsWith('data:image')) {
        await uploadString(fileRef, fileOrDataUrl, 'data_url');
        return await getDownloadURL(fileRef);
      }
      return fileOrDataUrl;
    }

    const uploadTask = uploadBytesResumable(fileRef, fileOrDataUrl);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        undefined,
        (err) => reject(err),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  },
};
