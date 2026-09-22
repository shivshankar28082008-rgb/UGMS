import React, { useEffect, useState } from 'react';
import { Phone, HeartPulse, ShieldCheck, AlertCircle } from 'lucide-react';
import { Employee, IDCardSettings } from '../../types';
import { UniGrovaLogo, OFFICIAL_UNIGROVA_LOGO_URL } from '../common/UniGrovaLogo';
import { buildEmployeeQRPayload, generateQRCodeDataURL } from '../../utils/qrHelper';

interface IDCardPreviewProps {
  employee: Employee;
  idCardSettings: IDCardSettings;
  side?: 'front' | 'back';
  isFlipped?: boolean;
  onFlip?: () => void;
  scale?: number;
  printMode?: boolean;
}

export const IDCardPreview: React.FC<IDCardPreviewProps> = ({
  employee,
  idCardSettings,
  side,
  isFlipped = false,
  onFlip,
  printMode = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const payload = employee.qrPayload || buildEmployeeQRPayload(employee);
    generateQRCodeDataURL(payload).then((url) => {
      if (isMounted) setQrDataUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [employee]);

  // Standard CR80 ISO Card Dimensions (85.60 mm x 53.98 mm -> scaled for crisp render at 428px x 270px)
  const cardWidth = 428;
  const cardHeight = 270;

  const renderFront = () => (
    <div
      id={`id-card-front-${employee.employeeId}`}
      className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200/90 select-none flex flex-col justify-between"
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 60%, #F0FDF4 100%)',
      }}
    >
      {/* Top Header Section */}
      <div className="relative px-5 pt-3.5 pb-2.5 bg-gradient-to-r from-[#0B2545] via-[#113C6E] to-[#0A5C4A] text-white flex items-center justify-between shadow-xs">
        <UniGrovaLogo size="sm" variant="full" inverted />
        <div className="text-right">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-400 text-slate-950 shadow-xs">
            EMPLOYEE ID CARD
          </span>
          <p className="text-[8px] text-slate-300 font-mono mt-0.5">CR80 • ISO/IEC 7810</p>
        </div>
      </div>

      {/* Corporate Accent Line */}
      <div className="h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-500 w-full" />

      {/* Main Body: Photo & Employee Information */}
      <div className="relative px-5 py-2.5 flex-1 flex items-center gap-4">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.05] overflow-hidden">
          <img
            src={OFFICIAL_UNIGROVA_LOGO_URL}
            alt=""
            className="w-44 h-44 object-contain filter grayscale"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Large Professional Employee Photo */}
        <div className="relative shrink-0">
          <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-[#0B2545] shadow-md bg-slate-100">
            <img
              src={employee.profilePhoto}
              alt={employee.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  employee.fullName
                )}&background=0B2545&color=fff&size=200`;
              }}
            />
          </div>
          {/* Blood Group Pill Badge */}
          <div className="absolute -bottom-2 -right-1.5 px-2 py-0.5 bg-rose-600 text-white rounded-md text-[10px] font-black tracking-wider shadow-sm flex items-center gap-0.5">
            <HeartPulse className="w-2.5 h-2.5" />
            <span>{employee.bloodGroup || 'O+'}</span>
          </div>
        </div>

        {/* Identity Details */}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-extrabold text-slate-900 truncate leading-tight tracking-tight">
            {employee.fullName}
          </h2>
          {employee.preferredName && (
            <p className="text-[11px] font-medium text-slate-500">"{employee.preferredName}"</p>
          )}

          <p className="text-xs font-bold text-emerald-700 mt-0.5 truncate">{employee.designation}</p>

          <div className="mt-2 space-y-1 text-[10px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-400 uppercase w-14">ID:</span>
              <span className="font-mono font-bold text-[#0B2545] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                {employee.employeeId}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-400 uppercase w-14">Dept:</span>
              <span className="font-semibold text-slate-800 truncate">{employee.department}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-400 uppercase w-14">Joined:</span>
              <span className="text-slate-700 font-medium">{employee.joiningDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tagline Bar */}
      <div className="px-5 py-2 bg-slate-950 text-white flex items-center justify-between text-[9px] border-t border-slate-800">
        <span className="text-emerald-400 font-bold tracking-wider">
          LEARN • BUILD • GROW TOGETHER
        </span>
        <span className="text-slate-400 font-mono">unigrova.com</span>
      </div>
    </div>
  );

  const renderBack = () => (
    <div
      id={`id-card-back-${employee.employeeId}`}
      className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200/90 select-none flex flex-col justify-between"
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 50%, #F1F5F9 100%)',
      }}
    >
      {/* Top Notice */}
      <div className="px-5 pt-3 pb-2 bg-[#0B2545] text-white flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-1.5">
          <UniGrovaLogo size="sm" variant="icon-only" />
          <span className="font-bold tracking-wider text-emerald-300 uppercase">
            Valid Company Identification
          </span>
        </div>
        <span className="text-slate-300 font-mono text-[8px]">UGMS SECURITY VERIFIED</span>
      </div>

      {/* Main Body */}
      <div className="relative px-5 py-2 flex-1 flex items-center justify-between gap-3">
        {/* Left Column: Real QR Code */}
        <div className="flex flex-col items-center shrink-0">
          <div className="p-1.5 bg-white border border-slate-300 rounded-xl shadow-xs">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Employee Verification QR" className="w-22 h-22 object-contain" />
            ) : (
              <div className="w-22 h-22 bg-slate-100 animate-pulse rounded" />
            )}
          </div>
          <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-wider mt-1">
            Scan to Verify Credentials
          </span>
        </div>

        {/* Right Column: Employee Info, Emergency, CEO Signature */}
        <div className="flex-1 flex flex-col justify-between h-full pl-1">
          {/* Employee summary info */}
          <div className="text-[9.5px] space-y-0.5 text-slate-700 bg-slate-50/80 p-1.5 rounded border border-slate-200">
            <p>
              <strong className="text-slate-900">ID:</strong> {employee.employeeId} •{' '}
              <strong className="text-slate-900">Dept:</strong> {employee.department}
            </p>
            <p>
              <strong className="text-slate-900">Issued:</strong> {employee.joiningDate}
            </p>
          </div>

          {/* Emergency Contact */}
          <div className="p-1.5 bg-rose-50/70 border border-rose-200/80 rounded text-[9px]">
            <div className="flex items-center gap-1 text-rose-800 font-bold uppercase text-[8px]">
              <Phone className="w-2.5 h-2.5 text-rose-600" />
              <span>Emergency Contact</span>
            </div>
            <p className="font-semibold text-slate-900 truncate">
              {employee.emergencyContact.name}{' '}
              <span className="text-slate-500 font-normal">({employee.emergencyContact.relationship})</span>
            </p>
            <p className="font-mono text-slate-700 font-medium">
              {employee.emergencyContact.phone}
            </p>
          </div>

          {/* Authorized Signature Section */}
          <div className="p-1.5 bg-emerald-50/70 border border-emerald-200/90 rounded flex flex-col items-center text-center">
            <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-950">
              Authorized Signature
            </span>

            {/* If uploaded signature image exists */}
            {idCardSettings.signatureImageUrl ? (
              <div className="h-7 my-0.5 flex items-center justify-center">
                <img
                  src={idCardSettings.signatureImageUrl}
                  alt="CEO Signature"
                  className="max-h-6 object-contain"
                />
              </div>
            ) : (
              /* Requirement #12: If no signature has been uploaded, show "CEO Authorization Pending" */
              <div className="my-0.5 text-center">
                <span className="text-[8.5px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                  CEO Authorization Pending
                </span>
              </div>
            )}

            <div className="text-[8px] text-slate-600 font-semibold border-t border-emerald-300/60 pt-0.5 w-full">
              <span className="text-slate-900 font-bold">CEO: Tannu Kumari</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Return Notice & Legal property */}
      <div className="px-5 py-1.5 bg-slate-100 border-t border-slate-200 text-[8px] text-slate-600 flex items-center justify-between">
        <span className="font-medium">Property of UniGrova • Valid Company Identification</span>
        <span className="font-mono font-bold text-slate-800">{employee.employeeId}</span>
      </div>
    </div>
  );

  if (printMode) {
    return (
      <div className="flex flex-col gap-6 items-center p-4 bg-white">
        <div>{renderFront()}</div>
        <div>{renderBack()}</div>
      </div>
    );
  }

  if (side === 'front') return renderFront();
  if (side === 'back') return renderBack();

  return (
    <div
      className="relative cursor-pointer select-none group perspective-1000"
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
      }}
      onClick={onFlip}
    >
      <div
        className={`w-full h-full transition-transform duration-500 transform-style-3d relative ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        <div className="absolute inset-0 backface-hidden">{renderFront()}</div>
        <div className="absolute inset-0 backface-hidden rotate-y-180">{renderBack()}</div>
      </div>
    </div>
  );
};
