"use client"

import StockGrid from "./StockGrid"
import Stock from "./Stock"
import { Device } from "../types/deviceTypes"

type Props = {  
  deviceList: any[]
  stockAreas: any[]
  deviceTypes: any[]
  deviceModels: any[] 
  startDrag: (target: HTMLElement,clientX: number,  clientY: number,device: Device) => void
  handleMouseMove: (e: React.MouseEvent) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  onDrop:(device: Device, stockAreaId: number) => void
  openStockInfoModal: (device: Device) => void
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green"
  stockCellSize: number
  setStockCellSize: React.Dispatch<React.SetStateAction<number>>
}

export default function StockAreas({ deviceList,
                                     stockAreas,
                                     deviceTypes,
                                     deviceModels,
                                     startDrag,
                                     handleMouseMove,
                                     deleteDevice,
                                     draggingDevice,
                                     pendingDevice,
                                     onDrop,
                                     openStockInfoModal,
                                    getMAlert,
                                    stockCellSize,
                                    setStockCellSize
                                    }: Props) {

  return (
    <div className="p-3">
      <div
        style={{
          position: "sticky",
          top: 0,
          display: "flex",
          justifyContent: "flex-end",
          zIndex: 100,
          paddingBottom: "8px",
          background: "white"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "6px",
            padding: "8px",
            borderRadius: "8px"
          }}
        >
          {/* 上段 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <div
              style={{
                minWidth: "48px",
                textAlign: "right",
                fontSize: "12px"
              }}
            >
              {Math.round(stockCellSize / 80 * 100)}%
            </div>

            <button
              onClick={() =>
                setStockCellSize(s => Math.max(24, s - 4))
              }
            >
              −
            </button>

            <button
              onClick={() =>
                setStockCellSize(s => Math.min(120, s + 4))
              }
            >
              ＋
            </button>
          </div>

          {/* 下段スライダー */}
          <input
            type="range"
            min={24}
            max={120}
            step={4}
            value={stockCellSize}
            onChange={(e) =>
              setStockCellSize(Number(e.target.value))
            }
            style={{
              width: "140px"
            }}
          />
        </div>
      </div>
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
                  deviceList={deviceList}     // 修正: deviceList → devices
                  stockAreaID={area.id}
                  deviceTypes={deviceTypes}
                  deviceModels={deviceModels}

                  startDrag={startDrag}
                  handleMouseMove={handleMouseMove}
                  deleteDevice={deleteDevice}
                  draggingDevice={draggingDevice}
                  pendingDevice={pendingDevice}
                  openStockInfoModal={openStockInfoModal}
                  getMAlert={getMAlert}
                  cellSize={stockCellSize}
                />
            </StockGrid>
          </div>
        ))}
      </div>

    </div>
  )
}