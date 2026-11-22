
import { API_BASE_URL } from "../api/client/apiClient"

const WS_URL = API_BASE_URL.replace(/^http/, "ws") + "/ws"

export function connectWebSocket(onCreateDevice: () => void,
                                onDeleteDevice: () => void,
                                onUpdateDevice: () => void,
                                onMoveDevice: () => void,
                                onUpdateWard: () => void,
                                onUpdateRoom: () => void,
                                onUpdateStockArea: () => void,
                                onCreateInspection: () => void,
                                onUpdateHospitalSetting: () => void,
                                onUpdateAnnouncement: () => void,
                                onUpdateDeviceType: () => void,
                                onUpdateDeviceModel: () => void,
                                onUpdateMaintenanceType: () => void,
                                onUpdateInfectionType: () => void,
                                onUpdateRoomInfection: () => void,

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
    if (message.type === "update_room") {
      console.log("[WebSocket] update_room を検知")
      onUpdateRoom()
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
    if (message.type === "update_announcement") {
      console.log("[WebSocket] update_announcement を検知")
      onUpdateAnnouncement()
    }
    if (message.type === "update_device_type") {
    console.log("[WebSocket] update_device_type を検知")
    onUpdateDeviceType()
    }

    if (message.type === "update_device_model") {
      console.log("[WebSocket] update_device_model を検知")
      onUpdateDeviceModel()
    }

    if (message.type === "update_maintenance_type") {
      console.log("[WebSocket] update_maintenance_type を検知")
      onUpdateMaintenanceType()
    }

    if (message.type === "update_infection_type") {
      console.log("[WebSocket] update_infection_type を検知")
      onUpdateInfectionType()
    }
    if (message.type === "update_room_infection") {
      console.log("[WebSocket] update_room_infection を検知")
      onUpdateRoomInfection()
    }

}

  return ws
}
