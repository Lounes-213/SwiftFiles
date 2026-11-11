import React, { useState, useRef } from 'react';
import { Language, SecuritySettings, AppConfig, ThemeColor } from '../types';
import { translations } from '../i18n';
import { getThemeClasses } from '../theme';
import { 
  Globe, Shield, HelpCircle, Eye, ChevronRight, X, FileText, 
  Moon, Sun, Palette, RotateCcw, Upload, Fingerprint, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProLogo from './ProLogo';

interface SettingsViewProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  security: SecuritySettings;
  setSecurity: React.Dispatch<React.SetStateAction<SecuritySettings>>;
  appConfig: AppConfig;
  setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  language, setLanguage, security, setSecurity, appConfig, setAppConfig 
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showPlayStore, setShowPlayStore] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[language];
  const theme = getThemeClasses(appConfig.themeColor as ThemeColor);

  const langs: { id: Language; label: string; flag: string }[] = [
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'fr', label: 'Français', flag: '🇫🇷' },
    { id: 'ar', label: 'العربية', flag: '🇩🇿' },
  ];

  const themeColors: { id: ThemeColor; bg: string; name: string }[] = [
    { id: 'amber', bg: 'bg-amber-500', name: 'Orange Amber' },
    { id: 'indigo', bg: 'bg-indigo-600', name: 'Indigo' },
    { id: 'emerald', bg: 'bg-emerald-600', name: 'Emerald' },
    { id: 'blue', bg: 'bg-blue-600', name: 'Sapphire' },
    { id: 'purple', bg: 'bg-purple-600', name: 'Amethyst' },
    { id: 'rose', bg: 'bg-rose-600', name: 'Crimson' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAppConfig(prev => ({
          ...prev,
          customIconUrl: reader.result as string,
          logoStyle: 'custom'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDarkMode = () => {
    setAppConfig(prev => {
      const nextDark = !prev.darkMode;
      if (nextDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { ...prev, darkMode: nextDark };
    });
  };

  return (
    <div className={`space-y-6 max-w-xl mx-auto ${language === 'ar' ? 'rtl font-arabic' : 'ltr'}`}>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.settings}</h2>

      {/* Appearance & Themes */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4">
          <div className={`w-10 h-10 ${theme.bgSubtle} ${theme.textPrimary} rounded-2xl flex items-center justify-center`}>
            <Palette size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.appearance}</h3>
            <p className="text-slate-400 text-xs font-medium">Dark mode, theme colors, app icon</p>
          </div>
        </div>

        <div className="p-4 space-y-5">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {appConfig.darkMode ? <Moon size={18} className={theme.textPrimary} /> : <Sun size={18} className={theme.textPrimary} />}
              <span className="text-sm font-bold text-slate-900 dark:text-white">{t.darkMode}</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                appConfig.darkMode ? theme.bgPrimary : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${appConfig.darkMode ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {/* Color Themes */}
          <div className="pt-3 border-t border-slate-50 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-3">{t.themeColor}</label>
            <div className="flex gap-3">
              {themeColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setAppConfig(prev => ({ ...prev, themeColor: color.id }))}
                  className={`w-9 h-9 rounded-full ${color.bg} flex items-center justify-center transition-all ${
                    appConfig.themeColor === color.id ? 'ring-4 ring-slate-900 dark:ring-white ring-offset-2 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Custom App Launcher Icon */}
          <div className="pt-3 border-t border-slate-50 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-3">{t.appLogo}</label>
            
            <input 
              type="file" 
              ref={logoFileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleLogoUpload} 
            />

            <div className="flex items-center gap-4">
              <ProLogo 
                className="w-14 h-14" 
                customIconUrl={appConfig.customIconUrl} 
                styleVariant={appConfig.logoStyle}
                accentColor={appConfig.themeColor}
              />

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => logoFileInputRef.current?.click()}
                  className={`px-4 py-2 ${theme.bgSubtle} ${theme.textPrimary} font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity`}
                >
                  <Upload size={14} />
                  {t.uploadCustomLogo}
                </button>

                {appConfig.logoStyle === 'custom' && (
                  <button
                    onClick={() => setAppConfig(prev => ({ ...prev, logoStyle: 's_modern', customIconUrl: undefined }))}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                  >
                    <RotateCcw size={12} />
                    {t.resetLogo}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4">
          <div className={`w-10 h-10 ${theme.bgSubtle} ${theme.textPrimary} rounded-2xl flex items-center justify-center`}>
            <Globe size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.language}</h3>
            <p className="text-slate-400 text-xs font-medium">Interface language</p>
          </div>
        </div>
        <div className="p-3 space-y-1">
          {langs.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`w-full p-3 px-4 rounded-2xl flex items-center justify-between transition-all ${
                language === lang.id ? `${theme.bgSubtle} ${theme.textPrimary} font-bold` : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm">{lang.label}</span>
              </div>
              {language === lang.id && <div className={`w-2 h-2 ${theme.bgPrimary} rounded-full`} />}
            </button>
          ))}
        </div>
      </div>

      {/* Fingerprint Security & Privacy Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4">
          <div className={`w-10 h-10 ${theme.bgSubtle} ${theme.textPrimary} rounded-2xl flex items-center justify-center`}>
            <Shield size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.security}</h3>
            <p className="text-slate-400 text-xs font-medium">{t.securityDesc}</p>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {/* Fingerprint Security Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Fingerprint size={20} className={theme.textPrimary} />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{t.securityToggle}</p>
                {security.enabled && <p className="text-[11px] text-emerald-600 font-bold">Fingerprint Active</p>}
              </div>
            </div>
            <button
              onClick={() => setSecurity(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                security.enabled ? theme.bgPrimary : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${security.enabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {/* Privacy Blur Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Eye size={18} className="text-slate-400" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{t.privacyMask}</p>
                <p className="text-[11px] text-slate-400 font-medium">{t.privacyMaskDesc}</p>
              </div>
            </div>
            <button
              onClick={() => setSecurity(prev => ({ ...prev, maskSensitiveData: !prev.maskSensitiveData }))}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                security.maskSensitiveData ? theme.bgPrimary : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${security.maskSensitiveData ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Help, Play Store & Privacy Policy */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowPlayStore(true)}
          className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800"
        >
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Share2 size={20} className={theme.textPrimary} />
            <span className="font-bold text-sm">{t.playStoreExport}</span>
          </div>
          <ChevronRight size={18} className="text-slate-300" />
        </button>

        <button
          onClick={() => setShowHelp(true)}
          className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800"
        >
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <HelpCircle size={20} className={theme.textPrimary} />
            <span className="font-bold text-sm">{t.helpSupport}</span>
          </div>
          <ChevronRight size={18} className="text-slate-300" />
        </button>

        <button
          onClick={() => setShowPrivacy(true)}
          className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <FileText size={20} className={theme.textPrimary} />
            <span className="font-bold text-sm">{t.privacyPolicy}</span>
          </div>
          <ChevronRight size={18} className="text-slate-300" />
        </button>
      </div>

      <div className="text-center pb-8 pt-4">
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">SwiftFiles v1.0.0</p>
      </div>

      {/* Play Store Export Modal */}
      <AnimatePresence>
        {showPlayStore && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.playStoreTitle}</h3>
                <button onClick={() => setShowPlayStore(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-left">
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-4 rounded-2xl">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-bold mb-1">{t.playStoreStep1}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{t.playStoreStep2}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed font-bold">{t.playStoreStep3}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.helpTitle}</h3>
                <button onClick={() => setShowHelp(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-left">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{t.faq1Q}</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{t.faq1A}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{t.faq2Q}</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{t.faq2A}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6"
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.privacyPolicy}</h3>
                <button onClick={() => setShowPrivacy(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={20} />
                </button>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                {t.privacyPolicyContent}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsView;
