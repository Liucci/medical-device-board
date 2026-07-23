"use client"

import { useMemo, useRef, useState } from "react"
import Draggable from "react-draggable"
import { DeviceModelType } from "../types/deviceModelTypes"

type Device = {
  id: number
  typeName: string
  modelName: string
  isUnderMaintenance?: boolean
  currentWardId?: number | null
}

type Props = {
  devices: Device[]
  deviceModels: DeviceModelType[]
  isDragging?: boolean
}

type SummaryItem = {
  key: string
  typeName: string
  modelName: string
  stockCount: number
  usingCount: number
  maintenanceCount: number
  totalCount: number
}

export default function LowStockPanel({
  devices,
  deviceModels,
  isDragging = false
}: Props) {

  const [collapsed, setCollapsed] = useState(true)
  const nodeRef = useRef<HTMLDivElement>(null)

  const summaries = useMemo(() => {

    const displayMap = new Map(
      deviceModels.map(model => [
        model.name,
        {
          displayRemainingCount: model.displayRemainingCount,
          remainingAlertCount: model.remainingAlertCount
        }
      ])
    )

    const map = new Map<string, SummaryItem>()

    devices.forEach((device) => {

      const key = `${device.typeName}-${device.modelName}`

      if (!map.has(key)) {
        map.set(key, {
          key,
          typeName: device.typeName,
          modelName: device.modelName,
          stockCount: 0,
          usingCount: 0,
          maintenanceCount: 0,
          totalCount: 0
        })
      }

      const item = map.get(key)!

      if (device.isUnderMaintenance) {
        item.maintenanceCount += 1
        item.totalCount += 1
      }
      else if (device.currentWardId) {
        item.usingCount += 1
        item.totalCount += 1
      }
      else {
        item.stockCount += 1
        item.totalCount += 1
      }

    })

    return Array.from(map.values())
      .filter((item) => {

        const model = displayMap.get(item.modelName)

        if (!model) {return false}

        return model.displayRemainingCount

      })
      .sort((a, b) => a.stockCount - b.stockCount)

  }, [devices, deviceModels])

  if (summaries.length === 0) {return null}

  return (
    <Draggable
      handle=".low-stock-handle"
      cancel=".no-drag"
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className={`
          fixed
          top-4
          right-4
          z-[9999]
          w-[260px]
          rounded-lg
          border
          border-gray-300
          bg-white/85
          shadow-lg
          backdrop-blur
          overflow-hidden
          transition-opacity
          duration-150
          ${isDragging ? "opacity-10 pointer-events-none" : "opacity-90"}
        `}
      >

        <div
          className="
            low-stock-handle
            flex
            items-center
            justify-between
            cursor-move
            bg-gray-100
            px-2
            py-1
            font-bold
            select-none
          "
        >
          <span className="text-xs">
            機器残数
          </span>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              no-drag
              rounded
              px-2
              py-1
              text-xs
              hover:bg-gray-200
            "
          >
            {collapsed ? "▼" : "▲"}
          </button>
        </div>

        {!collapsed && (
          <div
            className="
              max-h-[400px]
              overflow-y-auto
              text-xs
            "
          >

            <div
              className="
                grid
                grid-cols-[1fr_36px_36px_36px]
                gap-2
                border-b
                bg-white
                px-2
                py-1
                font-bold
                sticky
                top-0
                z-10
              "
            >
              <div>機種 / 型式</div>
              <div className="text-center">在庫</div>
              <div className="text-center">使用</div>
              <div className="text-center">保守</div>
            </div>

            {summaries.map((item) => {

              const model = deviceModels.find(
                m => m.name === item.modelName
              )

              const alertCount = model?.remainingAlertCount ?? 0

              const stockClass =
                item.stockCount === 0
                  ? "text-red-600 font-bold animate-pulse"
                  : item.stockCount <= alertCount
                  ? "text-yellow-600 font-bold"
                  : ""

              return (
                <div
                  key={item.key}
                  className="
                    grid
                    grid-cols-[1fr_36px_36px_36px]
                    gap-2
                    border-b
                    px-3
                    py-2
                    hover:bg-gray-50
                  "
                >
                  <div className="leading-tight">
                    <div className="font-semibold">
                      {item.typeName}
                    </div>

                    <div className="text-xs text-gray-500">
                      {item.modelName}
                    </div>
                  </div>

                  <div className={`text-center ${stockClass}`}>
                    {item.stockCount}
                  </div>

                  <div className="text-center">
                    {item.usingCount}
                  </div>

                  <div className="text-center">
                    {item.maintenanceCount}
                  </div>

                </div>
              )
            })}

          </div>
        )}

      </div>
    </Draggable>
  )
}