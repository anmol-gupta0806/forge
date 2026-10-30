# Roadmap: SENTINEL Autonomous Disaster Swarm

## Overview

A 6-phase engineering roadmap executing the full autonomous disaster response and logistics swarm platform from foundational infrastructure to production polish for the Gen AI Hackathon.

## Phases

- [x] **Phase 1: Foundation & Project Scaffolding** - Monorepo architecture, FastAPI skeleton, Vite React setup, editorial design system tokens.
- [x] **Phase 2: Live Data Integration Layer** - Open-Meteo, GDACS GeoRSS, OSRM driving engine, Nominatim geocoding, official FCI and NDRF datasets.
- [x] **Phase 3: Multi-Agent Swarm Core** - 5-agent LangGraph-style state machine (Monitor, Assess, Logistics, Routing, Orchestrator) with SPHERE RAG engine.
- [x] **Phase 4: Editorial Minimalist UI** - CartoDB Positron map, interactive threat feed, real-time agent reasoning audit trail, relief manifest drawer.
- [ ] **Phase 5: WebSocket Streaming & Edge Hardening** - Real-time step-by-step agent telemetry streaming over WebSockets, offline fallback caching.
- [ ] **Phase 6: Evaluation Polish & Demo Runbook** - Live rehearsal, benchmark verification, performance audits, and one-click production scripts.

## Phase Details

### Phase 1: Foundation & Project Scaffolding
**Goal**: Establish scalable backend and editorial frontend monorepo architecture.
**Depends on**: Nothing
**Requirements**: Monorepo layout, FastAPI backend, React 19 + Vite frontend, Tailwind CSS v4 styling, startup batch scripts.
**Success Criteria**:
  1. FastAPI backend boots on port 8000 and responds to `/health`.
  2. Vite frontend boots on port 5173 with editorial design typography.
  3. Batch scripts allow one-click launch.

### Phase 2: Live Data Integration Layer
**Goal**: Implement zero-mock live API connectors and official Indian disaster datasets.
**Depends on**: Phase 1
**Requirements**: `WeatherService`, `AlertService`, `GeoService`, `RouteService`, official FCI & NDRF JSON registers.
**Success Criteria**:
  1. Open-Meteo returns live temperature, wind speed, pressure without mocks.
  2. GDACS feed parses global disaster alerts.
  3. OSRM calculates real turn-by-turn routes with distance and duration.

### Phase 3: Multi-Agent Swarm Core
**Goal**: Deploy 5 autonomous agents operating across state transitions with anti-hallucination source attribution.
**Depends on**: Phase 2
**Requirements**: `MonitorAgent`, `AssessmentAgent`, `LogisticsAgent`, `RoutingAgent`, `SwarmOrchestrator`, `RagService`.
**Success Criteria**:
  1. Swarm executes end-to-end mission in <6 seconds.
  2. RAG service calculates exact water (15L/day) and food (2,100 kcal) SPHERE quotas.
  3. Dynamic detour avoidance applies when transit paths cross active hazard radius.

### Phase 4: Editorial Minimalist UI
**Goal**: Deliver a high-information-density, publication-grade cartographic interface.
**Depends on**: Phase 3
**Requirements**: `Navbar`, `StatsBar`, `MapView`, `ThreatPanel`, `AgentReasoningPanel`, `ReliefDrawer`.
**Success Criteria**:
  1. Leaflet map renders CartoDB Positron basemap with pulsating hazard zones and route lines.
  2. Reasoning panel displays latency and verified API badges for all 5 steps.
  3. Manifest drawer displays itemized supplies, vehicle manifests, and raw verified JSON.

### Phase 5: WebSocket Streaming & Edge Hardening
**Goal**: Provide live animated step streaming and resilient edge-case handling.
**Depends on**: Phase 4
**Requirements**: WebSocket `/ws/live` connection, client reconnection logic, network error boundaries.
**Success Criteria**:
  1. Agent reasoning steps animate progressively as each tool resolves.
  2. Temporary upstream API drop gracefully falls back to cached state without crashing.

### Phase 6: Evaluation Polish & Demo Runbook
**Goal**: Final hackathon presentation readiness.
**Depends on**: Phase 5
**Requirements**: 8-minute judging demo script, scenario quick-switches, architecture README.
**Success Criteria**:
  1. Judges can switch between Odisha Cyclone, Bihar Flood, and Live GPS scan instantly.
  2. Zero errors or console warnings during live demonstration.
