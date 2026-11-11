import React, { useState } from 'react';
import { Folder, FileItem, Language, ThemeColor } from '../types';
import { translations } from '../i18n';
import { getThemeClasses } from '../theme';
import { Folder as FolderIcon, Plus, Trash2, Search, ArrowLeft, FileText, Star, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateFileModal from './CreateFileModal';

interface FoldersViewProps {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  scans: FileItem[];
  language: Language;
  themeColor?: ThemeColor;
  onSelectFile: (file: FileItem) => void;
  onSaveFile: (file: FileItem) => void;
  onToggleStar: (id: string) => void;
}

const FoldersView: React.FC<FoldersViewProps> = ({ 
  folders, setFolders, scans, language, themeColor = 'amber', 
  onSelectFile, onSaveFile, onToggleStar 
}) => {
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [search, setSearch] = useState('');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [showCreateFileModal, setShowCreateFileModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  
  const t = translations[language];
  const theme = getThemeClasses(themeColor as ThemeColor);

  const activeFolder = folders.find(f => f.id === activeFolderId);

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
    setShowAddFolder(false);
  };

  const confirmDeleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    if (activeFolderId === id) setActiveFolderId(null);
    setFolderToDelete(null);
  };

  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  // Active folder files
  const activeFolderFiles = activeFolderId ? scans.filter(s => s.folderId === activeFolderId) : [];

  return (
    <div className={`space-y-6 max-w-xl mx-auto ${language === 'ar' ? 'rtl font-arabic' : 'ltr'}`}>
      <AnimatePresence mode="wait">
        {/* VIEW 1: Active Folder Contents View */}
        {activeFolderId && activeFolder ? (
          <motion.div 
            key="folder-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Top Navigation Bar inside Folder */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <button 
                onClick={() => setActiveFolderId(null)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft size={18} className={language === 'ar' ? 'rotate-180' : ''} />
                <span>{t.foldersTitle}</span>
              </button>
              
              <button
                onClick={() => setShowCreateFileModal(true)}
                className={`px-3.5 py-2 ${theme.bgPrimary} text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-transform`}
              >
                <Plus size={16} />
                <span>{t.addFileBtn}</span>
              </button>
            </div>

            {/* Folder Banner Header */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className={`w-14 h-14 ${activeFolder.color} rounded-2xl flex items-center justify-center text-white shadow-md shrink-0`}>
                <FolderIcon size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{activeFolder.name}</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">{activeFolderFiles.length} Documents</p>
              </div>
            </div>

            {/* Folder Files List (Clean Strip - Thumbnail + Title ONLY) */}
            <div className="space-y-3">
              {activeFolderFiles.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                    <FileText size={24} />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-xs mb-4">
                    This folder is empty. Add documents inside this folder!
                  </p>
                  <button
                    onClick={() => setShowCreateFileModal(true)}
                    className={`px-4 py-2.5 ${theme.bgPrimary} text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-md`}
                  >
                    <Plus size={16} />
                    {t.addFileBtn}
                  </button>
                </div>
              ) : (
                activeFolderFiles.map(file => (
                  <div
                    key={file.id}
                    onClick={() => onSelectFile(file)}
                    className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer active:scale-[0.99] transition-all hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    {/* Small clean complete document image thumbnail */}
                    {file.image ? (
                      <img 
                        src={file.image} 
                        alt={file.title} 
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0 shadow-sm" 
                      />
                    ) : (
                      <div className={`w-14 h-14 rounded-xl ${theme.bgSubtle} ${theme.textPrimary} flex items-center justify-center shrink-0`}>
                        <FileText size={22} />
                      </div>
                    )}

                    {/* Title ONLY - No extra details/fields shown on card strip */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">{file.title}</h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                        {new Date(file.timestamp).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(file.id);
                      }}
                      className="p-2 text-slate-300 dark:text-slate-700 hover:text-amber-400 shrink-0"
                    >
                      <Star size={18} className={file.starred ? 'fill-amber-400 text-amber-400' : ''} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          /* VIEW 2: Root Folders Grid View */
          <motion.div
            key="folders-grid"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.foldersTitle}</h2>
              <button 
                onClick={() => setShowAddFolder(true)}
                className={`w-10 h-10 ${theme.bgPrimary} text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform`}
              >
                <Plus size={22} />
              </button>
            </div>

            {/* Folder Search */}
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

            {/* Folders Grid */}
            <div className="grid grid-cols-2 gap-4">
              {filteredFolders.map((folder, idx) => {
                const count = scans.filter(s => s.folderId === folder.id).length;

                return (
                  <motion.div
                    key={folder.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setActiveFolderId(folder.id)}
                    className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 ${folder.color} rounded-2xl flex items-center justify-center text-white shadow-md`}>
                        <FolderIcon size={24} />
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFolderToDelete(folder.id);
                        }}
                        className="p-1.5 text-slate-300 dark:text-slate-700 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">{folder.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{count} Docs</p>
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-700" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {folders.length === 0 && !showAddFolder && (
              <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
                <p className="text-slate-400 font-bold text-sm">Create custom folders to group your personal documents!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Folder Modal */}
      {showAddFolder && (
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
                onClick={() => setShowAddFolder(false)}
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

      {/* Add File Inside Active Folder Modal */}
      <AnimatePresence>
        {showCreateFileModal && activeFolderId && (
          <CreateFileModal
            folders={folders}
            defaultFolderId={activeFolderId}
            onSave={(file) => {
              onSaveFile(file);
              setShowCreateFileModal(false);
            }}
            onClose={() => setShowCreateFileModal(false)}
            language={language}
            themeColor={themeColor}
          />
        )}
      </AnimatePresence>

      {/* Delete Folder Confirmation Modal */}
      <AnimatePresence>
        {folderToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 text-center space-y-4"
            >
              <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle size={28} />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{t.confirmDeleteTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.confirmDeleteFolderMsg}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setFolderToDelete(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => confirmDeleteFolder(folderToDelete)}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  {t.confirmBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoldersView;
