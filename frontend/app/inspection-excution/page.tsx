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

// 処理中表示
import { LoadingOverlay } from "../components/common/LoadingOverlay"

export default function InspectionExecutionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const deviceId = searchParams.get("deviceId")

    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
    const [device, setDevice] = useState<Device | null>(null)
    const [deviceType, setDeviceType] = useState<DeviceTypeType | null>(null)
    const [deviceModel, setDeviceModel] = useState<DeviceModelType | null>(null)
    const [ward, setWard] = useState<WardType | null>(null)
    const [room, setRoom] = useState<RoomType | null>(null)
    const [roomInfections, setRoomInfections] = useState<RoomInfectionType[]>([])
    const [infectionTypes, setInfectionTypes] = useState<InfectionTypeType[]>([])
    const [inspectionChecklists, setInspectionChecklists] = useState<InspectionChecklist[]>([])
    const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([])
    const [loading, setLoading] = useState(false)

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
                

                const device = devices.find(d => String(d.id) === deviceId)
                if (!device) return
console.log("device", device)
console.log("device.type", device.type)
console.log("device.model", device.model)
console.log("inspectionChecklists", inspectionChecklists)

                const deviceType = deviceTypes.find(d => d.id === device.type)
                const deviceModel = deviceModels.find(d => d.id === device.model)
                const room = rooms.find(r => r.id === device.roomId)
                const targetRoomInfections = roomInfections.filter(
                    roomInfection => roomInfection.roomId === device.roomId
                )
console.log(
    "target infectionTypeIds:",
    targetRoomInfections.map(roomInfection => roomInfection.infectionTypeId)
)

console.log(
    "infectionType ids:",
    infectionTypes.map(infectionType => ({
        id: infectionType.id,
        name: infectionType.name,
    }))
)               



                const ward = wards.find(w => w.id === room?.wardId)
console.log(
    "matched checklists",
    inspectionChecklists.filter(
        checklist =>
            checklist.deviceTypeId === device.type &&
            checklist.deviceModelId === device.model
    )
)
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
            } finally {
                setLoading(false)
            }
        }

        fetchInitialData()
    }, [deviceId])

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

            <div className="mt-6 rounded border p-4">
                <h2 className="text-lg font-bold">
                    実施者情報
                </h2>

                <div className="mt-2">
                    <p>ユーザー名：{currentUser?.displayName ?? "－"}</p>
                    <p>権限：{currentUser?.role ?? "－"}</p>
                </div>
            </div>

            <div className="mt-6 rounded border p-4">
                <h2 className="text-lg font-bold">
                    感染情報
                </h2>

                {roomInfections.length === 0 ? (
                    <p className="mt-2">
                        感染情報はありません。
                    </p>
                ) : (
                    <div className="mt-2 flex gap-2">
                        {roomInfections.map(roomInfection => {
const infectionType = infectionTypes.find(
    infectionType => String(infectionType.id) === String(roomInfection.infectionTypeId)
)
console.log(
    "infection compare:",
    roomInfection.infectionTypeId,
    typeof roomInfection.infectionTypeId,
    infectionTypes.map(infectionType => ({
        id: infectionType.id,
        type: typeof infectionType.id,
        name: infectionType.name,
    }))
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


            <div className="mt-6 rounded border p-4">
                <p>対象機器ID：{deviceId ?? "未指定"}</p>
                <p>機器名：{deviceType?.name ?? "－"}</p>
                <p>型式：{deviceModel?.name ?? "－"}</p>
                <p>シリアル番号：{device?.serialNumber ?? "－"}</p>
                <p>管理番号：{device?.managementNumber ?? "－"}</p>
                <p>病棟：{ward?.name ?? "－"}</p>
                <p>部屋：{room?.name ?? "－"}</p>

            </div>

            <div className="mt-6 rounded border p-4">
                <h2 className="text-lg font-bold">
                    点検表
                </h2>

                {inspectionChecklists.length === 0 ? (
                    <p className="mt-2">
                        対象の点検表がありません。
                    </p>
                ) : (
                    <div className="mt-4 space-y-2">
                        {inspectionChecklists.map(checklist => {
                            const inspectionType = inspectionTypes.find(
                                inspectionType => inspectionType.id === checklist.inspectionTypeId
                            )

                            return (
                                <button
                                    key={checklist.id}
                                    type="button"
                                    className="block w-full rounded border p-4 text-left hover:bg-gray-50"
                                >
                                    <div className="font-bold">
                                        {checklist.name}
                                    </div>

                                    <div className="mt-1 text-sm text-gray-600">
                                        点検表種別：{inspectionType?.name ?? "－"}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}                
            </div>
        </main>
    )
}