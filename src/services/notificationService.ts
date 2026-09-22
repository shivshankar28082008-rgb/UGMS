import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { NotificationItem } from '../types';

const COLLECTION = 'notifications';

export const NotificationService = {
  /**
   * Real-time listener for notifications in Firestore
   */
  subscribeNotifications(
    onData: (notifications: NotificationItem[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    const q = query(collection(db, COLLECTION), limit(30));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: NotificationItem[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            title: data.title || 'Notification',
            message: data.message || '',
            timestamp: data.createdAt || 'Just now',
            type: data.type || 'info',
            read: !!data.isRead,
            linkTab: data.linkTab || '',
          });
        });
        // Sort newest first
        list.sort((a, b) => b.id.localeCompare(a.id));
        onData(list);
      },
      (error) => {
        console.error('Error listening to notifications:', error);
        if (onError) onError(error);
        else handleFirestoreError(error, OperationType.LIST, COLLECTION);
      }
    );
  },

  /**
   * Fetch notifications once
   */
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTION));
      const list: NotificationItem[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          title: data.title || 'Notification',
          message: data.message || '',
          timestamp: data.createdAt || 'Just now',
          type: data.type || 'info',
          read: !!data.isRead,
          linkTab: data.linkTab || '',
        });
      });
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, COLLECTION);
    }
  },

  /**
   * Create an executive notification in Firestore
   */
  async createNotification(
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'alert' = 'info',
    linkTab?: string,
    recipientOfficerId?: string
  ): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTION), {
        title,
        message,
        type,
        linkTab: linkTab || '',
        recipientOfficerId: recipientOfficerId || 'ALL',
        isRead: false,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        serverTimestamp: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Could not write notification to Firestore:', err);
    }
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, notificationId);
      await updateDoc(docRef, { isRead: true });
    } catch (err) {
      console.warn('Could not mark notification as read:', err);
    }
  },
};
