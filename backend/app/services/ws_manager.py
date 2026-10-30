from typing import List
from fastapi import WebSocket
import logging

logger = logging.getLogger("sentinel.ws")

class WebSocketManager:
    MAX_CONNECTIONS: int = 100

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        if len(self.active_connections) >= self.MAX_CONNECTIONS:
            # Drop earliest connection to maintain cap
            old = self.active_connections.pop(0)
            try:
                await old.close(code=1008, reason="Connection pool full")
            except Exception:
                pass

        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket client connected. Active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Active: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)
        
        for dead in dead_connections:
            self.disconnect(dead)

ws_manager = WebSocketManager()

