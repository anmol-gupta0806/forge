import React from 'react';
import { Users, Truck, ShieldCheck } from 'lucide-react';
import type { SwarmExecutionResponse } from '../types';

interface StatsBarProps {
  data: SwarmExecutionResponse | null;
  isExecuting?: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ data }) => {
  if (!data) return null;

  const { threat, assessment, routing_manifest, depot_allocations } = data;
  const isCritical = threat.severity === 'critical';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-stone-200 bg-white divide-x divide-stone-200">
      {/* 1. Epicenter Sector */}
      <div className="p-3.5 px-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
            Active Hazard Sector
          </span>
          <span
            className={`text-[10px] font-mono uppercase px-1.5 py-0.2 border ${
              isCritical
                ? 'border-red-300 bg-red-50 text-red-800'
                : 'border-amber-300 bg-amber-50 text-amber-800'
            }`}
          >
            {threat.severity}
          </span>
        </div>
        <div className="editorial-title text-lg font-bold text-stone-900 mt-1 truncate">
          {threat.location.label || threat.title}
        </div>
        <p className="text-[11px] text-stone-500 mt-0.5 font-mono">
          Radius: {threat.radius_km} km | Source: {threat.source.split(' ')[0]}
        </p>
      </div>

      {/* 2. Population Exposure */}
      <div className="p-3.5 px-6">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
          <Users className="w-3.5 h-3.5 text-stone-600" />
          <span>Exposed Civilians</span>
        </div>
        <div className="editorial-title text-xl font-bold text-stone-900 mt-1">
          {assessment.affected_population.toLocaleString()}
        </div>
        <p className="text-[11px] text-stone-500 mt-0.5">
          {assessment.displaced_estimate.toLocaleString()} target evacuees to shelter
        </p>
      </div>

      {/* 3. SPHERE Supply Allocation */}
      <div className="p-3.5 px-6">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>SPHERE 72h Relief Quota</span>
        </div>
        <div className="editorial-title text-xl font-bold text-stone-900 mt-1">
          {(assessment.resource_quotas.drinking_water_liters / 1000).toFixed(0)}k L / {(assessment.resource_quotas.food_rations_kg / 1000).toFixed(1)} MT
        </div>
        <p className="text-[11px] text-stone-500 mt-0.5">
          Clean water & fortified food rations
        </p>
      </div>

      {/* 4. Fleet & Depots Mobilized */}
      <div className="p-3.5 px-6">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
          <Truck className="w-3.5 h-3.5 text-blue-700" />
          <span>Mobilized Swarm Fleet</span>
        </div>
        <div className="editorial-title text-xl font-bold text-stone-900 mt-1 flex items-baseline gap-1.5">
          <span>{routing_manifest.total_vehicles_mobilized} Units</span>
          <span className="text-xs font-mono text-stone-500 font-normal">
            ({depot_allocations.length} Hubs)
          </span>
        </div>
        <p className="text-[11px] text-stone-500 mt-0.5">
          {routing_manifest.total_travel_distance_km.toFixed(0)} km total road corridors
        </p>
      </div>
    </div>
  );
};
