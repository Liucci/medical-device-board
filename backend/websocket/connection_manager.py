
from fastapi import WebSocket
from typing import Any
from uuid import uuid4


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, dict[str, dict[str, Any]]] = {}

    async def connect(self, websocket: WebSocket, session_id: str, user_id: str, hospital_id: str) -> str:
        await websocket.accept()
        connection_id = str(uuid4())
        if hospital_id not in self.active_connections:
            self.active_connections[hospital_id] = {}
        self.active_connections[hospital_id][connection_id] = {
            "session_id": session_id,
            "user_id": user_id,
            "websocket": websocket
        }
        return connection_id

    def disconnect(self, connection_id: str, hospital_id: str) -> None:
        hospital_connections = self.active_connections.get(hospital_id)
        if not hospital_connections:
            return
        hospital_connections.pop(connection_id, None)
        if not hospital_connections:
            del self.active_connections[hospital_id]

    async def broadcast_to_hospital(self, hospital_id: str, message: dict[str, Any]) -> None:
        hospital_connections = self.active_connections.get(hospital_id)
        if not hospital_connections:
            return
        for connection_id, connection in list(hospital_connections.items()):
            try:
                await connection["websocket"].send_json(message)
            except Exception:
                self.disconnect(connection_id, hospital_id)


connection_manager = ConnectionManager()
