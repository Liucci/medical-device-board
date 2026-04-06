"use client"

import { Device, deviceModels, deviceTypes } from "../types/deviceTypes"
import DeviceIcon from "../utils/DeviceIcon"
type Props = {
  devices: Device[]
  stockAreaID: number
 startDrag: (e: React.MouseEvent, device: Device) => void
  handleMouseMove: (e: React.MouseEvent) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
}


export default function Stock({
                                devices,
                                stockAreaID,
                                startDrag,
                                handleMouseMove,
                                deleteDevice,
                                draggingDevice
                              }: Props) {

/*   console.log("Stock CE室ID:", stockAreaID);
  console.log("CE室 devices:", devices.filter(d => d.stockAreaID === stockAreaID));
 */  // この倉庫のdeviceだけ取得
  const areaDevices = devices.filter(
    (d) => d.stockAreaID === stockAreaID
  )

  return (
    <>
      {areaDevices.map((d) => {
        //dragging中は座標管理、それ以外はgridで配置するためのフラグ
        const isDragging = draggingDevice?.id === d.id

        const typeName =
          deviceTypes.find((t) => t.typeID === d.type)?.name || "不明"

        const modelName =
          deviceModels.find((m) => m.modelID === d.model)?.name || "不明"
          //console.log("typeName:", typeName, "modelName:", modelName);
        return (
          <div  
            key={d.id}
            onMouseDown={(e) => startDrag(e, d)}
 
              onContextMenu={(e) => {
              e.preventDefault()
              if (confirm(`${typeName} ${modelName} を削除しますか？`)) {
                deleteDevice(d.id)
              }
            }}
              /*draggingDeviceのidと現在のdeviceのidが同じ場合は、
              position:relativeでマウスに追従させる。
              それ以外はgridの位置に配置する。*/ 
              style={
                   {
                      gridColumn: d.col,
                      gridRow: d.row,
                      cursor: "grab",
                      //dragLayerのアイコンドラッグ中はiconを非表示にす
                      visibility: isDragging ? "hidden" : "visible"
                    }
              }
            >
          <DeviceIcon
            typeName={typeName}
            modelName={modelName}
          />

        </div>
      )
    })}
  </>
)
}