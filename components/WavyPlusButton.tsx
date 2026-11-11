import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { getThemeClasses } from '../theme';
import { ThemeColor } from '../types';

interface WavyPlusButtonProps {
  onClick: () => void;
  themeColor?: ThemeColor;
}

const WavyPlusButton: React.FC<WavyPlusButtonProps> = ({ onClick, themeColor = 'amber' }) => {
  const theme = getThemeClasses(themeColor as ThemeColor);

  return (
    <div className="relative -top-7 group shrink-0">
      {/* Clean Solid Circular Button with Plus Icon */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onClick}
        className={`w-16 h-16 ${theme.bgPrimary} rounded-full text-white flex items-center justify-center shadow-xl border-4 border-slate-50 dark:border-slate-950 relative z-10 cursor-pointer`}
      >
        <Plus size={32} strokeWidth={2.8} />
      </motion.button>
    </div>
  );
};

export default WavyPlusButton;
