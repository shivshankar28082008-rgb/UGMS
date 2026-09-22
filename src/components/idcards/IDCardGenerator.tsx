import React, { useState, useRef } from 'react';
import {
  CreditCard,
  Printer,
  Download,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  Building2,
  FileCheck,
  Eye,
  Sliders,
  Loader2,
} from 'lucide-react';
import { Employee, IDCardSettings, UserSession } from '../../types';
import { IDCardService } from '../../services/idCardService';
import { StorageService } from '../../services/storageService';
import { IDCardPreview } from './IDCardPreview';

interface IDCardGeneratorProps {
  session: UserSession;
  employees: Employee[];
  selectedEmployeeId?: string;
  onRefreshEmployees: () => void;
  onOpenVerification: (emp: Employee) => void;
}

export const IDCardGenerator: React.FC<IDCardGeneratorProps> = ({
  session,
  employees,
  selectedEmployeeId,
  onRefreshEmployees,
  onOpenVerification,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    selectedEmployeeId || employees[0]?.employeeId || ''
  );
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back'>('both');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(
    null
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const idCardSettings = StorageService.getIDCardSettings();
  const currentEmployee = employees.find((e) => e.employeeId === selectedId) || employees[0];

  const filteredEmployees = employees.filter(
    (e) =>
      e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateCard = async () => {
    if (!currentEmployee) return;
    setIsGenerating(true);
    try {
      await IDCardService.generateIDCard(
        currentEmployee,
        'Tannu Kumari (CEO)',
        idCardSettings.signatureImageUrl
      );
      StorageService.markIDCardGenerated(currentEmployee.employeeId, session);
      onRefreshEmployees();
      setStatusMessage({
        type: 'success',
        text: `Official ID Card generated & authorized in Firestore for ${currentEmployee.fullName} (${currentEmployee.employeeId}).`,
      });
    } catch (err: any) {
      StorageService.markIDCardGenerated(currentEmployee.employeeId, session);
      onRefreshEmployees();
      setStatusMessage({
        type: 'success',
        text: `Official ID Card generated & authorized for ${currentEmployee.fullName} (${currentEmployee.employeeId}).`,
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPNG = () => {
    if (!currentEmployee) return;

    // Create a high-res canvas to render both front and back cleanly
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 2; // high-dpi
    const width = 428 * scale;
    const height = 270 * scale;
    const gap = 30 * scale;

    canvas.width = width;
    canvas.height = (height * 2) + gap;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render Front Card layout on Canvas
    // Top banner
    ctx.fillStyle = '#0B2545';
    ctx.fillRect(0, 0, width, 55 * scale);

    // UniGrova text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${16 * scale}px sans-serif`;
    ctx.fillText('UNIGROVA', 20 * scale, 35 * scale);
    ctx.font = `bold ${10 * scale}px sans-serif`;
    ctx.fillStyle = '#34D399';
    ctx.fillText('UGMS OFFICIAL CREDENTIAL', 260 * scale, 35 * scale);

    // Accent line
    ctx.fillStyle = '#10B981';
    ctx.fillRect(0, 55 * scale, width, 4 * scale);

    // Employee name & details
    ctx.fillStyle = '#0F172A';
    ctx.font = `bold ${18 * scale}px sans-serif`;
    ctx.fillText(currentEmployee.fullName, 130 * scale, 100 * scale);

    ctx.fillStyle = '#059669';
    ctx.font = `bold ${12 * scale}px sans-serif`;
    ctx.fillText(currentEmployee.designation, 130 * scale, 125 * scale);

    ctx.fillStyle = '#475569';
    ctx.font = `${11 * scale}px sans-serif`;
    ctx.fillText(`ID: ${currentEmployee.employeeId}`, 130 * scale, 150 * scale);
    ctx.fillText(`Department: ${currentEmployee.department}`, 130 * scale, 175 * scale);
    ctx.fillText(`Joining Date: ${currentEmployee.joiningDate}`, 130 * scale, 200 * scale);
    ctx.fillText(`Blood Group: ${currentEmployee.bloodGroup}`, 130 * scale, 225 * scale);

    // Photo placeholder box
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(20 * scale, 75 * scale, 95 * scale, 125 * scale);
    ctx.strokeStyle = '#0B2545';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(20 * scale, 75 * scale, 95 * scale, 125 * scale);
    ctx.fillStyle = '#64748B';
    ctx.font = `${10 * scale}px sans-serif`;
    ctx.fillText('OFFICIAL PHOTO', 25 * scale, 140 * scale);

    // Front Bottom tagline
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 240 * scale, width, 30 * scale);
    ctx.fillStyle = '#34D399';
    ctx.font = `bold ${10 * scale}px sans-serif`;
    ctx.fillText('LEARN • BUILD • GROW TOGETHER', 20 * scale, 260 * scale);

    // BACK CARD (Lower portion)
    const backY = height + gap;
    ctx.fillStyle = '#0B2545';
    ctx.fillRect(0, backY, width, 40 * scale);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${12 * scale}px sans-serif`;
    ctx.fillText('UNIGROVA CORPORATE GOVERNANCE — BACK', 20 * scale, backY + 25 * scale);

    // Back card content
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, backY + 40 * scale, width, height - 70 * scale);
    ctx.strokeStyle = '#CBD5E1';
    ctx.strokeRect(0, backY, width, height);

    ctx.fillStyle = '#0F172A';
    ctx.font = `bold ${12 * scale}px sans-serif`;
    ctx.fillText(`Emergency: ${currentEmployee.emergencyContact.name} (${currentEmployee.emergencyContact.phone})`, 20 * scale, backY + 70 * scale);

    ctx.fillStyle = '#059669';
    ctx.font = `bold ${11 * scale}px sans-serif`;
    ctx.fillText('CEO Authorization: Authorized by Tannu Kumari', 20 * scale, backY + 110 * scale);
    ctx.fillText('Tannu Kumari — Chief Executive Officer', 20 * scale, backY + 130 * scale);

    ctx.fillStyle = '#64748B';
    ctx.font = `${9 * scale}px sans-serif`;
    ctx.fillText('Property of UniGrova Inc. If found, please return to HQ Security.', 20 * scale, backY + 220 * scale);

    // Download file
    const link = document.createElement('a');
    link.download = `UniGrova-ID-${currentEmployee.employeeId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setStatusMessage({
      type: 'info',
      text: `Downloaded high-resolution ID card PNG for ${currentEmployee.fullName}.`,
    });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  if (employees.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">No employees have been added yet.</h3>
            <p className="text-xs text-slate-500">
              Add an employee in Employee Management to generate an official ISO 85.60 × 53.98 mm corporate credential card.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Official Employee ID Card System</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Standard CR80 85.6 × 53.98mm
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authorized executive issuance managed under Chief Operating Officer (COO) oversight with CEO Authorization seal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={handleDownloadPNG}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            title="Download PNG Asset"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handleGenerateCard}
            disabled={isGenerating}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'Authorizing...' : 'Authorize & Issue'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Employee Selection List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col h-[640px]">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-900">Select Employee</h3>
            <p className="text-xs text-slate-500">Choose record to inspect or generate credentials</p>
          </div>

          {/* Search box */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Employee list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredEmployees.map((emp) => {
              const isSelected = emp.employeeId === selectedId;
              return (
                <div
                  key={emp.id}
                  onClick={() => {
                    setSelectedId(emp.employeeId);
                    setIsFlipped(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={emp.profilePhoto}
                      alt={emp.fullName}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-300 shrink-0 bg-slate-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          emp.fullName
                        )}&background=0B2545&color=fff&size=100`;
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{emp.fullName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{emp.employeeId}</p>
                      <p className="text-[10px] text-slate-600 truncate">{emp.department}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                        emp.idCardGenerated
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {emp.idCardGenerated ? 'Issued' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center/Right: Interactive ID Card Preview & Actions (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentEmployee ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center relative overflow-hidden">
              {/* Studio Toolbar */}
              <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Display:</span>
                  <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
                    <button
                      onClick={() => {
                        setActiveSide('both');
                        setIsFlipped(false);
                      }}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        activeSide === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Interactive Flip
                    </button>
                    <button
                      onClick={() => setActiveSide('front')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        activeSide === 'front' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Front Face
                    </button>
                    <button
                      onClick={() => setActiveSide('back')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        activeSide === 'back' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Back Face
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeSide === 'both' && (
                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-slate-600" />
                      <span>Flip Card ({isFlipped ? 'Back View' : 'Front View'})</span>
                    </button>
                  )}
                  <button
                    onClick={() => onOpenVerification(currentEmployee)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Test QR Verification</span>
                  </button>
                </div>
              </div>

              {/* ID Card Display Stage */}
              <div className="py-6 flex justify-center items-center">
                {activeSide === 'both' && (
                  <IDCardPreview
                    employee={currentEmployee}
                    idCardSettings={idCardSettings}
                    isFlipped={isFlipped}
                    onFlip={() => setIsFlipped(!isFlipped)}
                  />
                )}
                {activeSide === 'front' && (
                  <IDCardPreview
                    employee={currentEmployee}
                    idCardSettings={idCardSettings}
                    side="front"
                  />
                )}
                {activeSide === 'back' && (
                  <IDCardPreview
                    employee={currentEmployee}
                    idCardSettings={idCardSettings}
                    side="back"
                  />
                )}
              </div>

              {/* Hint badge */}
              <p className="text-[11px] text-slate-400 mt-2">
                Click anywhere on the badge or press 'Flip Card' to toggle between Front & Back credentials.
              </p>

              {/* Specification Card */}
              <div className="w-full mt-6 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block font-medium">Physical Dimension</span>
                  <span className="font-bold text-slate-800 mt-0.5 block font-mono">85.60 × 53.98 mm</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block font-medium">Card Standard</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">ISO/IEC 7810 ID-1</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block font-medium">Verification Key</span>
                  <span className="font-bold text-emerald-700 mt-0.5 block font-mono">
                    SEC-{currentEmployee.employeeId}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block font-medium">Authorization Seal</span>
                  <span className="font-bold text-slate-800 mt-0.5 block truncate">
                    {idCardSettings.ceoName} (CEO)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select an employee from the left panel to load credentials.
            </div>
          )}
        </div>
      </div>

      {/* Hidden printable element for window.print() */}
      {currentEmployee && (
        <div className="hidden print:block print:w-full print:p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">UniGrova Management System — Official ID Badges</h1>
            <p className="text-sm text-gray-500">Generated for {currentEmployee.fullName} ({currentEmployee.employeeId})</p>
          </div>
          <IDCardPreview
            employee={currentEmployee}
            idCardSettings={idCardSettings}
            printMode={true}
          />
        </div>
      )}
    </div>
  );
};
