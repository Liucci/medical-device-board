from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Cookie
from websocket.connection_manager import connection_manager
from session.fetch_session import fetch_session


router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(
                                websocket: WebSocket,
                                session_id: str | None = Cookie(default=None)
):
    if not session_id:
        await websocket.close(code=1008)
        return

    session = fetch_session(session_id)

    if session is None:
        await websocket.close(code=1008)
        return

    connection_id = await connection_manager.connect(
                                                    websocket=websocket,
                                                    session_id=session_id,
                                                    user_id=session.user_id,
                                                    hospital_id=session.hospital_id
                                            )

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.disconnect(
            connection_id=connection_id,
            hospital_id=session.hospital_id
        )
