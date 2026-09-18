"use client"

import { Suspense,useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// API
import { fetchCurrentUser } from "../api/auth/fetchCurrentUser"
import { getDevicesFromApi } from "../api/devices/fetchDevices"
import { getWardsFromApi } from "../api/wards/fetchWards"
import { getRoomsFromApi } from "../api/rooms/fetchRooms"
import { getRoomInfectionsFromApi } from "../api/roomInfections/fetchRoomInfections"
import { getInfectionTypesFromApi } from "../api/infectionTypes/fetchInfectionTypes"
import { getDeviceTypesFromApi } from "../api/deviceTypes/fetchDeviceTypes"
import { getDeviceModelsFromApi } from "../api/deviceModels/fetchDeviceModels"
import { getInspectionTypes } from "../api/inspection/inspectionTypes/fetchInspectionTypes"
import { getInspectionChecklistsFromApi } from "../api/inspection/inspectionChecklists/fetchInspectionChecklists"
import { getInspectionChecklistItemsFromApi } from "../api/inspection/inspectionChecklistItems/fetchInspectionChecklistItems"
import { getInspectionChecklistItemOptionsFromApi } from "../api/inspection/inspectionChecklistItemOptions/fetchInspectionChecklistItemOptions"
import { getInspectionItemCategoriesFromApi } from "../api/inspection/inspectionItemCategoies/fetchInspectionItemCategories"
import { getInspectionItemTypesFromApi } from "../api/inspection/inspectionItemTypes/fetchInspectionItemTypes"
import { createInspectionTransaction } from "../api/transactions/inspection/inspections/createInspectionTransaction"
import { getTodayInspectionsFromApi } from "../api/inspection/inspections/fetchTodayInspections"
import { fetchHospitalSettingsTransaction } from "../api/transactions/hospitalSettings/fetchHospitalSettingsTransaction"
import { fetchInitInspectionExecution } from "../api/inits/fetchInitInspectionExecution"
// types
import type { CurrentUser } from "../types/userTypes"
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
// normalizer
import {normalizeCurrentUser} from "../mapper/userMapper"
import { normalizeDevice } from "../mapper/deviceMapper"
import { normalizeWard } from "../mapper/wardsMapper"
import { normalizeRoom } from "../mapper/roomsMapper"
import {normalizeRoomInfection} from"../mapper/roomInfectionMapper"
import {normalizeInfectionType} from "../mapper/infectionTypeMapper"
import { normalizeDeviceType } from "../mapper/deviceTypeMapper"
import { normalizeDeviceModel } from "../mapper/deviceModelMapper"
import { normalizeInspectionType } from "../mapper/inspectionMapper/inspectionTypeMapper"
import { normalizeInspectionChecklist } from "../mapper/inspectionMapper/inspectionChecklistMapper"
import { normalizeInspectionChecklistItem } from "../mapper/inspectionMapper/inspectionChecklistItemMapper"
import { normalizeInspectionChecklistItemOption } from "../mapper/inspectionMapper/inspectionChecklistItemOptionMapper"
import { normalizeInspectionItemCategory } from "../mapper/inspectionMapper/inspectionItemCategoryMapper"
import { normalizeInspectionItemType } from "../mapper/inspectionMapper/inspectionItemTypeMapper"
import { normalizeHospitalSettings } from "../mapper/hospitalSettingMapper"

//buid
import { buildInspection } from "./utils/buildInspection"
// 処理中表示
import { executeWithErrorAndLoading } from "../components/common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../components/common/LoadingOverlay"


//Next.js 16では、useSearchParams()をSuspense境界の内側で実行する必要があります。
function InspectionExecutionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    //URLからdevice idを取得する（str扱いになるのでnumber変換）
    const deviceId = Number(searchParams.get("deviceId"))
    //user
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
//機器情報
    const [device, setDevice] = useState<Device | null>(null)
    const [deviceType, setDeviceType] = useState<DeviceTypeType | null>(null)
    const [deviceModel, setDeviceModel] = useState<DeviceModelType | null>(null)
    const [ward, setWard] = useState<WardType | null>(null)
    const [room, setRoom] = useState<RoomType | null>(null)
    const [roomInfections, setRoomInfections] = useState<RoomInfectionType[]>([])
    const [infectionTypes, setInfectionTypes] = useState<InfectionTypeType[]>([])
    const [hospitalSettings, setHospitalSettings] = useState<HospitalSettingsType | null>(null)
//点検情報
    const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([])
    const [inspectionChecklists, setInspectionChecklists] = useState<InspectionChecklist[]>([])
    const [selectedChecklistId, setSelectedChecklistId] = useState<string>("")
    const [inspectionChecklistItems, setInspectionChecklistItems] = useState<InspectionChecklistItem[]>([])
    const [inspectionChecklistItemOptions, setInspectionChecklistItemOptions] = useState<Record<number, InspectionChecklistItemOptionFrontType[]>>({})
    const [inspectionItemCategories, setInspectionItemCategories] = useState<InspectionItemCategoryType[]>([])
    const [inspectionItemTypes, setInspectionItemTypes] = useState<InspectionItemType[]>([])
    //点検結果を受け取るstate
    const [inspectionResults, setInspectionResults] = useState<Record<number, string | null>>({})
    //inspectionResults用関数
    const handleInspectionResultChange = (itemId: number, value: string | null) => {
        setInspectionResults(prev => ({
            ...prev,
            [itemId]: value
        }))
    } 
    const [loading, setLoading] = useState(false)

    
    const handleSave = async () => {
        if (!selectedChecklist) return
        // 必須項目チェック
        const missingRequiredItems = inspectionChecklistItems.filter(item => {
            if (!item.required) return false
            const value = inspectionResults[item.id]
            return value === null || value === undefined || value.trim() === ""
        })

        if (missingRequiredItems.length > 0) {
            alert(
                `入力必須の項目が未入力です。\n\n${missingRequiredItems
                    .map(item => `・${item.itemName}`)
                    .join("\n")}`
            )
            return
        }

        const inspection = {
            inspection: {
                deviceId,
                roomId: room?.id ?? null,
                inspectionTypeId: selectedChecklist.inspectionTypeId,
                checklistId: selectedChecklist.id,
                overallResult: null,
                comment: null
            },
            results: Object.entries(inspectionResults).map(
                ([checklistItemId, value]) => ({
                    checklistItemId: Number(checklistItemId),
                    value
                })
            )
        }
/* console.log(
    "保存する点検結果:",
    JSON.stringify(inspection, null, 2)
)
 */
        await executeWithErrorAndLoading({
                setLoading,
                action: async () => {
                        await createInspectionTransaction({
                            inspection,                           
                        })
                }
            })      
        alert("点検結果を保存しました")
        router.push("/dashboard")
    }

    //初期化
    const fetchInitialData = async () => {
        if (!deviceId) return
        setLoading(true)
        try {
            const data = await fetchInitInspectionExecution()
            const currentUserData = await fetchCurrentUser()
            const currentUser = normalizeCurrentUser(currentUserData)            
            const devices: Device[] = data.devices.map(normalizeDevice)
            const deviceTypes: DeviceTypeType[] = data.device_types.map(normalizeDeviceType)
            const deviceModels: DeviceModelType[] = data.device_models.map(normalizeDeviceModel)
            const wards: WardType[] = data.wards.map(normalizeWard)
            const rooms: RoomType[] = data.rooms.map(normalizeRoom)
            const roomInfections: RoomInfectionType[] = data.room_infections.map(normalizeRoomInfection)
            const infectionTypes: InfectionTypeType[] = data.infection_types.map(normalizeInfectionType)
            const inspectionChecklists: InspectionChecklist[] = data.inspection_checklists.map(normalizeInspectionChecklist)
            const inspectionTypes: InspectionType[] = data.inspection_types.map(normalizeInspectionType)
            const inspectionItemCategories: InspectionItemCategoryType[] = data.inspection_item_categories.map(normalizeInspectionItemCategory)
            const inspectionItemTypes: InspectionItemType[] = data.inspection_item_types.map(normalizeInspectionItemType)
            const device = devices.find(d => String(d.id) === String(deviceId))
            if (!device) return
            const deviceType = deviceTypes.find(d => d.id === device.type)
            const deviceModel = deviceModels.find(d => d.id === device.model)
            const room = rooms.find(r => r.id === device.roomId)
            const targetRoomInfections = roomInfections.filter(roomInfection => roomInfection.roomId === device.roomId)
            const ward = wards.find(w => w.id === room?.wardId)
            setCurrentUser(currentUser)
            setDevice(device)
            setDeviceType(deviceType ?? null)
            setDeviceModel(deviceModel ?? null)
            setRoom(room ?? null)
            setRoomInfections(targetRoomInfections)
            setInfectionTypes(infectionTypes)
            setWard(ward ?? null)
            setInspectionTypes(inspectionTypes)
            setInspectionChecklists(inspectionChecklists.filter(
                checklist => checklist.deviceTypeId === device.type && 
                    (checklist.deviceModelId === device.model ||checklist.deviceModelId === null)
            ))
            setInspectionItemTypes(inspectionItemTypes)
            setInspectionItemCategories(inspectionItemCategories)
            setHospitalSettings(normalizeHospitalSettings(data.hospital_settings))
        } finally {
            setLoading(false)
        }
    }
    //選択中Checklistをpage側で取得
    const selectedChecklist = inspectionChecklists.find(
        checklist => String(checklist.id) === selectedChecklistId
    )

    useEffect(() =>
    {
        fetchInitialData()
    }, [])

    // 点検表を選択したとき発動
    useEffect(() => {
        const fetchChecklistItems = async () => {
            if (!selectedChecklistId) {
                setInspectionChecklistItems([])
                setInspectionChecklistItemOptions({})
                return
            }

            const selectedChecklist = inspectionChecklists.find(checklist =>
                    String(checklist.id) === selectedChecklistId
            )

            if (!selectedChecklist) return
            const inspectionChecklistItemsData =await getInspectionChecklistItemsFromApi(Number(selectedChecklistId))
            const inspectionChecklistItems =inspectionChecklistItemsData.map(normalizeInspectionChecklistItem)

            // 各inspection itemの選択肢を取得
            const optionsEntries = await Promise.all(
                inspectionChecklistItems.map(async (item: InspectionChecklistItem) =>
                    {
                        const inspectionChecklistItemOptionsData =await getInspectionChecklistItemOptionsFromApi(item.id)
                        const inspectionChecklistItemOptions =inspectionChecklistItemOptionsData.map(normalizeInspectionChecklistItemOption)
                        return [item.id, inspectionChecklistItemOptions,] as const
                    }
                )
            )

            const optionsByChecklistItemId =Object.fromEntries(optionsEntries)

            setInspectionChecklistItems(inspectionChecklistItems)
            setInspectionChecklistItemOptions(optionsByChecklistItemId)
        }
        fetchChecklistItems()
    }, [selectedChecklistId])



return (
    <>
        <main className="min-h-screen bg-gray-200 p-12">

            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        点検実施
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        対象機器の点検を実施してください
                    </p>
                </div>

                {/* Main */}
                <div className="flex flex-col gap-6 lg:flex-row">

                    {/* ===================================== */}
                    {/* 左側：機器・実施者情報 */}
                    {/* ===================================== */}
                    <section className="
                        w-full
                        space-y-5
                        lg:w-1/3
                    ">

                        {/* 実施者情報 */}
                        <div className="
                            rounded-xl
                            bg-white
                            p-6
                            shadow-sm
                        ">
                            <div className="mb-4 pb-3">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    実施者情報
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    点検を実施するユーザー
                                </p>
                            </div>

                            <div className="space-y-2 text-sm text-gray-700">
                                <p>
                                    <span className="font-medium">
                                        ユーザー名：
                                    </span>
                                    {currentUser?.displayName ?? "－"}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        権限：
                                    </span>
                                    {currentUser?.role ?? "－"}
                                </p>
                            </div>
                        </div>

                        {/* 感染情報 */}
                        <div className="
                            rounded-xl
                            bg-white
                            p-6
                            shadow-sm
                        ">
                            <div className="mb-4 pb-3">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    感染情報
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    対象機器が設置されている部屋の感染情報
                                </p>
                            </div>

                            {roomInfections.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    感染情報はありません。
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {roomInfections.map(roomInfection => {
                                        const infectionType = infectionTypes.find(
                                            infectionType =>
                                                String(infectionType.id) ===
                                                String(roomInfection.infectionTypeId)
                                        )

                                        return (
                                            <div
                                                key={roomInfection.id}
                                                className="
                                                    rounded-lg
                                                    px-3
                                                    py-1.5
                                                    text-sm
                                                    font-medium
                                                    text-white
                                                    shadow-sm
                                                "
                                                style={{
                                                    backgroundColor:
                                                        infectionType?.color ?? "#666"
                                                }}
                                            >
                                                {infectionType?.name ?? "－"}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* 機器情報 */}
                        <div className="
                            rounded-xl
                            bg-white
                            p-6
                            shadow-sm
                        ">
                            <div className="mb-4 pb-3">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    機器情報
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    点検対象となる医療機器
                                </p>
                            </div>

                            <div className="space-y-2 text-sm text-gray-700">
                                <p>
                                    <span className="font-medium">
                                        対象機器ID：
                                    </span>
                                    {deviceId ?? "未指定"}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        機器名：
                                    </span>
                                    {deviceType?.name ?? "－"}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        型式：
                                    </span>
                                    {deviceModel?.name ?? "－"}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        シリアル番号：
                                    </span>
                                    {device?.serialNumber ?? "－"}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        管理番号：
                                    </span>
                                    {device?.managementNumber ?? "－"}
                                </p>

                            {/* 患者名 */}
                            {hospitalSettings?.showPatientName === true && (
                                <p>
                                    <span className="font-medium">
                                        患者名：
                                    </span>
                                    {room?.patientName ?? "－"}
                                </p>
                            )}


                                <p>
                                    <span className="font-medium">
                                        病棟：
                                    </span>
                                    {ward?.name ?? "－"}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        部屋：
                                    </span>
                                    {room?.name ?? "－"}
                                </p>
                            </div>
                        </div>

                        {/* 点検表 */}
                        <div className="
                            rounded-xl
                            bg-white
                            p-6
                            shadow-sm
                        ">
                            <div className="mb-4 pb-3">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    点検表
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    使用する点検表を選択してください
                                </p>
                            </div>

                            {inspectionChecklists.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    対象の点検表がありません。
                                </p>
                            ) : (
                                <div>
                                    {(() => {
                                        const latestInspectionChecklists =
                                            Object.values(
                                                inspectionChecklists.reduce<
                                                    Record<string, InspectionChecklist>
                                                >((acc, checklist) => {
                                                    const key = [
                                                        checklist.inspectionTypeId,
                                                        checklist.deviceTypeId,
                                                        checklist.deviceModelId,
                                                        checklist.name
                                                    ].join("-")

                                                    const current = acc[key]

                                                    if (
                                                        !current ||
                                                        checklist.version >
                                                            current.version
                                                    ) {
                                                        acc[key] = checklist
                                                    }

                                                    return acc
                                                }, {})
                                            )

                                        return (
                                            <select
                                                value={selectedChecklistId}
                                                onChange={event => {
                                                    setSelectedChecklistId(
                                                        event.target.value
                                                    )
                                                }}
                                                className="
                                                    w-full
                                                    rounded-lg
                                                    border
                                                    border-gray-500
                                                    bg-white
                                                    px-4
                                                    py-2.5
                                                    text-sm
                                                    outline-none
                                                    transition
                                                    focus:border-blue-500
                                                    focus:ring-2
                                                    focus:ring-blue-100
                                                "
                                            >
                                                <option value="">
                                                    点検表を選択してください
                                                </option>

                                                {latestInspectionChecklists.map(
                                                    checklist => {
                                                        const inspectionType =
                                                            inspectionTypes.find(
                                                                inspectionType =>
                                                                    inspectionType.id ===
                                                                    checklist.inspectionTypeId
                                                            )

                                                        return (
                                                            <option
                                                                key={checklist.id}
                                                                value={checklist.id}
                                                            >
                                                                {checklist.name}
                                                                （
                                                                {inspectionType?.name ??
                                                                    "－"}
                                                                {" / "}
                                                                Ver.
                                                                {checklist.version}
                                                                ）
                                                            </option>
                                                        )
                                                    }
                                                )}
                                            </select>
                                        )
                                    })()}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ===================================== */}
                    {/* 右側：点検項目 */}
                    {/* ===================================== */}
                    <section className="
                        w-full
                        rounded-xl
                        bg-white
                        p-6
                        shadow-sm
                        lg:w-2/3
                    ">

                        <div className="
                            mb-5
                            border-b
                            border-gray-200
                            pb-4
                        ">
                            <h2 className="
                                text-lg
                                font-semibold
                                text-gray-800
                            ">
                                点検項目
                            </h2>

                            <p className="
                                mt-1
                                text-sm
                                text-gray-500
                            ">
                                点検表の各項目を確認して入力してください
                            </p>
                        </div>

                        {!selectedChecklistId ? (
                            <div className="
                                flex
                                h-[600px]
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-dashed
                                border-gray-300
                            ">
                                <div className="text-center">
                                    <p className="text-sm text-gray-400">
                                        点検表を選択してください
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        左側から点検表を選択すると、
                                        点検項目が表示されます
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="
                                max-h-[700px]
                                overflow-y-auto
                                pr-2
                            ">
                                {selectedChecklist && buildInspection({
                                    checklist: selectedChecklist,
                                    items: inspectionChecklistItems,
                                    categories: inspectionItemCategories,
                                    itemTypes: inspectionItemTypes,
                                    optionsByChecklistItemId: inspectionChecklistItemOptions,
                                    inspectionResults,
                                    onChange: handleInspectionResultChange
                                })}
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer */}
                <div className="
                    mt-6
                    flex
                    justify-between
                    gap-3
                ">
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="
                            rounded-lg
                            border
                            border-gray-500
                            bg-white
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-gray-700
                            shadow-sm
                            transition
                            hover:bg-gray-50
                        "
                    >
                        ダッシュボードに戻る
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!selectedChecklistId || loading}
                        className="
                            rounded-lg
                            bg-blue-600
                            px-6
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            shadow-sm
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                            点検を完了する
                    </button>
                </div>
            </div>
        </main>
    {/* 処理中表示 */}
    <LoadingOverlay loading={loading} />
        
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