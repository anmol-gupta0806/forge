from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.models.schemas import SwarmExecutionResponse, ThreatReport, GeoPoint
from app.agents.orchestrator import SwarmOrchestrator
from app.services.alert_service import AlertService

router = APIRouter(prefix="/swarm", tags=["Swarm Execution"])

class SwarmTriggerRequest(BaseModel):
    threat_id: Optional[str] = None
    lat: Optional[float] = 20.2961
    lon: Optional[float] = 85.8245
    label: Optional[str] = "Puri Coastal Zone, Odisha"

@router.post("/execute", response_model=SwarmExecutionResponse)
async def execute_swarm(req: SwarmTriggerRequest):
    """
    Triggers end-to-end multi-agent swarm execution:
    1. MonitorAgent verifies meteorological telemetry
    2. AssessmentAgent computes population exposure & SPHERE quotas
    3. LogisticsAgent stages FCI godowns & NDRF battalions
    4. RoutingAgent queries OSRM for dynamic hazard-avoidance routes
    5. Orchestrator issues final dispatch orders
    """
    custom_threat = None
    
    if req.threat_id:
        # Match with known calibrated scenario or GDACS alert if requested
        scenarios = AlertService.get_calibrated_disaster_scenarios()
        matched = next((s for s in scenarios if s["id"] == req.threat_id), None)
        if not matched and req.threat_id.startswith("GDACS-"):
            gdacs_alerts = await AlertService.fetch_gdacs_live_alerts()
            matched = next((g for g in gdacs_alerts if g["id"] == req.threat_id), None)

        if matched:
            custom_threat = ThreatReport(
                id=matched["id"],
                type=matched["type"],
                title=matched["title"],
                severity=matched["severity"],
                location=GeoPoint(**matched["location"]),
                radius_km=matched["radius_km"],
                wind_speed_kmh=matched.get("wind_speed_kmh"),
                rainfall_mm_24h=matched.get("rainfall_mm_24h"),
                temperature_c=matched.get("temperature_c"),
                source=matched["source"],
                source_url=matched["source_url"]
            )
    
    res = await SwarmOrchestrator.execute_swarm_mission(
        lat=req.lat or 20.2961,
        lon=req.lon or 85.8245,
        location_label=req.label,
        custom_threat=custom_threat
    )
    return res

