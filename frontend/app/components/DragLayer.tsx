import { Device } from "../types/deviceTypes"
import DeviceIcon from "../utils/DeviceIcon"
//page.tsxからdraggingDeviceとmousePosをpropsで受け取る
type Props = {
  deviceTypes: any[]
  deviceModels: any[] 

  draggingDevice: Device | null
  mousePos: { x: number; y: number }
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green"
}

export default function DragLayer({ 
                                    deviceTypes, 
                                    deviceModels,
                                    draggingDevice,
                                    mousePos ,
                                    getMAlert
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
        className="dragging-effect" //drag開始時アイコン拡大エフェクト
      >
        <DeviceIcon
          typeName={typeName}
          modelName={modelName}
          assetType={assetType}
          managementNumber={draggingDevice.managementNumber}
          serialNumber={draggingDevice.serialNumber}
          mAlert={getMAlert(draggingDevice.id)}
          cellSize={80} //ドラッグ中はアイコンを大きく表示
          //isDragging={true}
        />
      </div>
  )
}