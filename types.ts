export enum AppState {
  SPLASH = 'SPLASH',
  HOME = 'HOME',
  CREATE = 'CREATE',
  RESULT = 'RESULT',
  STARRED = 'STARRED',
  FOLDERS = 'FOLDERS',
  SETTINGS = 'SETTINGS',
}

export type Language = 'en' | 'fr' | 'ar';

export type ThemeColor = 'indigo' | 'emerald' | 'blue' | 'purple' | 'rose' | 'amber';

export interface FileField {
  id: string;
  label: string;
  value: string;
  isSensitive?: boolean;
}

export interface FileItem {
  id: string;
  timestamp: number;
  title: string;
  note?: string;
  fields: FileField[];
  image?: string; // Base64 or Image URL
  images?: string[]; // Multiple attached images or document scans
  folderId?: string;
  starred?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
}

export interface SecuritySettings {
  enabled: boolean;
  pin: string;
  maskSensitiveData: boolean;
}

export interface AppConfig {
  themeColor: ThemeColor;
  darkMode: boolean;
  customIconUrl?: string;
  logoStyle: 's_modern' | 's_badge' | 's_shield' | 'custom';
}
