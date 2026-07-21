"use client"

import { useMemo, useState } from "react"
import { ExportDeviceListPdf } from "../../utils/ExportDeviceListPdf"
import { createPortal } from "react-dom"
import { Device } from "../../types/deviceTypes"
import { RoomType } from "../../types/roomTypes"
import { WardType } from "../../types/wardTypes"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import {exportDeviceListPdfTransaction}from "../../api/transactions/exports/exportDeviceListPdfTransaction"
import {DeviceListExportUIType}from "../../types/exportTypes"
import {exportDeviceListCsvTransaction}from "../../api/transactions/exports/exportDeviceListCsvTransaction"
import {LoadingOverlay} from "../common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"




type Props = {
  isOpen: boolean
  onClose: () => void
  deviceList: Device[]
  rooms: RoomType[]
  wards:WardType[]
  stockAreas: StockAreaType[]
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  getLatestMaintenanceTask:
    (deviceId?: number) => {
      name: string
      due_at: string
    } | null
}

export default function DeviceListModal({
  isOpen,
  onClose,
  deviceList,
  rooms,
  wards,
  stockAreas,
  deviceTypes,
  deviceModels,
  getLatestMaintenanceTask
}: Props) {

  // ===== search =====
  const [loading, setLoading] = useState(false)

  const [
    selectedStatuses,
    setSelectedStatuses
  ] = useState<string[]>([])

  const [
    selectedWards,
    setSelectedWards
  ] = useState<string[]>([])

  const [
    selectedTypes,
    setSelectedTypes
  ] = useState<string[]>([])

  const [
    maintenanceOnly,
    setMaintenanceOnly
  ] = useState(false)

  // ===== helper =====

  const getRoom = (
    roomId?: number
  ) => {

    return rooms.find(
      r =>
        Number(r.id)
        === Number(roomId)
    )

  }

  const getWardName = (
    roomId?: number
  ) => {

    const room =
      getRoom(roomId)

    const ward =
      wards.find(
        w =>
          Number(w.id)
          === Number(room?.wardId)
      )

    return ward?.name ?? ""

  }

  const getStockAreaName = (
    stockAreaId?: number
  ) => {

    return (
      stockAreas.find(
        s =>
          Number(s.id)
          === Number(stockAreaId)
      )?.name ?? ""
    )

  }

  const getTypeName = (
    typeId?: number
  ) => {

    return (
      deviceTypes.find(
        t =>
          Number(t.id)
          === Number(typeId)
      )?.name ?? ""
    )

  }

  const getModelName = (
    modelId?: number
  ) => {

    return (
      deviceModels.find(
        m =>
          Number(m.id)
          === Number(modelId)
      )?.name ?? ""
    )

  }

  // ===== checkbox helper =====

  const toggleSelection = (
    value: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {

    if (list.includes(value)) {

      setList(
        list.filter(v => v !== value)
      )

    } else {

      setList([
        ...list,
        value
      ])

    }

  }

  // ===== options =====

  const locationOptions = useMemo(() => {

    const wardNames =
      (deviceList ?? [])
        .filter(
          d => d.status === "room"
        )
        .map(d =>
          getWardName(d.roomId)
        )
        .filter(Boolean)

    const stockNames =
      (deviceList ?? [])
        .filter(
          d => d.status === "stock"
        )
        .map(d =>
          getStockAreaName(
            d.stockAreaId
          )
        )
        .filter(Boolean)

    return Array.from(
      new Set([
        ...wardNames,
        ...stockNames
      ])
    )

  }, [
    deviceList,
    rooms,
    wards,
    stockAreas
  ])

  const typeOptions = useMemo(() => {

    return Array.from(
      new Set(
        (deviceList ?? [])
          .map(d =>
            getTypeName(d.type)
          )
          .filter(Boolean)
      )
    )

  }, [
    deviceList,
    deviceTypes
  ])

  // ===== filter =====

  const filteredList = useMemo(() => {

    return (deviceList ?? [])

      .filter(device => {

        // ===== status =====

        if (
          selectedStatuses.length > 0
          &&
          !selectedStatuses.includes(
            device.status ?? ""
          )
        ) {

          return false

        }

        // ===== maintenance =====

        if (
          maintenanceOnly
          &&
          !device.isUnderMaintenance
        ) {

          return false

        }

        // ===== ward =====

        if (
          selectedWards.length > 0
        ) {

          const locationName =

            device.status === "room"

              ? getWardName(
                  device.roomId
                )

              : getStockAreaName(
                  device.stockAreaId
                )

          if (
            !selectedWards.includes(
              locationName
            )
          ) {

            return false

          }

        }

        // ===== type =====

        if (
          selectedTypes.length > 0
        ) {

          const typeName =
            getTypeName(
              device.type
            )

          if (
            !selectedTypes.includes(
              typeName
            )
          ) {

            return false

          }

        }

        return true

      })

      // ===== sort =====

      .sort((a, b) => {

        // ===== 保守中優先 =====

        if (
          a.isUnderMaintenance
          &&
          !b.isUnderMaintenance
        ) {

          return -1

        }

        if (
          !a.isUnderMaintenance
          &&
          b.isUnderMaintenance
        ) {

          return 1

        }

        // ===== 状態 =====

        const statusCompare =
          (a.status ?? "")
            .localeCompare(
              b.status ?? "",
              "ja",
              { numeric: true }
            )

        if (statusCompare !== 0) {

          return statusCompare

        }

        // ===== 病棟 =====

        const wardCompare =
          getWardName(a.roomId)
            .localeCompare(
              getWardName(b.roomId),
              "ja",
              { numeric: true }
            )

        if (wardCompare !== 0) {

          return wardCompare

        }

        // ===== 病室 =====

        const roomA =
          getRoom(a.roomId)
            ?.name ?? ""

        const roomB =
          getRoom(b.roomId)
            ?.name ?? ""

        return roomA.localeCompare(
          roomB,
          "ja",
          { numeric: true }
        )

      })

  }, [
    deviceList,
    selectedStatuses,
    selectedWards,
    selectedTypes,
    maintenanceOnly,
    rooms,
    wards,
    deviceTypes
  ])

  // ===== CSV =====



  // ===== PDF =====
const filteredDeviceLists = useMemo(() => {

  return filteredList.map(device => {

    const room =
      getRoom(device.roomId)

    const task =
      getLatestMaintenanceTask(
        device.id
      )

    return {

      status:
        device.status??"",

      isUnderMaintenance:
        device.isUnderMaintenance?? false,

      standby:
        device.standby?? false,

      wardName:
        device.status === "room"
          ? getWardName(device.roomId)
          : "",

      roomName:
        device.status === "room"
          ? room?.name ?? ""
          : "",

      stockAreaName:
        device.status === "stock"
          ? getStockAreaName(
              device.stockAreaId
            )
          : "",

      patientName:
        device.status === "room"
          ? room?.patientName ?? ""
          : "",

      deviceTypeName:
        getTypeName(device.type),

      deviceModelName:
        getModelName(device.model),

      managementNumber:
        device.managementNumber,

      serialNumber:
        device.serialNumber,

      note:
        device.note,

      maintenanceName:
        task?.name ?? "",

      dueAt:
        task?.due_at ?? ""

    }

  })

}, [
    filteredList
])


  if (!isOpen) return null

  return createPortal(
  <>
    <div
      className="
        fixed inset-0
        bg-black/40
        flex items-center justify-center
        z-9999
      "
    >

      <div
        className="
          bg-white
          w-[95vw]
          h-[85vh]
          rounded-xl
          p-4
          flex flex-col
        "
      >

        {/* ===== header ===== */}

        <div className="
          flex
          justify-between
          items-center
          mb-4
        ">

          <h2 className="text-xl font-bold">
            機器一覧
          </h2>

          <div className="flex gap-2">

            <button
                onClick={() =>
                executeWithErrorAndLoading({
                                            setLoading,
                                            action: () =>
                                                exportDeviceListCsvTransaction(filteredDeviceLists)
                })
                }
              className="
                px-3 py-1
                bg-green-600
                text-white
                rounded
              "
            >
              CSV出力
            </button>

            <button
              onClick={() =>
                executeWithErrorAndLoading({
                                            setLoading,
                                            action: () =>
                                                exportDeviceListPdfTransaction(filteredDeviceLists)
                })
              }
              className="
                px-3 py-1
                bg-blue-500
                text-white
                rounded
              "
            >
              PDF出力
            </button>

            <button
              onClick={onClose}
              className="
                px-3 py-1
                bg-gray-300
                rounded
              "
            >
              閉じる
            </button>

          </div>

        </div>

        {/* ===== search ===== */}

        <div className="
          grid
          grid-cols-4
          gap-4
          mb-4
          text-sm
        ">

          {/* ===== status ===== */}

          <div>

            <label className="
              text-xs
              text-gray-600
              mb-1
              block
            ">
              状態
            </label>

            <div className="
              border
              rounded
              p-2
              space-y-1
            ">

              <label className="block">

                <input
                  type="checkbox"
                  checked={
                    selectedStatuses.includes(
                      "room"
                    )
                  }
                  onChange={() =>
                    toggleSelection(
                      "room",
                      selectedStatuses,
                      setSelectedStatuses
                    )
                  }
                />

                <span className="ml-1">
                  病室
                </span>

              </label>

              <label className="block">

                <input
                  type="checkbox"
                  checked={
                    selectedStatuses.includes(
                      "stock"
                    )
                  }
                  onChange={() =>
                    toggleSelection(
                      "stock",
                      selectedStatuses,
                      setSelectedStatuses
                    )
                  }
                />

                <span className="ml-1">
                  在庫
                </span>

              </label>

            </div>

          </div>

          {/* ===== maintenance ===== */}

          <div>

            <label className="
              text-xs
              text-gray-600
              mb-1
              block
            ">
              保守
            </label>

            <div className="
              border
              rounded
              p-2
            ">

              <label className="block">

                <input
                  type="checkbox"
                  checked={maintenanceOnly}
                  onChange={e =>
                    setMaintenanceOnly(
                      e.target.checked
                    )
                  }
                />

                <span className="ml-1">
                  保守中のみ
                </span>

              </label>

            </div>

          </div>

          {/* ===== ward ===== */}

          <div>

            <label className="
              text-xs
              text-gray-600
              mb-1
              block
            ">
              病棟/保管場所
            </label>

            <div className="
              border
              rounded
              p-2
              max-h-32
              overflow-auto
            ">

              {locationOptions.map(location => (

                <label
                  key={location}
                  className="block"
                >

                  <input
                    type="checkbox"
                    checked={
                      selectedWards.includes(
                        location
                      )
                    }
                    onChange={() =>
                      toggleSelection(
                        location,
                        selectedWards,
                        setSelectedWards
                      )
                    }
                  />

                  <span className="ml-1">
                    {location}
                  </span>

                </label>

              ))}

            </div>

          </div>

          {/* ===== type ===== */}

          <div>

            <label className="
              text-xs
              text-gray-600
              mb-1
              block
            ">
              機種
            </label>

            <div className="
              border
              rounded
              p-2
              max-h-32
              overflow-auto
            ">

              {typeOptions.map(type => (

                <label
                  key={type}
                  className="block"
                >

                  <input
                    type="checkbox"
                    checked={
                      selectedTypes.includes(
                        type
                      )
                    }
                    onChange={() =>
                      toggleSelection(
                        type,
                        selectedTypes,
                        setSelectedTypes
                      )
                    }
                  />

                  <span className="ml-1">
                    {type}
                  </span>

                </label>

              ))}

            </div>

          </div>

        </div>

        {/* ===== count ===== */}

        <div className="
          mb-2
          text-sm
          text-gray-600
        ">
          検索結果：
          {filteredList.length}件
        </div>

        {/* ===== table ===== */}

        <div className="
          flex-1
          overflow-auto
          border
        ">

          <table className="
            w-full
            text-sm
            border-collapse
          ">

            <thead className="
              sticky
              top-0
              bg-gray-100
              z-10
            ">

              <tr>

                <th className="border p-2">
                  状態
                </th>

                <th className="border p-2">
                  保守
                </th>

                <th className="border p-2">
                  病棟
                </th>

                <th className="border p-2">
                  病室/保管場所
                </th>

                <th className="border p-2">
                  患者名
                </th>

                <th className="border p-2">
                  機種名
                </th>

                <th className="border p-2">
                  型式
                </th>

                <th className="border p-2">
                  直近期限メンテナンス
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredList.length === 0 && (

                <tr>

                  <td
                    colSpan={8}
                    className="
                      border
                      p-8
                      text-center
                      text-gray-500
                    "
                  >
                    データがありません
                  </td>

                </tr>

              )}

              {filteredList.map(device => {

                const room =
                  getRoom(device.roomId)

                const task =
                  getLatestMaintenanceTask(
                    device.id
                  )

                return (

                  <tr
                    key={device.id}
                    className={`
                      hover:bg-gray-50

                      ${
                        device.isUnderMaintenance
                          ? "bg-red-50"
                          : ""
                      }
                    `}
                  >

                    {/* ===== status ===== */}

                    <td
                      className={`
                        border
                        p-2
                        font-bold

                        ${
                          device.isUnderMaintenance
                            ? "text-red-600"
                            : ""
                        }
                      `}
                    >
                      {device.status}
                    </td>

                    {/* ===== maintenance ===== */}

                    <td className="
                      border
                      p-2
                      text-center
                    ">

                      {device.isUnderMaintenance ? (

                        <span
                          className="
                            inline-flex
                            items-center
                            justify-center

                            min-w-[72px]

                            px-2
                            py-1

                            rounded-full

                            bg-red-600
                            text-white

                            text-xs
                            font-bold

                            animate-pulse
                          "
                        >
                          保守中
                        </span>

                      ) : (

                        <span className="text-gray-400">
                          -
                        </span>

                      )}

                    </td>

                    {/* ===== ward ===== */}

                    <td className="border p-2">

                      {
                        device.status === "room"
                          ? getWardName(
                              device.roomId
                            )
                          : ""
                      }

                    </td>

                    {/* ===== room ===== */}

                    <td className="border p-2">

                      {
                        device.status === "room"
                          ? room?.name ?? ""
                          : getStockAreaName(
                              device.stockAreaId
                            )
                      }

                    </td>

                    {/* ===== patient ===== */}

                    <td className="border p-2">

                      {
                        device.status === "room"
                          ? room?.patientName ?? ""
                          : ""
                      }

                    </td>

                    {/* ===== type ===== */}

                    <td className="border p-2">
                      {getTypeName(device.type)}
                    </td>

                    {/* ===== model ===== */}

                    <td className="border p-2">
                      {getModelName(device.model)}
                    </td>

                    {/* ===== task ===== */}

                    <td className="border p-2">

                      {task?.name}

                      {task?.due_at &&
                        ` (${new Date(
                          task.due_at
                        ).toLocaleDateString(
                          "ja-JP"
                        )})`
                      }

                    </td>

                  </tr>

                )

              })}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  <LoadingOverlay loading={loading} />
  </>
    ,
    document.body

  )

}