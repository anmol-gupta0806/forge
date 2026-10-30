import React from 'react';
import { Users, Truck, Warehouse, Clock, AlertTriangle } from 'lucide-react';
import type { SwarmExecutionResponse } from '../types';

interface StatsBarProps {
  data: SwarmExecutionResponse | null;
  isExecuting?: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ data }) => {
  if (!data) return null;

  const { assessment, routing_manifest, depot_allocations, total_latency_ms } = data;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 border-b border-[#e6e4dc] bg-white divide-x divide-[#e6e4dc]">
      {/* Metric 1 */}
      <div className="p-3.5 px-5">
        <div className="flex items-center gap-2 text-xs text-[#68665f] uppercase tracking-wider font-mono">
          <Users className="w-3.5 h-3.5 text-stone-600" />
          <span>Exposed Population</span>
        </div>
        <div className="editorial-title text-2xl font-bold text-[#1a1917] mt-1">
          {assessment.affected_population.toLocaleString()}
        </div>
        <p className="text-[11px] text-[#858279] mt-0.5">
          Across {assessment.vulnerable_districts.length} vulnerable census districts
        </p>
      </div>

      {/* Metric 2 */}
      <div className="p-3.5 px-5">
        <div className="flex items-center gap-2 text-xs text-[#68665f] uppercase tracking-wider font-mono">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Target Evacuees</span>
        </div>
        <div className="editorial-title text-2xl font-bold text-[#1a1917] mt-1">
          {assessment.displaced_estimate.toLocaleString()}
        </div>
        <p className="text-[11px] text-[#858279] mt-0.5">
          Priority relief shelters & medical aid
        </p>
      </div>

      {/* Metric 3 */}
      <div className="p-3.5 px-5">
        <div className="flex items-center gap-2 text-xs text-[#68665f] uppercase tracking-wider font-mono">
          <Warehouse className="w-3.5 h-3.5 text-blue-600" />
          <span>Staged Depots</span>
        </div>
        <div className="editorial-title text-2xl font-bold text-[#1a1917] mt-1">
          {depot_allocations.length} Hubs
        </div>
        <p className="text-[11px] text-[#858279] mt-0.5">
          FCI grain reserves & NDRF bases
        </p>
      </div>

      {/* Metric 4 */}
      <div className="p-3.5 px-5">
        <div className="flex items-center gap-2 text-xs text-[#68665f] uppercase tracking-wider font-mono">
          <Truck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tactical Fleet</span>
        </div>
        <div className="editorial-title text-2xl font-bold text-[#1a1917] mt-1">
          {routing_manifest.total_vehicles_mobilized} Units
        </div>
        <p className="text-[11px] text-[#858279] mt-0.5">
          {routing_manifest.total_travel_distance_km.toFixed(0)} km highway transit network
        </p>
      </div>

      {/* Metric 5 */}
      <div className="p-3.5 px-5 col-span-2 md:col-span-1">
        <div className="flex items-center gap-2 text-xs text-[#68665f] uppercase tracking-wider font-mono">
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          <span>Swarm Latency</span>
        </div>
        <div className="editorial-title text-2xl font-bold text-[#1a1917] mt-1 flex items-baseline gap-1.5">
          <span>{total_latency_ms}</span>
          <span className="text-xs font-mono text-[#858279] font-normal">ms</span>
        </div>
        <p className="text-[11px] text-emerald-700 font-mono mt-0.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Autonomous decision pipeline
        </p>
      </div>
    </div>
  );
};
