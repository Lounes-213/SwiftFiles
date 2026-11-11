import React, { useState } from 'react';
import { Folder, FileItem, Language, ThemeColor } from '../types';
import { translations } from '../i18n';
import { getThemeClasses } from '../theme';
import { Folder as FolderIcon, Plus, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface FoldersViewProps {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  scans: FileItem[];
  language: Language;
  themeColor?: ThemeColor;
}

const FoldersView: React.FC<FoldersViewProps> = ({ folders, setFolders, scans, language, themeColor = 'amber' }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [search, setSearch] = useState('');
  
  const t = translations[language];
  const theme = getThemeClasses(themeColor as ThemeColor);

  const addFolder = () => {
    if (!newFolderName.trim()) return;
    const colors = ['bg-amber-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-sky-500', 'bg-purple-500'];
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      color: colors[folders.length % colors.length],
    };
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowAdd(false);
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
  };

  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`space-y-6 max-w-xl mx-auto ${language === 'ar' ? 'rtl font-arabic' : 'ltr'}`}>
      {/* Header with App Theme Accent Button */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.foldersTitle}</h2>
        <button 
          onClick={() => setShowAdd(true)}
          className={`w-10 h-10 ${theme.bgPrimary} text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform`}
        >
          <Plus size={22} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search folders..." 
          className={`w-full h-12 pl-11 pr-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl focus:outline-none ${theme.ring} text-sm font-medium shadow-sm text-slate-900 dark:text-white`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredFolders.map((folder, idx) => {
          const count = scans.filter(s => s.folderId === folder.id).length;

          return (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className={`w-12 h-12 ${folder.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-md`}>
                <FolderIcon size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white truncate pr-6 text-sm">{folder.name}</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">{count} Documents</p>
              
              <button
                onClick={() => deleteFolder(folder.id)}
                className="absolute top-4 right-4 p-1.5 text-slate-300 dark:text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          );
        })}
      </div>

      {folders.length === 0 && !showAdd && (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
          <p className="text-slate-400 font-bold text-sm">Create custom folders to group your personal documents!</p>
        </div>
      )}

      {/* Add Folder Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6"
          >
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t.newFolder}</h3>
            <input 
              autoFocus
              type="text" 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder={t.folderName} 
              className={`w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none ${theme.ring} text-slate-900 dark:text-white font-bold mb-6 text-sm`}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 text-sm"
              >
                {t.cancel}
              </button>
              <button 
                onClick={addFolder}
                className={`flex-1 py-3 rounded-xl font-bold text-white ${theme.bgPrimary} text-sm shadow-md`}
              >
                {t.create}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FoldersView;
