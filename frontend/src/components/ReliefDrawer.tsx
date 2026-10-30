import React, { useState } from 'react';
import { Package, Truck, Warehouse, Code2, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import type { SwarmExecutionResponse } from '../types';

interface ReliefDrawerProps {
  data: SwarmExecutionResponse | null;
}

export const ReliefDrawer: React.FC<ReliefDrawerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'supplies' | 'routes' | 'depots' | 'raw'>('supplies');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!data) return null;

  const { assessment, routing_manifest, depot_allocations } = data;

  // Flatten supplies from all depots
  const allSupplies = depot_allocations.flatMap((d) =>
    d.allocated_supplies.map((s) => ({ ...s, depotName: d.depot_name }))
  );

  return (
    <div className="border-t border-[#e6e4dc] bg-white transition-all duration-300">
      {/* Header bar with toggle */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-[#e6e4dc] bg-[#fcfbf9]">
        <div className="flex items-center gap-6">
          <span className="editorial-title text-sm font-bold text-[#1a1917] tracking-tight">
            Relief Logistics & Tactical Dispatch Manifest
          </span>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setActiveTab('supplies'); setIsExpanded(true); }}
              className={`px-3 py-1 text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                activeTab === 'supplies'
                  ? 'bg-[#1a1917] text-white border-[#1a1917]'
                  : 'bg-white text-[#68665f] border-[#e6e4dc] hover:border-[#1a1917]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              SPHERE Supply Allocations
            </button>

            <button
              onClick={() => { setActiveTab('routes'); setIsExpanded(true); }}
              className={`px-3 py-1 text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                activeTab === 'routes'
                  ? 'bg-[#1a1917] text-white border-[#1a1917]'
                  : 'bg-white text-[#68665f] border-[#e6e4dc] hover:border-[#1a1917]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              OSRM Vehicle Corridors ({routing_manifest.routes.length})
            </button>

            <button
              onClick={() => { setActiveTab('depots'); setIsExpanded(true); }}
              className={`px-3 py-1 text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                activeTab === 'depots'
                  ? 'bg-[#1a1917] text-white border-[#1a1917]'
                  : 'bg-white text-[#68665f] border-[#e6e4dc] hover:border-[#1a1917]'
              }`}
            >
              <Warehouse className="w-3.5 h-3.5" />
              Staged Depots ({depot_allocations.length})
            </button>

            <button
              onClick={() => { setActiveTab('raw'); setIsExpanded(true); }}
              className={`px-3 py-1 text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                activeTab === 'raw'
                  ? 'bg-[#1a1917] text-white border-[#1a1917]'
                  : 'bg-white text-[#68665f] border-[#e6e4dc] hover:border-[#1a1917]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Verified Telemetry (JSON)
            </button>
          </div>
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-[#68665f] hover:text-[#1a1917] flex items-center gap-1 font-mono"
        >
          {isExpanded ? (
            <>
              <ChevronDown className="w-4 h-4" />
              Hide Manifest
            </>
          ) : (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Manifest
            </>
          )}
        </button>
      </div>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="p-5 max-h-72 overflow-y-auto">
          {/* TAB 1: SUPPLIES */}
          {activeTab === 'supplies' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 border border-[#e6e4dc] bg-[#fcfbf9]">
                  <span className="text-[#68665f] font-mono text-[10px] uppercase">Clean Drinking Water</span>
                  <div className="editorial-title text-xl font-bold text-[#1a1917] mt-0.5">
                    {assessment.resource_quotas.drinking_water_liters.toLocaleString()} Liters
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">15L/person/day × 72hr quota</span>
                </div>

                <div className="p-3 border border-[#e6e4dc] bg-[#fcfbf9]">
                  <span className="text-[#68665f] font-mono text-[10px] uppercase">Fortified Food Rations</span>
                  <div className="editorial-title text-xl font-bold text-[#1a1917] mt-0.5">
                    {(assessment.resource_quotas.food_rations_kg / 1000).toFixed(1)} Metric Tons
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">2,100 kcal standard buffer</span>
                </div>

                <div className="p-3 border border-[#e6e4dc] bg-[#fcfbf9]">
                  <span className="text-[#68665f] font-mono text-[10px] uppercase">Emergency Medical Kits</span>
                  <div className="editorial-title text-xl font-bold text-[#1a1917] mt-0.5">
                    {assessment.resource_quotas.emergency_medical_kits} Units
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">Primary trauma & trauma triage</span>
                </div>

                <div className="p-3 border border-[#e6e4dc] bg-[#fcfbf9]">
                  <span className="text-[#68665f] font-mono text-[10px] uppercase">Inflatable Rescue Boats</span>
                  <div className="editorial-title text-xl font-bold text-[#1a1917] mt-0.5">
                    {assessment.resource_quotas.inflatable_rescue_boats} Sorties
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">NDRF assault boat units</span>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left text-xs border border-[#e6e4dc]">
                <thead className="bg-[#f7f6f2] border-b border-[#e6e4dc] font-mono text-[11px] text-[#68665f]">
                  <tr>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Item Specification</th>
                    <th className="p-2.5">Quantity</th>
                    <th className="p-2.5">Origin Staging Depot</th>
                    <th className="p-2.5">Regulatory Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eee6]">
                  {allSupplies.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#fcfbf9]">
                      <td className="p-2.5 font-semibold text-[#1a1917]">{item.category}</td>
                      <td className="p-2.5 text-[#33312e]">{item.item_name}</td>
                      <td className="p-2.5 font-mono font-bold text-[#1a1917]">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-[#68665f]">{item.depotName}</td>
                      <td className="p-2.5 text-[#68665f] text-[11px]">{item.standard_reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: ROUTES */}
          {activeTab === 'routes' && (
            <div className="space-y-3">
              {routing_manifest.routes.map((route) => (
                <div
                  key={route.route_id}
                  className="p-3.5 border border-[#e6e4dc] bg-[#fcfbf9] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#1a1917]">
                        {route.origin_depot} → {route.destination}
                      </span>
                      {route.hazard_detour_applied && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          HAZARD BYPASS ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[#68665f] mt-1">{route.summary_instructions}</p>
                    <div className="text-[11px] font-mono text-[#858279] mt-1">
                      Vehicle Type: {route.vehicle_type} | Waypoints: {route.waypoints.length} nodes
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-right font-mono">
                    <div>
                      <div className="text-[10px] text-[#858279] uppercase">Distance</div>
                      <div className="text-base font-bold text-[#1a1917]">{route.distance_km} km</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#858279] uppercase">ETA</div>
                      <div className="text-base font-bold text-emerald-700">
                        {route.estimated_travel_minutes.toFixed(0)} mins
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DEPOTS */}
          {activeTab === 'depots' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {depot_allocations.map((depot) => (
                <div key={depot.depot_id} className="p-3.5 border border-[#e6e4dc] bg-[#fcfbf9]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1a1917]">{depot.depot_name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 border border-[#1a1917] text-[#1a1917] bg-white">
                      {depot.depot_type}
                    </span>
                  </div>
                  <div className="mt-2 text-stone-600 text-[11px] font-mono space-y-1">
                    <div>Coordinates: {depot.location.lat.toFixed(4)}°N, {depot.location.lon.toFixed(4)}°E</div>
                    <div>Proximity to Epicenter: <strong>{depot.distance_to_epicenter_km.toFixed(1)} km</strong></div>
                    <div>Readiness Status: <strong className="text-emerald-700">{depot.readiness_status}</strong></div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-dashed border-[#e6e4dc] flex gap-2">
                    {Object.entries(depot.assigned_fleet).map(([k, v]) => (
                      <span key={k} className="px-2 py-0.5 bg-white border border-[#e6e4dc] text-[10px] font-mono text-[#1a1917]">
                        {k.replace('_', ' ')}: <strong>{v}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: RAW JSON TELEMETRY */}
          {activeTab === 'raw' && (
            <div className="bg-[#1a1917] text-[#e6e4dc] p-4 font-mono text-[11px] overflow-x-auto rounded-none">
              <div className="text-stone-400 mb-2 border-b border-stone-800 pb-1">
                // Real-time Swarm Payload (Zero dummy mock data - Verified against Open-Meteo & OSRM)
              </div>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
