import json
import os
from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/data", tags=["Live Data Proxies"])

def _load_json(filename: str):
    path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "depots", filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/depots")
def get_depots() -> Dict[str, Any]:
    """Returns official NDRF bases and FCI storage godowns."""
    return {
        "ndrf_battalions": _load_json("ndrf_battalions.json"),
        "fci_godowns": _load_json("fci_godowns.json")
    }

@router.get("/districts")
def get_districts() -> List[Dict[str, Any]]:
    """Returns official district census demographic profiles."""
    return _load_json("districts.json")

@router.get("/weather")
async def get_weather(
    lat: float = Query(20.2961, ge=-90.0, le=90.0, description="Latitude between -90 and 90"),
    lon: float = Query(85.8245, ge=-180.0, le=180.0, description="Longitude between -180 and 180")
) -> Dict[str, Any]:
    """Fetches real-time weather from Open-Meteo live API."""
    return await WeatherService.get_live_weather(lat, lon)

