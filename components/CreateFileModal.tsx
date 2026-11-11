import React, { useState, useRef } from 'react';
import { Folder, Language, FileField, FileItem, ThemeColor } from '../types';
import { translations } from '../i18n';
import { getThemeClasses } from '../theme';
import { X, Plus, Trash2, Camera, Image as ImageIcon, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreateFileModalProps {
  folders: Folder[];
  onSave: (newItem: FileItem) => void;
  onClose: () => void;
  language: Language;
  themeColor?: ThemeColor;
}

const CreateFileModal: React.FC<CreateFileModalProps> = ({ folders, onSave, onClose, language, themeColor = 'indigo' }) => {
  const t = translations[language];
  const theme = getThemeClasses(themeColor as ThemeColor);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [folderId, setFolderId] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);
  
  const [fields, setFields] = useState<FileField[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFieldRow = () => {
    setFields(prev => [
      ...prev, 
      { id: Date.now().toString(), label: '', value: '' }
    ]);
  };

  const updateField = (id: string, key: 'label' | 'value', text: string) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, [key]: text } : f));
  };

  const removeField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const validFields = fields.filter(f => f.label.trim() || f.value.trim());

    const newItem: FileItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      title: title.trim(),
      note: note.trim() || undefined,
      folderId,
      image,
      fields: validFields,
      starred: false,
    };

    onSave(newItem);
  };

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6 ${language === 'ar' ? 'rtl font-arabic' : 'ltr'}`}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-t-[36px] sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto border-t border-slate-100 dark:border-slate-800 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.addFileBtn}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t.attachImage}</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
            {image ? (
              <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={image} className="w-full h-full object-contain" alt="Attached Scan" />
                <button
                  type="button"
                  onClick={() => setImage(undefined)}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-xl shadow-md"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:${theme.borderSubtle} rounded-2xl flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:${theme.textPrimary} transition-all bg-slate-50 dark:bg-slate-800/50`}
              >
                <div className="flex gap-3 mb-2">
                  <ImageIcon size={24} />
                  <Camera size={24} />
                </div>
                <span className="text-xs font-bold">{t.importFileBtn}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t.fileTitle}</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document Title"
              className={`w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white focus:outline-none ${theme.ring}`}
            />
          </div>

          {/* Folder Selection */}
          {folders.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t.foldersTitle}</label>
              <select
                value={folderId || ''}
                onChange={(e) => setFolderId(e.target.value || undefined)}
                className={`w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white focus:outline-none ${theme.ring}`}
              >
                <option value="">No Folder (General)</option>
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Manual Dynamic Fields Builder */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-slate-400 uppercase">{t.fields}</label>
              <button
                type="button"
                onClick={addFieldRow}
                className={`text-xs font-bold ${theme.textPrimary} flex items-center gap-1 hover:underline`}
              >
                <Plus size={16} />
                {t.addField}
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((f, idx) => (
                <div key={f.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={f.label}
                    onChange={(e) => updateField(f.id, 'label', e.target.value)}
                    placeholder={t.fieldLabel}
                    className="flex-1 h-11 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={f.value}
                    onChange={(e) => updateField(f.id, 'value', e.target.value)}
                    placeholder={t.fieldValue}
                    className="flex-1 h-11 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(f.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-13 rounded-2xl font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className={`flex-1 h-13 rounded-2xl font-bold text-white ${theme.bgPrimary} shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2`}
            >
              <Check size={20} />
              {t.save}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateFileModal;
