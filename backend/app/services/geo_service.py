import math
import httpx
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("sentinel.geo")

class GeoService:
    @staticmethod
    def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculates great-circle distance between two GPS coordinates in kilometers.
        """
        R = 6371.0 # Earth radius in km
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)

        a = math.sin(dphi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    @staticmethod
    async def reverse_geocode(lat: float, lon: float) -> str:
        """
        Nominatim OpenStreetMap live reverse geocoding.
        """
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=10"
        headers = {"User-Agent": "SentinelDisasterReliefSwarm/1.0 (hackathon-eval-demo)"}
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(url, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    return data.get("display_name", f"Region @ {lat:.3f}, {lon:.3f}")
        except Exception as e:
            logger.debug(f"Reverse geocode lookup note: {e}")
        return f"Coordinates {lat:.4f}°N, {lon:.4f}°E"
