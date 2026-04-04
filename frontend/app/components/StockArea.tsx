"use client"

import StockGrid from "./StockGrid"
import Stock from "./Stock"
import { stockAreas, Device } from "../types/deviceTypes"

type Props = {  
  devices: Device[]
  startDrag: (e: React.MouseEvent, device: Device) => void
  deleteDevice: (id: number) => void
}

export default function StockAreas({ devices, startDrag, deleteDevice }: Props) {

  return (
    <div className="p-3">

      <h2 className="text-lg font-bold mb-3">
        ストックエリア
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "220px 220px",
          gap: "12px"
        }}
      >
        {stockAreas.map((area) => (
          <div
            key={area.id}
            style={{
              gridColumn: area.id === 1 ? "span 3" : undefined
            }}
          >
            <StockGrid title={area.name}>
              {/* CE室だけ Stock を表示 */}
              {area.id === 1 && (
                <Stock
                  devices={devices}     // 修正: deviceList → devices
                  stockAreaID={1}
                  startDrag={startDrag}
                  deleteDevice={deleteDevice}
                />
              )}
            </StockGrid>
          </div>
        ))}
      </div>

    </div>
  )
}