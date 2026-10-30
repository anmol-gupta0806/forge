# SENTINEL — Autonomous Climate Intelligence & Logistics Swarm

## What This Is

An autonomous multi-agent disaster intelligence and emergency supply chain execution swarm built for the Gen AI Hackathon (Track: Climate, Resource Infrastructure & Global Supply Resilience, Problem #4). It ingests live meteorological data (Open-Meteo), disaster alerts (GDACS), district demographic census data (data.gov.in), and computes optimal vehicle transit corridors avoiding hazard zones via the Open Source Routing Machine (OSRM).

## Core Value

Autonomous end-to-end execution: detecting emerging climate threats, evaluating demographic exposure, mobilizing official FCI and NDRF depots, and calculating optimized hazard-avoidance transit routes with zero human delay and zero mock data.

## Requirements

### Validated

- [x] High-performance asynchronous FastAPI backend with typed Pydantic models
- [x] Multi-agent swarm committee (MonitorAgent, AssessmentAgent, LogisticsAgent, RoutingAgent, SwarmOrchestrator)
- [x] 100% real live APIs integrated: Open-Meteo, GDACS GeoRSS, OSRM routing, Nominatim reverse geocode
- [x] Pre-loaded official datasets: 12 NDRF Battalions, 7 FCI Godowns, Census district vulnerability indicators
- [x] SPHERE Humanitarian Charter & NDMA SOP disaster protocols integration
- [x] Editorial minimalist UI (Newsreader Serif, Inter Sans, JetBrains Mono, CartoDB Positron cartography)
- [x] Interactive Leaflet map with hazard zone circles, depot pins, and animated transit polylines
- [x] Step-by-step agentic reasoning stream with confidence scores and verified source attribution badges
- [x] Expandable relief manifest drawer with itemized food, water, medical quotas, and raw verified JSON telemetry

### Active

- [ ] Real-time WebSocket bidirectional streaming for live agent step animation
- [ ] Integration of user-provided Google Gemini API key for dynamic command synthesis
- [ ] Custom bounding box polygon routing exclusion for complex cyclone tracks

### Out of Scope

- Chat-only prompt wrapper — Problem #4 requires an autonomous execution swarm, not a conversational assistant.
- Synthetic / hardcoded JSON mock data — Disqualified by hackathon rules; all data must be live.

## Context

- Target Hackathon: Gen AI Hackathon · 100-Point Scoring Rubric
- Target Score: 92+/100 across Technical Depth (20), Agentic Execution (25), Problem/USP (25), Live Demo (30)
- Technical Stack: Python 3.13, FastAPI, httpx, React 19, Vite, Leaflet, Tailwind CSS v4, Lucide React

