from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import Optional
from app.models.schemas import SwarmExecutionResponse, ThreatReport, GeoPoint
from app.agents.orchestrator import SwarmOrchestrator
from app.services.alert_service import AlertService

router = APIRouter(prefix="/swarm", tags=["Swarm Execution"])

class SwarmTriggerRequest(BaseModel):
    threat_id: Optional[str] = Field(
        None,
        max_length=64,
        pattern=r"^[A-Za-z0-9_\-]+$",
        description="Optional ID of a calibrated or GDACS threat"
    )
    lat: Optional[float] = Field(
        20.2961,
        ge=-90.0,
        le=90.0,
        description="Latitude (-90 to +90)"
    )
    lon: Optional[float] = Field(
        85.8245,
        ge=-180.0,
        le=180.0,
        description="Longitude (-180 to +180)"
    )
    label: Optional[str] = Field(
        "Puri Coastal Zone, Odisha",
        max_length=150,
        description="Sanitized geographic label"
    )

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

