import React, { useState } from 'react';

export const OFFICIAL_UNIGROVA_LOGO_URL =
  'https://i.ibb.co/f3YHYbn/a50b5de5-4d99-4217-a76e-65f78a6b4973.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'compact' | 'badge' | 'icon-only';
  className?: string;
  inverted?: boolean;
}

export const UniGrovaLogo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  inverted = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const iconSize = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  }[size];

  const titleSize = {
    sm: 'text-sm font-bold tracking-wider',
    md: 'text-base font-extrabold tracking-wider',
    lg: 'text-xl font-extrabold tracking-wider',
    xl: 'text-2xl font-black tracking-widest',
    '2xl': 'text-3xl font-black tracking-widest',
  }[size];

  const taglineSize = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[10px] tracking-widest',
    lg: 'text-xs tracking-widest',
    xl: 'text-sm tracking-widest',
    '2xl': 'text-sm tracking-widest',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official UniGrova Company Logo Mark */}
      <div
        className={`relative flex items-center justify-center shrink-0 ${iconSize} rounded-xl overflow-hidden shadow-sm border border-slate-200/60 bg-white`}
      >
        {!imageError ? (
          <img
            src={OFFICIAL_UNIGROVA_LOGO_URL}
            alt="UniGrova Official Logo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          /* High-tech Geometric Vector Fallback */
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-1"
          >
            <rect width="48" height="48" rx="10" fill={inverted ? '#0F172A' : '#0B2545'} />
            <path
              d="M13 14V26C13 32.075 17.925 37 24 37C25.5 37 26.93 36.69 28.23 36.14"
              stroke="#38BDF8"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M35 14V26C35 32.075 30.075 37 24 37"
              stroke="#34D399"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path d="M24 12L28 17H25V26H23V17H20L24 12Z" fill="#34D399" />
          </svg>
        )}
      </div>

      {variant !== 'compact' && variant !== 'icon-only' && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`${titleSize} font-sans ${
                inverted ? 'text-white' : 'text-slate-900'
              }`}
            >
              UNIGROVA
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-normal rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              UGMS
            </span>
          </div>
          <span
            className={`${taglineSize} font-medium mt-0.5 text-slate-500 uppercase`}
          >
            LEARN • BUILD • GROW TOGETHER
          </span>
        </div>
      )}
    </div>
  );
};
