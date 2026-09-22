import React, { useState, useEffect } from 'react';
import { UserSession, Employee, Department, Venture, TechProject, ApprovalItem, ActivityLog } from './types';
import { AuthService } from './services/authService';
import { EmployeeService } from './services/employeeService';
import { StorageService } from './services/storageService';
import { PermissionService, NavItemKey } from './services/permissionService';

// Layout & Auth
import { LoginView } from './components/auth/LoginView';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { VerificationModal } from './components/verification/VerificationModal';

// Dashboards
import { FounderDashboard } from './components/dashboards/FounderDashboard';
import { CoFounderDashboard } from './components/dashboards/CoFounderDashboard';
import { CeoDashboard } from './components/dashboards/CeoDashboard';
import { CooDashboard } from './components/dashboards/CooDashboard';

// Core Feature Views
import { IDCardGenerator } from './components/idcards/IDCardGenerator';
import { EmployeeManagement } from './components/employees/EmployeeManagement';
import { EmployeeFormModal } from './components/employees/EmployeeFormModal';
import { ApprovalCenterView } from './components/views/ApprovalCenterView';
import { OnboardingView } from './components/views/OnboardingView';
import { OperationsView } from './components/views/OperationsView';
import { ProjectsView } from './components/views/ProjectsView';
import { ReportsView } from './components/views/ReportsView';
import { ActivityLogsView } from './components/views/ActivityLogsView';
import { SettingsView } from './components/views/SettingsView';
import { ExecutiveLeadershipView } from './components/views/ExecutiveLeadershipView';
import { ProfileView } from './components/profile/ProfileView';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(AuthService.getCurrentSession());
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // App State from StorageService
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [projects, setProjects] = useState<TechProject[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Verification & Quick Action modals
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyTargetEmployee, setVerifyTargetEmployee] = useState<Employee | null>(null);
  const [selectedIdCardEmployee, setSelectedIdCardEmployee] = useState<Employee | null>(null);
  const [isQuickAddEmployeeOpen, setIsQuickAddEmployeeOpen] = useState(false);

  const loadData = async () => {
    try {
      const remoteEmps = await EmployeeService.getAllEmployees();
      if (remoteEmps && remoteEmps.length > 0) {
        setEmployees(remoteEmps);
      } else {
        setEmployees(StorageService.getEmployees());
      }
    } catch {
      setEmployees(StorageService.getEmployees());
    }
    setDepartments(StorageService.getDepartments());
    setVentures(StorageService.getVentures());
    setProjects(StorageService.getProjects());
    setApprovals(StorageService.getApprovals());
    setActivityLogs(StorageService.getActivityLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    setActiveTab('overview');
    loadData();
  };

  const handleLogout = () => {
    AuthService.logout(session);
    setSession(null);
  };

  const handleOpenVerification = (emp?: Employee) => {
    setVerifyTargetEmployee(emp || null);
    setIsVerifyModalOpen(true);
  };

  const handleOpenGenerateID = (emp?: Employee) => {
    if (emp) setSelectedIdCardEmployee(emp);
    setActiveTab('idcards');
  };

  const handleSaveQuickEmployee = async (newEmp: Employee) => {
    if (!session) return;
    try {
      await EmployeeService.createEmployee(newEmp, session);
    } catch {
      StorageService.saveEmployee(newEmp, session);
    }
    loadData();
  };

  // If not logged in, render the Login Screen
  if (!session) {
    return (
      <>
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onOpenVerification={() => handleOpenVerification()}
        />
        <VerificationModal
          isOpen={isVerifyModalOpen}
          onClose={() => setIsVerifyModalOpen(false)}
          initialEmployee={verifyTargetEmployee}
        />
      </>
    );
  }

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (session.role) {
      case 'FOUNDER':
        return (
          <FounderDashboard
            session={session}
            employees={employees}
            departments={departments}
            ventures={ventures}
            projects={projects}
            approvals={approvals}
            activityLogs={activityLogs}
            onNavigateTab={setActiveTab}
          />
        );
      case 'CO_FOUNDER':
        return (
          <CoFounderDashboard
            session={session}
            projects={projects}
            activityLogs={activityLogs}
            onNavigateTab={setActiveTab}
          />
        );
      case 'CEO':
        return (
          <CeoDashboard
            session={session}
            employees={employees}
            departments={departments}
            projects={projects}
            approvals={approvals}
            activityLogs={activityLogs}
            onNavigateTab={setActiveTab}
          />
        );
      case 'COO':
      default:
        return (
          <CooDashboard
            session={session}
            employees={employees}
            departments={departments}
            onboarding={StorageService.getOnboardingCandidates()}
            activityLogs={activityLogs}
            onNavigateTab={setActiveTab}
            onOpenAddEmployee={() => setIsQuickAddEmployeeOpen(true)}
            onOpenGenerateID={handleOpenGenerateID}
          />
        );
    }
  };

  // Main Tab Router
  const renderMainContent = () => {
    const navKey = (activeTab === 'dashboard' ? 'overview' : activeTab) as NavItemKey;
    if (!PermissionService.canAccess(session.role, navKey)) {
      return (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Access Restricted</h3>
          <p className="text-xs text-slate-500 mt-1">
            Your executive role ({session.role}) is not authorized to access this module under UGMS governance rules.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
      case 'dashboard':
        return renderDashboard();
      case 'idcards':
        return (
          <IDCardGenerator
            session={session}
            employees={employees}
            selectedEmployeeId={selectedIdCardEmployee?.employeeId}
            onRefreshEmployees={loadData}
            onOpenVerification={handleOpenVerification}
          />
        );
      case 'employees':
        return (
          <EmployeeManagement
            session={session}
            employees={employees}
            departments={departments}
            onRefresh={loadData}
            onNavigateGenerateID={handleOpenGenerateID}
            onOpenVerification={handleOpenVerification}
          />
        );
      case 'onboarding':
        return (
          <OnboardingView
            session={session}
            candidates={StorageService.getOnboardingCandidates()}
            onRefresh={loadData}
            onNavigateGenerateID={() => setActiveTab('idcards')}
          />
        );
      case 'approvals':
        return (
          <ApprovalCenterView
            session={session}
            approvals={approvals}
            onRefresh={loadData}
          />
        );
      case 'operations':
        return (
          <OperationsView
            session={session}
            departments={departments}
            ventures={ventures}
            onRefresh={loadData}
            onNavigateEmployees={() => setActiveTab('employees')}
          />
        );
      case 'projects':
      case 'technology':
        return (
          <ProjectsView
            session={session}
            projects={projects}
            onRefresh={loadData}
          />
        );
      case 'reports':
        return (
          <ReportsView
            session={session}
            employees={employees}
            departments={departments}
            ventures={ventures}
            projects={projects}
            approvals={approvals}
          />
        );
      case 'activity':
        return (
          <ActivityLogsView
            session={session}
            activityLogs={activityLogs}
          />
        );
      case 'settings':
        return (
          <SettingsView
            session={session}
            onRefresh={loadData}
          />
        );
      case 'profile':
        return (
          <ProfileView
            session={session}
            onRefreshSession={() => setSession(AuthService.getCurrentSession())}
          />
        );
      case 'executives':
      case 'strategic':
      case 'partnerships':
        return <ExecutiveLeadershipView session={session} />;
      default:
        return renderDashboard();
    }
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const pendingOnboardingCount = StorageService.getOnboardingCandidates().filter(
    (c) => c.stage !== 'Completed'
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
      {/* Top Navigation Header */}
      <Header
        session={session}
        onLogout={handleLogout}
        onOpenVerification={() => handleOpenVerification()}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with Role Access Control */}
        <Sidebar
          session={session}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          pendingApprovalsCount={pendingApprovalsCount}
          pendingOnboardingCount={pendingOnboardingCount}
        />

        {/* Main Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderMainContent()}
        </main>
      </div>

      {/* Global Modals */}
      <VerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        initialEmployee={verifyTargetEmployee}
      />

      <EmployeeFormModal
        isOpen={isQuickAddEmployeeOpen}
        onClose={() => setIsQuickAddEmployeeOpen(false)}
        onSave={handleSaveQuickEmployee}
      />
    </div>
  );
}
