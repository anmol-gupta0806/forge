import time
from typing import Tuple, List
from app.models.schemas import ThreatReport, DepotAllocation, RouteManifest, VehicleRoute, AgentReasoningStep
from app.services.route_service import RouteService

class RoutingAgent:
    """
    Agent 4: Multi-Depot Fleet Transit & Real-Time Hazard Avoidance Routing.
    Queries OSRM driving engine to solve vehicle routing around the active hazard perimeter.
    """

    @classmethod
    async def generate_transit_manifest(
        cls, threat: ThreatReport, allocations: List[DepotAllocation]
    ) -> Tuple[RouteManifest, AgentReasoningStep]:
        start = time.perf_counter()
        
        t_lat = threat.location.lat
        t_lon = threat.location.lon
        dest_name = threat.location.label or f"Emergency Staging Sector ({threat.type.upper()})"
        
        routes: List[VehicleRoute] = []
        total_km = 0.0
        detours_count = 0
        
        # Calculate OSRM route for each allocated depot to disaster sector
        for depot in allocations:
            route = await RouteService.calculate_osrm_route(
                origin_lat=depot.location.lat,
                origin_lon=depot.location.lon,
                dest_lat=t_lat,
                dest_lon=t_lon,
                depot_name=depot.depot_name,
                dest_name=dest_name,
                hazard_center_lat=t_lat,
                hazard_center_lon=t_lon,
                hazard_radius_km=threat.radius_km
            )
            routes.append(route)
            total_km += route.distance_km
            if route.hazard_detour_applied:
                detours_count += 1

        total_vehicles = sum(sum(d.assigned_fleet.values()) for d in allocations)
        
        # Hazard zone polygon for map visualization
        hazard_polygon = {
            "type": "circle",
            "center": [t_lat, t_lon],
            "radius_km": threat.radius_km,
            "danger_level": threat.severity
        }

        manifest = RouteManifest(
            plan_id=f"MANIFEST-{threat.id}",
            total_vehicles_mobilized=total_vehicles,
            total_travel_distance_km=round(total_km, 1),
            routes=routes,
            avoidance_polygons=[hazard_polygon]
        )

        duration = int((time.perf_counter() - start) * 1000)
        step = AgentReasoningStep(
            step_number=4,
            agent="RoutingAgent",
            phase="DYNAMIC_TRANSIT_ROUTING",
            action_taken=f"Queried OSRM routing engine for {len(routes)} transit corridors. Implemented dynamic hazard boundary diversion.",
            tool_invoked="RouteService.calculate_osrm_route() via OSRM Engine",
            input_data={"routes_calculated": len(routes), "hazard_radius_km": threat.radius_km},
            output_summary=f"Calculated {len(routes)} vehicle corridors ({total_km:.1f} total km). Dynamic hazard detour active on {detours_count} routes.",
            source_attribution="Open Source Routing Machine (OSRM) + OpenStreetMap Network",
            confidence=0.98,
            execution_duration_ms=duration,
            timestamp=time.strftime("%H:%M:%S")
        )

        return manifest, step

