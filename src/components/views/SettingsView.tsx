import React, { useState } from 'react';
import {
  Settings,
  Save,
  Building,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Lock,
  Sparkles,
} from 'lucide-react';
import { CompanySettings, IDCardSettings, UserSession } from '../../types';
import { StorageService } from '../../services/storageService';
import { OFFICIAL_UNIGROVA_LOGO_URL } from '../common/UniGrovaLogo';

interface SettingsViewProps {
  session: UserSession;
  onRefresh: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  session,
  onRefresh,
}) => {
  const [companySettings, setCompanySettings] = useState<CompanySettings>(
    StorageService.getCompanySettings()
  );
  const [idCardSettings, setIdCardSettings] = useState<IDCardSettings>(
    StorageService.getIDCardSettings()
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const canEdit = session.role === 'CEO' || session.role === 'FOUNDER';

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    StorageService.saveCompanySettings(companySettings, session);
    onRefresh();
    setStatusMessage('Company Profile successfully updated in system storage.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSaveIDCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    StorageService.saveIDCardSettings(idCardSettings, session);
    onRefresh();
    setStatusMessage('Official ID Card specifications and CEO Signature configuration updated.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">System Configuration & Governance Settings</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              UGMS v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global corporate parameters, CEO signature seal, ID card standards, and security token policies.
          </p>
        </div>

        {!canEdit && (
          <div className="px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Read-Only: Modifiable exclusively by Founder & CEO</span>
          </div>
        )}
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Two Column Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Company Profile Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <Building className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Company Brand Identity</h3>
                <p className="text-xs text-slate-500">Corporate parameters printed across badges and reports</p>
              </div>
            </div>

            <form onSubmit={handleSaveCompany} id="companyForm" className="space-y-4 text-xs">
              {/* Official Logo Preview & Status */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-white p-1 shrink-0 shadow-xs">
                  <img
                    src={companySettings.logoUrl || OFFICIAL_UNIGROVA_LOGO_URL}
                    alt="UniGrova Official Logo"
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-slate-700 block">Official Corporate Logo</span>
                  <span className="text-[10px] text-emerald-700 font-mono truncate block">
                    {companySettings.logoUrl || OFFICIAL_UNIGROVA_LOGO_URL}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    Synchronized across UGMS login, ID badges, headers & exports
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={companySettings.name}
                  onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corporate Tagline</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={companySettings.tagline}
                  onChange={(e) => setCompanySettings({ ...companySettings, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-emerald-800 disabled:opacity-75"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    disabled={!canEdit}
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Website</label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-75 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">HQ Campus Address</label>
                <textarea
                  rows={2}
                  disabled={!canEdit}
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-75"
                />
              </div>
            </form>
          </div>

          {canEdit && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-right">
              <button
                type="submit"
                form="companyForm"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Company Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 2: ID Card & CEO Authorization Signature */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">ID Card & CEO Authorization Seal</h3>
                <p className="text-xs text-slate-500">
                  CR80 dimensions & CEO Tannu Kumari official signature authorization
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveIDCard} id="idCardForm" className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard Dimension</label>
                  <input
                    type="text"
                    disabled
                    value={idCardSettings.dimensions}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Validity (Years)</label>
                  <input
                    type="number"
                    disabled={!canEdit}
                    value={idCardSettings.validityYears}
                    onChange={(e) =>
                      setIdCardSettings({ ...idCardSettings, validityYears: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CEO Authorizing Officer Name</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={idCardSettings.ceoName}
                  onChange={(e) => setIdCardSettings({ ...idCardSettings, ceoName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Authorizing Designation</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={idCardSettings.ceoDesignation}
                  onChange={(e) =>
                    setIdCardSettings({ ...idCardSettings, ceoDesignation: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              {/* Signature Image Toggle & URL */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Custom Signature Image</p>
                    <p className="text-[11px] text-slate-500">
                      When enabled, renders the uploaded image instead of the text seal.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    disabled={!canEdit}
                    checked={idCardSettings.useSignatureImage}
                    onChange={(e) =>
                      setIdCardSettings({ ...idCardSettings, useSignatureImage: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>

                {idCardSettings.useSignatureImage && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Signature Image URL / Data</label>
                    <input
                      type="text"
                      disabled={!canEdit}
                      placeholder="https://... or data:image/png;base64,..."
                      value={idCardSettings.signatureImageUrl || ''}
                      onChange={(e) =>
                        setIdCardSettings({ ...idCardSettings, signatureImageUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </form>
          </div>

          {canEdit && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-right">
              <button
                type="submit"
                form="idCardForm"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save ID Card Specs</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
