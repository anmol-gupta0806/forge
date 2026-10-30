import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [20.2961, 85.8245],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });

    // High reliability tile layer: OpenStreetMap Standard with crisp rendering
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    // Invalidate size immediately and after short delay to handle CSS flex reflows
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // Watch container resize
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
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

    // 1. Draw Hazard Center & Danger Buffer Circle
    const isCritical = threat.severity === 'critical';
    const hazardColor = isCritical ? '#dc2626' : threat.severity === 'high' ? '#ea580c' : '#d97706';

    const dangerCircle = L.circle([threat.location.lat, threat.location.lon], {
      color: hazardColor,
      fillColor: hazardColor,
      fillOpacity: 0.18,
      weight: 2,
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
          <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${hazardColor}; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 16px; height: 16px; border-radius: 50%; background: ${hazardColor}; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    L.marker([threat.location.lat, threat.location.lon], { icon: epicenterIcon })
      .bindPopup(
        `<div style="font-family: system-ui, sans-serif; padding: 4px;">
          <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #1a1917;">${threat.title}</h4>
          <p style="margin: 4px 0 0; font-size: 11px; color: #555;">Coordinates: ${threat.location.lat.toFixed(4)}°N, ${threat.location.lon.toFixed(4)}°E</p>
          <p style="margin: 2px 0 0; font-size: 11px; color: #555;">Severity: <strong style="color: ${hazardColor}">${threat.severity.toUpperCase()}</strong></p>
        </div>`
      )
      .addTo(layerGroup);

    bounds.extend([threat.location.lat, threat.location.lon]);

    // 2. Draw Depot Pins
    depot_allocations.forEach((depot) => {
      const isNdrf = depot.depot_type === 'NDRF_BATTALION';
      const depotBg = isNdrf ? '#15803d' : '#0284c7';
      const labelShort = isNdrf ? 'NDRF BASE' : 'FCI GODOWN';

      const depotIcon = L.divIcon({
        className: 'custom-depot-marker',
        html: `
          <div style="display: inline-flex; align-items: center; gap: 5px; background: #ffffff; border: 2px solid ${depotBg}; padding: 3px 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.25); border-radius: 3px; white-space: nowrap;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${depotBg};"></div>
            <span style="font-family: monospace; font-size: 10px; font-weight: 700; color: #111;">${labelShort}</span>
          </div>
        `,
        iconSize: [90, 24],
        iconAnchor: [45, 12],
      });

      L.marker([depot.location.lat, depot.location.lon], { icon: depotIcon })
        .bindPopup(
          `<div style="font-family: system-ui, sans-serif; padding: 4px;">
            <h4 style="margin: 0; font-size: 12px; font-weight: 700; color: #111;">${depot.depot_name}</h4>
            <p style="margin: 3px 0 0; font-size: 11px; color: #555;">Distance to Epicenter: <strong>${depot.distance_to_epicenter_km.toFixed(1)} km</strong></p>
            <p style="margin: 2px 0 0; font-size: 11px; color: #555;">Readiness: <strong style="color: #15803d">${depot.readiness_status}</strong></p>
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
          weight: 4,
          opacity: 0.9,
          dashArray: route.hazard_detour_applied ? '8, 6' : undefined,
        }).addTo(layerGroup);

        routeLine.bindTooltip(
          `<div class="p-1 font-sans text-xs">
            <strong>${route.origin_depot}</strong> → <strong>${route.destination}</strong><br/>
            ${route.distance_km} km | ETA: ${route.estimated_travel_minutes.toFixed(0)} mins
            ${route.hazard_detour_applied ? '<br/><span class="text-amber-700 font-bold">⚠️ Hazard avoidance bypass active</span>' : ''}
          </div>`
        );
      }
    });

    // Fit map bounds safely
    try {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 9 });
    } catch {
      map.setView([threat.location.lat, threat.location.lon], 7);
    }

    // Delayed invalidateSize ensures tile alignment
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [data]);

  return (
    <div className="relative w-full h-full min-h-[420px] bg-stone-100 flex flex-col">
      {/* Map DOM Element */}
      <div
        ref={mapContainerRef}
        id="sentinel-map"
        className="w-full h-full flex-1 min-h-[420px] z-0"
        style={{ minHeight: '420px', width: '100%', height: '100%' }}
      />
      
      {/* Floating Map Legend Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-xs border border-stone-200 p-3 text-xs shadow-md max-w-xs pointer-events-auto">
        <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500 mb-2 font-bold">
          Cartographic Overlay
        </div>
        <div className="space-y-1.5 text-[11.5px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600/30 border border-red-600 shrink-0"></span>
            <span className="text-stone-900">Hazard Zone & Impact Radius</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-blue-600 shrink-0"></span>
            <span className="text-stone-900">OSRM Clear Transit Highway</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 border-b-2 border-dashed border-amber-600 shrink-0"></span>
            <span className="text-stone-900">Hazard Avoidance Detour</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-700 shrink-0"></span>
            <span className="text-stone-900">NDRF Battalion Base</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-sky-600 shrink-0"></span>
            <span className="text-stone-900">FCI Strategic Food Godown</span>
          </div>
        </div>
      </div>
    </div>
  );
};
