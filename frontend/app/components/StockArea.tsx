"use client"

import StockGrid from "./StockGrid"
import Stock from "./Stock"
import { stockAreas, Device } from "../types/deviceTypes"

type Props = {  
  devices: Device[]
  startDrag: (target: HTMLElement,clientX: number,  clientY: number,device: Device) => void
  handleMouseMove: (e: React.MouseEvent) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  onDrop:(device: Device, stockAreaId: number) => void
  openStockInfoModal: (device: Device) => void
}

export default function StockAreas({ devices,
                                     startDrag,
                                     handleMouseMove,
                                     deleteDevice,
                                     draggingDevice,
                                     pendingDevice,
                                     onDrop,
                                     openStockInfoModal
                                    }: Props) {

  return (
    <div className="p-3">

      <h2 className="text-lg font-bold mb-3">
        ストックエリア
      </h2>
      {/* 倉庫用コンテナの単位当たりのスタイル */}
      <div
        style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px"
        }}
      >
    {stockAreas.map((area) => (
      <div
        key={area.id}
        style={{
          gridColumn: area.id === 1 ? "span 3" : undefined
        }}

        // ★ここに追加
        onMouseUp={() => {
          if (!draggingDevice) return
          //onDropにdraggingDeviceとarea.idを渡す
          onDrop(draggingDevice, area.id)
        }}
  >            {/*StockGirdにtitleを渡す。childrenには条件に応じてStockコンポーネントを配置。*/}
          <StockGrid
              title={area.name}
            >             
              {/* Stockは機器アイコン作成ファイル */}
                <Stock
                  devices={devices}     // 修正: deviceList → devices
                  stockAreaID={area.id}
                  startDrag={startDrag}
                  handleMouseMove={handleMouseMove}
                  deleteDevice={deleteDevice}
                  draggingDevice={draggingDevice}
                  pendingDevice={pendingDevice}
                  openStockInfoModal={openStockInfoModal}

                />
            </StockGrid>
          </div>
        ))}
      </div>

    </div>
  )
}