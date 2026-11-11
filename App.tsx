import React, { useState, useEffect } from 'react';
import { AppState, FileItem, Folder, Language, SecuritySettings, AppConfig } from './types';
import { translations } from './i18n';
import { getThemeClasses } from './theme';
import ResultView from './components/ResultView';
import FoldersView from './components/FoldersView';
import SettingsView from './components/SettingsView';
import SplashScreen from './components/SplashScreen';
import SecurityLockModal from './components/SecurityLockModal';
import CreateFileModal from './components/CreateFileModal';
import WavyPlusButton from './components/WavyPlusButton';
import ProLogo from './components/ProLogo';
import { 
  Home, Folder as FolderIcon, Star, Settings, Plus, 
  Lock, Search, X, FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SPLASH);
  const [activeTab, setActiveTab] = useState<'home' | 'starred' | 'folders' | 'settings'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('swiftfiles_lang');
    return (saved as Language) || 'en';
  });

  const [security, setSecurity] = useState<SecuritySettings>(() => {
    const saved = localStorage.getItem('swiftfiles_security');
    return saved ? JSON.parse(saved) : { enabled: false, pin: '', maskSensitiveData: false };
  });

  const [appConfig, setAppConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('swiftfiles_config');
    return saved ? JSON.parse(saved) : { themeColor: 'amber', darkMode: false, logoStyle: 's_modern' };
  });

  const [isAppLocked, setIsAppLocked] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);

  const t = translations[language];
  const theme = getThemeClasses(appConfig.themeColor);

  // Initial Theme & Data Loading
  useEffect(() => {
    const savedFiles = localStorage.getItem('swiftfiles_items');
    const savedFolders = localStorage.getItem('swiftfiles_folders');
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    } else {
      const initialSamples: FileItem[] = [
        {
          id: 'sample-1',
          timestamp: Date.now() - 3600000 * 2,
          title: "Carte Nationale d'Identité",
          note: "Biometric ID card details for 1-tap copy",
          image: "/src/assets/images/id_card_algeria_sample_1794434833800.jpg",
          starred: true,
          fields: [
            { id: 'f1', label: 'N° Card NIN', value: '10928374129', isSensitive: true },
            { id: 'f2', label: 'Full Name', value: 'Emma Louise Clark' },
            { id: 'f3', label: 'Date of Birth', value: '15 OCT 1993' },
            { id: 'f4', label: 'Expiry Date', value: '28 SEP 2033' },
          ]
        },
        {
          id: 'sample-2',
          timestamp: Date.now() - 3600000 * 24,
          title: "Passeport Biométrique",
          note: "International passport number & expiry date",
          image: "/src/assets/images/passport_sample_1794434833992.jpg",
          starred: true,
          fields: [
            { id: 'f1', label: 'Passport N°', value: 'E24681357', isSensitive: true },
            { id: 'f2', label: 'Type', value: 'Biometric Passport' },
            { id: 'f3', label: 'Expiry Date', value: '12 JAN 2034' },
          ]
        },
        {
          id: 'sample-3',
          timestamp: Date.now() - 3600000 * 48,
          title: "Permis de Conduire",
          note: "Driver's license category B",
          image: "/src/assets/images/drivers_license_sample_1794434835517.jpg",
          starred: false,
          fields: [
            { id: 'f1', label: 'License N°', value: 'C1234567', isSensitive: true },
            { id: 'f2', label: 'Full Name', value: 'Eleanor Jane Harper' },
            { id: 'f3', label: 'Category', value: 'B (Light Vehicle)' },
          ]
        }
      ];
      setFiles(initialSamples);
    }
    if (savedFolders) setFolders(JSON.parse(savedFolders));

    const savedSec = localStorage.getItem('swiftfiles_security');
    if (savedSec) {
      const parsedSec: SecuritySettings = JSON.parse(savedSec);
      if (parsedSec.enabled && parsedSec.pin) {
        setIsAppLocked(true);
      }
    }

    const savedCfg = localStorage.getItem('swiftfiles_config');
    if (savedCfg) {
      const parsedCfg: AppConfig = JSON.parse(savedCfg);
      if (parsedCfg.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
    }

    const timer = setTimeout(() => setState(AppState.HOME), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Sync Dark/Light Mode on root document
  useEffect(() => {
    if (appConfig.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appConfig.darkMode]);

  // Save changes
  useEffect(() => {
    localStorage.setItem('swiftfiles_items', JSON.stringify(files));
    localStorage.setItem('swiftfiles_folders', JSON.stringify(folders));
    localStorage.setItem('swiftfiles_lang', language);
    localStorage.setItem('swiftfiles_security', JSON.stringify(security));
    localStorage.setItem('swiftfiles_config', JSON.stringify(appConfig));
  }, [files, folders, language, security, appConfig]);

  const handleSaveNewItem = (newItem: FileItem) => {
    setFiles([newItem, ...files]);
    setCurrentFile(newItem);
    setShowCreateModal(false);
    setState(AppState.RESULT);
  };

  const toggleStar = (id: string) => {
    setFiles(prev => prev.map(s => s.id === id ? { ...s, starred: !s.starred } : s));
    if (currentFile?.id === id) {
      setCurrentFile(prev => prev ? { ...prev, starred: !prev.starred } : null);
    }
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(s => s.id !== id));
    if (currentFile?.id === id) setState(AppState.HOME);
  };

  // Filter Logic
  const filteredFiles = files.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          item.fields.some(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()) || f.value.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'starred') return item.starred && matchesSearch;
    return matchesSearch;
  });

  const renderContent = () => {
    switch (state) {
      case AppState.SPLASH:
        return (
          <SplashScreen 
            customIconUrl={appConfig.customIconUrl} 
            themeColor={appConfig.themeColor} 
            darkMode={appConfig.darkMode} 
          />
        );

      case AppState.RESULT:
        return currentFile && (
          <ResultView 
            item={currentFile} 
            onBack={() => setState(AppState.HOME)} 
            onDelete={deleteFile} 
            onToggleStar={toggleStar}
            language={language}
            maskSensitiveData={security.maskSensitiveData}
            themeColor={appConfig.themeColor}
          />
        );

      default:
        return (
          <div className={cn("pb-28 pt-6 px-5 max-w-xl mx-auto text-slate-900 dark:text-slate-100", language === 'ar' ? 'rtl font-arabic' : 'ltr')}>
            {/* Clean Top Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <ProLogo 
                  className="w-10 h-10" 
                  customIconUrl={appConfig.customIconUrl} 
                  styleVariant={appConfig.logoStyle}
                  accentColor={appConfig.themeColor}
                />
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Swift<span className={`${theme.textPrimary} font-extrabold italic`}>Files</span>
                  </h1>
                  <p className="text-slate-400 font-medium text-[11px]">{t.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {security.enabled && (
                  <button
                    onClick={() => setIsAppLocked(true)}
                    className="p-2.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-100 dark:border-amber-900/40 active:scale-95 transition-transform"
                  >
                    <Lock size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Active View Router */}
            <AnimatePresence mode="wait">
              {(activeTab === 'home' || activeTab === 'starred') && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Clean Search Input */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder} 
                      className={`w-full h-12 pl-11 pr-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl focus:outline-none ${theme.ring} text-sm font-medium shadow-sm text-slate-900 dark:text-white`}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Section Title */}
                  <div className="flex justify-between items-center px-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {activeTab === 'starred' ? t.starred : t.recentFiles}
                    </h2>
                    <span className="text-xs font-bold text-slate-400">{filteredFiles.length} Documents</span>
                  </div>

                  {/* Document Card Grid / List */}
                  {filteredFiles.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                        {activeTab === 'starred' ? <Star size={32} /> : <FileText size={32} />}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                        {activeTab === 'starred' ? t.noStarred : t.noFiles}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredFiles.map(file => (
                        <div
                          key={file.id}
                          onClick={() => { setCurrentFile(file); setState(AppState.RESULT); }}
                          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer active:scale-[0.99] transition-all hover:border-slate-300 dark:hover:border-slate-700"
                        >
                          {file.image ? (
                            <img src={file.image} className="w-14 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-50 dark:border-slate-800 shrink-0" />
                          ) : (
                            <div className={`w-14 h-16 rounded-xl ${theme.bgSubtle} ${theme.textPrimary} flex items-center justify-center shrink-0`}>
                              <FileText size={24} />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">{file.title}</h3>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStar(file.id);
                                }}
                                className="p-1 text-slate-300 dark:text-slate-700 hover:text-amber-400"
                              >
                                <Star size={18} className={file.starred ? 'fill-amber-400 text-amber-400' : ''} />
                              </button>
                            </div>
                            
                            {file.fields.length > 0 && (
                              <p className="text-slate-500 dark:text-slate-400 text-xs truncate mt-1 font-medium">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{file.fields[0].label}:</span> {file.fields[0].value}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-[10px] font-bold ${theme.bgSubtle} ${theme.textPrimary} px-2 py-0.5 rounded-md uppercase tracking-wider`}>
                                {file.fields.length} Fields
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">
                                {new Date(file.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'folders' && (
                <FoldersView key="folders" folders={folders} setFolders={setFolders} scans={files as any} language={language} themeColor={appConfig.themeColor} />
              )}

              {activeTab === 'settings' && (
                <SettingsView 
                  key="settings" 
                  language={language} 
                  setLanguage={setLanguage}
                  security={security}
                  setSecurity={setSecurity}
                  appConfig={appConfig}
                  setAppConfig={setAppConfig}
                />
              )}
            </AnimatePresence>

            {/* Bottom Navigation & Plus Button with Dynamic Theme */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between z-50 max-w-xl mx-auto">
              <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={22} />} themeColor={appConfig.themeColor} />
              <NavButton active={activeTab === 'starred'} onClick={() => setActiveTab('starred')} icon={<Star size={22} />} themeColor={appConfig.themeColor} />
              
              {/* Central Wavy Animated Plus Button */}
              <WavyPlusButton 
                onClick={() => setShowCreateModal(true)} 
                themeColor={appConfig.themeColor} 
              />

              <NavButton active={activeTab === 'folders'} onClick={() => setActiveTab('folders')} icon={<FolderIcon size={22} />} themeColor={appConfig.themeColor} />
              <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={22} />} themeColor={appConfig.themeColor} />
            </nav>

            {/* Manual Create Document Modal */}
            <AnimatePresence>
              {showCreateModal && (
                <CreateFileModal
                  folders={folders}
                  onSave={handleSaveNewItem}
                  onClose={() => setShowCreateModal(false)}
                  language={language}
                  themeColor={appConfig.themeColor}
                />
              )}
            </AnimatePresence>
          </div>
        );
    }
  };

  return (
    <div className={cn("min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200", language === 'ar' ? 'font-arabic' : '')}>
      {isAppLocked && (
        <SecurityLockModal 
          onUnlock={() => setIsAppLocked(false)} 
          language={language}
          themeColor={appConfig.themeColor}
        />
      )}
      {renderContent()}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; themeColor?: string }> = ({ active, onClick, icon, themeColor = 'indigo' }) => {
  const theme = getThemeClasses(themeColor as any);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-2xl transition-all",
        active ? `${theme.textPrimary} ${theme.bgSubtle} font-bold` : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
      )}
    >
      {icon}
    </button>
  );
};

export default App;
