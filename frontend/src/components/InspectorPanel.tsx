import React, { useState } from 'react';
import {
  Cpu,
  Package,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Database,
  Truck,
  Warehouse,
  Zap
} from 'lucide-react';
import type { SwarmExecutionResponse, AgentReasoningStep } from '../types';

interface InspectorPanelProps {
  data: SwarmExecutionResponse | null;
  liveSteps: AgentReasoningStep[];
  threats: any[];
  activeThreatId: string;
  onSelectThreat: (threat: any) => void;
  isExecuting: boolean;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  data,
  liveSteps,
  threats,
  activeThreatId,
  onSelectThreat,
  isExecuting,
}) => {
  const [activeTab, setActiveTab] = useState<'agent' | 'manifest' | 'threats'>('agent');

  const stepsToDisplay = liveSteps.length > 0 ? liveSteps : (data?.reasoning_chain || []);

  return (
    <div className="h-full flex flex-col bg-white border-l border-stone-200">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-stone-200 px-4 bg-stone-50/70">
        <div className="flex items-center gap-1 -mb-px">
          <button
            onClick={() => setActiveTab('agent')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'agent'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-stone-700" />
            <span>Agent Reasoning</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 border border-stone-300 rounded-sm bg-white text-stone-600">
              {stepsToDisplay.length}/5
            </span>
          </button>

          <button
            onClick={() => setActiveTab('manifest')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'manifest'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-stone-700" />
            <span>Relief Manifest</span>
            {data && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 border border-stone-300 rounded-sm bg-white text-stone-600">
                {data.routing_manifest.total_vehicles_mobilized} Trucks
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('threats')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'threats'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Hazard Feeds</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 border border-stone-300 rounded-sm bg-white text-stone-600">
              {threats.length}
            </span>
          </button>
        </div>

        {data?.total_latency_ms && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            {data.total_latency_ms} ms
          </div>
        )}
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* ================= TAB 1: AGENT REASONING ================= */}
        {activeTab === 'agent' && (
          <div className="space-y-3.5">
            <div className="bg-stone-50 border border-stone-200 p-3 rounded-none">
              <h3 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider">
                Autonomous 5-Agent Pipeline
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Each agent autonomously queries real-time APIs, validates against official registries, and authorizes relief orders.
              </p>
            </div>

            {isExecuting && (
              <div className="p-4 bg-amber-50/80 border border-amber-200 text-xs font-mono text-amber-900 flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-600 animate-bounce shrink-0" />
                <span>Swarm committee executing across live APIs... Step {liveSteps.length} of 5</span>
              </div>
            )}

            {stepsToDisplay.map((step) => {
              const isOrchestrator = step.agent === 'SwarmOrchestrator';

              return (
                <div
                  key={step.step_number}
                  className={`border p-3.5 transition-all ${
                    isOrchestrator
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {/* Step header */}
                  <div className="flex items-center justify-between border-b pb-2 mb-2 border-stone-100/30">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 text-[11px] font-mono font-bold flex items-center justify-center ${
                          isOrchestrator ? 'bg-emerald-500 text-stone-900' : 'bg-stone-900 text-white'
                        }`}
                      >
                        {step.step_number}
                      </span>
                      <span className={`text-xs font-bold ${isOrchestrator ? 'text-white' : 'text-stone-900'}`}>
                        {step.agent}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 border ${
                        isOrchestrator ? 'border-stone-700 bg-stone-800 text-stone-300' : 'border-stone-200 bg-stone-50 text-stone-600'
                      }`}>
                        {step.phase}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10.5px] font-mono opacity-80">
                      <span>{step.execution_duration_ms}ms</span>
                      <span className={isOrchestrator ? 'text-emerald-300' : 'text-emerald-700'}>
                        {(step.confidence * 100).toFixed(0)}% conf
                      </span>
                    </div>
                  </div>

                  {/* Plain language explanation */}
                  <p className={`text-xs leading-relaxed ${isOrchestrator ? 'text-stone-200' : 'text-stone-700'}`}>
                    {step.action_taken}
                  </p>

                  {/* Tool invocation box */}
                  <div className={`mt-2.5 p-2 border text-[11px] font-mono ${
                    isOrchestrator
                      ? 'bg-stone-800/80 border-stone-700 text-stone-300'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}>
                    <div className="flex items-center gap-1 font-semibold text-[10.5px] opacity-75 uppercase tracking-wider mb-0.5">
                      <ChevronRight className="w-3 h-3" />
                      Tool: {step.tool_invoked}
                    </div>
                    <div className="mt-0.5 text-[11px] leading-snug">
                      {step.output_summary}
                    </div>
                  </div>

                  {/* Source Attribution Tag */}
                  <div className="mt-2.5 pt-2 border-t border-dashed border-stone-200/40 flex items-center justify-between text-[10px] font-mono">
                    <span className="flex items-center gap-1 opacity-75">
                      <Database className="w-3 h-3" />
                      Source: {step.source_attribution}
                    </span>
                    <span className={`flex items-center gap-0.5 font-semibold ${isOrchestrator ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= TAB 2: RELIEF MANIFEST ================= */}
        {activeTab === 'manifest' && data && (
          <div className="space-y-4">
            {/* SPHERE Standards Summary Cards */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-stone-700 mb-2">
                SPHERE Humanitarian Quotas (72-Hour Reserve)
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-stone-50 border border-stone-200">
                  <div className="text-[10px] font-mono text-stone-500 uppercase">Potable Clean Water</div>
                  <div className="editorial-title text-lg font-bold text-stone-900 mt-0.5">
                    {data.assessment.resource_quotas.drinking_water_liters.toLocaleString()} L
                  </div>
                  <div className="text-[10.5px] text-stone-600 font-mono mt-0.5">15L/person/day</div>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200">
                  <div className="text-[10px] font-mono text-stone-500 uppercase">Emergency Rations</div>
                  <div className="editorial-title text-lg font-bold text-stone-900 mt-0.5">
                    {(data.assessment.resource_quotas.food_rations_kg / 1000).toFixed(1)} MT
                  </div>
                  <div className="text-[10.5px] text-stone-600 font-mono mt-0.5">2,100 kcal energy base</div>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200">
                  <div className="text-[10px] font-mono text-stone-500 uppercase">Medical Trauma Kits</div>
                  <div className="editorial-title text-lg font-bold text-stone-900 mt-0.5">
                    {data.assessment.resource_quotas.emergency_medical_kits} Units
                  </div>
                  <div className="text-[10.5px] text-stone-600 font-mono mt-0.5">Primary clinic triage</div>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200">
                  <div className="text-[10px] font-mono text-stone-500 uppercase">Rescue Boat Sorties</div>
                  <div className="editorial-title text-lg font-bold text-stone-900 mt-0.5">
                    {data.assessment.resource_quotas.inflatable_rescue_boats} Boats
                  </div>
                  <div className="text-[10.5px] text-stone-600 font-mono mt-0.5">Motorized assault craft</div>
                </div>
              </div>
            </div>

            {/* Staged Depots */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-stone-700 mb-2">
                Staged Official Depots ({data.depot_allocations.length})
              </div>
              <div className="space-y-2">
                {data.depot_allocations.map((depot) => {
                  const isNdrf = depot.depot_type === 'NDRF_BATTALION';
                  return (
                    <div key={depot.depot_id} className="p-3 bg-white border border-stone-200 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                          {isNdrf ? <Warehouse className="w-3.5 h-3.5 text-emerald-700" /> : <Warehouse className="w-3.5 h-3.5 text-sky-700" />}
                          {depot.depot_name}
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 border ${
                          isNdrf ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-sky-300 bg-sky-50 text-sky-800'
                        }`}>
                          {depot.depot_type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] font-mono text-stone-600">
                        <span>Distance: {depot.distance_to_epicenter_km.toFixed(1)} km</span>
                        <span className="text-emerald-700 font-medium">Status: {depot.readiness_status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* OSRM Transit Routes */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-stone-700 mb-2">
                OSRM Driving Corridors ({data.routing_manifest.routes.length})
              </div>
              <div className="space-y-2">
                {data.routing_manifest.routes.map((route) => (
                  <div key={route.route_id} className="p-3 bg-stone-50 border border-stone-200 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-stone-700" />
                        {route.origin_depot} → {route.destination}
                      </div>
                      <div className="font-mono text-xs font-bold text-stone-900">
                        {route.distance_km} km ({route.estimated_travel_minutes.toFixed(0)} min)
                      </div>
                    </div>
                    {route.hazard_detour_applied && (
                      <div className="mt-1 text-[10.5px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 border border-amber-200 inline-block">
                        ⚠️ Hazard perimeter bypass detour applied
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: HAZARD FEEDS ================= */}
        {activeTab === 'threats' && (
          <div className="space-y-3">
            <div className="bg-stone-50 border border-stone-200 p-3 rounded-none">
              <h3 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider">
                Live Disaster Ingestion Feed
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Click any hazard to instantly mobilize the 5-agent swarm on that sector.
              </p>
            </div>

            {threats.map((t) => {
              const isSelected = activeThreatId === t.id;
              const isCrit = t.severity === 'critical';

              return (
                <div
                  key={t.id}
                  onClick={() => onSelectThreat(t)}
                  className={`p-3.5 border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.2 border ${
                        isSelected
                          ? 'border-red-400 bg-red-950/60 text-red-200'
                          : isCrit
                          ? 'border-red-300 bg-red-50 text-red-800'
                          : 'border-stone-300 bg-stone-100 text-stone-700'
                      }`}
                    >
                      {t.severity}
                    </span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>
                      {t.id}
                    </span>
                  </div>

                  <h4 className={`text-xs font-bold leading-snug ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {t.title}
                  </h4>

                  <p className={`text-[11px] mt-1 ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                    {t.location?.label || `${t.location?.lat?.toFixed(3)}°N, ${t.location?.lon?.toFixed(3)}°E`}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[10.5px] font-mono opacity-80 border-t pt-1.5 border-dashed border-stone-200/30">
                    {t.wind_speed_kmh && <span>{t.wind_speed_kmh} km/h wind</span>}
                    {t.rainfall_mm_24h && <span>{t.rainfall_mm_24h} mm rain</span>}
                    {t.temperature_c && <span>{t.temperature_c}°C</span>}
                    <span>Radius: {t.radius_km || 60}km</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
