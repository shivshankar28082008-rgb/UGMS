import { ExecutiveRole } from '../types';

export type NavItemKey =
  | 'overview'
  | 'strategic'
  | 'technology'
  | 'employees'
  | 'idcards'
  | 'operations'
  | 'projects'
  | 'partnerships'
  | 'reports'
  | 'activity'
  | 'executives'
  | 'settings'
  | 'onboarding'
  | 'approvals'
  | 'tasks'
  | 'profile';

export const ROLE_PERMISSIONS: Record<ExecutiveRole, Record<NavItemKey, boolean>> = {
  FOUNDER: {
    overview: true,
    strategic: true,
    technology: true,
    employees: true,
    idcards: true,
    operations: true,
    projects: true,
    partnerships: true,
    reports: true,
    activity: true,
    executives: true,
    settings: true,
    onboarding: true,
    approvals: true,
    tasks: true,
    profile: true,
  },
  CO_FOUNDER: {
    overview: true,
    strategic: true,
    technology: true,
    employees: false, // Explicitly restricted: HR/private employee info not granted by default
    idcards: false,
    operations: false,
    projects: true,
    partnerships: false,
    reports: true,
    activity: true,
    executives: false,
    settings: true,
    onboarding: false,
    approvals: true, // technical approvals
    tasks: true,
    profile: true,
  },
  CEO: {
    overview: true,
    strategic: true,
    technology: true,
    employees: true,
    idcards: true,
    operations: true,
    projects: true,
    partnerships: true,
    reports: true,
    activity: true,
    executives: true,
    settings: true,
    onboarding: true,
    approvals: true,
    tasks: true,
    profile: true,
  },
  COO: {
    overview: true,
    strategic: false,
    technology: false,
    employees: true,
    idcards: true,
    operations: true,
    projects: true,
    partnerships: false,
    reports: true,
    activity: true,
    executives: false,
    settings: false,
    onboarding: true,
    approvals: true,
    tasks: true,
    profile: true,
  },
  HR: {
    overview: true,
    strategic: false,
    technology: false,
    employees: true,
    idcards: true,
    operations: true,
    projects: false,
    partnerships: false,
    reports: true,
    activity: false,
    executives: false,
    settings: false,
    onboarding: true,
    approvals: false,
    tasks: true,
    profile: true,
  },
  MANAGER: {
    overview: true,
    strategic: false,
    technology: false,
    employees: false,
    idcards: false,
    operations: false,
    projects: true,
    partnerships: false,
    reports: false,
    activity: false,
    executives: false,
    settings: false,
    onboarding: false,
    approvals: false,
    tasks: true,
    profile: true,
  },
  EMPLOYEE: {
    overview: true,
    strategic: false,
    technology: false,
    employees: false,
    idcards: false,
    operations: false,
    projects: false,
    partnerships: false,
    reports: false,
    activity: false,
    executives: false,
    settings: false,
    onboarding: false,
    approvals: false,
    tasks: true,
    profile: true,
  },
};

export const PermissionService = {
  canAccess(role: ExecutiveRole, itemKey: NavItemKey): boolean {
    const rolePerms = ROLE_PERMISSIONS[role];
    if (!rolePerms) return false;
    return Boolean(rolePerms[itemKey]);
  },
};
