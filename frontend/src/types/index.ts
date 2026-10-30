export interface GeoPoint {
  lat: number;
  lon: number;
  label?: string;
}

export type ThreatSeverity = 'low' | 'moderate' | 'high' | 'critical';
export type ThreatType = 'cyclone' | 'flood' | 'heatwave' | 'earthquake' | 'storm_surge';

export interface ThreatReport {
  id: string;
  type: ThreatType;
  title: string;
  severity: ThreatSeverity;
  location: GeoPoint;
  radius_km: number;
  wind_speed_kmh?: number;
  rainfall_mm_24h?: number;
  temperature_c?: number;
  source: string;
  source_url: string;
  detected_at?: string;
  confidence?: number;
  raw_telemetry?: Record<string, any>;
}

export interface VulnerableZone {
  name: string;
  code: string;
  population: number;
  vulnerability_score: number;
  district_hospitals: number;
  cyclone_shelters: number;
  distance_km: number;
}

export interface ResourceQuotas {
  drinking_water_liters: number;
  food_rations_kg: number;
  emergency_medical_kits: number;
  inflatable_rescue_boats: number;
  mobile_water_purifiers: number;
  heavy_logistics_trucks: number;
}

export interface ImpactAssessment {
  threat_id: string;
  threat_type: string;
  severity: string;
  affected_population: number;
  displaced_estimate: number;
  vulnerability_index: number;
  hospitals_at_risk: number;
  cyclone_shelters_available: number;
  vulnerable_districts: VulnerableZone[];
  resource_quotas: ResourceQuotas;
  assessment_notes: string;
  sources_cited: string[];
  confidence_score: number;
}

export interface SupplyItem {
  category: string;
  item_name: string;
  quantity: number;
  unit: string;
  standard_reference: string;
}

export interface DepotAllocation {
  depot_id: string;
  depot_name: string;
  depot_type: 'NDRF_BATTALION' | 'FCI_GODOWN' | 'DISTRICT_HOSPITAL';
  location: GeoPoint;
  distance_to_epicenter_km: number;
  assigned_fleet: Record<string, number>;
  allocated_supplies: SupplyItem[];
  readiness_status: string;
}

export interface RouteWaypoint {
  lat: number;
  lon: number;
  name?: string;
  is_hazard_zone?: boolean;
}

export interface VehicleRoute {
  route_id: string;
  origin_depot: string;
  destination: string;
  vehicle_type: string;
  distance_km: number;
  estimated_travel_minutes: number;
  waypoints: RouteWaypoint[];
  hazard_detour_applied: boolean;
  summary_instructions: string;
}

export interface RouteManifest {
  plan_id: string;
  total_vehicles_mobilized: number;
  total_travel_distance_km: number;
  routes: VehicleRoute[];
  avoidance_polygons: any[];
}

export interface AgentReasoningStep {
  step_number: number;
  agent: string;
  phase: string;
  action_taken: string;
  tool_invoked: string;
  input_data: Record<string, any>;
  output_summary: string;
  source_attribution: string;
  confidence: number;
  execution_duration_ms: number;
  timestamp: string;
}

export interface SwarmExecutionResponse {
  session_id: string;
  threat: ThreatReport;
  assessment: ImpactAssessment;
  depot_allocations: DepotAllocation[];
  routing_manifest: RouteManifest;
  reasoning_chain: AgentReasoningStep[];
  total_latency_ms: number;
  status: 'SUCCESS' | 'PARTIAL_DEGRADATION' | 'FAILED';
}
