"use client"

import { useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { History }from "../../types/historyTypes"
import {exportHistoryPdfTransaction}from "../../api/transactions/exports/exportHistoryPdfTransaction"
import {exportHistoryCsvTransaction}from "../../api/transactions/exports/exportHistoryCsvTransaction"


type Props = {
  isOpen: boolean
  onClose: () => void
  histories: History[]
}

export default function HistoryModal({
  isOpen,
  onClose,
  histories
}: Props) {

  // ===== search =====

  const [startDate, setStartDate]
    = useState("")

  const [endDate, setEndDate]
    = useState("")

  const [
    selectedDeviceTypes,
    setSelectedDeviceTypes
  ] = useState<string[]>([])

  const [
    selectedDeviceModels,
    setSelectedDeviceModels
  ] = useState<string[]>([])

  const [
    selectedActionTypes,
    setSelectedActionTypes
  ] = useState<string[]>([])

  const [
    selectedStatuses,
    setSelectedStatuses
  ] = useState<string[]>([])

  const [
    deviceIdKeyword,
    setDeviceIdKeyword
  ] = useState("")

  const [
    patientKeyword,
    setPatientKeyword
  ] = useState("")

  // ===== action label =====

const actionLabelMap: Record<string, string> = {  
  create: "create",
  update: "update",
  move: "move",
  delete: "delete",
}

  // ===== helper =====

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

  // ===== master =====

  const deviceTypes = useMemo(() => {

    return Array.from(
      new Set(
        histories
          .map(h => h.deviceTypeName)
          .filter(Boolean)
      )
    )

  }, [histories])

  const deviceModels = useMemo(() => {

    return Array.from(
      new Set(

        histories

          .filter(h => {

            if (
              selectedDeviceTypes.length === 0
            ) {

              return true

            }

            return selectedDeviceTypes.includes(
              h.deviceTypeName ?? ""
            )

          })

          .map(h => h.deviceModelName)

          .filter(Boolean)

      )
    )

  }, [
    histories,
    selectedDeviceTypes
  ])

  // ===== filter =====

  const filteredHistories = useMemo(() => {

    return histories.filter(history => {

      // ===== date =====

const created =
  new Date(
            history.createdAt ?? ""
          )
      if (startDate) {

        const start =
          new Date(startDate)

        if (created < start) {

          return false

        }

      }

      if (endDate) {

        const end =
          new Date(endDate)

        end.setHours(
          23,
          59,
          59,
          999
        )

        if (created > end) {

          return false

        }

      }

      // ===== device type =====

      if (
        selectedDeviceTypes.length > 0
        &&
        !selectedDeviceTypes.includes(
          history.deviceTypeName ?? ""
        )
      ) {

        return false

      }

      // ===== device model =====

      if (
        selectedDeviceModels.length > 0
        &&
        !selectedDeviceModels.includes(
          history.deviceModelName ?? ""
        )
      ) {

        return false

      }

      // ===== action =====

      if (
        selectedActionTypes.length > 0
        &&
        !selectedActionTypes.includes(
          history.actionType
        )
      ) {

        return false

      }


      // ===== device id =====

      if (
        deviceIdKeyword
        &&
        !String(history.deviceId)
          .includes(deviceIdKeyword)
      ) {

        return false

      }

      // ===== patient =====

      if (
        patientKeyword
        &&
        !history.patientName
          ?.toLowerCase()
          .includes(
            patientKeyword.toLowerCase()
          )
      ) {

        return false

      }

      return true

    })

  }, [

    histories,

    startDate,
    endDate,

    selectedDeviceTypes,
    selectedDeviceModels,

    selectedActionTypes,
    selectedStatuses,

    deviceIdKeyword,
    patientKeyword

  ])

  // ===== CSV =====


  if (!isOpen) return null

  return createPortal(

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
            履歴
          </h2>

          <div className="flex gap-2">

            <button
                onClick={() =>
                  exportHistoryCsvTransaction(
                    filteredHistories
                  )
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
                exportHistoryPdfTransaction(
                                              filteredHistories
                                            )
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
        grid-cols-6
        gap-4
        mb-4
        text-sm
      ">

        {/* =======================================
            日付
        ======================================= */}

        <div className="
          flex
          flex-col
          gap-2
        ">

          {/* ===== start ===== */}

          <div className="flex flex-col">

            <label className="
              text-xs
              text-gray-600
              mb-1
            ">
              検索開始日
            </label>

            <input
              type="date"
              value={startDate}
              onChange={e =>
                setStartDate(
                  e.target.value
                )
              }
              className="
                border
                p-2
                rounded
              "
            />

          </div>

          {/* ===== end ===== */}

          <div className="flex flex-col">

            <label className="
              text-xs
              text-gray-600
              mb-1
            ">
              検索終了日
            </label>

            <input
              type="date"
              value={endDate}
              onChange={e =>
                setEndDate(
                  e.target.value
                )
              }
              className="
                border
                p-2
                rounded
              "
            />

          </div>

        </div>

        {/* =======================================
            keyword
        ======================================= */}

        <div className="
          flex
          flex-col
          gap-2
        ">

          {/* ===== device id ===== */}

          <div className="flex flex-col">

            <label className="
              text-xs
              text-gray-600
              mb-1
            ">
              機器ID
            </label>

            <input
              placeholder="機器ID"
              value={deviceIdKeyword}
              onChange={e =>
                setDeviceIdKeyword(
                  e.target.value
                )
              }
              className="
                border
                p-2
                rounded
              "
            />

          </div>

          {/* ===== patient ===== */}

          <div className="flex flex-col">

            <label className="
              text-xs
              text-gray-600
              mb-1
            ">
              患者名
            </label>

            <input
              placeholder="患者名"
              value={patientKeyword}
              onChange={e =>
                setPatientKeyword(
                  e.target.value
                )
              }
              className="
                border
                p-2
                rounded
              "
            />

          </div>

        </div>

        {/* =======================================
            type
        ======================================= */}

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

            {deviceTypes.map(type => (

              <label
                key={type}
                className="block"
              >

                <input
                  type="checkbox"
                  checked={
                    selectedDeviceTypes.includes(
                      type ?? ""
                    )
                  }
                  onChange={() =>
                    toggleSelection(
                      type ?? "",
                      selectedDeviceTypes,
                      setSelectedDeviceTypes
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

        {/* =======================================
            model
        ======================================= */}

        <div>

          <label className="
            text-xs
            text-gray-600
            mb-1
            block
          ">
            型式
          </label>

          <div className="
            border
            rounded
            p-2
            max-h-32
            overflow-auto
          ">

            {deviceModels.map(model => (

              <label
                key={model}
                className="block"
              >

                <input
                  type="checkbox"
                  checked={
                    selectedDeviceModels.includes(
                      model ?? ""
                    )
                  }
                  onChange={() =>
                    toggleSelection(
                      model ?? "",
                      selectedDeviceModels,
                      setSelectedDeviceModels
                    )
                  }
                />

                <span className="ml-1">
                  {model}
                </span>

              </label>

            ))}

          </div>

        </div>

        {/* =======================================
            action
        ======================================= */}

        <div>

          <label className="
            text-xs
            text-gray-600
            mb-1
            block
          ">
            操作
          </label>

          <div className="
            border
            rounded
            p-2
            max-h-32
            overflow-auto
          ">

            {
              [
                ["create", "create"],
                ["update", "update"],
                ["move", "move"],
                ["delete", "delete"]
              ]           
              .map(([value, label]) => (

              <label
                key={value}
                className="block"
              >

                <input
                  type="checkbox"
                  checked={
                    selectedActionTypes.includes(
                      value
                    )
                  }
                  onChange={() =>
                    toggleSelection(
                      value,
                      selectedActionTypes,
                      setSelectedActionTypes
                    )
                  }
                />

                <span className="ml-1">
                  {label}
                </span>

              </label>

            ))}

          </div>

        </div>

        {/* =======================================
            status
        ======================================= */}



      </div>
        {/* ===== count ===== */}

        <div className="
          mb-2
          text-sm
          text-gray-600
        ">
          検索結果：
          {filteredHistories.length}件
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
                  日時
                </th>

                <th className="border p-2">
                  機器ID
                </th>

                <th className="border p-2">
                  機種
                </th>

                <th className="border p-2">
                  型式
                </th>

                <th className="border p-2">
                  操作
                </th>



                <th className="border p-2">
                  保守開始日
                </th>

                <th className="border p-2">
                  保守終了日
                </th>

                <th className="border p-2">
                  配置
                </th>

                <th className="border p-2">
                  患者
                </th>

                <th className="border p-2">
                  内容
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredHistories.length === 0 && (

                <tr>

                  <td
                    colSpan={11}
                    className="
                      border
                      p-8
                      text-center
                      text-gray-500
                    "
                  >
                    履歴がありません
                  </td>

                </tr>

              )}

              {filteredHistories.map(history => (

                <tr
                  key={history.id}
                  className={`
                    hover:bg-gray-50

                    ${
                      history.actionType
                      === "fix_start"
                        ? "bg-red-50"
                        : ""
                    }

                    ${
                      history.actionType
                      === "fix_end"
                        ? "bg-green-50"
                        : ""
                    }
                  `}
                >

                  <td className="
                    border
                    p-2
                    whitespace-nowrap
                  ">
{
  history.createdAt
    ? new Date(
        history.createdAt
      ).toLocaleString("ja-JP")
    : "-"
}

                  </td>

                  <td className="
                    border
                    p-2
                    text-center
                  ">
                    {history.deviceId}
                  </td>

                  <td className="
                    border
                    p-2
                  ">
                    {
                      history.deviceTypeName
                      ?? "-"
                    }
                  </td>

                  <td className="
                    border
                    p-2
                  ">
                    {
                      history.deviceModelName
                      ?? "-"
                    }
                  </td>

                  <td className="
                    border
                    p-2
                    text-center
                  ">

                    {
                      actionLabelMap[
                        history.actionType
                      ] ?? history.actionType
                    }

                  </td>


                  <td className="
                    border
                    p-2
                    text-center
                    whitespace-nowrap
                  ">

                    {
                      history.maintenanceStartedAt
                        ? new Date(
                            history
                              .maintenanceStartedAt
                          ).toLocaleDateString(
                            "ja-JP"
                          )
                        : "-"
                    }

                  </td>

                  <td className="
                    border
                    p-2
                    text-center
                    whitespace-nowrap
                  ">

                    {
                      history.maintenanceFinishedAt
                        ? new Date(
                            history
                              .maintenanceFinishedAt
                          ).toLocaleDateString(
                            "ja-JP"
                          )
                        : "-"
                    }

                  </td>

                  <td className="
                    border
                    p-2
                  ">

                    {
                      history.roomName
                      ??
                      history.stockAreaName
                      ??
                      "-"
                    }

                  </td>

                  <td className="
                    border
                    p-2
                  ">

                    {
                      history.patientName
                      ?? "-"
                    }

                  </td>

                  <td className="
                    border
                    p-2
                    whitespace-pre-wrap
                  ">

                    {history.message}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>,
    document.body

  )

}