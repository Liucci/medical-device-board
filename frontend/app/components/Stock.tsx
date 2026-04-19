"use client"

import { Device, deviceModels, deviceTypes } from "../types/deviceTypes"
import DeviceIcon from "../utils/DeviceIcon"
import {useRef} from "react"

type Props = {
  deviceList: any[]
  stockAreaID: number
  deviceTypes: any[]
  deviceModels: any[] 
  
  startDrag: (target: HTMLElement,clientX: number,  clientY: number,device: Device) => void
  handleMouseMove: (e: React.MouseEvent) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  openStockInfoModal: (device: Device) => void
}


export default function Stock({
                                deviceList,
                                stockAreaID,
                                deviceTypes,
                                deviceModels,
                                startDrag,
                                handleMouseMove,
                                deleteDevice,
                                draggingDevice,
                                pendingDevice,
                                openStockInfoModal
                              }: Props) {

/*   console.log("Stock CE室ID:", stockAreaID);
  console.log("CE室 devices:", devices.filter(d => d.stockAreaID === stockAreaID));
 */  // この倉庫のdeviceだけ取得
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)        
  const isLongPress = useRef(false)

  //console.log("🔥 devices:", deviceList)
  //console.log("🔥 stockAreaID:", stockAreaID)      
  const areaDevices = deviceList.filter((d) => {
    console.log("CHECK:", {
      status: d.status,
      stockAreaID: d.stockAreaID,
      target: stockAreaID
    })

    return (
      d.status === "stock" &&
      d.stockAreaID === stockAreaID &&
      d.id !== pendingDevice?.id
    )
  })

/*   const areaDevices = deviceList
    .filter(
      (d) => d.status === "stock" &&
      d.stockAreaID === stockAreaID &&
      d.id !== pendingDevice?.id
    )
    .sort((a, b) => {
      // 第1優先：type
      if (a.type !== b.type) {
        return a.type - b.type
      }

      // 第2優先：model
      return a.model - b.model
    }) */

return (
    <>
      {areaDevices.map((d) => {
        //dragging中は座標管理、それ以外はgridで配置するためのフラグ
          const isDragging = draggingDevice?.id === d.id

          const typeName =
            deviceTypes.find((t) => t.id === d.type)?.name || "不明"

          const modelName =
            deviceModels.find((m) => m.id === d.model)?.name || "不明"
          const assetType=d.assetType

          
          console.log("typeName:", typeName, "modelName:", modelName);
        return (
            <div
              key={d.id}

              onMouseDown={(e) => {
                //左クリック以外排除
                if (e.button !== 0) return

                isLongPress.current = false

                // ✅ 必要な値を先に退避
                const target = e.currentTarget as HTMLElement
                const clientX = e.clientX
                const clientY = e.clientY

                longPressTimer.current = setTimeout(() => {
                  console.log("長押し → drag開始")
                  isLongPress.current = true

                  startDrag(target, clientX, clientY, d)
                }, 300)
              }}
              onMouseUp={(e) => {
                //左クリック以外排除
                if (e.button !== 0) return
                if (longPressTimer.current) {
                  clearTimeout(longPressTimer.current)
                  longPressTimer.current = null
                }
                if (!isLongPress.current) {
                  console.log("シングルクリック")
                  console.log("stockDevice",d)
                  openStockInfoModal(d)
                }
              }}

              onMouseLeave={() => {
                if (longPressTimer.current) {
                  clearTimeout(longPressTimer.current)
                  longPressTimer.current = null
                }
              }}


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
            assetType={assetType}
          />

        </div>
      )
    })}
  </>
)
}