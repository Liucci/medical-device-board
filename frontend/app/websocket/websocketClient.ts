
import { API_BASE_URL } from "../api/client/apiClient"

const WS_URL = API_BASE_URL.replace(/^http/, "ws") + "/ws"

export function connectWebSocket(onCreateDevice: () => void,
                                onDeleteDevice: () => void,
                              )
 {
  const ws = new WebSocket(WS_URL)
  
  ws.onopen = () => {
    console.log("[WebSocket] 接続確立")
  }
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)

    if (message.type === "create_device") {
        console.log("[WebSocket] create_device を検知")
      onCreateDevice()
    }
    if (message.type === "delete_device") {
        console.log("[WebSocket] delete_device を検知")
      onDeleteDevice()
    }
  }

  return ws
}
