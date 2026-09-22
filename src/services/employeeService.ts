import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../firebase/config';
import { Employee, EmployeeStatus, UserSession } from '../types';
import { ActivityService } from './activityService';

const COLLECTION = 'employees';

export const EmployeeService = {
  /**
   * Alias for getEmployees
   */
  async getAllEmployees(): Promise<Employee[]> {
    return this.getEmployees();
  },

  /**
   * Real-time subscription to all employees in Firestore
   */
  subscribeEmployees(
    onData: (employees: Employee[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    const q = query(collection(db, COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Employee[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            employeeId: data.employeeId || d.id,
            fullName: data.fullName || '',
            preferredName: data.preferredName || '',
            profilePhoto: data.photoUrl || data.profilePhoto || '',
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || 'Other',
            bloodGroup: data.bloodGroup || 'O+',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            designation: data.designation || '',
            department: data.department || '',
            joiningDate: data.joiningDate || '',
            employmentType: data.employmentType || 'Full-Time',
            workLocation: data.workLocation || 'Corporate HQ',
            reportingManager: data.reportingManager || 'COO',
            status: (data.status as EmployeeStatus) || 'Active',
            emergencyContact: data.emergencyContact || {
              name: data.emergencyContactName || '',
              relationship: data.emergencyContactRelationship || '',
              phone: data.emergencyContactPhone || '',
            },
            idCardGenerated: !!data.idCardGenerated,
            idCardGeneratedAt: data.idCardGeneratedAt,
            notes: data.notes || '',
          });
        });
        // Sort by employeeId descending
        list.sort((a, b) => b.employeeId.localeCompare(a.employeeId));
        onData(list);
      },
      (error) => {
        console.error('Error listening to employees:', error);
        if (onError) onError(error);
        else handleFirestoreError(error, OperationType.LIST, COLLECTION);
      }
    );
  },

  /**
   * Fetch one-time list of all employees
   */
  async getEmployees(): Promise<Employee[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTION));
      const list: Employee[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          employeeId: data.employeeId || d.id,
          fullName: data.fullName || '',
          preferredName: data.preferredName || '',
          profilePhoto: data.photoUrl || data.profilePhoto || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || 'Other',
          bloodGroup: data.bloodGroup || 'O+',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          designation: data.designation || '',
          department: data.department || '',
          joiningDate: data.joiningDate || '',
          employmentType: data.employmentType || 'Full-Time',
          workLocation: data.workLocation || 'Corporate HQ',
          reportingManager: data.reportingManager || 'COO',
          status: (data.status as EmployeeStatus) || 'Active',
          emergencyContact: data.emergencyContact || {
            name: data.emergencyContactName || '',
            relationship: data.emergencyContactRelationship || '',
            phone: data.emergencyContactPhone || '',
          },
          idCardGenerated: !!data.idCardGenerated,
          idCardGeneratedAt: data.idCardGeneratedAt,
          notes: data.notes || '',
        });
      });
      list.sort((a, b) => b.employeeId.localeCompare(a.employeeId));
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, COLLECTION);
    }
  },

  /**
   * Fetch single employee by ID
   */
  async getEmployeeById(employeeId: string): Promise<Employee | null> {
    try {
      const docRef = doc(db, COLLECTION, employeeId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return null;
      }
      const data = snap.data();
      return {
        id: snap.id,
        employeeId: data.employeeId || snap.id,
        fullName: data.fullName || '',
        preferredName: data.preferredName || '',
        profilePhoto: data.photoUrl || data.profilePhoto || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || 'Other',
        bloodGroup: data.bloodGroup || 'O+',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        designation: data.designation || '',
        department: data.department || '',
        joiningDate: data.joiningDate || '',
        employmentType: data.employmentType || 'Full-Time',
        workLocation: data.workLocation || 'Corporate HQ',
        reportingManager: data.reportingManager || 'COO',
        status: (data.status as EmployeeStatus) || 'Active',
        emergencyContact: data.emergencyContact || {
          name: data.emergencyContactName || '',
          relationship: data.emergencyContactRelationship || '',
          phone: data.emergencyContactPhone || '',
        },
        idCardGenerated: !!data.idCardGenerated,
        idCardGeneratedAt: data.idCardGeneratedAt,
        notes: data.notes || '',
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `${COLLECTION}/${employeeId}`);
    }
  },

  /**
   * Generates the next sequential unique Employee ID: UIG-EMP-0001, UIG-EMP-0002...
   */
  async generateNextEmployeeId(): Promise<string> {
    try {
      const snap = await getDocs(collection(db, COLLECTION));
      let maxNum = 0;
      snap.forEach((d) => {
        const empId = d.data().employeeId || d.id;
        const match = empId.match(/UIG-EMP-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      });
      const nextNum = maxNum + 1;
      return `UIG-EMP-${String(nextNum).padStart(4, '0')}`;
    } catch {
      // Fallback
      return `UIG-EMP-0001`;
    }
  },

  /**
   * Upload an employee photo to Firebase Storage
   */
  async uploadEmployeePhoto(employeeId: string, photo: File | string): Promise<string> {
    try {
      const storagePath = `employees/${employeeId}/profile.jpg`;
      const fileRef = ref(storage, storagePath);

      if (typeof photo === 'string') {
        if (photo.startsWith('data:image')) {
          await uploadString(fileRef, photo, 'data_url');
          return await getDownloadURL(fileRef);
        }
        return photo; // Already a URL
      } else {
        await uploadBytes(fileRef, photo);
        return await getDownloadURL(fileRef);
      }
    } catch (err) {
      console.warn('Firebase Storage upload warning, using direct photo:', err);
      if (typeof photo === 'string') return photo;
      return '';
    }
  },

  /**
   * Create a new employee record in Firestore
   */
  async createEmployee(
    empData: Employee | Omit<Employee, 'id'>,
    photoOrSession?: File | UserSession | null,
    actorName = 'COO Rishika Priya',
    actorOfficerId = 'UIG701596',
    actorRole = 'COO'
  ): Promise<Employee> {
    try {
      let photoFile: File | null = null;
      if (photoOrSession) {
        if ('officerId' in photoOrSession) {
          actorName = photoOrSession.name;
          actorOfficerId = photoOrSession.officerId;
          actorRole = photoOrSession.role;
        } else if (photoOrSession instanceof File) {
          photoFile = photoOrSession;
        }
      }

      const employeeId = empData.employeeId || (await this.generateNextEmployeeId());
      let photoUrl = empData.profilePhoto || '';

      if (photoFile) {
        photoUrl = await this.uploadEmployeePhoto(employeeId, photoFile);
      } else if (empData.profilePhoto?.startsWith('data:image')) {
        photoUrl = await this.uploadEmployeePhoto(employeeId, empData.profilePhoto);
      }

      const docRef = doc(db, COLLECTION, employeeId);
      const payload = {
        employeeId,
        fullName: empData.fullName.trim(),
        preferredName: empData.preferredName?.trim() || '',
        photoUrl,
        dateOfBirth: empData.dateOfBirth || '',
        gender: empData.gender || 'Other',
        bloodGroup: empData.bloodGroup || 'O+',
        phone: empData.phone || '',
        email: empData.email || '',
        address: empData.address || '',
        designation: empData.designation.trim(),
        department: empData.department.trim(),
        joiningDate: empData.joiningDate || new Date().toISOString().split('T')[0],
        employmentType: empData.employmentType || 'Full-Time',
        workLocation: empData.workLocation || 'Corporate HQ',
        reportingManager: empData.reportingManager || 'COO',
        status: empData.status || 'Active',
        emergencyContact: empData.emergencyContact || {
          name: '',
          relationship: '',
          phone: '',
        },
        emergencyContactName: empData.emergencyContact?.name || '',
        emergencyContactRelationship: empData.emergencyContact?.relationship || '',
        emergencyContactPhone: empData.emergencyContact?.phone || '',
        idCardGenerated: false,
        createdAt: new Date().toISOString(),
        serverTimestamp: serverTimestamp(),
        createdBy: actorName,
      };

      await setDoc(docRef, payload);

      // Record Activity Log in Firestore
      await ActivityService.logActivity(
        actorName,
        actorOfficerId,
        actorRole,
        `Created official staff record for ${empData.fullName} (${employeeId}) - Department: ${empData.department}`,
        'Employee',
        employeeId
      );

      return {
        ...empData,
        id: employeeId,
        employeeId,
        profilePhoto: photoUrl,
        idCardGenerated: false,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, COLLECTION);
    }
  },

  /**
   * Update existing employee in Firestore
   */
  async updateEmployee(
    employeeId: string,
    updates: Partial<Employee>,
    photoOrSession?: File | UserSession | null,
    actorName = 'COO Rishika Priya',
    actorOfficerId = 'UIG701596',
    actorRole = 'COO'
  ): Promise<void> {
    try {
      let photoFile: File | null = null;
      if (photoOrSession) {
        if ('officerId' in photoOrSession) {
          actorName = photoOrSession.name;
          actorOfficerId = photoOrSession.officerId;
          actorRole = photoOrSession.role;
        } else if (photoOrSession instanceof File) {
          photoFile = photoOrSession;
        }
      }

      const docRef = doc(db, COLLECTION, employeeId);
      let photoUrl = updates.profilePhoto;

      if (photoFile) {
        photoUrl = await this.uploadEmployeePhoto(employeeId, photoFile);
      } else if (updates.profilePhoto?.startsWith('data:image')) {
        photoUrl = await this.uploadEmployeePhoto(employeeId, updates.profilePhoto);
      }

      const updatePayload: Record<string, unknown> = {
        ...updates,
        updatedAt: new Date().toISOString(),
        serverUpdated: serverTimestamp(),
        updatedBy: actorName,
      };

      if (photoUrl) {
        updatePayload.photoUrl = photoUrl;
      }

      await updateDoc(docRef, updatePayload);

      await ActivityService.logActivity(
        actorName,
        actorOfficerId,
        actorRole,
        `Updated employee dossier for ID: ${employeeId}`,
        'Employee',
        employeeId
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION}/${employeeId}`);
    }
  },

  /**
   * Update employee status (Active, Inactive, Suspended, etc.)
   */
  async updateStatus(
    employeeId: string,
    status: EmployeeStatus,
    actorName = 'COO Rishika Priya',
    actorOfficerId = 'UIG701596',
    actorRole = 'COO'
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, employeeId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString(),
        updatedBy: actorName,
      });

      await ActivityService.logActivity(
        actorName,
        actorOfficerId,
        actorRole,
        `Changed employee status for ${employeeId} to ${status}`,
        'Employee',
        employeeId
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION}/${employeeId}`);
    }
  },

  /**
   * Delete an employee record from Firestore
   */
  async deleteEmployee(
    employeeId: string,
    employeeName: string,
    actorName = 'COO Rishika Priya',
    actorOfficerId = 'UIG701596',
    actorRole = 'COO'
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, employeeId);
      await deleteDoc(docRef);

      await ActivityService.logActivity(
        actorName,
        actorOfficerId,
        actorRole,
        `Permanently archived employee record ${employeeName} (${employeeId})`,
        'Employee',
        employeeId
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${COLLECTION}/${employeeId}`);
    }
  },
};
