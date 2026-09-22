import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Department, TechProject, InternalTask, ApprovalItem } from '../types';
import { ActivityService } from './activityService';

export const OpsService = {
  /**
   * Real-time Departments from Firestore
   */
  subscribeDepartments(onData: (deps: Department[]) => void): () => void {
    return onSnapshot(
      collection(db, 'departments'),
      (snap) => {
        const list: Department[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            name: data.name || '',
            code: data.code || d.id,
            departmentHead: data.head || data.departmentHead || 'Department Head',
            description: data.description || '',
            employeeCount: Number(data.employeeCount || 0),
            status: data.status || 'Active',
            budgetCode: data.budgetCode || '',
          });
        });
        onData(list);
      },
      (err) => console.error('Error listening to departments:', err)
    );
  },

  /**
   * Real-time Projects from Firestore
   */
  subscribeProjects(onData: (projects: TechProject[]) => void): () => void {
    return onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        const list: TechProject[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            name: data.name || '',
            lead: data.lead || '',
            description: data.description || '',
            status: data.status || 'Active',
            progress: Number(data.progress || 0),
            techStack: data.techStack || ['React', 'TypeScript', 'Firebase'],
            repo: data.repo || 'github.com/unigrova',
            dueDate: data.targetDate || data.dueDate || '',
            cloudHealth: data.cloudHealth || 'Operational',
          });
        });
        onData(list);
      },
      (err) => console.error('Error listening to projects:', err)
    );
  },

  /**
   * Real-time Tasks from Firestore
   */
  subscribeTasks(onData: (tasks: InternalTask[]) => void): () => void {
    return onSnapshot(
      collection(db, 'tasks'),
      (snap) => {
        const list: InternalTask[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            title: data.title || '',
            description: data.description || '',
            assignedTo: data.assignedTo || '',
            assignedBy: data.assignedBy || 'COO',
            assignedByRole: data.assignedByRole || 'COO',
            priority: data.priority || 'Medium',
            status: data.status || 'Pending',
            dueDate: data.dueDate || '',
            createdAt: data.createdAt || '',
            department: data.department || 'Operations',
          });
        });
        onData(list);
      },
      (err) => console.error('Error listening to tasks:', err)
    );
  },

  /**
   * Real-time Approvals from Firestore
   */
  subscribeApprovals(onData: (approvals: ApprovalItem[]) => void): () => void {
    return onSnapshot(
      collection(db, 'approvals'),
      (snap) => {
        const list: ApprovalItem[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            title: data.title || '',
            category: data.category || 'Operational Requests',
            submittedBy: data.submittedBy || '',
            submittedByRole: data.submittedByRole || 'Staff',
            submittedDate: data.submittedDate || data.date || '',
            status: data.status || 'Pending',
            details: data.details || data.comments || '',
            reviewedBy: data.reviewedBy,
            reviewedAt: data.reviewedAt,
            reviewNotes: data.reviewNotes,
          });
        });
        onData(list);
      },
      (err) => console.error('Error listening to approvals:', err)
    );
  },

  /**
   * Create Project in Firestore
   */
  async createProject(project: Omit<TechProject, 'id'>, actorName: string, actorOfficerId: string): Promise<void> {
    const id = `PROJ-${Date.now().toString(36).toUpperCase()}`;
    await setDoc(doc(db, 'projects', id), {
      ...project,
      createdAt: new Date().toISOString(),
      serverTimestamp: serverTimestamp(),
    });
    await ActivityService.logActivity(actorName, actorOfficerId, 'Executive', `Created new project: ${project.name}`, 'Project', id);
  },

  /**
   * Action Approval
   */
  async actionApproval(
    id: string,
    status: 'Approved' | 'Rejected',
    actorName: string,
    actorOfficerId: string,
    notes?: string
  ): Promise<void> {
    await updateDoc(doc(db, 'approvals', id), {
      status,
      reviewedBy: actorName,
      reviewedAt: new Date().toISOString(),
      reviewNotes: notes || '',
    });
    await ActivityService.logActivity(
      actorName,
      actorOfficerId,
      'CEO',
      `${status === 'Approved' ? 'Approved' : 'Rejected'} approval request ID ${id}`,
      'Approval',
      id
    );
  },
};
