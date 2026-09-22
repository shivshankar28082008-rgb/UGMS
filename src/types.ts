export type ExecutiveRole = 'FOUNDER' | 'CO_FOUNDER' | 'CEO' | 'COO' | 'HR' | 'MANAGER' | 'EMPLOYEE';

export interface UserSession {
  officerId: string;
  name: string;
  preferredName?: string;
  position: string;
  role: ExecutiveRole;
  profileImage: string;
  email: string;
  token: string;
  loginTime: string;
  expiresAt: number;
  faceLockEnabled?: boolean;
}

export interface ExecutiveLeader {
  officerId: string;
  name: string;
  preferredName?: string;
  position: string;
  role: ExecutiveRole;
  profileImage: string;
  email: string;
  phone?: string;
  responsibilities: string[];
  bio: string;
  department: string;
  location: string;
  faceLockEnabled?: boolean;
  faceLockData?: string;
  faceLockEnrolledAt?: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Executive' | 'Intern';
export type EmployeeStatus = 'Active' | 'Onboarding' | 'Inactive' | 'On Leave';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Employee {
  id: string; // e.g. UIG-EMP-001
  employeeId: string;
  fullName: string;
  preferredName?: string;
  profilePhoto: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  designation: string;
  department: string;
  joiningDate: string;
  employmentType: EmploymentType;
  workLocation: string;
  reportingManager: string;
  status: EmployeeStatus;
  emergencyContact: EmergencyContact;
  idCardGenerated: boolean;
  idCardGeneratedAt?: string;
  qrPayload?: string;
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  code?: string;
  departmentHead: string;
  head?: string;
  headOfficerId?: string;
  officerInCharge?: string;
  description: string;
  employeeCount: number;
  activeProjects?: number;
  status: 'Active' | 'Restructuring' | 'Archived';
  budgetCode?: string;
}

export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

export interface InternalTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  assignedByRole: ExecutiveRole;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  department: string;
}

export type ApprovalCategory = 
  | 'Employee Onboarding' 
  | 'ID Card Requests' 
  | 'Department Changes' 
  | 'Operational Requests' 
  | 'Project Requests' 
  | 'Documents' 
  | 'Announcements';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ApprovalItem {
  id: string;
  title: string;
  category: ApprovalCategory;
  submittedBy: string;
  submittedByRole: string;
  submittedDate: string;
  status: ApprovalStatus;
  details: string;
  targetId?: string;
  reviewedBy?: string;
  actionedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  officerId: string;
  role: ExecutiveRole;
  action: string;
  category: 'Auth' | 'Employee' | 'IDCard' | 'Approval' | 'Project' | 'System' | 'Department' | 'Task' | 'Authentication';
  date: string;
  time: string;
  ipAddress?: string;
  target?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  linkTab?: string;
}

export interface CompanySettings {
  companyName: string;
  name?: string;
  systemName: string;
  tagline: string;
  logoUrl?: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  foundedYear?: string;
}

export interface IDCardSettings {
  logoUrl?: string;
  ceoName: string;
  ceoDesignation: string;
  signatureImageUrl?: string;
  useSignatureImage: boolean;
  cardTheme?: 'Navy Blue & Emerald' | 'Corporate Tech' | 'Executive Slate';
  cardVersion?: string;
  verificationDomain?: string;
  dimensions?: string;
  validityYears?: number;
}

export interface SecuritySettings {
  sessionTimeoutMinutes: number;
  requireTwoFactor: boolean;
  passwordMinLength: number;
  logRetentionDays: number;
}

export interface Venture {
  id: string;
  name: string;
  code: string;
  sector: string;
  lead: string;
  status: 'Active' | 'Scaling' | 'Incubating' | 'Planning';
  activeProjects: number;
  teamSize: number;
  performanceScore: number;
  description: string;
}

export interface TechProject {
  id: string;
  name: string;
  lead: string;
  team?: string;
  teamMembers?: string[];
  description?: string;
  status: 'Development' | 'Testing' | 'Production' | 'Planning' | 'Active';
  progress: number;
  cloudHealth?: 'Operational' | 'Degraded' | 'Maintenance';
  repo: string;
  techStack: string[];
  dueDate?: string;
  deadline?: string;
}

export interface OnboardingStep {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'in_review' | 'approved' | 'completed';
}

export type OnboardingStage =
  | 'Candidate Created'
  | 'Document Verification'
  | 'ID Card Generation'
  | 'Asset Assignment'
  | 'Completed'
  | 'Details'
  | 'Documents'
  | 'Review'
  | 'Approval'
  | 'ID Generation';

export interface OnboardingCandidate {
  id: string;
  fullName: string;
  preferredName?: string;
  email: string;
  phone: string;
  roleProposed: string;
  department: string;
  stage: OnboardingStage;
  submittedDate?: string;
  createdDate?: string;
  documentsSubmitted?: string[] | boolean;
  emergencyContact?: EmergencyContact;
  bloodGroup?: BloodGroup;
  status?: 'Pending Review' | 'CEO Approved' | 'ID Ready' | 'Active';
  assignedOfficer?: string;
  idCardReady?: boolean;
  assetsAssigned?: boolean;
}
