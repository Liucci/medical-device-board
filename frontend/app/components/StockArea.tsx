"use client"

import StockGrid from "./StockGrid"
import Stock from "./Stock"
import { stockAreas, Device } from "../types/deviceTypes"

type Props = {  
  devices: Device[]
  startDrag: (e: React.MouseEvent, device: Device) => void
  handleMouseMove: (e: React.MouseEvent) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
}

export default function StockAreas({ devices, startDrag, handleMouseMove, deleteDevice, draggingDevice }: Props) {

  return (
    <div className="p-3">

      <h2 className="text-lg font-bold mb-3">
        ストックエリア
      </h2>
      {/* 倉庫用コンテナの単位当たりのスタイル */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "220px 220px",
          gap: "12px"
        }}
      >
        {/* stockAreasはdeviceTypes.tsで定義された倉庫エリアのリスト。これをマッピングしてStockGridコンポーネントを生成。 */}
        {stockAreas.map((area) => (
          <div
            key={area.id}
            style={{
              gridColumn: area.id === 1 ? "span 3" : undefined
            }}
          >
            {/*StockGirdにtitleを渡す。childrenには条件に応じてStockコンポーネントを配置。*/}
            <StockGrid title={area.name}>
              {/* Stockは機器アイコン作成ファイル */}
              {/*area.id=1のCE室コンテナに機器アイコンを配置するための条件分岐*/}
              {area.id === 1 && (
                <Stock
                  devices={devices}     // 修正: deviceList → devices
                  stockAreaID={1}
                  startDrag={startDrag}
                  handleMouseMove={handleMouseMove}
                  deleteDevice={deleteDevice}
                  draggingDevice={draggingDevice}
                />
              )}
            </StockGrid>
          </div>
        ))}
      </div>

    </div>
  )
}