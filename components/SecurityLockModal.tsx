import React, { useState } from 'react';
import { Fingerprint, CheckCircle2, ShieldAlert } from 'lucide-react';
import { translations } from '../i18n';
import { Language, ThemeColor } from '../types';
import { getThemeClasses } from '../theme';
import { motion, AnimatePresence } from 'framer-motion';

interface SecurityLockModalProps {
  onUnlock: () => void;
  language: Language;
  themeColor?: ThemeColor;
}

const SecurityLockModal: React.FC<SecurityLockModalProps> = ({ onUnlock, language, themeColor = 'amber' }) => {
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const t = translations[language];
  const theme = getThemeClasses(themeColor as ThemeColor);

  const handleFingerprintTap = () => {
    if (scanning || success) return;
    setScanning(true);
    
    // Simulate high-speed biometric scan
    setTimeout(() => {
      setScanning(false);
      setSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 700);
    }, 1200);
  };

  return (
    <div className={`fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[200] flex flex-col items-center justify-center p-6 ${language === 'ar' ? 'rtl font-arabic' : 'ltr'}`}>
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-10"
      >
        <div className={`w-20 h-20 ${theme.bgSubtle} ${theme.textPrimary} border ${theme.borderSubtle} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
          <Fingerprint size={42} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">{t.unlockApp}</h2>
        <p className="text-slate-400 text-sm mt-2">{t.touchSensor}</p>
      </motion.div>

      {/* Interactive Fingerprint Biometric Sensor Area */}
      <div className="relative flex items-center justify-center mb-12">
        {/* Glow rings */}
        <motion.div
          animate={{
            scale: scanning ? [1, 1.4, 1] : [1, 1.15, 1],
            opacity: scanning ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2]
          }}
          transition={{ repeat: Infinity, duration: scanning ? 0.8 : 2 }}
          className={`absolute w-36 h-36 ${theme.bgPrimary} rounded-full blur-xl pointer-events-none`}
        />

        {/* Biometric Sensor Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFingerprintTap}
          className={`w-28 h-28 ${theme.bgSubtle} border-2 ${
            success ? 'border-emerald-500 bg-emerald-500/20' : theme.borderSubtle
          } rounded-full flex flex-col items-center justify-center relative overflow-hidden shadow-2xl cursor-pointer active:opacity-90 transition-all`}
        >
          {/* Laser Scanning Line Animation */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 50 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className={`absolute inset-x-0 h-1.5 ${theme.bgPrimary} shadow-[0_0_15px_#f59e0b] z-20`}
              />
            )}
          </AnimatePresence>

          {success ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle2 size={56} className="text-emerald-400" />
            </motion.div>
          ) : (
            <Fingerprint size={56} className={`${scanning ? theme.textPrimary + ' animate-pulse' : 'text-slate-300 dark:text-slate-400'}`} />
          )}
        </motion.button>
      </div>

      {/* Status indicator */}
      <div className="text-center h-8">
        {scanning && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-sm font-bold ${theme.textPrimary}`}>
            {t.scanningFingerprint}
          </motion.p>
        )}
        {success && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-emerald-400">
            {t.unlockSuccess}
          </motion.p>
        )}
        {!scanning && !success && (
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Tap sensor to scan fingerprint
          </p>
        )}
      </div>
    </div>
  );
};

export default SecurityLockModal;
