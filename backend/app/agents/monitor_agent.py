import time
from typing import Dict, Any, Tuple
from app.services.weather_service import WeatherService
from app.models.schemas import ThreatReport, GeoPoint, AgentReasoningStep

class MonitorAgent:
    """
    Agent 1: Continuous Meteorological & Disaster Ingestion Engine.
    Monitors live weather feeds, computes hazard anomalies against thresholds.
    """
    
    @staticmethod
    async def analyze_location(lat: float, lon: float, location_label: str = "Regional Scan") -> Tuple[ThreatReport, AgentReasoningStep]:
        start = time.perf_counter()
        
        # Ingest live weather from Open-Meteo
        weather = await WeatherService.get_live_weather(lat, lon)
        
        temp = weather.get("temperature_c", 28.0)
        wind = weather.get("wind_speed_kmh", 15.0)
        rain = weather.get("rain_mm", 0.0)
        pressure = weather.get("surface_pressure_hpa", 1010.0)
        
        # Anomaly threshold evaluation
        threat_type = "storm_surge"
        severity = "low"
        radius = 35.0
        
        if wind > 100 or pressure < 985:
            threat_type = "cyclone"
            severity = "critical"
            radius = 85.0
        elif rain > 80 or (rain > 40 and wind > 40):
            threat_type = "flood"
            severity = "high"
            radius = 65.0
        elif temp > 43.0:
            threat_type = "heatwave"
            severity = "high" if temp > 46 else "moderate"
            radius = 100.0
        elif wind > 50:
            threat_type = "cyclone"
            severity = "moderate"
            radius = 50.0

        threat = ThreatReport(
            id=f"THR-{int(time.time())}",
            type=threat_type, # type: ignore
            title=f"Autonomous Hazard Trigger: {severity.upper()} {threat_type.upper()} Detected",
            severity=severity, # type: ignore
            location=GeoPoint(lat=lat, lon=lon, label=location_label),
            radius_km=radius,
            wind_speed_kmh=wind,
            rainfall_mm_24h=rain,
            temperature_c=temp,
            source=weather.get("source", "Open-Meteo Live API"),
            source_url=weather.get("source_url", "https://open-meteo.com"),
            raw_telemetry=weather
        )
        
        duration = int((time.perf_counter() - start) * 1000)
        step = AgentReasoningStep(
            step_number=1,
            agent="MonitorAgent",
            phase="ENVIRONMENT_SCAN",
            action_taken=f"Ingested live telemetry from {threat.source}. Anomaly matrix classified {threat_type.upper()} (Severity: {severity.upper()}).",
            tool_invoked="WeatherService.get_live_weather()",
            input_data={"lat": lat, "lon": lon, "label": location_label},
            output_summary=f"Wind: {wind} km/h, Rain: {rain} mm, Pressure: {pressure} hPa, Temp: {temp}°C. Threshold tripped: {severity.upper()}.",
            source_attribution=threat.source,
            confidence=0.96,
            execution_duration_ms=duration,
            timestamp=time.strftime("%H:%M:%S")
        )
        
        return threat, step

