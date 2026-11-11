// Source: Google Maps Platform Code Assist
import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { FileItem, Language, ThemeColor } from '../types';
import { translations } from '../i18n';
import { getThemeClasses } from '../theme';
import { MapPin, Navigation, FileText, ChevronRight } from 'lucide-react';

interface MapViewProps {
  files: FileItem[];
  onSelectFile: (file: FileItem) => void;
  language: Language;
  themeColor?: ThemeColor;
}

// Sample document locations (Algiers, Oran, Constantine, Paris, etc.)
const sampleLocations = [
  { id: 'loc-1', fileId: 'sample-1', title: "Carte Nationale d'Identité", lat: 36.7538, lng: 3.0588, city: 'Algiers, Algeria' },
  { id: 'loc-2', fileId: 'sample-2', title: "Passeport Biométrique", lat: 35.6976, lng: -0.6337, city: 'Oran, Algeria' },
  { id: 'loc-3', fileId: 'sample-3', title: "Permis de Conduire", lat: 36.3650, lng: 6.6147, city: 'Constantine, Algeria' },
];

const MapView: React.FC<MapViewProps> = ({ files, onSelectFile, language, themeColor = 'amber' }) => {
  const [selectedPin, setSelectedPin] = useState<typeof sampleLocations[0] | null>(null);
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const theme = getThemeClasses(themeColor as ThemeColor);
  const t = translations[language];

  const defaultCenter = { lat: 36.7538, lng: 3.0588 }; // Algiers Center

  return (
    <div className={`space-y-4 max-w-xl mx-auto ${language === 'ar' ? 'rtl font-arabic' : 'ltr'}`}>
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MapPin size={24} className={theme.textPrimary} />
            Document Map Locations
          </h2>
          <p className="text-slate-400 text-xs font-medium">Interactive geolocation pins for your vault files</p>
        </div>
      </div>

      {/* Map Container - Height specified for CF2 compliance */}
      <div className="w-full h-[440px] bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md relative">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={6}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="w-full h-full"
          >
            {sampleLocations.map(loc => {
              const fileMatch = files.find(f => f.id === loc.fileId);

              return (
                <AdvancedMarker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  onClick={() => setSelectedPin(loc)}
                >
                  <Pin
                    background={themeColor === 'amber' ? '#D97706' : '#4F46E5'}
                    glyphColor="#FFFFFF"
                    borderColor="#FFFFFF"
                  />
                </AdvancedMarker>
              );
            })}

            {selectedPin && (
              <InfoWindow
                position={{ lat: selectedPin.lat, lng: selectedPin.lng }}
                onCloseClick={() => setSelectedPin(null)}
              >
                <div className="p-2 max-w-[200px]">
                  <h4 className="font-bold text-slate-900 text-xs truncate mb-1">{selectedPin.title}</h4>
                  <p className="text-[10px] text-slate-500 mb-2">{selectedPin.city}</p>
                  <button
                    onClick={() => {
                      const matched = files.find(f => f.id === selectedPin.fileId);
                      if (matched) onSelectFile(matched);
                    }}
                    className={`w-full py-1.5 px-3 ${theme.bgPrimary} text-white font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 shadow-sm`}
                  >
                    <FileText size={12} />
                    Open File
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* List of Pinned Locations */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase px-1">Pinned Document Locations</h3>
        <div className="space-y-2">
          {sampleLocations.map(loc => {
            const matchedFile = files.find(f => f.id === loc.fileId);

            return (
              <div
                key={loc.id}
                onClick={() => matchedFile && onSelectFile(matchedFile)}
                className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${theme.bgSubtle} ${theme.textPrimary} rounded-xl flex items-center justify-center shrink-0`}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{loc.title}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{loc.city}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapView;
