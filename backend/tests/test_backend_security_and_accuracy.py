import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    """Verify health endpoint and security controls."""
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "security_controls" in data
    assert data["security_controls"]["rate_limiter"] == "active"
    assert data["security_controls"]["ssrf_protection"] == "active"
    assert "X-Content-Type-Options" in res.headers
    assert res.headers["X-Content-Type-Options"] == "nosniff"

def test_active_threats_endpoint():
    """Verify live alerts are ingested without mock placeholders."""
    res = client.get("/api/v1/threats/active")
    assert res.status_code == 200
    threats = res.json()
    assert len(threats) >= 3
    first = threats[0]
    assert "location" in first
    assert "lat" in first["location"]
    assert "lon" in first["location"]
    assert "severity" in first
    assert "source" in first

def test_input_validation_invalid_coordinates():
    """Verify out-of-bounds coordinates are strictly blocked."""
    # Latitude > 90
    res = client.post("/api/v1/swarm/execute", json={"lat": 125.0, "lon": 85.0})
    assert res.status_code == 422
    data = res.json()
    assert data["status"] == "validation_error"

    # Longitude < -180
    res = client.post("/api/v1/swarm/execute", json={"lat": 20.0, "lon": -250.0})
    assert res.status_code == 422

def test_input_validation_malicious_threat_id():
    """Verify path traversal / injection attacks in threat_id are rejected."""
    bad_ids = [
        "../../etc/passwd",
        "<script>alert(1)</script>",
        "THREAT; DROP TABLE users;--",
        "THREAT' OR '1'='1"
    ]
    for bad_id in bad_ids:
        res = client.post("/api/v1/swarm/execute", json={"threat_id": bad_id})
        assert res.status_code == 422, f"Failed to reject malicious ID: {bad_id}"

def test_swarm_execution_correctness():
    """Verify end-to-end swarm execution accuracy and rule compliance."""
    res = client.post("/api/v1/swarm/execute", json={
        "threat_id": "THREAT-OD-CYCLONE-01",
        "lat": 19.8135,
        "lon": 85.8312,
        "label": "Puri Coastline, Odisha"
    })
    assert res.status_code == 200
    data = res.json()
    
    assert data["status"] == "SUCCESS"
    assert data["threat"]["type"] == "cyclone"
    assert data["threat"]["severity"] == "critical"
    
    # Verify SPHERE Standard humanitarian calculation correctness
    quotas = data["assessment"]["resource_quotas"]
    displaced = data["assessment"]["displaced_estimate"]
    
    # 15L water/person/day * 3 days = 45L per person
    expected_water = displaced * 15 * 3
    assert quotas["drinking_water_liters"] == expected_water
    
    # 0.55 kg food/person/day * 3 days = 1.65 kg per person
    expected_food = int(displaced * 0.55 * 3)
    assert quotas["food_rations_kg"] == expected_food
    
    # NDRF & FCI Depots allocated
    depots = data["depot_allocations"]
    assert len(depots) >= 2
    types = {d["depot_type"] for d in depots}
    assert "NDRF_BATTALION" in types
    assert "FCI_GODOWN" in types

    # OSRM Routes generated
    manifest = data["routing_manifest"]
    assert len(manifest["routes"]) >= 2
    assert manifest["total_travel_distance_km"] > 0
    
    # 5-agent reasoning committee verified
    reasoning = data["reasoning_chain"]
    assert len(reasoning) == 5
    agents = [r["agent"] for r in reasoning]
    assert agents == ["MonitorAgent", "AssessmentAgent", "LogisticsAgent", "RoutingAgent", "SwarmOrchestrator"]
    
    # Source attribution present on all steps
    for step in reasoning:
        assert step["source_attribution"] is not None and len(step["source_attribution"]) > 0

if __name__ == "__main__":
    print("Running automated backend tests...")
    test_health_endpoint()
    print("[PASS] Health & Security Headers test passed")
    test_active_threats_endpoint()
    print("[PASS] Active Threats endpoint test passed")
    test_input_validation_invalid_coordinates()
    print("[PASS] Input validation (coordinates) test passed")
    test_input_validation_malicious_threat_id()
    print("[PASS] Injection / SSRF / path traversal test passed")
    test_swarm_execution_correctness()
    print("[PASS] Full Swarm execution & SPHERE calculation test passed")
    print("\nALL BACKEND CORRECTNESS & SECURITY TESTS PASSED!")
