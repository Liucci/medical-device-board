"use client"

import { Device } from "../types/deviceTypes"
import { StockAreaType } from "../types/stockTypes"
import { DeviceTypeType } from "../types/deviceTypeTypes"
import { DeviceModelType } from "../types/deviceModelTypes"

import DeviceIcon from "../utils/DeviceIcon"
import {useRef} from "react"
import {
  createLongPressState,
  startLongPress,
  finishLongPress,
  cancelLongPress,
} from "../drag/longPress"
//StockAreA.tsxよりpropを受け取る
type Props = {
  deviceList:  Device[]
  stockAreaId: number
  deviceTypes: DeviceTypeType[]
  deviceModels:  DeviceModelType[]
  managementNumber: string | undefined
  serialNumber: string | undefined

  startDrag: (target: HTMLElement,clientX: number,  clientY: number,device: Device) => void
  handleMouseMove: (e: React.PointerEvent) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  openStockInfoModal: (device: Device) => void
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green"
  cellSize: number
  currentUser: any
  isDragging: boolean
}


export default function Stock({
                                deviceList,
                                stockAreaId,
                                deviceTypes,
                                deviceModels,
                                startDrag,
                                handleMouseMove,
                                deleteDevice,
                                draggingDevice,
                                pendingDevice,
                                openStockInfoModal,
                                getMAlert,
                                cellSize,
                                managementNumber,
                                serialNumber,
                                currentUser,
                                isDragging
                              }: Props) {




/*   console.log("Stock CE室ID:", stockAreaId);
  console.log("CE室 devices:", devices.filter(d => d.stockAreaId === stockAreaId));
 */  // この倉庫のdeviceだけ取得
  //const longPressTimer = useRef<NodeJS.Timeout | null>(null)        
  //const isLongPress = useRef(false)



const longPress = useRef(createLongPressState())
  //console.log("🔥 devices:", deviceList)
  //console.log("🔥 stockAreaId:", stockAreaId)      

   const areaDevices = deviceList
    .filter(
      (d) => d.status === "stock" &&
      d.stockAreaId === stockAreaId &&
      d.id !== pendingDevice?.id
    )
    .sort((a, b) => {
      // 第1優先：type
      if (a.type !== b.type) {
        return a.type - b.type
      }

      // 第2優先：model
      return a.model - b.model
    }) 

return (
    <>
      {areaDevices.map((d) => {
        //dragging中は座標管理、それ以外はgridで配置するためのフラグ
const isCurrentDragging = draggingDevice?.id === d.id
          const typeName =
            deviceTypes.find((t) => t.id === d.type)?.name || "不明"

          const iconColor =
            deviceTypes.find((t) => t.id === d.type)?.iconColor
            ?? "#BFDBFE"

          const modelName =
            deviceModels.find((m) => m.id === d.model)?.name || "不明"
          const assetType=d.assetType

          
          
          //console.log("typeName:", typeName, "modelName:", modelName);
        return (
            <div
              key={d.id}

              onPointerDown={(e) => {
                //左クリック以外排除
                if (e.button !== 0) return
                  // 必要な値を先に取得
                    const target = e.currentTarget as HTMLElement
                    const clientX = e.clientX
                    const clientY = e.clientY
                    startLongPress(
                      longPress.current,
                      () => {

                        if (currentUser?.role === "viewer") {
                          alert("閲覧者は機器移動できません")
                          return
                        }

                        console.log("長押し → drag開始")

                        startDrag(
                          target,
                          clientX,
                          clientY,
                          d
                        )
                      }
                    )
              }}

              onPointerUp={(e) => {
                if (e.button !== 0) return

                finishLongPress(
                  longPress.current,
                  () => {
                    console.log("シングルクリック")
                    console.log("stockDevice", d)
                    openStockInfoModal(d)
                  },
                  isDragging
                )
              }}

              onPointerLeave={() => {
                cancelLongPress(longPress.current)
              }}


              onContextMenu={(e) => {
              e.preventDefault()
              if (d.id === undefined) return
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
                      touchAction: "none",
                      //dragLayerのアイコンドラッグ中はiconを非表示にす
                      visibility: isCurrentDragging ? "hidden" : "visible"                    }
              }
            >
          <DeviceIcon
            typeName={typeName}
            modelName={modelName}
            assetType={assetType}
            iconColor={iconColor}
            managementNumber={d.managementNumber}
            serialNumber={d.serialNumber}
            rentalEndDate={d.rentalEndDate}   
            mAlert={getMAlert(d.id)}
            cellSize={cellSize}
            isUnderMaintenance={d.isUnderMaintenance}
            standby={d.standby}
            standbyStartedAt={d.standbyStartedAt}
          />

        </div>
      )
    })}
  </>
)
}
