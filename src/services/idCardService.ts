import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Employee } from '../types';
import { ActivityService } from './activityService';

export interface IDCardRecord {
  idCardId: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  issuedAt: string;
  issuedBy: string;
  status: 'Active' | 'Revoked' | 'Expired';
  qrVerificationId: string;
  cardVersion: string;
  ceoSignatureUrl?: string;
  validUntil?: string;
}

export interface VerificationResult {
  valid: boolean;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Revoked' | 'NotFound';
  employee?: {
    fullName: string;
    employeeId: string;
    designation: string;
    department: string;
    joiningDate: string;
    bloodGroup: string;
    profilePhoto: string;
    workLocation: string;
    status: string;
  };
  idCard?: IDCardRecord;
  message: string;
}

const COLLECTION = 'idCards';

export const IDCardService = {
  /**
   * Subscribe to real-time generated ID cards in Firestore
   */
  subscribeIDCards(
    onData: (cards: IDCardRecord[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    const q = query(collection(db, COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: IDCardRecord[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            idCardId: d.id,
            employeeId: data.employeeId || '',
            employeeName: data.employeeName || '',
            designation: data.designation || '',
            department: data.department || '',
            issuedAt: data.issuedAt || '',
            issuedBy: data.issuedBy || 'Tannu Kumari (CEO)',
            status: data.status || 'Active',
            qrVerificationId: data.qrVerificationId || '',
            cardVersion: data.cardVersion || 'UGMS-v3.0',
            ceoSignatureUrl: data.ceoSignatureUrl,
            validUntil: data.validUntil,
          });
        });
        onData(list);
      },
      (error) => {
        console.error('Error listening to idCards:', error);
        if (onError) onError(error);
        else handleFirestoreError(error, OperationType.LIST, COLLECTION);
      }
    );
  },

  /**
   * Generate an official ID Card record in Firestore
   */
  async generateIDCard(
    employee: Employee,
    issuedBy = 'Tannu Kumari (CEO)',
    ceoSignatureUrl?: string
  ): Promise<IDCardRecord> {
    try {
      const idCardId = `IDC-${employee.employeeId}-${Date.now().toString(36).toUpperCase()}`;
      const qrVerificationId = `UGMS-VERIFY-${employee.employeeId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const cardRecord: IDCardRecord = {
        idCardId,
        employeeId: employee.employeeId,
        employeeName: employee.fullName,
        designation: employee.designation,
        department: employee.department,
        issuedAt: new Date().toISOString(),
        issuedBy,
        status: 'Active',
        qrVerificationId,
        cardVersion: 'UGMS-v3.0-PRO',
        ceoSignatureUrl: ceoSignatureUrl || '',
      };

      // Save ID Card document
      await setDoc(doc(db, COLLECTION, idCardId), {
        ...cardRecord,
        serverTimestamp: serverTimestamp(),
      });

      // Update employee document marking card generated
      const empDocRef = doc(db, 'employees', employee.employeeId);
      await updateDoc(empDocRef, {
        idCardGenerated: true,
        idCardGeneratedAt: cardRecord.issuedAt,
        qrPayload: qrVerificationId,
      });

      // Record Activity Log
      await ActivityService.logActivity(
        issuedBy,
        'CEO',
        'CEO',
        `Generated official ISO Corporate ID Card for ${employee.fullName} (${employee.employeeId})`,
        'IDCard',
        idCardId
      );

      return cardRecord;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, COLLECTION);
    }
  },

  /**
   * Real QR verification logic - queries Firestore for validity
   */
  async verifyByCode(code: string): Promise<VerificationResult> {
    try {
      const cleanCode = code.trim();

      // Check if it matches a qrVerificationId
      let cardSnap = await getDocs(
        query(collection(db, COLLECTION), where('qrVerificationId', '==', cleanCode))
      );

      // Or fallback search by employeeId or idCardId
      if (cardSnap.empty) {
        cardSnap = await getDocs(
          query(collection(db, COLLECTION), where('employeeId', '==', cleanCode))
        );
      }

      let idCardData: IDCardRecord | undefined;
      let targetEmployeeId = cleanCode;

      if (!cardSnap.empty) {
        const d = cardSnap.docs[0];
        idCardData = d.data() as IDCardRecord;
        targetEmployeeId = idCardData.employeeId;
      }

      // Query Employee document from Firestore
      const empDoc = await getDoc(doc(db, 'employees', targetEmployeeId));

      if (!empDoc.exists()) {
        return {
          valid: false,
          status: 'NotFound',
          message: 'VERIFICATION NOT FOUND: No registered UniGrova employee record corresponds to this credential.',
        };
      }

      const emp = empDoc.data();
      const empStatus = emp.status || 'Active';

      if (empStatus !== 'Active') {
        return {
          valid: false,
          status: empStatus,
          employee: {
            fullName: emp.fullName,
            employeeId: emp.employeeId,
            designation: emp.designation,
            department: emp.department,
            joiningDate: emp.joiningDate,
            bloodGroup: emp.bloodGroup,
            profilePhoto: emp.photoUrl || emp.profilePhoto || '',
            workLocation: emp.workLocation || 'Corporate HQ',
            status: empStatus,
          },
          idCard: idCardData,
          message: `EMPLOYEE STATUS: ${empStatus.toUpperCase()}. This identity credential is currently suspended or inactive.`,
        };
      }

      return {
        valid: true,
        status: 'Active',
        employee: {
          fullName: emp.fullName,
          employeeId: emp.employeeId,
          designation: emp.designation,
          department: emp.department,
          joiningDate: emp.joiningDate,
          bloodGroup: emp.bloodGroup,
          profilePhoto: emp.photoUrl || emp.profilePhoto || '',
          workLocation: emp.workLocation || 'Corporate HQ',
          status: 'Active',
        },
        idCard: idCardData,
        message: 'VERIFIED EMPLOYEE: Official active identification issued by UniGrova Management System.',
      };
    } catch (err) {
      console.error('Verification error:', err);
      return {
        valid: false,
        status: 'NotFound',
        message: 'Verification check encountered an error. Please verify network connectivity.',
      };
    }
  },
};
