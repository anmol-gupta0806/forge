from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any
from datetime import datetime

class GeoPoint(BaseModel):
    lat: float
    lon: float
    label: Optional[str] = None

class ThreatReport(BaseModel):
    id: str
    type: Literal["cyclone", "flood", "heatwave", "earthquake", "storm_surge"]
    title: str
    severity: Literal["low", "moderate", "high", "critical"]
    location: GeoPoint
    radius_km: float
    wind_speed_kmh: Optional[float] = None
    rainfall_mm_24h: Optional[float] = None
    temperature_c: Optional[float] = None
    source: str  # GDACS / Open-Meteo / IMD Alert
    source_url: str
    detected_at: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = 0.95
    raw_telemetry: Dict[str, Any] = Field(default_factory=dict)

class VulnerableZone(BaseModel):
    name: str
    code: str
    population: int
    vulnerability_score: float
    district_hospitals: int
    cyclone_shelters: int
    distance_km: float

class ResourceQuotas(BaseModel):
    drinking_water_liters: int
    food_rations_kg: int
    emergency_medical_kits: int
    inflatable_rescue_boats: int
    mobile_water_purifiers: int
    heavy_logistics_trucks: int

class ImpactAssessment(BaseModel):
    threat_id: str
    threat_type: str
    severity: str
    affected_population: int
    displaced_estimate: int
    vulnerability_index: float  # 0.0 to 1.0
    hospitals_at_risk: int
    cyclone_shelters_available: int
    vulnerable_districts: List[VulnerableZone]
    resource_quotas: ResourceQuotas
    assessment_notes: str
    sources_cited: List[str]
    confidence_score: float

class SupplyItem(BaseModel):
    category: str  # Food / Water / Medical / Shelter / Rescue Gear
    item_name: str
    quantity: int
    unit: str
    standard_reference: str  # e.g. "SPHERE Standard: 15L water/day"

class DepotAllocation(BaseModel):
    depot_id: str
    depot_name: str
    depot_type: Literal["NDRF_BATTALION", "FCI_GODOWN", "DISTRICT_HOSPITAL"]
    location: GeoPoint
    distance_to_epicenter_km: float
    assigned_fleet: Dict[str, int]
    allocated_supplies: List[SupplyItem]
    readiness_status: str

class RouteWaypoint(BaseModel):
    lat: float
    lon: float
    name: Optional[str] = None
    is_hazard_zone: bool = False

class VehicleRoute(BaseModel):
    route_id: str
    origin_depot: str
    destination: str
    vehicle_type: str
    distance_km: float
    estimated_travel_minutes: float
    waypoints: List[RouteWaypoint]
    hazard_detour_applied: bool
    summary_instructions: str

class RouteManifest(BaseModel):
    plan_id: str
    total_vehicles_mobilized: int
    total_travel_distance_km: float
    routes: List[VehicleRoute]
    avoidance_polygons: List[Dict[str, Any]]

class AgentReasoningStep(BaseModel):
    step_number: int
    agent: str  # MonitorAgent / AssessmentAgent / LogisticsAgent / RoutingAgent / Orchestrator
    phase: str
    action_taken: str
    tool_invoked: str
    input_data: Dict[str, Any]
    output_summary: str
    source_attribution: str
    confidence: float
    execution_duration_ms: int
    timestamp: str

class SwarmExecutionResponse(BaseModel):
    session_id: str
    threat: ThreatReport
    assessment: ImpactAssessment
    depot_allocations: List[DepotAllocation]
    routing_manifest: RouteManifest
    reasoning_chain: List[AgentReasoningStep]
    total_latency_ms: int
    status: Literal["SUCCESS", "PARTIAL_DEGRADATION", "FAILED"]

class MonitoringStatus(BaseModel):
    is_active: bool
    last_poll_time: Optional[str] = None
    threats_detected_count: int
    active_regions: List[str]
    upstream_health: Dict[str, str]

