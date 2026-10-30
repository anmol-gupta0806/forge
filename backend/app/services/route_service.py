import httpx
import logging
from typing import Dict, Any, List
from app.core.config import settings
from app.models.schemas import RouteWaypoint, VehicleRoute

logger = logging.getLogger("sentinel.routing")

class RouteService:
    @staticmethod
    async def calculate_osrm_route(
        origin_lat: float, origin_lon: float,
        dest_lat: float, dest_lon: float,
        depot_name: str, dest_name: str,
        hazard_center_lat: float, hazard_center_lon: float,
        hazard_radius_km: float
    ) -> VehicleRoute:
        """
        Queries the live Open Source Routing Machine (OSRM) engine to calculate
        real turn-by-turn road routes. If route passes through the hazard epicenter,
        applies dynamic detour waypoints.
        """
        # Determine if detour waypoint is required (if straight line passes too close to hazard center)
        mid_lat = (origin_lat + dest_lat) / 2.0
        mid_lon = (origin_lon + dest_lon) / 2.0
        
        # Calculate distance of midpoint to hazard center
        d_lat = mid_lat - hazard_center_lat
        d_lon = mid_lon - hazard_center_lon
        dist_approx = ((d_lat * 111.0)**2 + (d_lon * 111.0)**2)**0.5
        
        detour_applied = False
        coords_str = f"{origin_lon},{origin_lat};{dest_lon},{dest_lat}"
        
        if dist_approx < (hazard_radius_km * 0.7):
            # Divert around the perimeter
            detour_applied = True
            detour_lat = hazard_center_lat + (hazard_radius_km / 111.0) * 1.15
            detour_lon = hazard_center_lon + (hazard_radius_km / (111.0 * 0.9)) * 1.15
            coords_str = f"{origin_lon},{origin_lat};{detour_lon:.4f},{detour_lat:.4f};{dest_lon},{dest_lat}"

        osrm_url = f"{settings.OSRM_API_URL}/route/v1/driving/{coords_str}?overview=full&geometries=geojson"
        
        waypoints: List[RouteWaypoint] = []
        distance_km = 0.0
        duration_minutes = 0.0

        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(osrm_url)
                if res.status_code == 200:
                    data = res.json()
                    routes = data.get("routes", [])
                    if routes:
                        primary = routes[0]
                        distance_km = round(primary.get("distance", 0.0) / 1000.0, 1)
                        duration_minutes = round(primary.get("duration", 0.0) / 60.0, 1)
                        geometry = primary.get("geometry", {}).get("coordinates", [])
                        
                        # Downsample geometry for lightweight frontend animation
                        step = max(1, len(geometry) // 35)
                        for pt in geometry[::step]:
                            waypoints.append(RouteWaypoint(lat=pt[1], lon=pt[0]))
                        
                        # Ensure last point matches destination
                        if waypoints and (waypoints[-1].lat != dest_lat or waypoints[-1].lon != dest_lon):
                            waypoints.append(RouteWaypoint(lat=dest_lat, lon=dest_lon))
        except Exception as e:
            logger.warning(f"OSRM online query note: {e}. Generating geodetic corridor.")

        # Robust fallback if OSRM rate limited or slow: generate geodetic highway corridor
        if not waypoints:
            steps = 20
            for i in range(steps + 1):
                t = i / float(steps)
                lat = origin_lat + t * (dest_lat - origin_lat)
                lon = origin_lon + t * (dest_lon - origin_lon)
                if detour_applied:
                    lat += 0.18 * (1.0 - (2 * t - 1)**2)
                waypoints.append(RouteWaypoint(lat=round(lat, 5), lon=round(lon, 5)))
            
            # Approximate highway speed 45 km/h for heavy relief trucks
            dist_deg = ((dest_lat - origin_lat)**2 + (dest_lon - origin_lon)**2)**0.5
            distance_km = round(dist_deg * 111.0 * (1.25 if detour_applied else 1.1), 1)
            duration_minutes = round((distance_km / 45.0) * 60.0, 1)

        summary = (
            f"Relief corridor active from {depot_name} to {dest_name}. "
            f"Distance: {distance_km} km, ETA: {duration_minutes:.0f} mins. "
            f"{'Hazard avoidance bypass active.' if detour_applied else 'Direct transit corridor clear.'}"
        )

        return VehicleRoute(
            route_id=f"RT-{depot_name[:3]}-{dest_name[:3]}-{int(distance_km)}",
            origin_depot=depot_name,
            destination=dest_name,
            vehicle_type="TATRA Heavy 8x8 Relief Truck + Escort",
            distance_km=distance_km,
            estimated_travel_minutes=duration_minutes,
            waypoints=waypoints,
            hazard_detour_applied=detour_applied,
            summary_instructions=summary
        )
