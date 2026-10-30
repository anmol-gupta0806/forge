import React from 'react';
import { Wind, Waves, Sun, Compass } from 'lucide-react';

interface NavbarProps {
  onSelectScenario: (scenarioId: string, label: string) => void;
  activeScenarioId: string;
  isExecuting: boolean;
  onLiveTrigger: () => void;
  wsConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectScenario,
  activeScenarioId,
  isExecuting,
  onLiveTrigger,
  wsConnected = true
}) => {
  return (
    <header className="border-b border-[#e6e4dc] bg-[#fcfbf9] px-6 py-3.5 sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Editorial Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-none border border-[#1a1917] bg-[#1a1917] text-[#fcfbf9] flex items-center justify-center font-bold text-sm">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="editorial-title text-xl font-bold tracking-tight text-[#1a1917]">
                SENTINEL
              </span>
              <span className="text-[11px] font-mono tracking-wider uppercase px-2 py-0.5 border border-[#1a1917]/20 text-[#1a1917]/80 rounded-none bg-stone-100">
                Disaster Swarm v2.0
              </span>
            </div>
            <p className="text-xs text-[#68665f] tracking-wide">
              Autonomous Climate Intelligence & Emergency Supply Chain Execution
            </p>
          </div>
        </div>

        {/* Upstream Status Pill */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-[#68665f]">
          <span className="flex items-center gap-1.5 font-mono">
            <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`}></span>
            {wsConnected ? 'LIVE STREAM CONNECTED' : 'REST POLLING READY'}
          </span>
          <span className="text-stone-300">|</span>
          <span className="font-mono text-[11px] text-[#78756d]">
            APIs: Open-Meteo · OSRM · Census 2011 · GDACS
          </span>
        </div>

        {/* Scenario Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] uppercase tracking-wider font-mono text-[#68665f] mr-1">
            Scenarios:
          </span>
          <button
            onClick={() => onSelectScenario('THREAT-OD-CYCLONE-01', 'Puri Coastal Belt, Odisha')}
            disabled={isExecuting}
            className={`px-2.5 py-1 text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              activeScenarioId === 'THREAT-OD-CYCLONE-01'
                ? 'bg-[#1a1917] text-[#fcfbf9] border-[#1a1917]'
                : 'bg-white text-[#1a1917] border-[#e6e4dc] hover:border-[#1a1917]'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-red-600" />
            Odisha Cyclone
          </button>
          
          <button
            onClick={() => onSelectScenario('THREAT-BR-FLOOD-02', 'Saharsa Embankment, Bihar')}
            disabled={isExecuting}
            className={`px-2.5 py-1 text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              activeScenarioId === 'THREAT-BR-FLOOD-02'
                ? 'bg-[#1a1917] text-[#fcfbf9] border-[#1a1917]'
                : 'bg-white text-[#1a1917] border-[#e6e4dc] hover:border-[#1a1917]'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-blue-600" />
            Bihar Flood
          </button>

          <button
            onClick={() => onSelectScenario('THREAT-RJ-HEATWAVE-03', 'Barmer Desert Sector, Rajasthan')}
            disabled={isExecuting}
            className={`px-2.5 py-1 text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              activeScenarioId === 'THREAT-RJ-HEATWAVE-03'
                ? 'bg-[#1a1917] text-[#fcfbf9] border-[#1a1917]'
                : 'bg-white text-[#1a1917] border-[#e6e4dc] hover:border-[#1a1917]'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            Thar Heatwave
          </button>

          <button
            onClick={onLiveTrigger}
            disabled={isExecuting}
            className="px-2.5 py-1 text-xs font-medium border border-stone-800 bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors flex items-center gap-1.5 ml-1"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            Live Met Scan
          </button>
        </div>
      </div>
    </header>
  );
};
