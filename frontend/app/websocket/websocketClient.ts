
import { API_BASE_URL } from "../api/client/apiClient"

const WS_URL = API_BASE_URL.replace(/^http/, "ws") + "/ws"

export function connectWebSocket(onCreateDevice: () => void,
                                onDeleteDevice: () => void,
                                onUpdateDevice: () => void,
                                onMoveDevice: () => void,
                                onUpdateWard: () => void,
                                onUpdateStockArea: () => void,
                                onCreateInspection: () => void,
                                onUpdateHospitalSetting: () => void,

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
    if (message.type === "update_device") {
      console.log("[WebSocket] update_device を検知")
      onUpdateDevice()
    }
    if (message.type === "move_device") {
      console.log("[WebSocket] move_device を検知")
      onMoveDevice()
    }
    if (message.type === "update_ward") {
      console.log("[WebSocket] update_ward を検知")
      onUpdateWard()
    }
    if (message.type === "update_stock_area") {
      console.log("[WebSocket] update_stock_area を検知")
      onUpdateStockArea()
    }
    if (message.type === "create_inspection") {
      console.log("[WebSocket] create_inspection を検知")
      onCreateInspection()
    }
    if (message.type === "update_hospital_setting") {
    console.log("[WebSocket] update_hospital_setting を検知")
    onUpdateHospitalSetting()
    }

  }

  return ws
}
