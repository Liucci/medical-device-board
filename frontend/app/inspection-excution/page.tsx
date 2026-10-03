"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, ChevronUp, History, MessageSquare, CheckCircle2 } from "lucide-react"
import { fetchInitInspectionExecution } from "../api/inits/fetchInitInspectionExecution"
import { getInspectionChecklistItemsWithOptionsFromApi } from "../api/inspection/inspectionChecklistItems/fetchInspectionChecklistItemsWithOptions"
import { createInspectionTransaction } from "../api/transactions/inspection/inspections/createInspectionTransaction"
import { flagNeedsRefreshTodayInspections } from "../utils/dashboardCache"

import type { Device } from "../types/deviceTypes"
import type { WardType } from "../types/wardTypes"
import type { RoomType } from "../types/roomTypes"
import type { RoomInfectionType } from "../types/roomInfectionTypes"
import type { InfectionTypeType } from "../types/infectionTypeTypes"
import type { DeviceTypeType } from "../types/deviceTypeTypes"
import type { DeviceModelType } from "../types/deviceModelTypes"
import type { InspectionType } from "../types/inspectionTypes/inspectionTypeTypes"
import type { InspectionChecklist } from "../types/inspectionTypes/inspectionChecklistTypes"
import type { InspectionChecklistItem } from "../types/inspectionTypes/inspectionChecklistItemTypes"
import type { InspectionChecklistItemOptionFrontType } from "../types/inspectionTypes/inspectionChecklistItemOptionTypes"
import type { InspectionItemCategoryType } from "../types/inspectionTypes/inspectionItemCategoryTypes"
import type { InspectionItemType } from "../types/inspectionTypes/inspectionItemTypeTypes"
import type { HospitalSettingsType } from "../types/hospitalSettingTypes"
import { normalizeDevice } from "../mapper/deviceMapper"
import { normalizeWard } from "../mapper/wardsMapper"
import { normalizeRoom } from "../mapper/roomsMapper"
import { normalizeRoomInfection } from "../mapper/roomInfectionMapper"
import { normalizeInfectionType } from "../mapper/infectionTypeMapper"
import { normalizeDeviceType } from "../mapper/deviceTypeMapper"
import { normalizeDeviceModel } from "../mapper/deviceModelMapper"
import { normalizeInspectionType } from "../mapper/inspectionMapper/inspectionTypeMapper"
import { normalizeInspectionChecklist } from "../mapper/inspectionMapper/inspectionChecklistMapper"
import { normalizeInspectionChecklistItem } from "../mapper/inspectionMapper/inspectionChecklistItemMapper"
import { normalizeInspectionChecklistItemOption } from "../mapper/inspectionMapper/inspectionChecklistItemOptionMapper"
import { normalizeInspectionItemCategory } from "../mapper/inspectionMapper/inspectionItemCategoryMapper"
import { normalizeInspectionItemType } from "../mapper/inspectionMapper/inspectionItemTypeMapper"
import { normalizeHospitalSettings } from "../mapper/hospitalSettingMapper"
import { buildInspection } from "./utils/buildInspection"
import { executeWithErrorAndLoading } from "../components/common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../components/common/LoadingOverlay"
import InspectionOverallResultModal from "./components/InspectionOverallResultModal"
import InspectionCommentModal from "./components/InspectionCommentModal"
import InspectionHistoryModal from "./components/InspectionHistoryModal"
import ConfirmModal from "../components/common/ConfirmModal"
import useConfirmModal from "../components/common/useConfirmModal"

function InspectionExecutionPage() {
    console.log("InspectionExecutionPage")
    const router = useRouter()
    const searchParams = useSearchParams()
    const confirmModal = useConfirmModal()
    const deviceId = Number(searchParams.get("deviceId"))

    const [currentUser, setCurrentUser] = useState<{ displayName: string; role: string } | null>(null)
    const [device, setDevice] = useState<Device | null>(null)
    const [deviceType, setDeviceType] = useState<DeviceTypeType | null>(null)
    const [deviceModel, setDeviceModel] = useState<DeviceModelType | null>(null)
    const [ward, setWard] = useState<WardType | null>(null)
    const [room, setRoom] = useState<RoomType | null>(null)
    const [roomInfections, setRoomInfections] = useState<RoomInfectionType[]>([])
    const [infectionTypes, setInfectionTypes] = useState<InfectionTypeType[]>([])
    const [hospitalSettings, setHospitalSettings] = useState<HospitalSettingsType | null>(null)
    const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([])
    const [inspectionChecklists, setInspectionChecklists] = useState<InspectionChecklist[]>([])
    const [selectedInspectionTypeId, setSelectedInspectionTypeId] = useState<number | null>(null)
    const [selectedChecklistId, setSelectedChecklistId] = useState<string>("")
    const [inspectionChecklistItems, setInspectionChecklistItems] = useState<InspectionChecklistItem[]>([])
    const [inspectionChecklistItemOptions, setInspectionChecklistItemOptions] = useState<Record<number, InspectionChecklistItemOptionFrontType[]>>({})
    const [inspectionItemCategories, setInspectionItemCategories] = useState<InspectionItemCategoryType[]>([])
    const [inspectionItemTypes, setInspectionItemTypes] = useState<InspectionItemType[]>([])
    const [inspectionResults, setInspectionResults] = useState<Record<number, string | null>>({})
    const [overallResult, setOverallResult] = useState<"OK" | "NG" | null>(null)
    const [comment, setComment] = useState("")
    const [isOverallResultModalOpen, setIsOverallResultModalOpen] = useState(false)
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
    const [isInspectionHistoryModalOpen, setIsInspectionHistoryModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // スマホ用アコーディオン開閉状態 (デフォルトは閉じて省スペース化)
    const [isUserDetailOpen, setIsUserDetailOpen] = useState(false)
    const [isInfectionDetailOpen, setIsInfectionDetailOpen] = useState(false)
    const [isDeviceDetailOpen, setIsDeviceDetailOpen] = useState(false)

    const getTodayDate = () => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
    }

    const handleInspectionResultChange = (itemId: number, value: string | null) => {
        setInspectionResults((prev) => ({ ...prev, [itemId]: value }))
    }

    const validateRequiredItems = async () => {
        if (!selectedChecklist) return false
        const missing = inspectionChecklistItems.filter((item: InspectionChecklistItem) => {
            if (!item.required) return false
            const val = inspectionResults[item.id]
            if (val === "-") return false
            return val === null || val === undefined || (typeof val === "string" && val.trim() === "")
        })
        if (missing.length > 0) {
            await confirmModal.confirm({
                title: "未入力の必須項目",
                message: `以下の必須項目が未入力です：\n${missing.map((item: InspectionChecklistItem) => `・${item.itemName}`).join("\n")}`,
                buttonPattern: "ok_only",
                icon: "warning",
            })
            return false
        }
        return true
    }

    const handleSave = async (result: "OK" | "NG") => {
        if (!selectedChecklist) return
        setOverallResult(result)
        const inspection = {
            inspection: {
                deviceId,
                roomId: room?.id ?? null,
                inspectionTypeId: selectedChecklist.inspectionTypeId,
                checklistId: selectedChecklist.id,
                overallResult: result,
                comment: comment || null,
            },
            results: Object.entries(inspectionResults).map(([checklistItemId, value]) => ({
                checklistItemId: Number(checklistItemId),
                value,
            })),
        }
        try {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => { await createInspectionTransaction({ inspection }) },
            })
            flagNeedsRefreshTodayInspections(true) // ★ 点検更新フラグをON
            await confirmModal.confirm({ title: "保存完了", message: `点検結果（判定: ${result}）を記録しました`, buttonPattern: "ok_only", icon: "success", confirmVariant: "teal" })
            router.push("/dashboard")
        } catch (error) {
            await confirmModal.confirm({ title: "エラー", message: "点検結果の保存に失敗しました", buttonPattern: "ok_only", icon: "warning", confirmVariant: "danger" })
        }
    }

    const fetchInitialData = async () => {
        try {
            await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                    const data = await fetchInitInspectionExecution()
                    const devices: Device[] = data.devices.map(normalizeDevice)
                    const d = devices.find((deviceItem: Device) => String(deviceItem.id) === String(deviceId))
                    if (!d) return
                    const dTypes: DeviceTypeType[] = data.device_types.map(normalizeDeviceType)
                    const dModels: DeviceModelType[] = data.device_models.map(normalizeDeviceModel)
                    const wards: WardType[] = data.wards.map(normalizeWard)
                    const rooms: RoomType[] = data.rooms.map(normalizeRoom)
                    const r = rooms.find((roomItem: RoomType) => roomItem.id === d.roomId)
                    const rInfections: RoomInfectionType[] = data.room_infections.map(normalizeRoomInfection)
                    const targetInfections = rInfections.filter((ri: RoomInfectionType) => ri.roomId === d.roomId)
                    const iTypes: InfectionTypeType[] = data.infection_types.map(normalizeInfectionType)
                    const allChecklists: InspectionChecklist[] = data.inspection_checklists.map(normalizeInspectionChecklist)
                    const filteredChecklists = allChecklists.filter((cl: InspectionChecklist) => cl.deviceTypeId === d.type && (cl.deviceModelId === d.model || cl.deviceModelId === null))
                    const iTypesList: InspectionType[] = data.inspection_types.map(normalizeInspectionType)

                    setCurrentUser({ displayName: data.current_user.display_name, role: data.current_user.role })
                    setDevice(d)
                    setDeviceType(dTypes.find((typeItem: DeviceTypeType) => typeItem.id === d.type) ?? null)
                    setDeviceModel(dModels.find((modelItem: DeviceModelType) => modelItem.id === d.model) ?? null)
                    setRoom(r ?? null)
                    setWard(wards.find((w: WardType) => w.id === r?.wardId) ?? null)
                    setRoomInfections(targetInfections)
                    setInfectionTypes(iTypes)
                    setInspectionTypes(iTypesList)
                    setInspectionChecklists(filteredChecklists)
                    setInspectionItemCategories(data.inspection_item_categories.map(normalizeInspectionItemCategory))
                    setInspectionItemTypes(data.inspection_item_types.map(normalizeInspectionItemType))
                    setHospitalSettings(normalizeHospitalSettings(data.hospital_settings))

                    if (filteredChecklists.length > 0) {
                        const firstType = filteredChecklists[0].inspectionTypeId
                        setSelectedInspectionTypeId(firstType)
                        setSelectedChecklistId(String(filteredChecklists[0].id))
                    }
                },
            })
        } catch (error) {
            await confirmModal.confirm({ title: "エラー", message: "初期化に失敗しました", buttonPattern: "ok_only", icon: "warning", confirmVariant: "danger" })
            router.push("/dashboard")
        }
    }

    const selectedChecklist = inspectionChecklists.find((cl: InspectionChecklist) => String(cl.id) === selectedChecklistId)

    useEffect(() => { fetchInitialData() }, [])

    // 点検表種類の変更時に選択中点検表を再設定
    const handleInspectionTypeChange = (typeId: number | null) => {
        setSelectedInspectionTypeId(typeId)
        if (typeId === null) {
            setSelectedChecklistId("")
            return
        }
        const available = latestChecklists.filter((cl: InspectionChecklist) => cl.inspectionTypeId === typeId)
        if (available.length > 0) setSelectedChecklistId(String(available[0].id))
        else setSelectedChecklistId("")
    }

    useEffect(() => {
        const fetchChecklistItems = async () => {
            if (!selectedChecklistId) { setInspectionChecklistItems([]); setInspectionChecklistItemOptions({}); return }
            try {
                await executeWithErrorAndLoading({
                    setLoading,
                    action: async () => {
                        const itemsData = await getInspectionChecklistItemsWithOptionsFromApi(Number(selectedChecklistId))
                        const items: InspectionChecklistItem[] = itemsData.map(normalizeInspectionChecklistItem)
                        if (device?.standby) {
                            const standbyExcludedIds = new Set(
                                items.filter((item: InspectionChecklistItem) => {
                                    const cat = inspectionItemCategories.find((category: InspectionItemCategoryType) => category.id === item.categoryId)
                                    return cat?.excludeWhenStandby === true
                                }).map((item: InspectionChecklistItem) => item.id)
                            )
                            setInspectionResults((prev) => {
                                const next = { ...prev }
                                standbyExcludedIds.forEach((id: number) => { next[id] = "-" })
                                return next
                            })
                        }
                        const optionsMap: Record<number, InspectionChecklistItemOptionFrontType[]> = {}
                        itemsData.forEach((item: any) => {
                            optionsMap[item.id] = (item.options ?? []).map(normalizeInspectionChecklistItemOption)
                        })
                        setInspectionChecklistItems(items)
                        setInspectionChecklistItemOptions(optionsMap)
                    },
                })
            } catch (error) {
                setInspectionChecklistItems([])
                setInspectionChecklistItemOptions({})
            }
        }
        fetchChecklistItems()
    }, [selectedChecklistId])

    const latestChecklists = Object.values(
        inspectionChecklists.reduce<Record<string, InspectionChecklist>>((acc, cl: InspectionChecklist) => {
            const key = [cl.inspectionTypeId, cl.deviceTypeId, cl.deviceModelId, cl.name].join("-")
            if (!acc[key] || cl.version > acc[key].version) acc[key] = cl
            return acc
        }, {})
    )

    const filteredChecklistsByType = latestChecklists.filter((cl: InspectionChecklist) =>
        selectedInspectionTypeId === null ? true : cl.inspectionTypeId === selectedInspectionTypeId
    )

    return (
        <>
            <div className="min-h-screen w-full bg-slate-50 text-slate-900 pb-28">
                {/* Header */}
                <header className="w-full border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
                        <div>
                            <h1 className="text-base font-bold text-slate-900 sm:text-lg">点検実施</h1>
                            <p className="text-[11px] text-slate-500">対象機器の点検を実施して結果を登録します</p>
                        </div>
                        {currentUser && (
                            <div className="text-right">
                                <span className="text-xs font-bold text-slate-800 block">{currentUser.displayName}</span>
                                <span className="text-[10px] text-slate-400 block">{currentUser.role}</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main: PC・タブレット横は 4/12 vs 8/12、スマホ・タブレット縦は1列垂直スクロール */}
                <main className="mx-auto w-full max-w-7xl p-3 sm:p-5">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
                        {/* 左側：必要情報（実施者・感染・機器・点検表選択） */}
                        <div className="space-y-3 lg:col-span-4 lg:space-y-4">
                            {/* 1. 実施者情報 */}
                            <section className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                                <div
                                    onClick={() => setIsUserDetailOpen((prev) => !prev)}
                                    className="flex items-center justify-between border-b border-slate-100 px-4 py-3 cursor-pointer lg:cursor-default"
                                >
                                    <div>
                                        <h2 className="text-xs font-bold tracking-wide text-slate-700">実施者情報</h2>
                                        <p className="text-[11px] text-slate-400 lg:hidden">
                                            {currentUser ? `${currentUser.displayName} (${currentUser.role})` : "未取得"}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="実施者情報詳細を開閉"
                                        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 lg:hidden"
                                    >
                                        {isUserDetailOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </button>
                                </div>
                                <div className={`p-4 space-y-2 text-xs text-slate-700 ${isUserDetailOpen ? "block" : "hidden lg:block"}`}>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="font-medium text-slate-500">ユーザー名</span>
                                        <span className="font-bold text-slate-900">{currentUser?.displayName ?? "－"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="font-medium text-slate-500">権限</span>
                                        <span className="font-bold text-slate-900">{currentUser?.role ?? "－"}</span>
                                    </div>
                                </div>
                            </section>

                            {/* 2. 感染情報 */}
                            <section className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                                <div
                                    onClick={() => setIsInfectionDetailOpen((prev) => !prev)}
                                    className="flex items-center justify-between border-b border-slate-100 px-4 py-3 cursor-pointer lg:cursor-default"
                                >
                                    <div>
                                        <h2 className="text-xs font-bold tracking-wide text-slate-700">感染情報</h2>
                                        <p className="text-[11px] text-slate-400 lg:hidden">
                                            {roomInfections.length === 0 ? "なし" : `${roomInfections.length}件登録あり`}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="感染情報詳細を開閉"
                                        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 lg:hidden"
                                    >
                                        {isInfectionDetailOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </button>
                                </div>
                                <div className={`p-4 ${isInfectionDetailOpen ? "block" : "hidden lg:block"}`}>
                                    {roomInfections.length === 0 ? (
                                        <p className="text-xs text-slate-400">対象機器の部屋に感染情報はありません</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-1.5">
                                            {roomInfections.map((ri: RoomInfectionType) => {
                                                const inf = infectionTypes.find((it: InfectionTypeType) => String(it.id) === String(ri.infectionTypeId))
                                                return (
                                                    <span
                                                        key={ri.id}
                                                        className="rounded-md px-2.5 py-1 text-xs font-bold text-white shadow-2xs"
                                                        style={{ backgroundColor: inf?.color ?? "#e11d48" }}
                                                    >
                                                        {inf?.name ?? "感染"}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* 3. 機器情報 (全項目保持・矢印で詳細開閉) */}
                            <section className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                                <div
                                    onClick={() => setIsDeviceDetailOpen((prev) => !prev)}
                                    className="flex items-center justify-between border-b border-slate-100 px-4 py-3 cursor-pointer lg:cursor-default"
                                >
                                    <div>
                                        <h2 className="text-xs font-bold tracking-wide text-slate-700">機器情報</h2>
                                        <p className="text-[11px] font-bold text-slate-800 lg:hidden">
                                            {deviceType?.name ?? "－"} {deviceModel?.name ? `(${deviceModel.name})` : ""}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="機器情報詳細を開閉"
                                        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 lg:hidden"
                                    >
                                        {isDeviceDetailOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </button>
                                </div>
                                <div className={`p-4 space-y-2 text-xs text-slate-700 ${isDeviceDetailOpen ? "block" : "hidden lg:block"}`}>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="font-medium text-slate-500">対象機器ID</span>
                                        <span className="font-mono font-bold text-slate-900">{deviceId || "未指定"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="font-medium text-slate-500">機器名</span>
                                        <span className="font-bold text-slate-900">{deviceType?.name ?? "－"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="font-medium text-slate-500">型式</span>
                                        <span className="font-bold text-slate-900">{deviceModel?.name ?? "－"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="font-medium text-slate-500">シリアル番号</span>
                                        <span className="font-mono font-bold text-slate-900">{device?.serialNumber ?? "－"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="font-medium text-slate-500">管理番号</span>
                                        <span className="font-mono font-bold text-slate-900">{device?.managementNumber ?? "－"}</span>
                                    </div>
                                    {hospitalSettings?.showPatientName && (
                                        <div className="flex justify-between items-center py-0.5">
                                            <span className="font-medium text-slate-500">患者名</span>
                                            <span className="font-bold text-teal-800">{room?.patientName ?? "－"}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="font-medium text-slate-500">病棟</span>
                                        <span className="font-bold text-slate-900">{ward?.name ?? "－"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="font-medium text-slate-500">部屋</span>
                                        <span className="font-bold text-slate-900">{room?.name ?? "－"}</span>
                                    </div>
                                </div>
                            </section>

                            {/* 4. 点検表選択 (①点検表種類 -> ②点検表 -> ③過去点検ボタン) */}
                            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5">
                                <div className="border-b border-slate-100 pb-2">
                                    <h2 className="text-xs font-bold tracking-wide text-slate-700">点検表選択</h2>
                                    <p className="mt-0.5 text-[11px] text-slate-400">種類を選択し、点検表を決定します</p>
                                </div>

                                {/* ① 点検表種類 */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-slate-500">点検表種類</label>
                                    <select
                                        value={selectedInspectionTypeId ?? ""}
                                        onChange={(event) => {
                                            const val = event.target.value === "" ? null : Number(event.target.value)
                                            handleInspectionTypeChange(val)
                                        }}
                                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:text-sm"
                                    >
                                        <option value="">すべての種類</option>
                                        {inspectionTypes.map((it: InspectionType) => (
                                            <option key={it.id} value={it.id}>{it.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* ② 点検表 */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-slate-500">点検表</label>
                                    <select
                                        value={selectedChecklistId}
                                        onChange={(event) => setSelectedChecklistId(event.target.value)}
                                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:text-sm"
                                    >
                                        <option value="">点検表を選択してください</option>
                                        {filteredChecklistsByType.map((cl: InspectionChecklist) => (
                                            <option key={cl.id} value={cl.id}>
                                                {cl.name} (Ver.{cl.version})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* ③ 過去の点検結果を参照ボタン */}
                                <button
                                    type="button"
                                    onClick={() => setIsInspectionHistoryModalOpen(true)}
                                    disabled={!selectedChecklistId}
                                    className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <History className="h-4 w-4 text-teal-700" />
                                    <span>過去の点検結果を参照</span>
                                </button>
                            </section>
                        </div>

                        {/* 右側：点検項目メインエリア */}
                        <div className="space-y-4 lg:col-span-8">
                            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
                                <div className="mb-4 border-b border-slate-100 pb-3">
                                    <h2 className="text-sm font-bold tracking-wide text-slate-800 sm:text-base">
                                        点検項目
                                    </h2>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        各項目を確認・入力してください（長押しで対象外に切り替え可能）
                                    </p>
                                </div>

                                {!selectedChecklistId ? (
                                    <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 text-center">
                                        <div>
                                            <p className="text-sm font-bold text-slate-400">点検表を選択してください</p>
                                            <p className="mt-1 text-xs text-slate-400">点検表を選択すると、点検項目が表示されます</p>
                                        </div>
                                    </div>
                                ) : (
                                    buildInspection({
                                        checklist: selectedChecklist!,
                                        items: inspectionChecklistItems,
                                        categories: inspectionItemCategories,
                                        itemTypes: inspectionItemTypes,
                                        optionsByChecklistItemId: inspectionChecklistItemOptions,
                                        inspectionResults,
                                        inspectionDate: getTodayDate(),
                                        onChange: handleInspectionResultChange,
                                    })
                                )}
                            </section>

                            {/* 備考内容のリアルタイム表示確認カード */}
                            {comment && (
                                <div
                                    onClick={() => setIsCommentModalOpen(true)}
                                    className="cursor-pointer rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-2xs transition-all hover:bg-amber-100/70"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                                            <MessageSquare className="h-4 w-4 shrink-0 text-amber-700" />
                                            <span>入力済み備考（特記事項）</span>
                                        </div>
                                        <span className="text-[11px] font-bold text-amber-700 underline">変更する</span>
                                    </div>
                                    <p className="mt-2 pl-5 text-xs leading-relaxed font-medium text-slate-800 whitespace-pre-wrap">
                                        {comment}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* 画面下部固定アクションバー (Sticky Bottom Bar) */}
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-3 py-2.5 shadow-lg sm:px-6 sm:py-3">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 sm:gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard")}
                            className="flex h-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 sm:px-4 sm:text-sm"
                        >
                            戻る
                        </button>

                        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={() => setIsCommentModalOpen(true)}
                                className={`flex h-11 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-colors sm:px-4 sm:text-sm ${
                                    comment
                                        ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                                        : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                <MessageSquare className="h-4 w-4 shrink-0 text-slate-600" />
                                <span className="truncate">{comment ? "備考あり (確認・変更)" : "備考欄入力"}</span>
                            </button>

                            <button
                                type="button"
                                onClick={async () => {
                                    const isValid = await validateRequiredItems()
                                    if (!isValid) return
                                    setIsOverallResultModalOpen(true)
                                }}
                                disabled={!selectedChecklistId || loading}
                                className="flex h-11 flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-5 text-sm font-bold text-white shadow-md transition-all hover:bg-teal-800 active:scale-98 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-44"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                <span>点検を完了する</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <LoadingOverlay loading={loading} />

            <InspectionOverallResultModal
                isOpen={isOverallResultModalOpen}
                onClose={() => setIsOverallResultModalOpen(false)}
                onSelect={async (result) => {
                    setIsOverallResultModalOpen(false)
                    await handleSave(result)
                }}
            />

            <InspectionCommentModal
                isOpen={isCommentModalOpen}
                initialComment={comment}
                onClose={() => setIsCommentModalOpen(false)}
                onSave={(val: string) => {
                    setComment(val)
                    setIsCommentModalOpen(false)
                }}
            />

            <InspectionHistoryModal
                isOpen={isInspectionHistoryModalOpen}
                onClose={() => setIsInspectionHistoryModalOpen(false)}
                deviceId={deviceId}
                checklistId={Number(selectedChecklistId)}
            />

            <ConfirmModal
                open={confirmModal.isOpen}
                onClose={confirmModal.closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                subMessage={confirmModal.subMessage}
                icon={confirmModal.icon}
                buttonPattern={confirmModal.buttonPattern}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                confirmVariant={confirmModal.confirmVariant}
            />
        </>
    )
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <InspectionExecutionPage />
        </Suspense>
    )
}