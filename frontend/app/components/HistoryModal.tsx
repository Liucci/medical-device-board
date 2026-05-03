"use client"

import { useMemo, useState } from "react"

import { ExportHistoriesPdf }
  from "../utils/ExportHistoriesPdf"

type History = {
  id: number
  device_id: number

  device_type_name: string | null
  device_model_name: string | null

  action_type: string
  status: string

  room_name: string | null
  stock_area_name: string | null
  patient_name: string | null

  message: string

  created_at: string
}

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

  // ===== search state =====

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedDeviceType, setSelectedDeviceType]= useState("")
  const [selectedDeviceModel, setSelectedDeviceModel]= useState("")
  const [deviceIdKeyword, setDeviceIdKeyword]= useState("")
  const [patientKeyword, setPatientKeyword]= useState("")
  const [actionTypeKeyword, setActionTypeKeyword]= useState("")  
  const [messageKeyword, setMessageKeyword]= useState("")
  const [statusKeyword, setStatusKeyword]= useState("")

  // ===== dropdown master =====

  const deviceTypes = useMemo(() => {

    return Array.from(
      new Set(
        histories
          .map(h => h.device_type_name)
          .filter(Boolean)
      )
    )

  }, [histories])

  const deviceModels = useMemo(() => {

    return Array.from(
      new Set(
        histories
          .filter(h => {
            if (!selectedDeviceType) return true

            return (
              h.device_type_name
              === selectedDeviceType
            )
          })
          .map(h => h.device_model_name)
          .filter(Boolean)
      )
    )

  }, [
    histories,
    selectedDeviceType
  ])

  // ===== filter =====

  const filteredHistories = useMemo(() => {

    return histories.filter(history => {

      // ===== date =====

      const created = new Date(history.created_at)

      if (startDate) {

        const start = new Date(startDate)

        if (created < start) {
          return false
        }
      }

      if (endDate) {

        const end = new Date(endDate)

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
        selectedDeviceType &&
        history.device_type_name
          !== selectedDeviceType
      ) {
        return false
      }

      // ===== device model =====

      if (
        selectedDeviceModel &&
        history.device_model_name
          !== selectedDeviceModel
      ) {
        return false
      }

      // ===== device id =====

      if (
        deviceIdKeyword &&
        !String(history.device_id)
          .includes(deviceIdKeyword)
      ) {
        return false
      }

      // ===== patient =====

      if (
        patientKeyword &&
        !history.patient_name
          ?.toLowerCase()
          .includes(
            patientKeyword.toLowerCase()
          )
      ) {
        return false
      }

      // ===== message =====

      if (
        messageKeyword &&
        !history.message
          .toLowerCase()
          .includes(
            messageKeyword.toLowerCase()
          )
      ) {
        return false
      }
        // ===== action type =====

        if (
          actionTypeKeyword &&
          history.action_type
            !== actionTypeKeyword
        ) {
          return false
        }
      // ===== status =====

      if (
        statusKeyword &&
        history.status !== statusKeyword
      ) {
        return false
      }

      return true

    })

  }, [
    histories,
    startDate,
    endDate,
    selectedDeviceType,
    selectedDeviceModel,
    deviceIdKeyword,
    patientKeyword,
    actionTypeKeyword,
    messageKeyword,
    statusKeyword
  ])
  // ===== export CSV =====
  const actionLabelMap: Record<string, string> = {
    create: "新規",
    move: "移動",
    delete: "削除",
    fix:"修理"
  }
  const exportCsv = () => {

    const headers = [
      "日時",
      "機器ID",
      "機種",
      "型式",
      "操作",
      "状態",
      "配置",
      "患者",
      "内容"
    ]

    const rows = filteredHistories.map(h => [

      new Date(h.created_at)
        .toLocaleString("ja-JP"),

      h.device_id,

      h.device_type_name ?? "",

      h.device_model_name ?? "",

      actionLabelMap[h.action_type]
        ?? h.action_type,

      h.status,

      h.room_name
        ?? h.stock_area_name
        ?? "",

      h.patient_name ?? "",

      h.message

    ])

    // ===== CSV文字列生成 =====

    const csvContent = [
      headers,
      ...rows
    ]
      .map(row =>
        row
          .map(value =>
            `"${String(value)
              .replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n")

    // ===== BOM付きUTF-8 =====

    const bom = "\uFEFF"

    const blob = new Blob(
      [bom + csvContent],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    )

    const url =
      URL.createObjectURL(blob)

    // ===== download =====

    const link =
      document.createElement("a")

    const now = new Date()

    const fileName =
      `履歴_${now
        .toLocaleDateString("ja-JP")
        .replace(/\//g, "-")}.csv`

    link.href = url
    link.setAttribute(
      "download",
      fileName
    )

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }
  if (!isOpen) return null

  return (
    <div
      className="
        fixed inset-0
        bg-black/40
        flex items-center justify-center
        z-50
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

        {/* header */}

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
                onClick={exportCsv}
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
                ExportHistoriesPdf(
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

        {/* search */}

        <div className="
          grid
          grid-cols-4
          gap-2
          mb-4
          text-sm
        ">

          {/* 開始日 */}

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

          {/* 終了日 */}

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

          {/* 機種 */}

          <div className="flex flex-col">
            <label className="
              text-xs
              text-gray-600
              mb-1
            ">
              機種
            </label>

            <select
              value={selectedDeviceType}
              onChange={e => {

                setSelectedDeviceType(
                  e.target.value
                )

                // 機種変更時は型式リセット
                setSelectedDeviceModel("")
              }}
              className="
                border
                p-2
                rounded
              "
            >
              <option value="">
                全機種
              </option>

              {deviceTypes.map(type => (

                <option
                  key={type}
                  value={type ?? ""}
                >
                  {type}
                </option>

              ))}

            </select>
          </div>

          {/* 型式 */}

          <div className="flex flex-col">
            <label className="
              text-xs
              text-gray-600
              mb-1
            ">
              型式
            </label>

            <select
              value={selectedDeviceModel}
              onChange={e =>
                setSelectedDeviceModel(
                  e.target.value
                )
              }
              className="
                border
                p-2
                rounded
              "
            >
              <option value="">
                全型式
              </option>

              {deviceModels.map(model => (

                <option
                  key={model}
                  value={model ?? ""}
                >
                  {model}
                </option>

              ))}

            </select>
          </div>

          {/* 機器ID */}

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

          {/* 患者名 */}

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

          {/* 内容 */}
{/* 
          <div className="flex flex-col">
            <label className="
              text-xs
              text-gray-600
              mb-1
            ">
              内容
            </label>

            <input
              placeholder="内容"
              value={messageKeyword}
              onChange={e =>
                setMessageKeyword(
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
 */}

          {/* 操作 */}

          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">
              操作
            </label>

            <select
              value={actionTypeKeyword}
              onChange={e =>
                setActionTypeKeyword(
                  e.target.value
                )
              }
              className="
                border
                p-2
                rounded
              "
            >
              <option value="">
                全操作
              </option>

              <option value="create">
                新規
              </option>

              <option value="move">
                移動
              </option>

              <option value="delete">
                削除
              </option>
              <option value="fix">
                修理
              </option>

            </select>
          </div>
          {/* 状態 */}

          <div className="flex flex-col">
            <label className="
              text-xs
              text-gray-600
              mb-1
            ">
              状態
            </label>

            <select
              value={statusKeyword}
              onChange={e =>
                setStatusKeyword(
                  e.target.value
                )
              }
              className="
                border
                p-2
                rounded
              "
            >
              <option value="">
                全状態
              </option>

              <option value="stock">
                stock
              </option>

              <option value="room">
                room
              </option>

            </select>
          </div>

        </div>

        {/* count */}

        <div className="
          mb-2
          text-sm
          text-gray-600
        ">
          検索結果：
          {filteredHistories.length}件
        </div>

        {/* table */}

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
                  状態
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
                    colSpan={8}
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
                  className="
                    hover:bg-gray-50
                  "
                >

                  <td className="
                    border
                    p-2
                    whitespace-nowrap
                  ">
                    {
                      new Date(
                        history.created_at
                      ).toLocaleString("ja-JP")
                    }
                  </td>

                  <td className="
                    border
                    p-2
                    text-center
                  ">
                    {history.device_id}
                  </td>

                  <td className="
                    border
                    p-2
                  ">
                    {
                      history.device_type_name
                      ?? "-"
                    }
                  </td>

                  <td className="
                    border
                    p-2
                  ">
                    {
                      history.device_model_name
                      ?? "-"
                    }
                  </td>
                  <td className="
                    border
                    p-2
                    text-center
                  ">
                    {history.action_type}
                  </td>

                  <td className="
                    border
                    p-2
                    text-center
                  ">
                    {history.status}
                  </td>

                  <td className="
                    border
                    p-2
                  ">
                    {
                      history.room_name
                      ??
                      history.stock_area_name
                      ??
                      "-"
                    }
                  </td>

                  <td className="
                    border
                    p-2
                  ">
                    {
                      history.patient_name
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
    </div>
  )
}