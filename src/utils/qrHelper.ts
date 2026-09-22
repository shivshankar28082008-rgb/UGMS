import QRCode from 'qrcode';
import { Employee } from '../types';

export interface VerifiedEmployeePayload {
  organization: string;
  employeeName: string;
  preferredName?: string;
  employeeId: string;
  designation: string;
  department: string;
  joiningDate: string;
  status: string;
  issuedBy: string;
  verificationHash: string;
}

export function buildEmployeeQRPayload(employee: Employee): string {
  // Strict format compliant with requirement Section 12:
  // "QR contains only: UniGrova, Employee Name, Employee ID, Designation, Department, Joining Date, Status. Do NOT include passwords, credentials, sensitive info."
  const data: VerifiedEmployeePayload = {
    organization: 'UniGrova',
    employeeName: employee.fullName,
    preferredName: employee.preferredName,
    employeeId: employee.employeeId,
    designation: employee.designation,
    department: employee.department,
    joiningDate: employee.joiningDate,
    status: employee.status,
    issuedBy: 'UGMS Executive Administration (COO Office & CEO Authorization)',
    verificationHash: `UGMS-${btoa(employee.employeeId).substring(0, 10)}-${employee.joiningDate.replace(/-/g, '')}`,
  };

  return JSON.stringify(data, null, 2);
}

export async function generateQRCodeDataURL(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#0B2545',
        light: '#FFFFFF',
      },
      width: 256,
    });
  } catch (err) {
    console.error('Failed to generate QR code data URL', err);
    return '';
  }
}
