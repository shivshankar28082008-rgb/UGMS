import React from 'react';
import {
  ShieldCheck,
  Building2,
  Mail,
  Award,
  Sparkles,
  Layers,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { UserSession } from '../../types';
import { UniGrovaLogo } from '../common/UniGrovaLogo';

interface ExecutiveLeadershipViewProps {
  session: UserSession;
}

export const ExecutiveLeadershipView: React.FC<ExecutiveLeadershipViewProps> = ({
  session,
}) => {
  const leaders = Object.values(StorageService.getLeaders());

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <UniGrovaLogo size="lg" variant="compact" className="mt-0.5 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Executive Leadership & Governance Council</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Council of 4
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Governing body of UniGrova directing long-term vision, technological architecture, corporate strategy, and operational execution.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>UGMS Governance Charter Active</span>
        </div>
      </div>

      {/* Leadership 4 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leaders.map((leader) => (
          <div
            key={leader.officerId}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Leader Photo & Heading */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={leader.profileImage}
                  alt={leader.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-md shrink-0 bg-slate-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      leader.name
                    )}&background=0B2545&color=fff&size=200`;
                  }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900 truncate">{leader.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 shrink-0">
                      {leader.role}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-emerald-700 mt-0.5">{leader.position}</p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono mt-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-bold">
                      {leader.officerId}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 font-sans">{leader.department}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 mb-4">
                {leader.bio}
              </p>

              {/* Responsibilities */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Governance Portfolio & Core Responsibilities
                </h4>
                <div className="space-y-1.5">
                  {leader.responsibilities.map((resp, idx) => (
                    <div key={idx} className="text-xs flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Contact */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{leader.email}</span>
              </span>
              <span className="font-semibold text-emerald-700">Executive Council</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
