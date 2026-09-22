import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { ActivityLog, ExecutiveRole } from '../types';

const COLLECTION = 'activityLogs';

export const ActivityService = {
  /**
   * Subscribe to real-time activity logs from Firestore
   */
  subscribeActivityLogs(
    onData: (logs: ActivityLog[]) => void,
    maxCount = 40,
    onError?: (err: Error) => void
  ): () => void {
    const q = query(collection(db, COLLECTION), limit(maxCount));
    return onSnapshot(
      q,
      (snapshot) => {
        const logs: ActivityLog[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          const timestampStr = data.timestamp || new Date().toISOString();
          const dateObj = new Date(timestampStr);
          logs.push({
            id: d.id,
            user: data.actorName || 'System',
            officerId: data.actorOfficerId || 'SYS-00',
            role: (data.actorRole as ExecutiveRole) || 'OFFICER',
            action: data.action || '',
            category: (data.entityType as ActivityLog['category']) || 'System',
            date: !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString() : 'Today',
            time: !isNaN(dateObj.getTime())
              ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Just now',
            target: data.entityId,
          });
        });
        // Sort descending by timestamp
        logs.sort((a, b) => b.id.localeCompare(a.id));
        onData(logs);
      },
      (error) => {
        console.error('Error listening to activity logs:', error);
        if (onError) onError(error);
        else handleFirestoreError(error, OperationType.LIST, COLLECTION);
      }
    );
  },

  /**
   * Fetch activity logs once
   */
  async getActivityLogs(maxCount = 50): Promise<ActivityLog[]> {
    try {
      const q = query(collection(db, COLLECTION), limit(maxCount));
      const snap = await getDocs(q);
      const logs: ActivityLog[] = [];
      snap.forEach((d) => {
        const data = d.data();
        const timestampStr = data.timestamp || new Date().toISOString();
        const dateObj = new Date(timestampStr);
        logs.push({
          id: d.id,
          user: data.actorName || 'System',
          officerId: data.actorOfficerId || 'SYS-00',
          role: (data.actorRole as ExecutiveRole) || 'OFFICER',
          action: data.action || '',
          category: (data.entityType as ActivityLog['category']) || 'System',
          date: !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString() : 'Today',
          time: !isNaN(dateObj.getTime())
            ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just now',
          target: data.entityId,
        });
      });
      return logs;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, COLLECTION);
    }
  },

  /**
   * Write an audit log entry to Firestore
   */
  async logActivity(
    actorName: string,
    actorOfficerId: string,
    actorRole: string,
    action: string,
    entityType: string,
    entityId?: string
  ): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTION), {
        actorName,
        actorOfficerId,
        actorRole,
        action,
        entityType,
        entityId: entityId || '',
        timestamp: new Date().toISOString(),
        serverTimestamp: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Could not record activity log in Firestore:', err);
    }
  },
};
