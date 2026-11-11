import React, { useState } from 'react';
import { FileItem, Language, ThemeColor } from '../types';
import { translations } from '../i18n';
import { getThemeClasses } from '../theme';
import { ArrowLeft, Copy, Check, Trash2, Star, Eye, EyeOff, FileText, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultViewProps {
  item: FileItem;
  onBack: () => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  language: Language;
  maskSensitiveData?: boolean;
  themeColor?: ThemeColor;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  item, onBack, onDelete, onToggleStar, language, maskSensitiveData = false, themeColor = 'indigo' 
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [revealed, setRevealed] = useState(!maskSensitiveData);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const t = translations[language];
  const theme = getThemeClasses(themeColor as ThemeColor);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    const allText = `${item.title}\n` + (item.note ? `${item.note}\n\n` : '\n') + item.fields.map(f => `${f.label}: ${f.value}`).join('\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 pb-28 text-slate-900 dark:text-slate-100 ${language === 'ar' ? 'rtl font-arabic' : 'ltr'}`}>
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-2 max-w-[50%]">
          <FileText size={18} className={theme.textPrimary} />
          <h2 className="text-base font-bold truncate">{item.title}</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleStar(item.id)}
            className={`p-2 rounded-2xl transition-all ${
              item.starred ? 'bg-amber-50 text-amber-500 dark:bg-amber-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Star size={22} className={item.starred ? 'fill-amber-400' : ''} />
          </button>
          <button onClick={() => setShowConfirmDelete(true)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-2xl transition-colors">
            <Trash2 size={22} />
          </button>
        </div>
      </div>

      <div className="p-5 max-w-xl mx-auto space-y-6">
        {/* Preview Images Gallery if attached */}
        {((item.images && item.images.length > 0) || item.image) && (
          <div className="space-y-3">
            {(() => {
              const allImages = item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : []);
              const [selectedImgIdx, setSelectedImgIdx] = useState(0);

              return (
                <div className="space-y-3">
                  <div className="w-full aspect-[4/3] bg-slate-900 rounded-3xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 relative group">
                    <img src={allImages[selectedImgIdx] || allImages[0]} className="w-full h-full object-contain" alt="Attached Document Scan" />
                    <button
                      onClick={() => setRevealed(!revealed)}
                      className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border border-white/20 shadow-lg"
                    >
                      {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                      {revealed ? 'Hide Data' : 'Reveal Data'}
                    </button>
                    {allImages.length > 1 && (
                      <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold">
                        {selectedImgIdx + 1} / {allImages.length}
                      </span>
                    )}
                  </div>

                  {/* Thumbnails strip for multiple images */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                      {allImages.map((imgSrc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImgIdx(idx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                            selectedImgIdx === idx ? 'border-amber-500 dark:border-amber-400 scale-105 shadow-md' : 'border-slate-200 dark:border-slate-800 opacity-70'
                          }`}
                        >
                          <img src={imgSrc} className="w-full h-full object-cover" alt={`Thumb ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Quick Copy All Action */}
        <button
          onClick={copyAll}
          className={`w-full h-13 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm shadow-md transition-all ${
            copiedAll ? 'bg-emerald-600 text-white' : `${theme.bgPrimary} text-white shadow-indigo-200 dark:shadow-none`
          }`}
        >
          {copiedAll ? <Check size={18} /> : <Copy size={18} />}
          {copiedAll ? t.copied : t.copyAll}
        </button>

        {/* Note / Description */}
        {item.note && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <p className={`text-xs font-black ${theme.textPrimary} uppercase tracking-widest mb-1`}>{t.noteLabel}</p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{item.note}</p>
          </motion.div>
        )}

        {/* Custom Key-Value Fields */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.fields}</h3>
            <span className="text-[10px] font-bold text-slate-400">{item.fields.length} Items</span>
          </div>

          {item.fields.map((field, idx) => {
            const isMasked = !revealed && (maskSensitiveData || field.isSensitive);
            const displayValue = isMasked ? '•••• •••• ••••' : field.value;

            return (
              <motion.div
                key={field.id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => copyToClipboard(field.value, idx)}
                className="bg-white dark:bg-slate-900 p-4 px-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer active:bg-slate-50 dark:active:bg-slate-800 transition-all group"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{field.label || 'Field'}</p>
                  <p className={`font-bold text-slate-900 dark:text-white text-sm truncate ${isMasked ? 'tracking-widest text-slate-400 select-none' : ''}`}>
                    {displayValue || '—'}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(field.value, idx);
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    copiedIndex === idx ? 'bg-emerald-500 text-white' : `bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:${theme.bgSubtle} group-hover:${theme.textPrimary}`
                  }`}
                >
                  {copiedIndex === idx ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
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
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.confirmDeleteMsg}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    setShowConfirmDelete(false);
                    onDelete(item.id);
                  }}
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

export default ResultView;
