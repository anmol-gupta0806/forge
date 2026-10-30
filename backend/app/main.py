import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from app.core.config import settings
from app.api.routes import threats, swarm, data
from app.services.ws_manager import ws_manager

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Autonomous multi-agent disaster intelligence and supply chain logistics swarm."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect API routers
app.include_router(threats.router, prefix="/api/v1")
app.include_router(swarm.router, prefix="/api/v1")
app.include_router(data.router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "mode": "autonomous_active",
        "upstream_apis": {
            "open_meteo": "operational",
            "osrm_routing": "operational",
            "gdacs_georss": "operational",
            "data_gov_in": "synced"
        }
    }

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Send periodic telemetry heartbeat
            await asyncio.sleep(15)
            await websocket.send_json({
                "type": "HEARTBEAT",
                "status": "MONITORING_ACTIVE",
                "nodes_online": 5,
                "upstream_sync": "100%"
            })
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
