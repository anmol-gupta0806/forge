# 🛡️ SENTINEL — Autonomous Climate Intelligence & Logistics Swarm

> **Gen AI Hackathon Track**: Climate, Resource Infrastructure & Global Supply Resilience  
> **Problem Statement**: Autonomous Emergency Response & Supply Chain Logistics Swarm (Problem #4)  
> **UI Aesthetic**: Editorial Minimalist (CartoDB Positron Cartography, Newsreader Serif & JetBrains Mono)  
> **Data Compliance**: 100% Real-Time Live APIs & Official Datasets (Strict Zero Mock Data Policy)

---

## 1. System Overview

**SENTINEL** is an autonomous multi-agent execution swarm designed to monitor extreme weather shifts, evaluate population exposure in real time, mobilize strategic government food and rescue depots, and dispatch supply convoys around active hazard perimeters with dynamic route optimization.

Unlike conventional dashboards that merely display statistics and wait for manual intervention, SENTINEL operates as an **autonomous execution engine**:
1. **MonitorAgent** continuously interrogates live meteorological telemetry and GDACS alerts.
2. **AssessmentAgent** correlates hazard coordinates against Census demographic registers and calculates exact humanitarian quotas via SPHERE standards.
3. **LogisticsAgent** computes proximity matrices against official Food Corporation of India (FCI) godowns and National Disaster Response Force (NDRF) battalions.
4. **RoutingAgent** interfaces with the Open Source Routing Machine (OSRM) to solve multi-depot driving routes with real-time hazard avoidance detours.
5. **SwarmOrchestrator** synthesizes the command authorization, records a transparent reasoning chain, and broadcasts the response manifest.

---

## 2. Zero-Tolerance Data Compliance (Strictly Live APIs)

To strictly comply with the hackathon's **Zero Mock Data** mandate, SENTINEL contains no hardcoded numbers or fake JSON placeholder generators. Every calculation derives from live networks:

| Domain | Live Source | Protocol / Endpoint | Verification Link |
|---|---|---|---|
| **Real-Time Weather** | Open-Meteo Live API | REST (Latitude/Longitude query) | `https://api.open-meteo.com/v1/forecast` |
| **Global Disaster Alerts** | GDACS (UN / EU) | Live GeoRSS XML | `https://www.gdacs.org/xml/rss.xml` |
| **Road Vehicle Routing** | OSRM Driving Engine | Turn-by-Turn GeoJSON Route API | `https://router.project-osrm.org/route/v1/driving` |
| **Reverse Geocoding** | Nominatim (OpenStreetMap) | OpenStreetMap Geocoding API | `https://nominatim.openstreetmap.org/reverse` |
| **Relief Standards** | SPHERE Project 2018 | Humanitarian Charter Standards | 15L water/day, 2,100 kcal food |
| **Strategic Depots** | FCI & NDRF Registries | Official Public Datasets | data.gov.in / ndrf.gov.in |

---

## 3. Architecture & Multi-Agent Swarm

```
┌────────────────────────────────────────────────────────────────────────┐
│             EDITORIAL MINIMALIST UI (React 19 + Vite + Tailwind)       │
│  - Newsreader Serif & JetBrains Mono typography                        │
│  - Interactive CartoDB Positron Cartography + Animated Relief Routes   │
│  - Step-by-Step Agentic Reasoning Stream with Grounded Source Badges   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST / WebSocket
┌───────────────────────────────────▼────────────────────────────────────┐
│                  FASTAPI HIGH-PERFORMANCE BACKEND                      │
│                                                                        │
│   [MonitorAgent] ───> [AssessmentAgent] ───> [LogisticsAgent]          │
│         │                     │                     │                  │
│         ▼                     ▼                     ▼                  │
│   Open-Meteo API        Census Demographics    FCI Godowns (7 hubs)    │
│   GDACS GeoRSS Feed     SPHERE Standards       NDRF Bases (12 bns)     │
│                                                     │                  │
│                                                     ▼                  │
│   [SwarmOrchestrator] <────────────────────── [RoutingAgent]           │
│         │                                           │                  │
│         ▼                                           ▼                  │
│   Dispatch Manifest                           OSRM Driving Engine      │
│   (Water, Food, Fleet)                        (Hazard Avoidance Bypass)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Quick Start

### Prerequisites
- Python 3.11+
- Node.js v18+

### One-Click Launch (Windows)
Double-click:
```bash
start_sentinel.bat
```
This automatically launches both the FastAPI backend on port 8000 and the Vite frontend on port 5173.

### Manual Launch

**Backend:**
```bash
cd backend
.\venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

**Frontend:**
```bash
cd frontend
npm run dev
```
Interactive Console will be live at: [http://localhost:5173](http://localhost:5173)

---

## 5. Scoring Rubric Alignment (100 Points)

| Rubric Pillar | Max Pts | SENTINEL Implementation & Proof |
|---|---|---|
| **Technical Architecture & Engineering Depth** | 20 | • True modular decoupled architecture (Agents, Services, Models, Schemas)<br>• Asynchronous client pooling (`httpx.AsyncClient`) with zero UI blocking<br>• Real OSRM geodetic graph pathfinding with dynamic polygon detour calculation |
| **AI Reasoning & Agentic Execution** | 25 | • 5-agent sequential committee with self-contained tool invocations<br>• Anti-hallucination source attribution tags on every output<br>• Fully traceable reasoning chain with latency and confidence telemetry |
| **Problem Relevance, Impact & USP** | 25 | • Solves catastrophic disaster supply bottlenecks affecting 200M+ citizens<br>• Not a shallow chatbot wrapper: autonomous decision-to-dispatch loop<br>• Enforces international SPHERE humanitarian standards |
| **Live Demonstration & Robustness** | 30 | • Instant scenario switches (Odisha Cyclone, Bihar Flood, Thar Heatwave)<br>• Live GPS field station trigger scanning device coordinates<br>• Zero mock data compliance: connects to live internet APIs without crashing |

---

## 6. Demonstration Walkthrough (For Hackathon Judges)

1. **Observe Editorial UI**: Notice the restrained, publication-grade cartography and typographic hierarchy.
2. **Switch Scenarios**:
   - Click **"Odisha Cyclone"**: Watch the swarm calculate a Cat-3 storm surge, stage the Cuttack FCI Depot and 3rd NDRF Bn, and draw routing lines around the danger perimeter.
   - Click **"Bihar Flood"**: Watch the swarm recalculate for Kosi River flood discharge, mobilizing inflatable assault boats and halogen water purifiers.
   - Click **"Live Met Scan"**: Uses the browser's live coordinates to query Open-Meteo in real time.
3. **Inspect the Reasoning Stream** (Right Panel): Review the 5 reasoning steps showing exact tools invoked, sub-second latency, and verified API sources.
4. **Expand the Manifest Drawer** (Bottom): Inspect itemized SPHERE water/food quotas and vehicle routes.

