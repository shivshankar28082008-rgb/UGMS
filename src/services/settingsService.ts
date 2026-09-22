import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { CompanySettings, IDCardSettings } from '../types';

export const UNIGROVA_LOGO_DEFAULT = 'https://i.ibb.co/f3YHYbn/a50b5de5-4d99-4217-a76e-65f78a6b4973.jpg';

export interface UniGrovaSystemSettings {
  company: CompanySettings;
  idCard: IDCardSettings;
  updatedAt?: string;
  updatedBy?: string;
}

const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'UniGrova',
  systemName: 'UniGrova Management System',
  tagline: 'LEARN • BUILD • GROW TOGETHER',
  logoUrl: UNIGROVA_LOGO_DEFAULT,
  website: 'https://unigrova.com',
  email: 'contact@unigrova.com',
  phone: '+91 (Corporate Communications)',
  address: 'UniGrova Corporate Head Office',
  foundedYear: '2024',
};

const DEFAULT_IDCARD_SETTINGS: IDCardSettings = {
  logoUrl: UNIGROVA_LOGO_DEFAULT,
  ceoName: 'Tannu Kumari',
  ceoDesignation: 'Chief Executive Officer (CEO)',
  signatureImageUrl: '', // Empty initially - triggers "CEO Authorization Pending" until real signature uploaded
  useSignatureImage: true,
  cardTheme: 'Navy Blue & Emerald',
  cardVersion: 'v3.0-ISO',
  verificationDomain: 'unigrova.com/verify',
  validityYears: 3,
};

const DOC_PATH = 'settings/company';

export const SettingsService = {
  /**
   * Subscribe to real-time company settings from Firestore
   */
  subscribeSettings(
    onData: (settings: UniGrovaSystemSettings) => void,
    onError?: (err: Error) => void
  ): () => void {
    const docRef = doc(db, 'settings', 'company');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onData({
            company: {
              ...DEFAULT_COMPANY_SETTINGS,
              ...(data.company || {}),
              logoUrl: data.company?.logoUrl || UNIGROVA_LOGO_DEFAULT,
            },
            idCard: {
              ...DEFAULT_IDCARD_SETTINGS,
              ...(data.idCard || {}),
              logoUrl: data.idCard?.logoUrl || UNIGROVA_LOGO_DEFAULT,
              ceoName: data.idCard?.ceoName || 'Tannu Kumari',
            },
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy,
          });
        } else {
          // Send defaults if not created yet
          onData({
            company: DEFAULT_COMPANY_SETTINGS,
            idCard: DEFAULT_IDCARD_SETTINGS,
          });
        }
      },
      (error) => {
        console.error('Error listening to company settings:', error);
        if (onError) onError(error);
      }
    );
  },

  /**
   * Get settings once from Firestore
   */
  async getSettings(): Promise<UniGrovaSystemSettings> {
    try {
      const docRef = doc(db, 'settings', 'company');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          company: {
            ...DEFAULT_COMPANY_SETTINGS,
            ...(data.company || {}),
            logoUrl: data.company?.logoUrl || UNIGROVA_LOGO_DEFAULT,
          },
          idCard: {
            ...DEFAULT_IDCARD_SETTINGS,
            ...(data.idCard || {}),
            logoUrl: data.idCard?.logoUrl || UNIGROVA_LOGO_DEFAULT,
          },
          updatedAt: data.updatedAt,
          updatedBy: data.updatedBy,
        };
      }
      return {
        company: DEFAULT_COMPANY_SETTINGS,
        idCard: DEFAULT_IDCARD_SETTINGS,
      };
    } catch {
      return {
        company: DEFAULT_COMPANY_SETTINGS,
        idCard: DEFAULT_IDCARD_SETTINGS,
      };
    }
  },

  /**
   * Update corporate settings in Firestore
   */
  async updateSettings(
    settings: Partial<UniGrovaSystemSettings>,
    actorName = 'Tannu Kumari (CEO)'
  ): Promise<void> {
    try {
      const docRef = doc(db, 'settings', 'company');
      const current = await this.getSettings();

      const merged = {
        company: {
          ...current.company,
          ...(settings.company || {}),
        },
        idCard: {
          ...current.idCard,
          ...(settings.idCard || {}),
        },
        updatedAt: new Date().toISOString(),
        updatedBy: actorName,
        serverTimestamp: serverTimestamp(),
      };

      await setDoc(docRef, merged, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, DOC_PATH);
    }
  },
};
