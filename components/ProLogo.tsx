import React from 'react';
import { motion } from 'framer-motion';

interface ProLogoProps {
  className?: string;
  customIconUrl?: string;
  styleVariant?: 's_modern' | 'custom';
  accentColor?: string;
}

const ProLogo: React.FC<ProLogoProps> = ({ 
  className = "w-10 h-10", 
  customIconUrl, 
  styleVariant = 's_modern',
  accentColor = 'indigo' 
}) => {
  if (customIconUrl && styleVariant === 'custom') {
    return (
      <div className={`${className} rounded-2xl overflow-hidden shadow-sm shrink-0`}>
        <img src={customIconUrl} alt="App Icon" className="w-full h-full object-cover" />
      </div>
    );
  }

  const gradientStops: Record<string, { start: string; end: string }> = {
    indigo: { start: '#4F46E5', end: '#7C3AED' },
    emerald: { start: '#059669', end: '#0D9488' },
    blue: { start: '#2563EB', end: '#0284C7' },
    purple: { start: '#9333EA', end: '#C026D3' },
    rose: { start: '#E11D48', end: '#DB2777' },
    amber: { start: '#D97706', end: '#EA580C' },
  };

  const stops = gradientStops[accentColor] || gradientStops.indigo;
  const gradientId = `sLogoGrad_${accentColor}`;

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${className} flex items-center justify-center shrink-0 relative`}
    >
      <svg className="w-full h-full overflow-visible" viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={stops.start} />
            <stop offset="100%" stopColor={stops.end} />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Fluid Curved Letter S Vector */}
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          d="M 44 18 C 42 12 34 10 26 12 C 16 14.5 14 24 24 28 C 36 32 38 42 28 48 C 20 52 12 48 10 42" 
          stroke={`url(#${gradientId})`} 
          strokeWidth="8.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        
        {/* Accent spark dot */}
        <motion.circle 
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          cx="44" 
          cy="18" 
          r="3.5" 
          fill={stops.start} 
        />
      </svg>
    </motion.div>
  );
};

export default ProLogo;
