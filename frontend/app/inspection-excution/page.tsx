"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// fetch
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
// normalizer
import {normalizeCurrentUser} from "../utils/userMapper"
import { normalizeDevice } from "../utils/deviceMapper"
import { normalizeWard } from "../utils/wardsMapper"
import { normalizeRoom } from "../utils/roomsMapper"
import {normalizeRoomInfection} from"../utils/roomInfectionMapper"
import {normalizeInfectionType} from "../utils/infectionTypeMapper"
import { normalizeDeviceType } from "../utils/deviceTypeMapper"
import { normalizeDeviceModel } from "../utils/deviceModelMapper"
import { normalizeInspectionType } from "../utils/inspectionMapper/inspectionTypeMapper"
import { normalizeInspectionChecklist } from "../utils/inspectionMapper/inspectionChecklistMapper"
import { normalizeInspectionChecklistItem } from "../utils/inspectionMapper/inspectionChecklistItemMapper"
import { normalizeInspectionChecklistItemOption } from "../utils/inspectionMapper/inspectionChecklistItemOptionMapper"
import { normalizeInspectionItemCategory } from "../utils/inspectionMapper/inspectionItemCategoryMapper"
// 処理中表示
import { LoadingOverlay } from "../components/common/LoadingOverlay"

//CategoryのOrderを取得して、Itemの並び替え関数
function getInspectionChecklistItemGroups(
    items: InspectionChecklistItem[],
    categories: InspectionItemCategoryType[]
) {
    return categories
        .filter(category => category.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(category => ({
            category,
            items: items
                .filter(item => item.categoryId === category.id)
                .sort((a, b) => a.displayOrder - b.displayOrder)
        }))
        .filter(group => group.items.length > 0)
}

function getInspectionChecklistItemInput(
    item: InspectionChecklistItem,
    options: InspectionChecklistItemOptionFrontType[]
) {
    switch (item.itemTypeId) {
        case 1:
            return (
                <input
                    type="number"
                    defaultValue={item.defaultValue ?? ""}
                    className="w-full rounded border px-3 py-2"
                />
            )
        case 2:
            return (
                <input
                    type="text"
                    defaultValue={item.defaultValue ?? ""}
                    className="w-full rounded border px-3 py-2"
                />
            )
        case 3:
            return (
                <select
                    defaultValue={item.defaultValue ?? ""}
                    className="w-full rounded border px-3 py-2"
                >
                    <option value="">選択してください</option>
                    <option value="OK">OK</option>
                    <option value="NG">NG</option>
                </select>
            )
        case 4:
            return (
                <select
                    defaultValue={item.defaultValue ?? ""}
                    className="w-full rounded border px-3 py-2"
                >
                    <option value="">選択してください</option>
                    {options.map(option => (
                        <option key={option.id} value={option.value}>
                            {option.value}
                        </option>
                    ))}
                </select>
            )
        default:
            return null
    }
}

export default function InspectionExecutionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const deviceId = searchParams.get("deviceId")
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
//点検情報
    const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([])
    const [inspectionChecklists, setInspectionChecklists] = useState<InspectionChecklist[]>([])
    const [selectedChecklistId, setSelectedChecklistId] = useState<string>("")
    const [inspectionChecklistItems, setInspectionChecklistItems] = useState<InspectionChecklistItem[]>([])
    const [inspectionChecklistItemOptions, setInspectionChecklistItemOptions] = useState<Record<number, InspectionChecklistItemOptionFrontType[]>>({})
    const [inspectionItemCategories, setInspectionItemCategories] = useState<InspectionItemCategoryType[]>([])
    
    const [loading, setLoading] = useState(false)


    //初期化hook
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!deviceId) return

            setLoading(true)

            try {
                const currentUser = await fetchCurrentUser()
                if (!currentUser) return
                const userInfo = normalizeCurrentUser(currentUser)
                console.log("userInfo:",userInfo)
                

                const [
                    devicesData,
                    deviceTypesData,
                    deviceModelsData,
                    wardsData,
                    roomsData,
                    roomInfectionsData,
                    infectionTypesData,
                    inspectionChecklistsData,
                    inspectionTypesData,
                    inspectionItemCategoriesData,
                ] = await Promise.all([
                    getDevicesFromApi(),
                    getDeviceTypesFromApi(),
                    getDeviceModelsFromApi(),
                    getWardsFromApi(),
                    getRoomsFromApi(),
                    getRoomInfectionsFromApi(),
                    getInfectionTypesFromApi(),
                    getInspectionChecklistsFromApi(),
                    getInspectionTypes(),
                    getInspectionItemCategoriesFromApi()


                ])

const devices = devicesData.map(normalizeDevice)
const deviceTypes = deviceTypesData.map(normalizeDeviceType)
const deviceModels = deviceModelsData.map(normalizeDeviceModel)
const wards = wardsData.map(normalizeWard)
const rooms = roomsData.map(normalizeRoom)
const roomInfections = roomInfectionsData.map(normalizeRoomInfection)
const infectionTypes = infectionTypesData.map(normalizeInfectionType)
const inspectionChecklists = inspectionChecklistsData.map(normalizeInspectionChecklist)
const inspectionTypes = inspectionTypesData.map(normalizeInspectionType)
const inspectionItemCategories = inspectionItemCategoriesData.map(normalizeInspectionItemCategory)

const device = devices.find(d => String(d.id) === String(deviceId))

if (!device) return

const deviceType = deviceTypes.find(d => d.id === device.type)
const deviceModel = deviceModels.find(d => d.id === device.model)
const room = rooms.find(r => r.id === device.roomId)
const targetRoomInfections = roomInfections.filter(
    roomInfection => roomInfection.roomId === device.roomId
)
const ward = wards.find(w => w.id === room?.wardId)
                setCurrentUser(userInfo)
                setDevice(device)

                setDeviceType(deviceType ?? null)
                setDeviceModel(deviceModel ?? null)
                setRoom(room ?? null)
                setRoomInfections(targetRoomInfections)
                setInfectionTypes(infectionTypes)
                setWard(ward ?? null)
                setInspectionTypes(inspectionTypes)
                setInspectionChecklists(
                    inspectionChecklists.filter(
                        checklist =>
                            checklist.deviceTypeId === device.type &&
                            checklist.deviceModelId === device.model
                    )
                )
                setInspectionItemCategories(inspectionItemCategories)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialData()
    }, [deviceId])
    //点検表を選択したとき発動
    useEffect(() => {
        const fetchChecklistItems = async () => {
            if (!selectedChecklistId) {
                setInspectionChecklistItems([])
                setInspectionChecklistItemOptions({})
                return
            }

            const selectedChecklist = inspectionChecklists.find(
                checklist => String(checklist.id) === selectedChecklistId
            )

            console.log("selected checklist:", selectedChecklist)

            const inspectionChecklistItemsData = await getInspectionChecklistItemsFromApi(Number(selectedChecklistId))
            const inspectionChecklistItems = inspectionChecklistItemsData.map(normalizeInspectionChecklistItem)

            console.log("selected checklist items:", inspectionChecklistItems)

            const optionsByChecklistItemId: Record<number, InspectionChecklistItemOptionFrontType[]> = {}

            await Promise.all(
                inspectionChecklistItems.map(async item => {
                    const inspectionChecklistItemOptionsData = await getInspectionChecklistItemOptionsFromApi(item.id)
                    const inspectionChecklistItemOptions = inspectionChecklistItemOptionsData.map(normalizeInspectionChecklistItemOption)

                    optionsByChecklistItemId[item.id] = inspectionChecklistItemOptions
                })
            )

            console.log("selected checklist item options:", optionsByChecklistItemId)


            setInspectionChecklistItems(inspectionChecklistItems)
            setInspectionChecklistItemOptions(optionsByChecklistItemId)
        }

        fetchChecklistItems()
    }, [selectedChecklistId, inspectionChecklists])


return (
    <main className="min-h-screen p-6">
        {loading && <LoadingOverlay />}

        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
                点検実施
            </h1>

            <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded border px-4 py-2"
            >
                ダッシュボードへ戻る
            </button>
        </div>

        <div className="mt-6 grid grid-cols-[320px_1fr] gap-6">
            <div className="space-y-6">
                <div className="rounded border p-4">
                    <h2 className="text-lg font-bold">
                        実施者情報
                    </h2>

                    <div className="mt-2">
                        <p>ユーザー名：{currentUser?.displayName ?? "－"}</p>
                        <p>権限：{currentUser?.role ?? "－"}</p>
                    </div>
                </div>

                <div className="rounded border p-4">
                    <h2 className="text-lg font-bold">
                        感染情報
                    </h2>

                    {roomInfections.length === 0 ? (
                        <p className="mt-2">
                            感染情報はありません。
                        </p>
                    ) : (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {roomInfections.map(roomInfection => {
                                const infectionType = infectionTypes.find(
                                    infectionType => String(infectionType.id) === String(roomInfection.infectionTypeId)
                                )

                                return (
                                    <div
                                        key={roomInfection.id}
                                        className="rounded px-3 py-1 text-white"
                                        style={{ backgroundColor: infectionType?.color ?? "#666" }}
                                    >
                                        {infectionType?.name ?? "－"}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="rounded border p-4">
                    <h2 className="text-lg font-bold">
                        機器情報
                    </h2>

                    <div className="mt-2">
                        <p>対象機器ID：{deviceId ?? "未指定"}</p>
                        <p>機器名：{deviceType?.name ?? "－"}</p>
                        <p>型式：{deviceModel?.name ?? "－"}</p>
                        <p>シリアル番号：{device?.serialNumber ?? "－"}</p>
                        <p>管理番号：{device?.managementNumber ?? "－"}</p>
                        <p>病棟：{ward?.name ?? "－"}</p>
                        <p>部屋：{room?.name ?? "－"}</p>
                    </div>
                </div>

                <div className="rounded border p-4">
                    <h2 className="text-lg font-bold">
                        点検表
                    </h2>

                    {inspectionChecklists.length === 0 ? (
                        <p className="mt-2">
                            対象の点検表がありません。
                        </p>
                    ) : (
                        <div className="mt-4">
                            {(() => {
                                const latestInspectionChecklists = Object.values(
                                    inspectionChecklists.reduce<Record<string, InspectionChecklist>>((acc, checklist) => {
                                        const key = [
                                            checklist.inspectionTypeId,
                                            checklist.deviceTypeId,
                                            checklist.deviceModelId,
                                            checklist.name
                                        ].join("-")

                                        const current = acc[key]

                                        if (!current || checklist.version > current.version) {
                                            acc[key] = checklist
                                        }

                                        return acc
                                    }, {})
                                )

                                return (
                                    <select
                                        value={selectedChecklistId}
                                        onChange={event => {
                                            setSelectedChecklistId(event.target.value)
                                        }}
                                        className="w-full rounded border px-3 py-2"
                                    >
                                        <option value="">
                                            点検表を選択してください
                                        </option>

                                        {latestInspectionChecklists.map(checklist => {
                                            const inspectionType = inspectionTypes.find(
                                                inspectionType => inspectionType.id === checklist.inspectionTypeId
                                            )

                                            return (
                                                <option key={checklist.id} value={checklist.id}>
                                                    {checklist.name}（{inspectionType?.name ?? "－"} / Ver.{checklist.version}）
                                                </option>
                                            )
                                        })}
                                    </select>
                                )
                            })()}
                        </div>
                    )}
                </div>
            </div>

            <div className="min-w-0 rounded border p-6">
                <h2 className="text-xl font-bold">
                    点検項目
                </h2>

                {!selectedChecklistId ? (
                    <div className="mt-6 flex min-h-[400px] items-center justify-center text-gray-500">
                        点検表を選択してください。
                    </div>
                ) : (

                    <div className="mt-6 space-y-6">
                        {getInspectionChecklistItemGroups(
                            inspectionChecklistItems,
                            inspectionItemCategories
                        ).map(group => (
                            <div key={group.category.id}>
                                <h3 className="mb-3 border-b pb-2 text-lg font-bold">
                                    {group.category.name}
                                </h3>

                                <div className="space-y-3">
                                    {group.items.map(item => (
                                        <div
                                            key={item.id}
                                            className="rounded border p-4"
                                        >

                                        <div className="flex items-center gap-4">
                                            <p className="w-1/2 font-medium">
                                                {item.itemName}
                                            </p>

                                            <div className="w-1/2">
                                                {getInspectionChecklistItemInput(
                                                    item,
                                                    inspectionChecklistItemOptions[item.id] ?? []
                                                )}
                                            </div>
                                        </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>                    
                )}
            </div>
        </div>
    </main>
)
}