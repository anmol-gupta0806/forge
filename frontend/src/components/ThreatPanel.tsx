import React from 'react';
import { Wind, Droplets, Thermometer, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { ThreatReport } from '../types';

interface ThreatPanelProps {
  threats: any[];
  activeThreat: ThreatReport | null;
  onSelectThreat: (threat: any) => void;
  isExecuting: boolean;
}

export const ThreatPanel: React.FC<ThreatPanelProps> = ({
  threats,
  activeThreat,
  onSelectThreat,
  isExecuting,
}) => {
  return (
    <div className="h-full flex flex-col bg-[#fcfbf9] border-r border-[#e6e4dc]">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#e6e4dc]">
        <div className="flex items-center justify-between">
          <h2 className="editorial-title text-base font-bold text-[#1a1917] tracking-tight">
            Active Hazard Feeds
          </h2>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border border-[#e6e4dc] bg-white text-[#68665f]">
            {threats.length} Monitored
          </span>
        </div>
        <p className="text-xs text-[#68665f] mt-1">
          Ingested in real time from GDACS GeoRSS, IMD Bulletins, and Open-Meteo.
        </p>
      </div>

      {/* Threat List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#e6e4dc]">
        {threats.map((t) => {
          const isSelected = activeThreat?.id === t.id;
          const isCrit = t.severity === 'critical';
          const isHigh = t.severity === 'high';

          return (
            <div
              key={t.id}
              onClick={() => onSelectThreat(t)}
              className={`p-4 cursor-pointer transition-colors ${
                isSelected ? 'bg-white border-l-3 border-l-[#1a1917] shadow-xs' : 'hover:bg-white/60'
              }`}
            >
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 tracking-wider border ${
                    isCrit
                      ? 'bg-red-50 text-red-700 border-red-300'
                      : isHigh
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-stone-50 text-stone-700 border-stone-300'
                  }`}
                >
                  {t.severity} SEVERITY
                </span>
                <span className="text-[10px] font-mono text-[#858279]">{t.id}</span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-xs text-[#1a1917] leading-snug">
                {t.title}
              </h3>

              {/* Location */}
              <p className="text-[11px] text-[#68665f] mt-1">
                {t.location?.label || `${t.location?.lat?.toFixed(3)}°N, ${t.location?.lon?.toFixed(3)}°E`}
              </p>

              {/* Telemetry Chips */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-dashed border-[#e6e4dc] text-[11px] font-mono text-[#4a4843]">
                {t.wind_speed_kmh && (
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3 h-3 text-stone-500" />
                    <span>{t.wind_speed_kmh} km/h wind</span>
                  </div>
                )}
                {t.rainfall_mm_24h && (
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span>{t.rainfall_mm_24h} mm/24h</span>
                  </div>
                )}
                {t.temperature_c && (
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3 h-3 text-amber-500" />
                    <span>{t.temperature_c}°C surface</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-stone-500">
                  <span>Radius: {t.radius_km || 50} km</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={isExecuting}
                className={`mt-3 w-full py-1.5 px-3 text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                  isSelected
                    ? 'bg-[#1a1917] text-white border-[#1a1917]'
                    : 'bg-white text-[#1a1917] border-[#e6e4dc] hover:border-[#1a1917]'
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Swarm Active on This Sector
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-stone-700" />
                    Mobilize Swarm Execution
                  </>
                )}
              </button>

              <div className="mt-2 text-[10px] text-[#858279] flex items-center justify-between font-mono">
                <span>Source: {t.source}</span>
                <span className="text-emerald-700 font-semibold">VERIFIED API ✓</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
