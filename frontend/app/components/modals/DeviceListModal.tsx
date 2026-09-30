"use client"

import { useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { ExportDeviceListPdf } from "../../utils/pdf/ExportDeviceListPdf"
import { Device } from "../../types/deviceTypes"
import { RoomType } from "../../types/roomTypes"
import { WardType } from "../../types/wardTypes"
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { HospitalSettingsType } from "../../types/hospitalSettingTypes"
import { exportDeviceListPdfTransaction } from "../../api/transactions/exports/exportDeviceListPdfTransaction"
import { DeviceListExportUIType } from "../../types/exportTypes"
import { exportDeviceListCsvTransaction } from "../../api/transactions/exports/exportDeviceListCsvTransaction"
import { LoadingOverlay } from "../common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

type Props = {
  isOpen: boolean
  onClose: () => void
  deviceList: Device[]
  rooms: RoomType[]
  wards: WardType[]
  stockAreas: StockAreaType[]
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  getLatestMaintenanceTask:
    (deviceId?: number) => {
      name: string
      due_at: string
    } | null
  hospitalSettings: HospitalSettingsType | null
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
  getLatestMaintenanceTask,
  hospitalSettings
}: Props) {
  // ===== search =====
  const [loading, setLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedWards, setSelectedWards] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [maintenanceOnly, setMaintenanceOnly] = useState(false)

  // ===== helper =====
  const getRoom = (roomId?: number) => {
    return rooms.find(
      r =>
        Number(r.id) === Number(roomId)
    )
  }

  const getWardName = (roomId?: number) => {
    const room = getRoom(roomId)

    const ward = wards.find(
      w =>
        Number(w.id) === Number(room?.wardId)
    )

    return ward?.name ?? ""
  }

  const getStockAreaName = (stockAreaId?: number) => {
    return (
      stockAreas.find(
        s =>
          Number(s.id) === Number(stockAreaId)
      )?.name ?? ""
    )
  }

  const getTypeName = (typeId?: number) => {
    return (
      deviceTypes.find(
        t =>
          Number(t.id) === Number(typeId)
      )?.name ?? ""
    )
  }

  const getModelName = (modelId?: number) => {
    return (
      deviceModels.find(
        m =>
          Number(m.id) === Number(modelId)
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
      setList(list.filter(v => v !== value))
      return
    }

    setList([...list, value])
  }

  const clearSearchConditions = () => {
    setSelectedStatuses([])
    setSelectedWards([])
    setSelectedTypes([])
    setMaintenanceOnly(false)
  }

  // ===== options =====
  const locationOptions = useMemo(() => {
    const wardNames =
      (deviceList ?? [])
        .filter(d => d.status === "room")
        .map(d => getWardName(d.roomId))
        .filter(Boolean)

    const stockNames =
      (deviceList ?? [])
        .filter(d => d.status === "stock")
        .map(d =>
          getStockAreaName(d.stockAreaId)
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
          .map(d => getTypeName(d.type))
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
          selectedStatuses.length > 0 &&
          !selectedStatuses.includes(
            device.status ?? ""
          )
        ) {
          return false
        }

        // ===== maintenance =====
        if (
          maintenanceOnly &&
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
              ? getWardName(device.roomId)
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
            getTypeName(device.type)

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
          a.isUnderMaintenance &&
          !b.isUnderMaintenance
        ) {
          return -1
        }

        if (
          !a.isUnderMaintenance &&
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
          getRoom(a.roomId)?.name ?? ""

        const roomB =
          getRoom(b.roomId)?.name ?? ""

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
    stockAreas,
    deviceTypes
  ])

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
        status: device.status ?? "",
        isUnderMaintenance:
          device.isUnderMaintenance ?? false,
        standby: device.standby ?? false,
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
          hospitalSettings?.showPatientName &&
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
        note: device.note,
        maintenanceName:
          task?.name ?? "",
        dueAt:
          task?.due_at ?? ""
      }
    })
  }, [
    filteredList,
    hospitalSettings,
    rooms,
    wards,
    stockAreas,
    deviceTypes,
    deviceModels,
    getLatestMaintenanceTask
  ])

  if (!isOpen) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:p-4"
        onMouseDown={e => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <div
          className="
            flex h-full w-full flex-col overflow-hidden
            bg-slate-50 text-slate-900
            sm:h-[92vh] sm:max-h-[94vh] sm:max-w-[1500px]
            sm:rounded-2xl sm:border sm:border-slate-300 sm:shadow-2xl
          "
          onMouseDown={e => e.stopPropagation()}
        >
          {/* ===== header ===== */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-4 text-white sm:px-5">
            <h2 className="text-base font-bold tracking-wide sm:text-lg">
              機器一覧
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  executeWithErrorAndLoading({
                    setLoading,
                    action: () =>
                      exportDeviceListCsvTransaction(
                        filteredDeviceLists,
                        hospitalSettings?.showPatientName ?? false
                      )
                  })
                }
                className="
                  h-8 rounded-lg border border-slate-600
                  bg-slate-800 px-3 text-xs font-bold text-slate-100
                  transition hover:bg-slate-700
                "
              >
                CSV出力
              </button>

              <button
                type="button"
                onClick={() =>
                  executeWithErrorAndLoading({
                    setLoading,
                    action: () =>
                      exportDeviceListPdfTransaction(
                        filteredDeviceLists,
                        hospitalSettings?.showPatientName ?? false
                      )
                  })
                }
                className="
                  h-8 rounded-lg bg-teal-700 px-3
                  text-xs font-bold text-white
                  transition hover:bg-teal-800
                "
              >
                PDF出力
              </button>

              <button
                type="button"
                onClick={onClose}
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg text-slate-300
                  transition hover:bg-slate-700 hover:text-white
                "
                aria-label="閉じる"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ===== main ===== */}
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4">
            {/* ===== search section ===== */}
            <section className="shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() =>
                  setSearchOpen(prev => !prev)
                }
                className="
                  flex w-full items-center justify-between
                  border-b border-slate-100 px-4 py-3
                  text-left transition hover:bg-slate-50
                  sm:px-5
                "
              >
                <div>
                  <div className="text-xs font-bold tracking-wide text-slate-700">
                    検索条件
                  </div>

                  {!searchOpen && (
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      条件を指定して機器を絞り込みます
                    </div>
                  )}
                </div>

                {searchOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </button>

              {searchOpen && (
                <div className="max-h-[55vh] overflow-y-auto p-4 sm:max-h-none sm:overflow-visible sm:p-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {/* ===== status ===== */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        状態
                      </label>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <label className="
                          flex cursor-pointer items-center gap-2
                          rounded-md px-2 py-1.5
                          text-sm text-slate-700
                          hover:bg-white
                        ">
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes("room")}
                            onChange={() =>
                              toggleSelection(
                                "room",
                                selectedStatuses,
                                setSelectedStatuses
                              )
                            }
                            className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                          />

                          <span>病室</span>
                        </label>

                        <label className="
                          flex cursor-pointer items-center gap-2
                          rounded-md px-2 py-1.5
                          text-sm text-slate-700
                          hover:bg-white
                        ">
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes("stock")}
                            onChange={() =>
                              toggleSelection(
                                "stock",
                                selectedStatuses,
                                setSelectedStatuses
                              )
                            }
                            className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                          />

                          <span>在庫</span>
                        </label>
                      </div>
                    </div>

                    {/* ===== maintenance ===== */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        保守
                      </label>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <label className="
                          flex cursor-pointer items-center gap-2
                          rounded-md px-2 py-1.5
                          text-sm text-slate-700
                          hover:bg-white
                        ">
                          <input
                            type="checkbox"
                            checked={maintenanceOnly}
                            onChange={e =>
                              setMaintenanceOnly(
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                          />

                          <span>保守中のみ</span>
                        </label>
                      </div>
                    </div>

                    {/* ===== location ===== */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        病棟 / 保管場所
                      </label>

                      <div className="max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
                        {locationOptions.length === 0 ? (
                          <div className="px-2 py-2 text-xs text-slate-400">
                            選択肢がありません
                          </div>
                        ) : (
                          locationOptions.map(location => (
                            <label
                              key={location}
                              className="
                                flex cursor-pointer items-center gap-2
                                rounded-md px-2 py-1.5
                                text-sm text-slate-700
                                hover:bg-white
                              "
                            >
                              <input
                                type="checkbox"
                                checked={selectedWards.includes(
                                  location
                                )}
                                onChange={() =>
                                  toggleSelection(
                                    location,
                                    selectedWards,
                                    setSelectedWards
                                  )
                                }
                                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                              />

                              <span>{location}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>

                    {/* ===== type ===== */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        機種
                      </label>

                      <div className="max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
                        {typeOptions.length === 0 ? (
                          <div className="px-2 py-2 text-xs text-slate-400">
                            選択肢がありません
                          </div>
                        ) : (
                          typeOptions.map(type => (
                            <label
                              key={type}
                              className="
                                flex cursor-pointer items-center gap-2
                                rounded-md px-2 py-1.5
                                text-sm text-slate-700
                                hover:bg-white
                              "
                            >
                              <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() =>
                                  toggleSelection(
                                    type,
                                    selectedTypes,
                                    setSelectedTypes
                                  )
                                }
                                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                              />

                              <span>{type}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ===== clear ===== */}
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={clearSearchConditions}
                      className="
                        h-10 w-full rounded-lg
                        border border-slate-300
                        bg-slate-50 px-4
                        text-xs font-bold text-slate-700
                        transition hover:bg-slate-100
                        sm:w-auto sm:min-w-32
                      "
                    >
                      条件をクリア
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* ===== device list section ===== */}
            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* ===== section header ===== */}
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                <div className="text-xs font-bold tracking-wide text-slate-700">
                  機器一覧
                </div>

                <div className="text-xs font-medium text-slate-500">
                  検索結果：{filteredList.length}件
                </div>
              </div>

              {/* ===== table scroll area ===== */}
              <div className="min-h-0 flex-1 overflow-auto">
                <table className="min-w-[1050px] border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-100">
                    <tr>
                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        状態
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center font-bold text-slate-600">
                        保守
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        病棟
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        病室/保管場所
                      </th>

                      {hospitalSettings?.showPatientName && (
                        <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                          患者名
                        </th>
                      )}

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        機種名
                      </th>

                      <th className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        型式
                      </th>

                      <th className="whitespace-nowrap border-b border-slate-200 px-2.5 py-2 text-left font-bold text-slate-600">
                        直近期限メンテナンス
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredList.length === 0 && (
                      <tr>
                        <td
                          colSpan={
                            hospitalSettings?.showPatientName
                              ? 8
                              : 7
                          }
                          className="border-b border-slate-200 px-4 py-10 text-center text-sm text-slate-400"
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
                            transition hover:bg-slate-50
                            ${
                              device.isUnderMaintenance
                                ? "bg-rose-50"
                                : ""
                            }
                          `}
                        >
                          {/* ===== status ===== */}
                          <td
                            className={`
                              whitespace-nowrap
                              border-b border-r border-slate-200
                              px-2.5 py-2
                              font-bold
                              ${
                                device.isUnderMaintenance
                                  ? "text-rose-600"
                                  : "text-slate-700"
                              }
                            `}
                          >
                            {device.status === "room"
                              ? "病室"
                              : device.status === "stock"
                                ? "在庫"
                                : device.status}
                          </td>

                          {/* ===== maintenance ===== */}
                          <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-center">
                            {device.isUnderMaintenance ? (
                              <span className="
                                inline-flex min-w-[64px]
                                items-center justify-center
                                rounded-full
                                bg-rose-600
                                px-2 py-1
                                text-xs font-bold text-white
                              ">
                                保守中
                              </span>
                            ) : (
                              <span className="text-slate-400">
                                -
                              </span>
                            )}
                          </td>

                          {/* ===== ward ===== */}
                          <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                            {device.status === "room"
                              ? getWardName(
                                  device.roomId
                                )
                              : "-"}
                          </td>

                          {/* ===== room ===== */}
                          <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                            {device.status === "room"
                              ? room?.name ?? "-"
                              : getStockAreaName(
                                  device.stockAreaId
                                ) || "-"}
                          </td>

                          {/* ===== patient ===== */}
                          {hospitalSettings?.showPatientName && (
                            <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                              {device.status === "room"
                                ? room?.patientName ?? "-"
                                : "-"}
                            </td>
                          )}

                          {/* ===== type ===== */}
                          <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                            {getTypeName(device.type) || "-"}
                          </td>

                          {/* ===== model ===== */}
                          <td className="whitespace-nowrap border-b border-r border-slate-200 px-2.5 py-2 text-slate-700">
                            {getModelName(device.model) || "-"}
                          </td>

                          {/* ===== task ===== */}
                          <td className="whitespace-nowrap border-b border-slate-200 px-2.5 py-2 text-slate-700">
                            {task?.name ?? "-"}

                            {task?.due_at &&
                              ` (${new Date(
                                task.due_at
                              ).toLocaleDateString(
                                "ja-JP"
                              )})`}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>

      <LoadingOverlay loading={loading} />
    </>,
    document.body
  )
}