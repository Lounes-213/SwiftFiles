import React from 'react';
import { motion } from 'framer-motion';
import ProLogo from './ProLogo';
import { getThemeClasses } from '../theme';
import { ThemeColor, AppConfig } from '../types';

interface SplashScreenProps {
  customIconUrl?: string;
  themeColor?: ThemeColor;
  darkMode?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ customIconUrl, themeColor = 'amber', darkMode = false }) => {
  // Read saved config for immediate match on app load
  let activeTheme = themeColor;
  let activeDark = darkMode;

  try {
    const saved = localStorage.getItem('swiftfiles_config');
    if (saved) {
      const cfg: AppConfig = JSON.parse(saved);
      if (cfg.themeColor) activeTheme = cfg.themeColor;
      if (typeof cfg.darkMode === 'boolean') activeDark = cfg.darkMode;
    }
  } catch (e) {
    // fallback
  }

  const theme = getThemeClasses(activeTheme as ThemeColor);

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] overflow-hidden transition-colors duration-300 ${
      activeDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background ambient radial glow matching setting theme */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${theme.glowBg} blur-[120px] rounded-full pointer-events-none`} />

      {/* Pro S Logo */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <ProLogo className="w-28 h-28" customIconUrl={customIconUrl} accentColor={activeTheme} />
      </motion.div>

      {/* Title with Theme Accent */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <h1 className={`text-4xl font-black tracking-tighter ${activeDark ? 'text-white' : 'text-slate-900'}`}>
          Swift<span className={`${theme.textPrimary} font-extrabold italic`}>Files</span>
        </h1>
        <p className="text-slate-400 text-xs font-black tracking-[0.25em] uppercase mt-2">
          Personal Document Vault
        </p>
      </motion.div>

      {/* 3 Animated Loading Dots in Theme Accent */}
      <div className="absolute bottom-16 flex items-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.25, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className={`w-2.5 h-2.5 ${theme.bgPrimary} rounded-full shadow-md`}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
