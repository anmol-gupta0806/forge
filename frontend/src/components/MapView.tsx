import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { SwarmExecutionResponse } from '../types';

interface MapViewProps {
  data: SwarmExecutionResponse | null;
}

export const MapView: React.FC<MapViewProps> = ({ data }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20.2961, 85.8245],
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
    });

    // Minimalist Editorial Tiles: CartoDB Positron
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers when Swarm data updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup || !data) return;

    layerGroup.clearLayers();

    const { threat, depot_allocations, routing_manifest } = data;
    const bounds = L.latLngBounds([[threat.location.lat, threat.location.lon]]);

    // 1. Draw Hazard Center & Danger Buffer
    const isCritical = threat.severity === 'critical';
    const hazardColor = isCritical ? '#dc2626' : threat.severity === 'high' ? '#ea580c' : '#d97706';

    const dangerCircle = L.circle([threat.location.lat, threat.location.lon], {
      color: hazardColor,
      fillColor: hazardColor,
      fillOpacity: 0.16,
      weight: 1.5,
      dashArray: '6, 6',
      radius: threat.radius_km * 1000,
    }).addTo(layerGroup);

    dangerCircle.bindTooltip(
      `<div class="p-1 font-sans text-xs">
        <strong class="text-red-700">${threat.title}</strong><br/>
        Hazard Perimeter: ${threat.radius_km} km | Wind: ${threat.wind_speed_kmh || '--'} km/h
      </div>`,
      { sticky: true }
    );

    // Hazard Epicenter Icon
    const epicenterIcon = L.divIcon({
      className: 'custom-epicenter-marker',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${hazardColor}; opacity: 0.25; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 14px; height: 14px; border-radius: 50%; background: ${hazardColor}; border: 2.5px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    L.marker([threat.location.lat, threat.location.lon], { icon: epicenterIcon })
      .bindPopup(
        `<div style="font-family: var(--font-sans); padding: 4px;">
          <h4 style="margin: 0; font-size: 13px; font-weight: 600; color: #1a1917;">${threat.title}</h4>
          <p style="margin: 4px 0 0; font-size: 11px; color: #68665f;">Coordinates: ${threat.location.lat.toFixed(4)}°N, ${threat.location.lon.toFixed(4)}°E</p>
          <p style="margin: 2px 0 0; font-size: 11px; color: #68665f;">Severity: <strong>${threat.severity.toUpperCase()}</strong></p>
        </div>`
      )
      .addTo(layerGroup);

    bounds.extend([threat.location.lat, threat.location.lon]);

    // 2. Draw Depot Pins
    depot_allocations.forEach((depot) => {
      const isNdrf = depot.depot_type === 'NDRF_BATTALION';
      const depotColor = isNdrf ? '#15803d' : '#0369a1';
      const labelShort = isNdrf ? 'NDRF' : 'FCI';

      const depotIcon = L.divIcon({
        className: 'custom-depot-marker',
        html: `
          <div style="display: flex; align-items: center; gap: 4px; background: #ffffff; border: 1.5px solid ${depotColor}; padding: 3px 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.15); border-radius: 2px;">
            <div style="width: 7px; height: 7px; border-radius: 1px; background: ${depotColor};"></div>
            <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 600; color: #1a1917; letter-spacing: 0.5px;">${labelShort}</span>
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      L.marker([depot.location.lat, depot.location.lon], { icon: depotIcon })
        .bindPopup(
          `<div style="font-family: var(--font-sans); padding: 4px;">
            <h4 style="margin: 0; font-size: 12px; font-weight: 600; color: #1a1917;">${depot.depot_name}</h4>
            <p style="margin: 3px 0 0; font-size: 11px; color: #68665f;">Distance to Epicenter: ${depot.distance_to_epicenter_km.toFixed(1)} km</p>
            <p style="margin: 2px 0 0; font-size: 11px; color: #68665f;">Readiness: <strong>${depot.readiness_status}</strong></p>
          </div>`
        )
        .addTo(layerGroup);

      bounds.extend([depot.location.lat, depot.location.lon]);
    });

    // 3. Draw Vehicle Route Polylines
    routing_manifest.routes.forEach((route) => {
      const latlngs = route.waypoints.map((w) => [w.lat, w.lon] as [number, number]);
      if (latlngs.length >= 2) {
        const routeLine = L.polyline(latlngs, {
          color: route.hazard_detour_applied ? '#d97706' : '#2563eb',
          weight: 3.5,
          opacity: 0.85,
          dashArray: route.hazard_detour_applied ? '8, 6' : undefined,
        }).addTo(layerGroup);

        routeLine.bindTooltip(
          `<div class="p-1 font-sans text-xs">
            <strong>${route.origin_depot}</strong> → <strong>${route.destination}</strong><br/>
            ${route.distance_km} km | ETA: ${route.estimated_travel_minutes.toFixed(0)} mins
            ${route.hazard_detour_applied ? '<br/><span class="text-amber-700">⚠️ Hazard avoidance detour</span>' : ''}
          </div>`
        );
      }
    });

    // Fit map bounds to view all elements comfortably
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 9 });
  }, [data]);

  return (
    <div className="relative w-full h-full min-h-[480px] bg-[#e5e3df] overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />
      
      {/* Map Legend Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-xs border border-[#e6e4dc] p-3 text-xs shadow-xs max-w-xs">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[#68665f] mb-2 font-semibold">
          Cartographic Legend
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600/30 border border-red-600"></span>
            <span className="text-[#1a1917]">Hazard Zone & Projected Impact Cone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-blue-600"></span>
            <span className="text-[#1a1917]">OSRM Clear Relief Highway Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 border-b-2 border-dashed border-amber-600"></span>
            <span className="text-[#1a1917]">Hazard Avoidance Dynamic Detour</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-700"></span>
            <span className="text-[#1a1917]">NDRF Battalion Deployment Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-sky-700"></span>
            <span className="text-[#1a1917]">FCI Strategic Grain & Food Godown</span>
          </div>
        </div>
      </div>
    </div>
  );
};
