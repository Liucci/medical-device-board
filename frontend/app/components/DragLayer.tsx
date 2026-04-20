import { Device } from "../types/deviceTypes"
import DeviceIcon from "../utils/DeviceIcon"
//page.tsxからdraggingDeviceとmousePosをpropsで受け取る
type Props = {
  deviceTypes: any[]
  deviceModels: any[] 

  draggingDevice: Device | null
  mousePos: { x: number; y: number }
}

export default function DragLayer({ 
                                    deviceTypes, 
                                    deviceModels,
                                    draggingDevice,
                                    mousePos 
                                  }: Props) {

  if (!draggingDevice) return null

  const typeName =
    deviceTypes.find(t => t.id === draggingDevice.type)?.name ?? "Unknown"

  const modelName =
    deviceModels.find(m => m.id === draggingDevice.model)?.name ?? "Unknown"
  const assetType=draggingDevice.assetType
    //console.log("draggingDevice", draggingDevice)
  //console.log("mousePos", mousePos)

  return (
    <div
        style={{
          position: "fixed",
          left: mousePos.x - 40,
          top: mousePos.y - 30,
          pointerEvents: "none",
          zIndex: 10000
        }}
      >
        <DeviceIcon
          typeName={typeName}
          modelName={modelName}
          assetType={assetType}
        />
      </div>
  )
}