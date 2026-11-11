import { ThemeColor } from './types';

export interface ThemeStyles {
  bgPrimary: string;
  textPrimary: string;
  bgSubtle: string;
  borderSubtle: string;
  borderHover: string;
  cardBg: string;
  shadow: string;
  ring: string;
  glowBg: string;
  gradientStops: { start: string; end: string };
}

export const getThemeClasses = (color: ThemeColor = 'indigo'): ThemeStyles => {
  switch (color) {
    case 'emerald':
      return {
        bgPrimary: 'bg-emerald-600 hover:bg-emerald-700',
        textPrimary: 'text-emerald-600 dark:text-emerald-400',
        bgSubtle: 'bg-emerald-50 dark:bg-emerald-950/80',
        borderSubtle: 'border-emerald-100 dark:border-emerald-900/50',
        borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-700',
        cardBg: 'bg-white dark:bg-slate-900',
        shadow: 'shadow-emerald-200/50 dark:shadow-none',
        ring: 'focus:ring-emerald-500/20',
        glowBg: 'bg-emerald-500/30',
        gradientStops: { start: '#059669', end: '#0D9488' },
      };
    case 'blue':
      return {
        bgPrimary: 'bg-blue-600 hover:bg-blue-700',
        textPrimary: 'text-blue-600 dark:text-blue-400',
        bgSubtle: 'bg-blue-50 dark:bg-blue-950/80',
        borderSubtle: 'border-blue-100 dark:border-blue-900/50',
        borderHover: 'hover:border-blue-300 dark:hover:border-blue-700',
        cardBg: 'bg-white dark:bg-slate-900',
        shadow: 'shadow-blue-200/50 dark:shadow-none',
        ring: 'focus:ring-blue-500/20',
        glowBg: 'bg-blue-500/30',
        gradientStops: { start: '#2563EB', end: '#0284C7' },
      };
    case 'purple':
      return {
        bgPrimary: 'bg-purple-600 hover:bg-purple-700',
        textPrimary: 'text-purple-600 dark:text-purple-400',
        bgSubtle: 'bg-purple-50 dark:bg-purple-950/80',
        borderSubtle: 'border-purple-100 dark:border-purple-900/50',
        borderHover: 'hover:border-purple-300 dark:hover:border-purple-700',
        cardBg: 'bg-white dark:bg-slate-900',
        shadow: 'shadow-purple-200/50 dark:shadow-none',
        ring: 'focus:ring-purple-500/20',
        glowBg: 'bg-purple-500/30',
        gradientStops: { start: '#9333EA', end: '#C026D3' },
      };
    case 'rose':
      return {
        bgPrimary: 'bg-rose-600 hover:bg-rose-700',
        textPrimary: 'text-rose-600 dark:text-rose-400',
        bgSubtle: 'bg-rose-50 dark:bg-rose-950/80',
        borderSubtle: 'border-rose-100 dark:border-rose-900/50',
        borderHover: 'hover:border-rose-300 dark:hover:border-rose-700',
        cardBg: 'bg-white dark:bg-slate-900',
        shadow: 'shadow-rose-200/50 dark:shadow-none',
        ring: 'focus:ring-rose-500/20',
        glowBg: 'bg-rose-500/30',
        gradientStops: { start: '#E11D48', end: '#DB2777' },
      };
    case 'amber':
      return {
        bgPrimary: 'bg-amber-500 hover:bg-amber-600',
        textPrimary: 'text-amber-600 dark:text-amber-400',
        bgSubtle: 'bg-amber-50 dark:bg-amber-950/80',
        borderSubtle: 'border-amber-100 dark:border-amber-900/50',
        borderHover: 'hover:border-amber-300 dark:hover:border-amber-700',
        cardBg: 'bg-white dark:bg-slate-900',
        shadow: 'shadow-amber-200/50 dark:shadow-none',
        ring: 'focus:ring-amber-500/20',
        glowBg: 'bg-amber-500/30',
        gradientStops: { start: '#D97706', end: '#EA580C' },
      };
    default: // indigo
      return {
        bgPrimary: 'bg-indigo-600 hover:bg-indigo-700',
        textPrimary: 'text-indigo-600 dark:text-indigo-400',
        bgSubtle: 'bg-indigo-50 dark:bg-indigo-950/80',
        borderSubtle: 'border-indigo-100 dark:border-indigo-900/50',
        borderHover: 'hover:border-indigo-300 dark:hover:border-indigo-700',
        cardBg: 'bg-white dark:bg-slate-900',
        shadow: 'shadow-indigo-200/50 dark:shadow-none',
        ring: 'focus:ring-indigo-500/20',
        glowBg: 'bg-indigo-500/30',
        gradientStops: { start: '#4F46E5', end: '#7C3AED' },
      };
  }
};
