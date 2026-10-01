"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

//user、認証
import {CurrentUser  } from "../../types/userTypes"

//type
import { StockAreaType } from "../../types/stockTypes"
import { DeviceTypeType } from "../../types/deviceTypeTypes"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { WardType } from "../../types/wardTypes"
import { RoomType } from "../../types/roomTypes"
import {MaintenanceType } from "../../types/maintenanceTypeTypes"
import { InfectionTypeType } from "../../types/infectionTypeTypes"
import { RoomInfectionType } from "../../types/roomInfectionTypes"
import { HospitalSettingsType } from "../../types/hospitalSettingTypes"
import { TodayInspectionFrontType } from "../../types/inspectionTypes/inspectionTypes"
//表示データ
import { Device } from "../../types/deviceTypes"
import {MaintenanceTask } from "../../types/taskTypes"
import {UpdateMaintenanceTaskDueAt,CancelMaintenanceTask,CompleteMaintenanceTask } from "../../types/taskTypes"

//icon
import {
  Wrench,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit2,
  Activity,
  Stethoscope,
  User,
} from "lucide-react"
import { FaVirus } from "react-icons/fa"
//modal
import CommonModal from "../common/CommonModal"
import InputModal from "../common/InputModal"
import { executeWithLoading } from "../common/executeWithLoading"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"
import {LoadingOverlay} from "../common/LoadingOverlay"
import InfectionSelectModal from "./InfectionSelectModal"
import AddMaintenanceTaskModal from "../../components/modals/AddMaintenanceTaskModal"
import { createBothMaintenanceTask } from "../../api/tasks/createBothMaintenanceTask"
import { normalizeMaintenanceTask } from "../../mapper/taskMapper"

//page.tsxから
//stateレス化
type Props = {
  isOpen: boolean
  selectedRoomDevice: Device | null
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  onCancel: () => void
  wards:WardType[]
  rooms: RoomType[]
  tasks: MaintenanceTask[]                 // ← 追加
  maintenanceTypes: MaintenanceType[]
  renameManagementNumber:(id: number, value: string)=> Promise<boolean>
  renameSerialNumber:(id: number, value: string)=> Promise<boolean>
  renameNote:(id: number, value: string)=> Promise<boolean>
  renamePatientName:(roomId: number, value: string)=> Promise<boolean>
  toggleDeviceStandby:(
                        deviceId: number,
                        standby: boolean,
                      )=> Promise<boolean>
  renameRentalDates : (
                        deviceId: number,
                        rentalStartDate: string,
                        rentalEndDate: string
                      )=>Promise<boolean>
  onCompleteTask: (task: CompleteMaintenanceTask) => Promise<boolean>
  renameMaintenanceTaskDueAt: (task: UpdateMaintenanceTaskDueAt) => Promise<boolean>
  cancelTask: (task: CancelMaintenanceTask) => Promise<boolean>
  infectionTypes:InfectionTypeType[]
  roomInfections:RoomInfectionType[]
  setRoomInfections:React.Dispatch<React.SetStateAction<any[]>>
  onDelete: (deviceId: number) => Promise<void>
  hospitalSettings: HospitalSettingsType | null
  todayInspections?: TodayInspectionFrontType[]
  }

export default function RoomDeviceInfoModal({
  isOpen,
  selectedRoomDevice,
  deviceTypes,
  deviceModels,
  onCancel,
  wards,
  rooms,
  tasks,
  maintenanceTypes,
  onCompleteTask,
  renameManagementNumber,
  renameSerialNumber,
  renameNote,
  renamePatientName,
  toggleDeviceStandby,
  renameRentalDates,
  renameMaintenanceTaskDueAt,
  cancelTask,
  infectionTypes,
  roomInfections,
  setRoomInfections,
  onDelete,
  hospitalSettings,
  todayInspections,
}: Props) {
const [loading, setLoading] = useState(false)
const [isInfectionModalOpen, setIsInfectionModalOpen] = useState(false)
const router = useRouter()
const [isAddMaintenanceTaskModalOpen, setIsAddMaintenanceTaskModalOpen] = useState(false)

const [isInputModalOpen, setIsInputModalOpen] = useState(false)
const [inputModalTarget, setInputModalTarget] = useState<
  | "managementNumber"
  | "serialNumber"
  | "rentalStartDate"
  | "rentalEndDate"
  | "note"
  | "maintenanceTaskDueAt"
  | null
>(null)
const [inputModalTitle, setInputModalTitle] = useState("")
const [inputModalLabel, setInputModalLabel] = useState("")
const [inputModalType, setInputModalType] = useState<
  "text" | "number" | "date" | "time"
>("text")
const [inputModalDefaultValue, setInputModalDefaultValue] = useState("")
const [inputModalTaskId, setInputModalTaskId] = useState<number | null>(null)
const [inputModalRentalStartDate, setInputModalRentalStartDate] = useState("")

const openInputModal = ({
  target,
  title,
  label,
  type = "text",
  defaultValue = "",
}: {
  target:
    | "managementNumber"
    | "serialNumber"
    | "rentalStartDate"
    | "rentalEndDate"
    | "note"
    | "maintenanceTaskDueAt"
  title: string
  label?: string
  type?: "text" | "number" | "date" | "time"
  defaultValue?: string
}) => {
  setInputModalTarget(target)
  setInputModalTitle(title)
  setInputModalLabel(label ?? "")
  setInputModalType(type)
  setInputModalDefaultValue(defaultValue)
  setIsInputModalOpen(true)
}

const handleInputModalConfirm = async (value: string) => {
  const target = inputModalTarget
  if (!target || !selectedRoomDevice?.id) return

  setIsInputModalOpen(false)

  if (target === "managementNumber") {
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const success = await renameManagementNumber(
          selectedRoomDevice.id,
          value
        )
        if (!success) return
      },
    })
    return
  }

  if (target === "serialNumber") {
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const success = await renameSerialNumber(
          selectedRoomDevice.id,
          value
        )
        if (!success) return
      },
    })
    return
  }

  if (target === "note") {
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const success = await renameNote(
          selectedRoomDevice.id,
          value
        )
        if (!success) return
      },
    })
    return
  }

  if (target === "rentalStartDate") {
    setInputModalRentalStartDate(value)

    setInputModalTarget("rentalEndDate")
    setInputModalTitle("返却日を入力")
    setInputModalLabel("返却日")
    setInputModalType("date")
    setInputModalDefaultValue(
      rentalEndDate ? rentalEndDate.replace(/-/g, "/") : ""
    )
    setIsInputModalOpen(true)
    return
  }

  if (target === "rentalEndDate") {
    const normalizedEndDate = value.replace(/\//g, "-")

    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const success = await renameRentalDates(
          selectedRoomDevice.id,
          inputModalRentalStartDate.replace(/\//g, "-"),
          normalizedEndDate
        )
        if (!success) return
      },
    })
    return
  }

  if (target === "maintenanceTaskDueAt") {
    if (inputModalTaskId === null) return

    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const success = await renameMaintenanceTaskDueAt({
          id: inputModalTaskId,
          dueAt: `${value.replace(/\//g, "-")}T00:00:00`,
        })
        if (!success) return
      },
    })
  }
}

if (!isOpen || !selectedRoomDevice) return null

// ===== selectedRoomDeviceから直接取得 =====

const managementNumber =
  selectedRoomDevice.managementNumber ?? ""

const serialNumber =
  selectedRoomDevice.serialNumber ?? ""

const note =
  selectedRoomDevice.note ?? ""

const rentalStartDate =
  selectedRoomDevice.rentalStartDate || ""

const rentalEndDate =
  selectedRoomDevice.rentalEndDate || ""

const standby =
  selectedRoomDevice.standby ?? false

const standbyStartedAt =
  selectedRoomDevice.standbyStartedAt || ""

const standbyFinishedAt =
  selectedRoomDevice.standbyFinishedAt || ""

// ===== room =====

const room = rooms.find(
  r => r.id === selectedRoomDevice.roomId
)

const patientName =
  room?.patientName ?? ""

// ===== 名前 =====

const typeName =
  deviceTypes.find(
    t => t.id === selectedRoomDevice.type
  )?.name ?? "不明"

const modelName =
  deviceModels.find(
    m => m.id === selectedRoomDevice.model
  )?.name ?? "不明"

const roomName =
  room?.name ?? "不明"

const wardName =
  wards.find(
    w => w.id === room?.wardId
  )?.name ?? "不明" 
  
  
const deviceTasks =
  tasks.filter(
    task => task.deviceId === selectedRoomDevice.id
  )

const deviceTodayInspections =
  todayInspections?.filter(
    inspection =>
      inspection.deviceId === selectedRoomDevice.id
  ) ?? []


    // 🔽 共通表示行
  const InfoRow = ({
                    label,
                    value,
                    onEdit
                    }: {
                          label: string
                          value: string
                          onEdit: () => void
                        }) => (
                                <div className="flex items-center justify-between py-2">
                                  <div>
                                    <span className="text-sm text-gray-500">{label}：</span>
                                    <span className="ml-2 font-medium">
                                      {value || "情報なし"}
                                    </span>
                                  </div>

                                  <button
                                    onClick={onEdit}
                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                  >
                                    ✏
                                  </button>
                                </div>
                          )
  // 🔽 期限表示関数
  const getStatus = (due_at: string) => {
    const now = new Date()
    const diff = new Date(due_at).getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return { label: `期限切れ（${Math.abs(days)}日）`, color: "red" }
    if (days <= 2) return { label: `残り${days}日`, color: "yellow" }
    return { label: `残り${days}日`, color: "green" }
  }
  const isStandbyOverOneMonth = (() => {
    if (!standby || !standbyStartedAt) return false

    const start = new Date(standbyStartedAt)
    const limit = new Date(start)
    limit.setMonth(limit.getMonth() + 1)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    limit.setHours(0, 0, 0, 0)

    return today >= limit
  })()
  //スタンバイ開始解除の関数
  const handleToggleStandby = async () => {

    const deviceId = selectedRoomDevice.id
    if (!deviceId) return
    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {

    // ===== 解除 ====
    if (standby) {
      const success =
        await toggleDeviceStandby(
          deviceId,
          false
        )
      if (!success) return

      return
    }

    // ===== 開始 =====

    const success =
      await toggleDeviceStandby(
        deviceId,
        true
      )

    if (!success) return
    }
    })
  }  
  const handleDelete = async () => {
    if (!selectedRoomDevice?.id) return

    if (!confirm("この機器を削除しますか？")) return

    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
          await onDelete(selectedRoomDevice.id!)

    onCancel()
       }
  })
  }

  const handleInspection = () => {
    if (!selectedRoomDevice?.id) return

    const managementNumber = selectedRoomDevice.managementNumber?.trim() ?? ""
    const serialNumber = selectedRoomDevice.serialNumber?.trim() ?? ""

    if (!managementNumber && !serialNumber) {
      alert("管理番号またはシリアル番号を入力してください。")
      return
    }

    router.push(
      `/inspection-excution?deviceId=${selectedRoomDevice.id}`
    )
  }
  
  const handleAddMaintenanceTask = async (maintenanceTypeId: number) => {
    if (!selectedRoomDevice?.id) return

    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        const taskDB = await createBothMaintenanceTask({
          deviceId: selectedRoomDevice.id,
          maintenanceTypeId
        })
        const task = normalizeMaintenanceTask(taskDB)
      }
    })
  }

  if (!isOpen || !selectedRoomDevice) return null



return (
  <>
    <CommonModal
      open={isOpen}
      onClose={onCancel}
      title="使用中機器情報"
      maxWidth="max-w-6xl"
      height="h-[70vh]"
      rightContent={
        <button
          type="button"
          onClick={handleDelete}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-800/70 bg-rose-950/70 text-rose-300 transition-colors hover:bg-rose-900"
          title="機器の削除"
          aria-label="機器の削除"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      }
    >
        {/* =====================================================
            Main Content
        ===================================================== */}
      <div className="h-full w-full bg-slate-50 p-3 sm:p-4">
        <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-12">

              {/* =================================================
                  Left Column
              ================================================= */}
          <div className="min-h-0 overflow-y-auto lg:col-span-7">
            <div className="space-y-4">

                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-700 bg-slate-900 px-4 py-3 sm:px-5">
                    <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                      <span>{selectedRoomDevice.assetType}</span>
                      <span className="text-slate-600">/</span>
                      <span className="font-mono text-slate-300">
                        {managementNumber ? `管理番号 ${managementNumber}` : "管理番号未設定"}
                      </span>
                    </div>
                    <h3 className="truncate text-base font-bold text-white sm:text-lg">
                      {typeName}
                      <span className="ml-2 font-normal text-slate-300">{modelName}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
                    <div className="border-r border-slate-200 px-4 py-2.5 sm:px-5">
                      <div className="text-[10px] font-semibold tracking-wide text-slate-500">現在の位置</div>
                      <div className="mt-0.5 truncate text-sm font-bold text-slate-900">
                        {wardName}<span className="mx-1 text-slate-300">/</span>{roomName}
                      </div>
                    </div>
                    <div className="px-4 py-2.5 sm:px-5">
                      <div className="text-[10px] font-semibold tracking-wide text-slate-500">稼働状態</div>
                      <div className={`mt-0.5 text-sm font-bold ${standby ? "text-amber-700" : "text-emerald-700"}`}>
                        {standby ? "待機中" : "通常稼働中"}
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const isRental =
                      selectedRoomDevice.assetType === "レンタル" ||
                      selectedRoomDevice.assetType === "代替機"

                    let rentalAlert = ""
                    let isOverdue = false

                    if (isRental && rentalEndDate) {
                      const today = new Date()
                      const end = new Date(rentalEndDate)
                      today.setHours(0, 0, 0, 0)
                      end.setHours(0, 0, 0, 0)
                      const diff = end.getTime() - today.getTime()
                      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

                      if (days < 0) {
                        rentalAlert = `返却期限超過（${Math.abs(days)}日遅れ）`
                        isOverdue = true
                      } else if (days === 0) {
                        rentalAlert = "本日返却期限"
                        isOverdue = true
                      } else if (days <= 2) {
                        rentalAlert = `返却まで${days}日`
                      }
                    }

                    if (!isOverdue && !isStandbyOverOneMonth && !rentalAlert) return null

                    return (
                      <div
                        className={`border-b px-4 py-3 sm:px-5 ${
                          isOverdue ? "border-rose-300 bg-rose-50" : "border-amber-300 bg-amber-50"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${isOverdue ? "text-rose-600" : "text-amber-600"}`} />
                          <div className="min-w-0 text-xs leading-relaxed">
                            <div className={`font-bold ${isOverdue ? "text-rose-900" : "text-amber-900"}`}>
                              {isOverdue ? "重要アラート" : isStandbyOverOneMonth ? "長期待機" : "返却予定"}
                            </div>
                            <div className={isOverdue ? "text-rose-800" : "text-amber-800"}>
                              {isOverdue
                                ? `${rentalAlert}。契約更新または返却手続きを確認してください。`
                                : isStandbyOverOneMonth
                                  ? "スタンバイ開始から1ヶ月経過しています。動作点検または中央倉庫への返却を確認してください。"
                                  : rentalAlert}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                </section>

                {/* =================================================
                    Inspection
                ================================================= */}
                <section className="rounded-xl border border-teal-200 bg-white shadow-sm">

                  <div className="flex items-center justify-between border-b border-teal-100 px-4 py-3 sm:px-5">

                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-slate-700">
                        本日の始業・日常点検
                      </div>

                      <div className="mt-0.5 text-[11px] text-slate-400">
                        本日の実施回数
                      </div>
                    </div>

                    <div className="text-lg font-black text-teal-700">
                      {deviceTodayInspections.length}

                      <span className="ml-1 text-xs font-bold text-slate-500">
                        回
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">

                    <button
                      type="button"
                      onClick={handleInspection}
                      className="
                        flex h-12 w-full
                        items-center justify-center gap-2
                        rounded-xl
                        bg-teal-700
                        text-sm font-bold text-white
                        shadow-sm
                        transition-all
                        hover:bg-teal-800
                        active:scale-[0.99]
                      "
                    >
                      <Stethoscope className="h-4 w-4" />
                      点検チェックシートを開く
                    </button>

                    {deviceTodayInspections.length > 0 && (
                      <div className="mt-3">

                        <div className="mb-1.5 text-[11px] font-medium text-slate-400">
                          実施時刻
                        </div>

                        <div className="flex flex-wrap gap-1.5">

                          {deviceTodayInspections.map(
                            (insp, i) => (
                              <span
                                key={i}
                                className="
                                  rounded-md
                                  border border-teal-100
                                  bg-teal-50
                                  px-2.5 py-1
                                  font-mono text-xs
                                  font-bold text-teal-800
                                "
                              >
                                {new Date(
                                  insp.createdAt
                                ).toLocaleTimeString(
                                  "ja-JP",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            )
                          )}

                        </div>
                      </div>
                    )}
                  </div>
                </section>


                {/* =================================================
                    Location / Patient
                ================================================= */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                  <div className="border-b border-slate-100 py-3 sm:px-5">
                    <div className="text-xs font-bold tracking-wide text-slate-700">
                      配置・患者情報
                    </div>
                  </div>

                  <div className="space-y-3 px-4 pb-5 sm:px-5">

                    {/* 配置場所 */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                      {/* 病棟 */}
                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <div className="mb-1 text-[11px] font-medium text-slate-400">
                          病棟
                        </div>

                        <div className="truncate text-sm font-bold text-slate-900">
                          {wardName || "未設定"}
                        </div>
                      </div>

                      {/* 病室 */}
                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <div className="mb-1 text-[11px] font-medium text-slate-400">
                          病室
                        </div>

                        <div className="truncate text-sm font-bold text-slate-900">
                          {roomName || "未設定"}
                        </div>
                      </div>

                    </div>
                    {/* 患者 */}
                    {hospitalSettings?.showPatientName && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="mb-1 text-[11px] font-medium text-slate-400">
                          患者名
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-bold text-slate-900">
                            {patientName || "未設定"}
                          </span>
                          {/* 既存の編集処理をここにそのまま残す */}
                        </div>
                      </div>
                    )}

                    {/* =================================================
                        感染症区分
                        ※ FaVirus を維持
                    ================================================= */}
                      <div className="
                        flex items-center justify-between
                        gap-4 rounded-lg
                        border border-slate-200
                        bg-slate-50 p-3
                      ">
                      <div className="min-w-0">

                        <div className="mb-1.5 text-[11px] font-medium text-slate-400">
                          感染症区分
                        </div>

                        <div className="flex flex-wrap gap-1.5">

                          {room &&
                          roomInfections.filter(
                            (ri) =>
                              ri.roomId === room.id
                          ).length > 0 ? (

                            roomInfections
                              .filter(
                                (ri) =>
                                  ri.roomId === room.id
                              )
                              .map((ri) => {

                                const inf =
                                  infectionTypes.find(
                                    (i) =>
                                      i.id ===
                                      ri.infectionTypeId
                                  )

                                return (
                                  <span
                                    key={ri.id}
                                    className="
                                      inline-flex
                                      items-center
                                      gap-1.5
                                      rounded-md
                                      border
                                      border-slate-300
                                      bg-white px-3
                                      px-2.5
                                      py-1
                                      text-xs
                                      font-bold
                                      text-slate-800
                                    "
                                  >

                                    {/* 感染症を示す意味のあるアイコン */}
                                    <FaVirus
                                      className="h-3.5 w-3.5 shrink-0"
                                      style={{
                                        color:
                                          inf?.color ||
                                          "#e11d48",
                                      }}
                                    />

                                    <span>
                                      {inf?.name}
                                    </span>

                                  </span>
                                )
                              })

                          ) : (

                            <span className="text-xs text-slate-400">
                              特記なし
                            </span>

                          )}

                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setIsInfectionModalOpen(true)
                        }
                          className="
                              shrink-0 rounded-md p-1.5
                              text-slate-400
                              transition-colors
                              hover:bg-slate-200
                              hover:text-slate-700
                        "
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                                        
                  </div>

                </section>

                {/* =================================================
                    Device Information
                ================================================= */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                  <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                    <div className="text-xs font-bold tracking-wide text-slate-700">
                      機器情報
                    </div>
                  </div>

                  <div className="space-y-3 p-4 sm:p-5">

                    {/* 管理番号 / シリアル */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                      {/* 管理番号 */}
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">

                        <div className="mb-1 text-[11px] font-medium text-slate-400">
                          ME管理番号
                        </div>

                        <div className="flex items-center justify-between gap-2">

                          <span className="truncate font-mono text-sm font-bold text-slate-900">
                            {managementNumber || "未登録"}
                          </span>

                          <button
                            type="button"
                            onClick={async () => {
                              const deviceId =
                                selectedRoomDevice.id

                              if (!deviceId) return

                              openInputModal({
                                target: "managementNumber",
                                title: "管理番号を入力",
                                label: "ME管理番号",
                                defaultValue: managementNumber,
                              })
                            }}
                            className="
                              shrink-0 rounded-md p-1.5
                              text-slate-400
                              transition-colors
                              hover:bg-slate-200
                              hover:text-slate-700
                            "
                            title="管理番号を編集"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* シリアル番号 */}
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">

                        <div className="mb-1 text-[11px] font-medium text-slate-400">
                          シリアル番号（S/N）
                        </div>

                        <div className="flex items-center justify-between gap-2">

                          <span className="truncate font-mono text-sm font-bold text-slate-900">
                            {serialNumber || "未登録"}
                          </span>

                          <button
                            type="button"
                            onClick={async () => {
                              const deviceId =
                                selectedRoomDevice.id

                              if (!deviceId) return

                              openInputModal({
                                target: "serialNumber",
                                title: "シリアル番号を入力",
                                label: "シリアル番号（S/N）",
                                defaultValue: serialNumber,
                              })
                            }}
                            className="
                              shrink-0 rounded-md p-1.5
                              text-slate-400
                              transition-colors
                              hover:bg-slate-200
                              hover:text-slate-700
                            "
                            title="シリアル番号を編集"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 貸与期間 */}
                    {(selectedRoomDevice.assetType === "レンタル" ||
                      selectedRoomDevice.assetType === "代替機") && (
                      <div className="
                        flex items-center justify-between
                        gap-4 rounded-lg
                        border border-slate-200
                        bg-slate-50 p-3
                      ">

                        <div className="min-w-0">

                          <div className="mb-1 text-[11px] font-medium text-slate-400">
                            貸与・返却期間
                          </div>

                          <div className="font-mono text-sm font-bold text-slate-900">
                            {rentalStartDate || "未定"}

                            <span className="mx-1 text-slate-400">
                              〜
                            </span>

                            {rentalEndDate || "未定"}
                          </div>

                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            const deviceId =
                              selectedRoomDevice.id

                            if (!deviceId) return

                            openInputModal({
                              target: "rentalStartDate",
                              title: "貸与開始日を入力",
                              label: "貸与開始日",
                              type: "date",
                              defaultValue: rentalStartDate
                                ? rentalStartDate.replace(/-/g, "/")
                                : "",
                            })
                          }}
                          className="
                              shrink-0 rounded-md p-1.5
                              text-slate-400
                              transition-colors
                              hover:bg-slate-200
                              hover:text-slate-700
                          "
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    {/* 備考 */}
                    <div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">

                      <div className="mb-1.5 flex items-center justify-between">

                        <span className="text-[11px] font-medium text-slate-400">
                          特記事項・備考
                        </span>

                        <button
                          type="button"
                          onClick={async () => {
                            const deviceId =
                              selectedRoomDevice.id

                            if (!deviceId) return

                            openInputModal({
                              target: "note",
                              title: "備考を入力",
                              label: "特記事項・備考",
                              defaultValue: note,
                            })
                          }}
                          className="
                            rounded-md p-1.5
                            text-slate-400
                            transition-colors
                            hover:bg-slate-100
                            hover:text-slate-700
                          "
                          title="備考を編集"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>


                        {note ? (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                            {note}
                          </p>
                        ) : (
                          <p className="text-sm italic text-slate-400">
                            特記事項なし
                          </p>
                        )}

                      </div>
                    </div>
                  </div>
                </section>

              </div>
            </div>

              {/* =================================================
                  Right Column
              ================================================= */}
          <div className="min-h-0 overflow-y-auto lg:col-span-5">
            <div className="space-y-4">

                {/* =================================================
                    Standby
                ================================================= */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                  <div className="flex items-center justify-between gap-4 p-4 sm:p-5">

                    <div className="min-w-0">

                      <div className="text-[11px] font-semibold tracking-wide text-slate-400">
                        機器稼働ステータス
                      </div>

                      <div
                        className={`mt-1 text-base font-black ${
                          standby
                            ? "text-amber-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {standby
                          ? "待機中（スタンバイ）"
                          : "通常稼働中"}
                      </div>

                      {standby && (
                        <div className="mt-1 text-xs text-slate-500">
                          待機開始：
                          {standbyStartedAt
                            ? standbyStartedAt.slice(0, 10)
                            : "未設定"}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleStandby}
                      className={`
                        h-9 shrink-0 rounded-lg px-3
                        text-xs font-bold
                        transition-colors
                        ${
                          standby
                            ? "border border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"
                            : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }
                      `}
                    >
                      {standby
                        ? "待機解除"
                        : "待機に設定"}
                    </button>
                  </div>
                </section>

                {/* =================================================
                    Maintenance
                ================================================= */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">

                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-slate-700">
                        定期保守
                      </div>

                      <div className="mt-0.5 text-[11px] text-slate-400">
                        登録されているメンテナンスタスク
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setIsAddMaintenanceTaskModalOpen(
                          true
                        )
                      }
                      className="
                        flex h-8 items-center gap-1
                        rounded-lg
                        bg-slate-900 px-3
                        text-xs font-bold text-white
                        transition-colors
                        hover:bg-slate-800
                      "
                    >
                      <Plus className="h-3 w-3" />
                      追加
                    </button>
                  </div>

                  <div className="space-y-2 p-3 sm:p-4">

                    {deviceTasks.length === 0 ? (

                      <div
                        className="
                          rounded-lg
                          border border-dashed
                          border-slate-200
                          bg-slate-50
                          px-4 py-8
                          text-center
                          text-xs text-slate-400
                        "
                      >
                        登録タスクはありません
                      </div>

                    ) : (

                      deviceTasks.map((task) => {

                        const type =
                          maintenanceTypes.find(
                            (t) =>
                              t.id ===
                              task.maintenanceTypeId
                          )

                        const isCompleted =
                          task.completedAt !== null &&
                          task.completedAt !== undefined

                        const isCancelled =
                          !task.isActive

                        const isPending =
                          task.isActive &&
                          !isCompleted

                        const now = new Date()

                        const diff =
                          new Date(
                            task.dueAt
                          ).getTime() -
                          now.getTime()

                        const days = Math.ceil(
                          diff /
                            (1000 *
                              60 *
                              60 *
                              24)
                        )

                        return (
                          <div
                            key={task.id}
                            className={`
                              rounded-lg border p-3
                              transition-colors
                              ${
                                isCompleted
                                  ? "border-emerald-200 bg-emerald-50"
                                  : isCancelled
                                    ? "border-slate-200 bg-slate-50 opacity-60"
                                    : days < 0
                                      ? "border-rose-200 bg-rose-50"
                                      : days <= 2
                                        ? "border-amber-200 bg-amber-50/60"
                                        : "border-slate-200 bg-white"
                              }
                            `}
                          >

                            <div className="flex items-start justify-between gap-3">

                              <div className="min-w-0">

                                <div className="text-sm font-bold text-slate-900">
                                  {type?.name}
                                </div>

                                <div className="mt-0.5 text-[11px] text-slate-500">
                                  {type?.dependDeviceStatus ===
                                  "room"
                                    ? "使用中メンテナンス"
                                    : type?.dependDeviceStatus ===
                                        "stock"
                                      ? "保管中メンテナンス"
                                      : "定期メンテナンス"}
                                </div>

                                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">

                                  <span className="font-medium text-slate-500">
                                    期限
                                  </span>

                                  <span className="font-mono font-bold text-slate-700">
                                    {task.dueAt.slice(0, 10)}
                                  </span>

                                  {days < 0 ? (
                                    <span className="font-bold text-rose-700">
                                      {Math.abs(days)}
                                      日超過
                                    </span>
                                  ) : days <= 2 ? (
                                    <span className="font-bold text-amber-700">
                                      残り{days}日
                                    </span>
                                  ) : (
                                    <span className="font-bold text-emerald-700">
                                      残り{days}日
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex shrink-0 flex-wrap justify-end gap-1.5">

                                {isPending && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await executeWithErrorAndLoading(
                                          {
                                            setLoading,
                                            action:
                                              async () => {
                                                const success =
                                                  await onCompleteTask(
                                                    {
                                                      id: task.id,
                                                    }
                                                  )

                                                if (!success)
                                                  return
                                              },
                                          }
                                        )
                                      }}
                                      className="
                                        h-8 rounded-lg
                                        bg-teal-700 px-2.5
                                        text-xs font-bold text-white
                                        transition-colors
                                        hover:bg-teal-800
                                      "
                                    >
                                      実施
                                    </button>

                                    <button
                                      type="button"
                                      onClick={async () => {
                                        setInputModalTaskId(task.id)
                                        openInputModal({
                                          target: "maintenanceTaskDueAt",
                                          title: "メンテ期限を入力",
                                          label: "メンテ期限",
                                          type: "date",
                                          defaultValue: task.dueAt
                                            .slice(0, 10)
                                            .replace(/-/g, "/"),
                                        })
                                      }}
                                      className="
                                        h-8 rounded-lg
                                        border border-slate-200
                                        bg-white px-2.5
                                        text-xs font-bold text-slate-700
                                        transition-colors
                                        hover:bg-slate-50
                                      "
                                    >
                                      修正
                                    </button>

                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const ok =
                                          confirm(
                                            "このメンテナンスタスクを中止しますか？"
                                          )

                                        if (!ok)
                                          return

                                        await executeWithErrorAndLoading(
                                          {
                                            setLoading,
                                            action:
                                              async () => {
                                                const success =
                                                  await cancelTask(
                                                    {
                                                      id: task.id,
                                                      isActive:
                                                        false,
                                                    }
                                                  )

                                                if (!success)
                                                  return
                                              },
                                          }
                                        )
                                      }}
                                      className="
                                        h-8 rounded-lg
                                        border border-rose-200
                                        bg-white px-2.5
                                        text-xs font-bold text-rose-700
                                        transition-colors
                                        hover:bg-rose-50
                                      "
                                    >
                                      中止
                                    </button>
                                  </>
                                )}

                                {isCompleted && (
                                  <span className="
                                    flex h-8
                                    items-center gap-1
                                    px-2
                                    text-xs font-bold
                                    text-emerald-700
                                  ">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    実施済
                                  </span>
                                )}

                                {isCancelled && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const ok =
                                        confirm(
                                          "中止を解除しますか？"
                                        )

                                      if (!ok)
                                        return

                                      await executeWithErrorAndLoading(
                                        {
                                          setLoading,
                                          action:
                                            async () => {
                                              const success =
                                                await cancelTask(
                                                  {
                                                    id: task.id,
                                                    isActive:
                                                      true,
                                                  }
                                                )

                                              if (!success)
                                                return
                                            },
                                        }
                                      )
                                    }}
                                    className="
                                      h-8 rounded-lg
                                      border border-slate-200
                                      bg-white px-2.5
                                      text-xs font-bold text-slate-600
                                      transition-colors
                                      hover:bg-slate-50
                                    "
                                  >
                                    中止解除
                                  </button>
                                )}

                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            Child Modals
        ===================================================== */}

        <InputModal
          open={isInputModalOpen}
          onClose={() => {
            setIsInputModalOpen(false)
            setInputModalTarget(null)
            setInputModalTaskId(null)
          }}
          onConfirm={handleInputModalConfirm}
          title={inputModalTitle}
          label={inputModalLabel}
          type={inputModalType}
          defaultValue={inputModalDefaultValue}
          confirmText="保存"
          cancelText="キャンセル"
        />

        <InfectionSelectModal
          isOpen={isInfectionModalOpen}
          onClose={() =>
            setIsInfectionModalOpen(false)
          }
          infectionTypes={infectionTypes}
          roomInfections={roomInfections}
          roomId={room?.id ?? 0}
          setRoomInfections={setRoomInfections}
        />

        <AddMaintenanceTaskModal
          isOpen={isAddMaintenanceTaskModalOpen}
          deviceId={selectedRoomDevice.id}
          deviceTypeId={selectedRoomDevice.type}
          deviceModelId={selectedRoomDevice.model}
          maintenanceTypes={maintenanceTypes}
          onClose={() =>
            setIsAddMaintenanceTaskModalOpen(false)
          }
          onAdd={handleAddMaintenanceTask}
        />
        
    </CommonModal>

    {/* =========================================================
        Loading
    ========================================================= */}
    <LoadingOverlay loading={loading} />
  </>
)
}