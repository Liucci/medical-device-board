"use client"
import { useEffect, useState, useRef, useMemo } from "react"
import { getDashboardCache, setDashboardCache, hasDashboardCache, clearDashboardCache, getNeedsRefreshTodayInspections, flagNeedsRefreshTodayInspections } from "../utils/dashboardCache"
import { initDashboard } from "../dashboard/initDashboard"
import styles from "../page.module.css"
import StockAreas from "../components/StockArea"
import WardArea from "../components/WardArea"
import ButtonPanel from "../components/ButtonPanel"
import DragLayer from "../components/DragLayer"
import RoomModal from "../components/modals/RoomModal"
import RoomToRoomModal from "../components/modals/RoomToRoomModal"
import StockInfoModal from "../components/modals/StockInfoModal"
import RoomDeviceInfoModal from "../components/modals/RoomDeviceInfoModal"
import WardInfoModal from "../components/modals/WardInfoModal"
import { CurrentUser } from "../types/userTypes"
import { WardType, UpdateWardInfoType } from "../types/wardTypes"
import { Device, StockLastUpdatedResponse, WardLastUpdatedResponse } from "../types/deviceTypes"
import { TodayInspectionFrontType } from "../types/inspectionTypes/inspectionTypes" 
import { normalizeDevice, toDBDevice } from "../mapper/deviceMapper"
import { normalizeRoom } from "../mapper/roomsMapper"
import { normalizeWard } from "../mapper/wardsMapper"
import { normalizeStockArea } from "../mapper/stockAreaMapper"
import { normalizeDeviceType } from "../mapper/deviceTypeMapper"
import { normalizeDeviceModel } from "../mapper/deviceModelMapper"
import { normalizeHistory } from "../mapper/historyMapper"
import { normalizeMaintenanceType } from "../mapper/maintenanceTypeMapper"
import { normalizeMaintenanceTask } from "../mapper/taskMapper"
import { normalizeInfectionType } from "../mapper/infectionTypeMapper"
import { normalizeRoomInfection } from "../mapper/roomInfectionMapper"
import { normalizeWardInfection } from "../mapper/wardInfectionMapper"
import { normalizeActiveAnnouncement } from "../mapper/announcementMapper"
import { normalizeInspectionType } from "../mapper/inspectionMapper/inspectionTypeMapper"
import { normalizeTodayInspection } from "../mapper/inspectionMapper/inspectionMapper"
import { checkWardWarning } from "../utils/checkWardWarning"
import { useRouter } from "next/navigation"
import { startAutoRefreshToken } from "../contexts/autoRefreshToken"
import { logoutFromBackend } from "../api/auth/logout"
import { startAutoLogout, stopAutoLogout } from "../contexts/autoLogout"
import { supabase } from "../lib/supabase"
import { getDevicesFromApi } from "../api/devices/fetchDevices"
import { moveStockToRoomTransaction } from "../api/transactions/devices/moveStockToRoomTransaction"
import { moveStockToStockTransaction } from "../api/transactions/devices/moveStockToStockTransaction"
import { moveRoomToStockTransaction } from "../api/transactions/devices/moveRoomToStockTransaction"
import { moveRoomToRoomTransaction } from "../api/transactions/devices/moveRoomToRoomTransaction"
import { moveRoomToRoomNewPatientTransaction } from "../api/transactions/devices/moveRoomToRoomNewPatientTransaction"
import { getStockAreasFromApi } from "../api/stockAreas/fetchStockAreas"
import { getWardsFromApi } from "../api/wards/fetchWards"
import { getRoomsFromApi } from "../api/rooms/fetchRooms"
import { getDeviceTypesFromApi } from "../api/deviceTypes/fetchDeviceTypes"
import { getTasksFromApi } from "../api/tasks/fetchTasks"
import { getMaintenanceTypesFromApi } from "../api/maintenanceTypes/fetchMaintenanceTypes"
import { getHistoriesFromApi } from "../api/histories/fetchHistories"
import { fetchInitDashboard } from "../api/transactions/fetchInitDashboard"
import { fetchStockLastUpdated } from "../api/devices/fetchStockLastUpdated"
import { fetchWardLastUpdated } from "../api/devices/fetchWardLastUpdated"
import { deleteDeviceTransaction } from "../api/transactions/devices/deleteDeviceTransaction"
import { updateManagementNumber } from "../api/transactions/devices/updateManagementNumber"
import { updateSerialNumber } from "../api/transactions/devices/updateSerialNumber"
import { updateNote } from "../api/transactions/devices/updateNote"
import { updateRentalDates } from "../api/transactions/devices/updateRentalDates"
import { updateMaintenanceDatesTransaction } from "../api/transactions/devices/updateMaintenanceDatesTransaction"
import { startStandby } from "../api/transactions/devices/startStandby"
import { finishStandby } from "../api/transactions/devices/finishStandby"
import { startMaintenance } from "../api/transactions/devices/startMaintenance"
import { finishMaintenance } from "../api/transactions/devices/finishMaintenance"
import { updateRoomPatientName } from "../api/transactions/rooms/updateRoomPatientName"
import { updateWardTransaction } from "../api/transactions/wards/updateWardTransaction"
import { createDeviceTypeTransaction } from "../api/transactions/deviceTypes/createDeviceTypeTransaction"
import { completeMaintenanceTaskTransaction } from "../api/transactions/tasks/completeMaintenanceTaskTransaction"
import { updateMaintenanceTaskDueAtTransaction } from "../api/transactions/tasks/updateMaintenanceTaskDueAtTransaction"
import { cancelMaintenanceTaskTransaction } from "../api/transactions/tasks/cancelMaintenanceTaskTransaction"
import { CompleteMaintenanceTask, UpdateMaintenanceTaskDueAt, CancelMaintenanceTask } from "../types/taskTypes"
import { getTodayInspectionsFromApi } from "../api/inspection/inspections/fetchTodayInspections"
import { getInfectionTypesFromApi } from "../api/infectionTypes/fetchInfectionTypes"
import { getRoomInfectionsFromApi } from "../api/roomInfections/fetchRoomInfections"
import { updateWardInfoTransaction } from "../api/transactions/wards/updateWardInfoTransaction"
import { createInfectionTypeTransaction } from "../api/transactions/infectionTypes/createInfectionTypeTransaction"
import { updateInfectionTypeTransaction } from "../api/transactions/infectionTypes/updateInfectionTypeTransaction"
import { deleteInfectionTypesTransaction } from "../api/transactions/infectionTypes/deleteInfectionTypesTransaction"
import { createRoomInfectionTransaction } from "../api/transactions/roomInfections/createRoomInfectionTransaction"
import { deleteRoomInfectionsTransaction } from "../api/transactions/roomInfections/deleteRoomInfectionsTransaction"
import { useDrag } from "../drag/useDrag"
import { autoScroll, isInside } from "../drag/autoScroll"
import { getDropTarget } from "../drag/drop"
import { createLongPressState, startLongPress, finishLongPress, cancelLongPress } from "../drag/longPress"
import { subscribeDevicesRealtime } from "../realtime/devicesRealtime"
import { subscribeWardsRealtime } from "../realtime/wardsRealtime"
import { subscribeRoomsRealtime } from "../realtime/roomsRealtime"
import { subscribeStockAreasRealtime } from "../realtime/stockAreasRealtime"
import { subscribeDeviceTypesRealtime } from "../realtime/deviceTypesRealtime"
import { subscribeDeviceModelsRealtime } from "../realtime/deviceModelsRealtime"
import { subscribeMaintenanceTypesRealtime } from "../realtime/maintenanceTypesRealtime"
import { subscribeInfectionTypesRealtime } from "../realtime/infectionTypesRealtime"
import { subscribeRoomInfectionsRealtime } from "../realtime/roomInfectionsRealtime"
import { subscribeMaintenanceTasksRealtime } from "../realtime/maintenanceTasksRealtime"
import { subscribeAnnouncementsRealtime } from "../realtime/announcementsRealtime"
import { subscribeAnnouncementHospitalsRealtime } from "../realtime/announcementHospitalsRealtime"
import { subscribeHospitalSettingsRealtime } from "../realtime/hospitalSettingsRealtime"
import { subscribeInspectionsRealtime } from "../realtime/inspectionsRealtime"
import { ActiveAnnouncementFrontType } from "../types/announcementTypes"
import { fetchActiveAnnouncementsTransaction } from "../api/transactions/announcements/fetchActiveAnnouncementsTransaction"
import { HospitalSettingsType } from "../types/hospitalSettingTypes"
import { fetchHospitalSettingsTransaction } from "../api/transactions/hospitalSettings/fetchHospitalSettingsTransaction"
import { normalizeInspectionItemCategory } from "../mapper/inspectionMapper/inspectionItemCategoryMapper"
import { LoadingOverlay } from "../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../components/common/executeWithErrorAndLoading"
import { normalizeHospitalSettings } from "../mapper/hospitalSettingMapper"
import ConfirmModal from "../components/common/ConfirmModal"
import useConfirmModal from "../components/common/useConfirmModal"

export default function Page() {
  const [deviceList, setDeviceList] = useState<any[]>([])
  const [stockAreas, setStockAreas] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [deviceTypes, setDeviceTypes] = useState<any[]>([])
  const [deviceModels, setDeviceModels] = useState<any[]>([])
  const [histories, setHistories] = useState<any[]>([])
  const [infectionTypes, setInfectionTypes] = useState<any[]>([])
  const [roomInfections, setRoomInfections] = useState<any[]>([])
  const [wardInfections, setWardInfections] = useState<any[]>([])
  const [inspectionTypes, setInspectionTypes] = useState<any[]>([])
  const [inspectionItemCategories, setInspectionItemCategories] = useState<any[]>([])
  const [todayInspections, setTodayInspections] = useState<TodayInspectionFrontType[]>([])
  const [inspectionCounts, setInspectionCounts] = useState<Record<number, number>>({})
  const [managementNumber, setManagementNumber] = useState<string | undefined>(undefined)
  const [serialNumber, setSerialNumber] = useState<string | undefined>(undefined)
  const [stockLastUpdated, setStockLastUpdated] = useState<StockLastUpdatedResponse>({ updatedAt: null })
  const [wardLastUpdated, setWardLastUpdated] = useState<WardLastUpdatedResponse>({ updatedAt: null })
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [roomToRoomModalOpen, setRoomToRoomModalOpen] = useState(false)
  const [stockInfoModalOpen, setStockInfoModalOpen] = useState(false)
  const [roomDeviceInfoModalOpen, setRoomDeviceInfoModalOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [selectedRoomDevice, setSelectedRoomDevice] = useState<Device | null>(null)
  const [wardInfoModalOpen, setWardInfoModalOpen] = useState(false)
  const [selectedWard, setSelectedWard] = useState<WardType | null>(null)
  const [pendingDevice, setPendingDevice] = useState<Device | null>(null)
  const [targetWardId, setTargetWardId] = useState<number | null>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [maintenanceTypes, setMaintenanceTypes] = useState<any[]>([])
  const [split, setSplit] = useState(0.65)
  const [isResizing, setIsResizing] = useState(false)
  const resizeLongPress = useRef(createLongPressState())
  const wardRef = useRef<HTMLDivElement | null>(null)
  const stockRef = useRef<HTMLDivElement | null>(null)
  const wardScrollRef = useRef<HTMLDivElement | null>(null)
  const stockScrollRef = useRef<HTMLDivElement | null>(null)
  const [wardCellSize, setWardCellSize] = useState(80)
  const [stockCellSize, setStockCellSize] = useState(80)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null | undefined>(undefined)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [activeAnnouncements, setActiveAnnouncements] = useState<ActiveAnnouncementFrontType[]>([])
  const [hospitalSettings, setHospitalSettings] = useState<HospitalSettingsType | null>(null)
  const confirmModal = useConfirmModal()

  const {
    draggingDevice,
    setDraggingDevice,
    isDragging,
    setIsDragging,
    mousePos,
    setMousePos,
    dragOffset,
    setDragOffset,
    startDrag,
    updateMousePos,
    endDrag,
  } = useDrag()

  // ドラッグ中の処理（元の正常なコードのまま完全維持）
  const handleMouseMove = (e: React.PointerEvent) => {
    if (isResizing && !draggingDevice) {
      const newSplit = e.clientY / window.innerHeight
      if (newSplit > 0.1 && newSplit < 0.9) setSplit(newSplit)
      return
    }
    if (!draggingDevice) return
    updateMousePos(e.clientX, e.clientY)

    if (wardRef.current && isInside(e, wardRef.current)) autoScroll(wardRef.current, e.clientX, e.clientY)
    const wardContainer = wardScrollRef.current
    if (wardContainer && isInside(e, wardContainer)) autoScroll(wardContainer, e.clientX, e.clientY)
    const stockContainer = stockScrollRef.current
    if (stockContainer && isInside(e, stockContainer)) autoScroll(stockContainer, e.clientX, e.clientY)
  }

  const handlePointerUp = async (e: React.PointerEvent) => {
    finishLongPress(resizeLongPress.current, () => {}, isResizing)
    const dropTarget = getDropTarget(e.clientX, e.clientY)
    const device = draggingDevice
    endDrag()
    setIsResizing(false)
    if (!device || !dropTarget) return
    if (dropTarget.type === "stock") await handleDropToStock(device, dropTarget.stockAreaId)
    if (dropTarget.type === "ward") await handleDropToWard(device, dropTarget.wardId)
  }

  const handleDropToStock = async (device: Device, stockAreaId: number) => {
    if (!device?.id) return
    if (device.status === "room") {
      if (!device?.roomId) return
      const confirmed = await confirmModal.confirm({
        title: "倉庫移動の確認",
        message: "機器を倉庫へ移動しますか？",
        subMessage: "病室から中央倉庫へ返却移動します。",
        buttonPattern: "yes_no",
        confirmVariant: "teal",
      })
      if (!confirmed) return
      await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
          if (device.id === undefined || device.roomId === undefined) return
          await moveRoomToStockTransaction({
            deviceId: device.id,
            roomId: device.roomId,
            stockAreaId,
            setDevices: setDeviceList,
            setRooms,
            setHistories,
            setTasks,
            setRoomInfections,
            devices: deviceList
          })
          const lastUpdated = await fetchStockLastUpdated()
          setStockLastUpdated(lastUpdated)
          setWardLastUpdated(lastUpdated)
          setInspectionCounts(prev => ({ ...prev, [device.id]: 0 }))
          setTodayInspections(prev => prev.filter(inspection => inspection.deviceId !== device.id))
          setDraggingDevice(null)
        }
      })
      return
    }

    const confirmed = await confirmModal.confirm({
      title: "保管場所変更の確認",
      message: "機器の保管場所を変更しますか？",
      buttonPattern: "yes_no",
      confirmVariant: "teal",
    })
    if (!confirmed) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        if (device.id === undefined) return
        await moveStockToStockTransaction({
          deviceId: device.id,
          stockAreaId,
          setDevices: setDeviceList,
          setHistories,
          devices: deviceList
        })
        setStockLastUpdated(await fetchStockLastUpdated())
        setDraggingDevice(null)
      }
    })
  }

  const handleDropToWard = async (device: Device, wardId: number) => {
    if (!currentUser) return
    if (device.isUnderMaintenance) {
      alert("保守中機器は病棟へ配置できません")
      return
    }
    const ward = wards.find(w => w.id === wardId)
    if (!ward) return
    if (!checkWardWarning(ward, wardInfections)) return
    setPendingDevice(device)
    setTargetWardId(wardId)
    if (device.status === "stock") setRoomModalOpen(true)
    else if (device.status === "room") setRoomToRoomModalOpen(true)
  }

  const handleRoomSubmit = async (roomId: number, patientName: string) => {
    if (!pendingDevice?.id) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        if (pendingDevice.id === undefined) return
        setPendingDevice(null)
        setRoomModalOpen(false)
        await moveStockToRoomTransaction({
          deviceId: pendingDevice.id,
          roomId,
          patientName,
          setDevices: setDeviceList,
          setRooms,
          setHistories,
          setTasks,
          devices: deviceList
        })
        setStockLastUpdated(await fetchWardLastUpdated())
        setWardLastUpdated(await fetchWardLastUpdated())
        setTargetWardId(null)
      }
    })
  }

  const handleRoomCancel = () => {
    if (!currentUser) return
    setRoomModalOpen(false)
    setPendingDevice(null)
    setTargetWardId(null)
  }

  const handleRoomToRoomSubmit = async (roomId: number, patientName: string, samePatient: boolean) => {
    if (!pendingDevice?.id) return
    if (!pendingDevice?.roomId) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        if (pendingDevice.id === undefined) return
        if (pendingDevice.roomId === undefined) return
        setRoomToRoomModalOpen(false)
        setPendingDevice(null)
        if (samePatient) {
          await moveRoomToRoomTransaction({
            deviceId: pendingDevice.id,
            preRoomId: pendingDevice.roomId,
            postRoomId: roomId,
            patientName,
            setDevices: setDeviceList,
            setRooms,
            setHistories,
            setRoomInfections,
            devices: deviceList
          })
        } else {
          await moveRoomToRoomNewPatientTransaction({
            deviceId: pendingDevice.id,
            preRoomId: pendingDevice.roomId,
            postRoomId: roomId,
            patientName,
            setDevices: setDeviceList,
            setRooms,
            setHistories,
            setTasks,
            setRoomInfections,
            devices: deviceList
          })
        }
        setWardLastUpdated(await fetchWardLastUpdated())
        setInspectionCounts(prev => ({ ...prev, [pendingDevice.id]: 0 }))
        setTodayInspections(prev => prev.filter(inspection => inspection.deviceId !== pendingDevice.id))
        setTargetWardId(null)
      }
    })
  }

  const handleRoomToRoomCancel = () => {
    if (!currentUser) return
    setRoomToRoomModalOpen(false)
    setPendingDevice(null)
    setTargetWardId(null)
  }

  const openStockInfoModal = (device: Device) => {
    setSelectedDevice(device)
    setStockInfoModalOpen(true)
  }

  const handleStockInfoCancel = () => {
    if (!currentUser) return
    setStockInfoModalOpen(false)
  }

  const openRoomDeviceInfoModal = (device: Device) => {
    if (!currentUser) return
    if (device.roomId === undefined) return
    setSelectedRoomDevice(device)
    setRoomDeviceInfoModalOpen(true)
  }

  const renamePatientName = async (roomId: number, value: string): Promise<boolean> => {
    const room = rooms.find(r => r.id === roomId)
    if (!room) return false
    await updateRoomPatientName({ room: { ...room, patientName: value }, setRooms })
    setWardLastUpdated(await fetchWardLastUpdated())
    return true
  }

  const renameSerialNumber = async (id: number, value: string): Promise<boolean> => {
    const device = deviceList.find(d => d.id === id)
    if (!device) return false
    await updateSerialNumber({ device: { ...device, serialNumber: value.trim() } })
    const devices = await getDevicesFromApi()
    const normalizedDevices = devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice = normalizedDevices.find(d => d.id === id)
    if (updatedDevice) {
      if (selectedRoomDevice?.id === id) setSelectedRoomDevice(updatedDevice)
      if (selectedDevice?.id === id) setSelectedDevice(updatedDevice)
    }
    setStockLastUpdated(await fetchStockLastUpdated())
    setWardLastUpdated(await fetchWardLastUpdated())
    return true
  }

  const renameNote = async (id: number, value: string): Promise<boolean> => {
    const device = deviceList.find(d => d.id === id)
    if (!device) return false
    await updateNote({ device: { ...device, note: value.trim() } })
    const devices = await getDevicesFromApi()
    const normalizedDevices = devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice = normalizedDevices.find(d => d.id === id)
    if (updatedDevice) {
      if (selectedRoomDevice?.id === id) setSelectedRoomDevice(updatedDevice)
      if (selectedDevice?.id === id) setSelectedDevice(updatedDevice)
    }
    setStockLastUpdated(await fetchStockLastUpdated())
    setWardLastUpdated(await fetchWardLastUpdated())
    return true
  }

  const renameManagementNumber = async (id: number, value: string): Promise<boolean> => {
    const device = deviceList.find(d => d.id === id)
    if (!device) return false
    await updateManagementNumber({ device: { ...device, managementNumber: value } })
    const devices = await getDevicesFromApi()
    const normalizedDevices = devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice = normalizedDevices.find(d => d.id === id)
    if (updatedDevice) {
      if (selectedRoomDevice?.id === id) setSelectedRoomDevice(updatedDevice)
      if (selectedDevice?.id === id) setSelectedDevice(updatedDevice)
    }
    setStockLastUpdated(await fetchStockLastUpdated())
    setWardLastUpdated(await fetchWardLastUpdated())
    return true
  }

  const renameRentalDates = async (deviceId: number, rentalStartDate?: string, rentalEndDate?: string): Promise<boolean> => {
    const device = deviceList.find(d => d.id === deviceId)
    if (!device) return false
    await updateRentalDates({ device: { ...device, rentalStartDate, rentalEndDate } })
    const devices = await getDevicesFromApi()
    const normalizedDevices = devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice = normalizedDevices.find(d => d.id === deviceId)
    if (updatedDevice) {
      if (selectedRoomDevice?.id === deviceId) {
        setSelectedRoomDevice(updatedDevice)
        setWardLastUpdated(await fetchWardLastUpdated())
      }
      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(updatedDevice)
        setStockLastUpdated(await fetchStockLastUpdated())
      }
    }
    return true
  }

  const renameMaintenanceDates = async (deviceId: number, maintenanceStartedAt?: string): Promise<boolean> => {
    const device = deviceList.find(d => d.id === deviceId)
    if (!device) return false
    await updateMaintenanceDatesTransaction({ device: { ...device, maintenanceStartedAt } })
    const devices = await getDevicesFromApi()
    const normalizedDevices = devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice = normalizedDevices.find(d => d.id === deviceId)
    if (updatedDevice) {
      if (selectedRoomDevice?.id === deviceId) {
        setSelectedRoomDevice(updatedDevice)
        setWardLastUpdated(await fetchWardLastUpdated())
      }
      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(updatedDevice)
        setStockLastUpdated(await fetchStockLastUpdated())
      }
    }
    return true
  }

  const toggleDeviceStandby = async (deviceId: number, standby: boolean): Promise<boolean> => {
    if (standby) {
      await startStandby(deviceId)
      setWardLastUpdated(await fetchWardLastUpdated())
    } else {
      await finishStandby(deviceId)
      setWardLastUpdated(await fetchWardLastUpdated())
    }
    const devices = await getDevicesFromApi()
    const normalizedDevices = devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice = normalizedDevices.find(d => d.id === deviceId)
    if (updatedDevice) setSelectedRoomDevice(updatedDevice)
    return true
  }

  const toggleDeviceMaintenance = async (deviceId: number, nextMaintenance: boolean): Promise<boolean> => {
    if (nextMaintenance) await startMaintenance(deviceId)
    else await finishMaintenance(deviceId)
    const devices = await getDevicesFromApi()
    const normalizedDevices = devices.map(normalizeDevice)
    setDeviceList(normalizedDevices)
    const updatedDevice = normalizedDevices.find(d => d.id === deviceId)
    if (updatedDevice) {
      if (selectedRoomDevice?.id === deviceId) setSelectedRoomDevice(updatedDevice)
      if (selectedDevice?.id === deviceId) setSelectedDevice(updatedDevice)
    }
    setStockLastUpdated(await fetchStockLastUpdated())
    return true
  }

  const handleRoomDeviceInfoCancel = () => {
    if (!currentUser) return
    setRoomDeviceInfoModalOpen(false)
  }

  const deleteDevice = async (deviceId: number) => {
    const now = new Date().toISOString()
    const preDevice = deviceList.find(d => d.id === deviceId)
    await deleteDeviceTransaction({
      deviceId,
      setDeviceList,
      setTasks,
      setHistories,
      setRooms,
      setRoomInfections
    })
    if (preDevice.status === "stock") setStockLastUpdated({ updatedAt: now })
    else setWardLastUpdated({ updatedAt: now })
  }

  const handleCompleteTask = async (task: CompleteMaintenanceTask) => {
    await completeMaintenanceTaskTransaction({ task, setTasks })
    setWardLastUpdated(await fetchWardLastUpdated())
    return true
  }

  const getDeviceTasks = (deviceId?: number) => {
    if (!deviceId) return []
    return tasks.filter(t => Number(t.deviceId) === Number(deviceId))
  }

  const renameMaintenanceTaskDueAt = async (task: UpdateMaintenanceTaskDueAt): Promise<boolean> => {
    await updateMaintenanceTaskDueAtTransaction({ task, setTasks })
    setWardLastUpdated(await fetchWardLastUpdated())
    return true
  }

  const cancelTask = async (task: CancelMaintenanceTask): Promise<boolean> => {
    await cancelMaintenanceTaskTransaction({ task, setTasks })
    setWardLastUpdated(await fetchWardLastUpdated())
    return true
  }

  const getMAlert = (deviceId?: number): "red" | "yellow" | "green" | null => {
    if (!deviceId) return null
    const activeTasks = tasks.filter(t => Number(t.deviceId) === Number(deviceId) && t.isActive && !t.completedAt)
    if (activeTasks.length === 0) return null
    const nearestTask = activeTasks.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0]
    const now = new Date()
    const diff = new Date(nearestTask.dueAt).getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return "red"
    if (days <= 2) return "yellow"
    return "green"
  }

  const handleSubmitWardInfo = async (ward: UpdateWardInfoType, infectionTypeIds: number[]) => {
    await updateWardInfoTransaction({ ward, infectionTypeIds, setWards, setWardInfections })
    setWardInfoModalOpen(false)
    setSelectedWard(null)
  }

  const openWardInfoModal = (ward: WardType) => {
    setSelectedWard(ward)
    setWardInfoModalOpen(true)
  }

  const closeWardInfoModal = () => {
    setWardInfoModalOpen(false)
    setSelectedWard(null)
  }

  const fetchHistories = async () => {
    const histories = await getHistoriesFromApi()
    setHistories(histories.map(normalizeHistory))
  }

  const getWardDeviceList = () => deviceList.filter(d => d.status === "room")

  const getLatestMaintenanceTask = (deviceId?: number) => {
    if (!deviceId) return null
    const deviceTasks = getDeviceTasks(deviceId)
    if (deviceTasks.length === 0) return null
    const sorted = [...deviceTasks].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    const latest = sorted[0]
    const maintenanceType = maintenanceTypes.find(mt => Number(mt.id) === Number(latest.maintenanceTypeId))
    return { name: maintenanceType?.name ?? "", due_at: latest.dueAt }
  }

  // ⭕ 機種ごとの残数をカウント（useMemoで配列参照を安定化し、ドラッグ時のLowStockPanelの不要な呼び出しを防止）
  const lowStockDevices = useMemo(() => {
    return deviceList.map(device => {
      const typeName = deviceTypes.find(t => Number(t.id) === Number(device.type))?.name ?? "不明"
      const modelName = deviceModels.find(m => Number(m.id) === Number(device.model))?.name ?? "不明"
      return {
        id: device.id,
        typeName,
        modelName,
        isUnderMaintenance: device.isUnderMaintenance,
        currentWardId: device.roomId ?? null,
      }
    })
  }, [deviceList, deviceTypes, deviceModels])

  const handleLogout = async (showConfirm = true) => {
    if (showConfirm) {
      const confirmed = await confirmModal.confirm({
        title: "ログアウトの確認",
        message: "ログアウトしますか？",
        subMessage: "ログアウトすると再ログインが必要になります。",
        buttonPattern: "yes_no",
        confirmVariant: "danger",
        icon: "warning",
      })
      if (!confirmed) return
    }
    await logoutFromBackend()
    await supabase.auth.signOut()
    clearDashboardCache() 
    setCurrentUser(null)
    router.push("/login")
  }

  const refreshTodayInspectionsOnly = async () => {
    try {
      const data = await getTodayInspectionsFromApi()
      const todayIns = data.map(normalizeTodayInspection)
      const counts: Record<number, number> = {}
      todayIns.forEach(i => { counts[i.deviceId] = (counts[i.deviceId] ?? 0) + 1 })
      setTodayInspections(todayIns)
      setInspectionCounts(counts)
      const cache = getDashboardCache()
      if (cache) {
        cache.today_inspections = data
        setDashboardCache(cache)
      }
    } catch (error) {
      console.error("本日の点検情報更新エラー:", error)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const user = await initDashboard({ setCurrentUser, setAccessToken })
        if (user?.access_token) startAutoRefreshToken(user.access_token, setAccessToken)
      } catch (error) {
        console.error(error)
      }
    }
    init()
  }, [])
//currentUser又はaccessToken変化したとき走る。
  useEffect(() => {
    if (!currentUser) return
    if (!accessToken) return
    supabase.realtime.setAuth(accessToken)
    
    const unsubscribeDevices = subscribeDevicesRealtime({ setDeviceList, setStockLastUpdated, setWardLastUpdated })
    const unsubscribeWards = subscribeWardsRealtime({ setWards })
    const unsubscribeRooms = subscribeRoomsRealtime({ setRooms })
    const unsubscribeStockAreas = subscribeStockAreasRealtime({ setStockAreas })
    const unsubscribeDeviceTypes = subscribeDeviceTypesRealtime({ setDeviceTypes })
    const unsubscribeDeviceModels = subscribeDeviceModelsRealtime({ setDeviceModels })
    const unsubscribeMaintenanceTypes = subscribeMaintenanceTypesRealtime({ setMaintenanceTypes })
    const unsubscribeInfectionTypes = subscribeInfectionTypesRealtime({ setInfectionTypes })
    const unsubscribeRoomInfections = subscribeRoomInfectionsRealtime({ setRoomInfections })
    const unsubscribeMaintenanceTasks = subscribeMaintenanceTasksRealtime({ setTasks })
    const unsubscribeAnnouncements = subscribeAnnouncementsRealtime({ hospitalId: currentUser.hospitalId, setAnnouncements: setActiveAnnouncements })
    const unsubscribeAnnouncementHospitals = subscribeAnnouncementHospitalsRealtime({ hospitalId: currentUser.hospitalId, setAnnouncements: setActiveAnnouncements })
    const unsubscribeHospitalSettingRealtime = subscribeHospitalSettingsRealtime()
    const unsubscribeInspections = subscribeInspectionsRealtime({ setInspectionCounts, setTodayInspections })

    return () => {
      unsubscribeDevices()
      unsubscribeWards()
      unsubscribeRooms()
      unsubscribeStockAreas()
      unsubscribeDeviceTypes()
      unsubscribeDeviceModels()
      unsubscribeMaintenanceTypes()
      unsubscribeInfectionTypes()
      unsubscribeRoomInfections()
      unsubscribeMaintenanceTasks()
      unsubscribeAnnouncements()
      unsubscribeAnnouncementHospitals()
      unsubscribeHospitalSettingRealtime()
      unsubscribeInspections()
    }
  }, [currentUser, accessToken])

  useEffect(() => {
    if (!accessToken) return
    supabase.realtime.setAuth(accessToken)
  }, [accessToken])

  const applyDashboardData = (data: any) => {
    setDeviceList(data.devices.map(normalizeDevice))
    setStockAreas(data.stock_areas.map(normalizeStockArea))
    setWards(data.wards.map(normalizeWard))
    setRooms(data.rooms.map(normalizeRoom))
    setDeviceTypes(data.device_types.map(normalizeDeviceType))
    setDeviceModels(data.device_models.map(normalizeDeviceModel))
    setTasks(data.tasks.map(normalizeMaintenanceTask))
    setMaintenanceTypes(data.maintenance_types.map(normalizeMaintenanceType))
    setHistories(data.histories.map(normalizeHistory))
    setInfectionTypes(data.infection_types.map(normalizeInfectionType))
    setRoomInfections(data.room_infections.map(normalizeRoomInfection))
    setWardInfections(data.ward_infections.map(normalizeWardInfection))
    setActiveAnnouncements(data.active_announcements.map(normalizeActiveAnnouncement))
    setInspectionTypes(data.inspection_types.map(normalizeInspectionType))
    setInspectionItemCategories(data.inspection_item_categories.map(normalizeInspectionItemCategory))
    setHospitalSettings(normalizeHospitalSettings(data.hospital_settings))
    const todayIns: TodayInspectionFrontType[] = data.today_inspections.map(normalizeTodayInspection)
    const counts: Record<number, number> = {}
    todayIns.forEach(i => { counts[i.deviceId] = (counts[i.deviceId] ?? 0) + 1 })
    setTodayInspections(todayIns)
    setInspectionCounts(counts)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return
      if (hasDashboardCache()) {
        const cachedData = getDashboardCache()
        applyDashboardData(cachedData)
        if (getNeedsRefreshTodayInspections()) {
          flagNeedsRefreshTodayInspections(false)
          await refreshTodayInspectionsOnly()
        }
        return
      }

      await executeWithErrorAndLoading({
        setLoading,
        action: async () => {
          clearDashboardCache()
          const data = await fetchInitDashboard()
          if (!data) return
          setDashboardCache(data)
          applyDashboardData(data)
          const stockLastUpdated = await fetchStockLastUpdated()
          const wardLastUpdated = await fetchWardLastUpdated()
          setStockLastUpdated(stockLastUpdated)
          setWardLastUpdated(wardLastUpdated)
        },
      })
    }
    fetchData()
  }, [currentUser])

  useEffect(() => {
    if (currentUser === undefined) return
    if (!currentUser) {
      clearDashboardCache()
      router.replace("/login")
    }
  }, [currentUser, router])

  useEffect(() => {
    if (!hospitalSettings) return
    if (!hospitalSettings.autoLogoutEnabled) {
      stopAutoLogout()
      return
    }
    startAutoLogout(hospitalSettings.autoLogoutTime, () => handleLogout(false))
    return () => { stopAutoLogout() }
  }, [hospitalSettings])

  useEffect(() => {
    if (!currentUser) return
    const getTodayKey = () => new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })
    let currentDate = getTodayKey()
    const timer = window.setInterval(() => {
      const today = getTodayKey()
      if (today === currentDate) return
      currentDate = today
      setInspectionCounts({})
      setTodayInspections([])
    }, 60 * 1000)
    return () => { window.clearInterval(timer) }
  }, [currentUser])

  if (currentUser === undefined || !currentUser) return null

  return (
    <>
      <div
        className={`${styles.layout} ${draggingDevice ? styles.dragging : ""}`}
        style={{ gridTemplateRows: `${split}fr 6px ${1 - split}fr` }}
        onPointerMove={e => handleMouseMove(e)}
        onPointerUp={e => handlePointerUp(e)}
      >
        {/* 病棟エリア */}
        <div className={styles.ward} ref={wardRef}>
          <WardArea
            deviceList={deviceList}
            lowStockDevices={lowStockDevices}
            deviceTypes={deviceTypes}
            deviceModels={deviceModels}
            deleteDevice={deleteDevice}
            wards={wards}
            startDrag={startDrag}
            draggingDevice={draggingDevice}
            pendingDevice={pendingDevice}
            onDrop={handleDropToWard} 
            rooms={rooms}
            openRoomDeviceInfoModal={openRoomDeviceInfoModal}
            openWardInfoModal={openWardInfoModal}
            getMAlert={getMAlert}
            wardCellSize={wardCellSize}
            setWardCellSize={setWardCellSize}
            inspectionCounts={inspectionCounts}
            todayInspections={todayInspections}
            currentUser={currentUser}
            scrollRef={wardScrollRef}
            isDragging={isDragging}
            wardLastUpdated={wardLastUpdated}
            infectionTypes={infectionTypes}
            roomInfections={roomInfections}
            wardInfections={wardInfections}
            activeAnnouncements={activeAnnouncements}
            hospitalSettings={hospitalSettings}
          />
        </div>

        {/* 境界バー */}
        <div
          className="no-touch-menu"
          style={{
            height: "6px",
            background: isResizing ? "#2563eb" : "#ccc",
            cursor: "row-resize",
            touchAction: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none",
          }}
          onPointerDown={() => {
            startLongPress(resizeLongPress.current, () => setIsResizing(true))
          }}
          onPointerLeave={() => {
            cancelLongPress(resizeLongPress.current)
          }}      
        > 
          <div
            className="no-touch-menu"
            style={{
              width: "48px",
              height: "20px",
              borderRadius: "10px",
              background: isResizing ? "#2563eb" : "#888",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            ≡
          </div>
        </div>

        {/* 在庫エリア */}
        <div className={styles.stock} ref={stockRef}>
          <StockAreas
            deviceList={deviceList}
            stockAreas={stockAreas}
            deviceTypes={deviceTypes}
            deviceModels={deviceModels}
            deleteDevice={deleteDevice}
            managementNumber={managementNumber}
            serialNumber={serialNumber}
            startDrag={startDrag}
            handleMouseMove={handleMouseMove}
            draggingDevice={draggingDevice}
            pendingDevice={pendingDevice}
            onDrop={handleDropToStock}
            openStockInfoModal={openStockInfoModal}
            getMAlert={getMAlert}
            stockCellSize={stockCellSize}
            setStockCellSize={setStockCellSize}
            currentUser={currentUser}
            scrollRef={stockScrollRef}
            isDragging={isDragging}
            stockLastUpdated={stockLastUpdated}
            inspectionCounts={inspectionCounts}   
            todayInspections={todayInspections}  
          />
        </div>      

        {/* ボタンパネル */}
        <div className={styles.button}>
          <ButtonPanel 
            currentUser={currentUser}
            deviceList={deviceList}
            setDeviceList={setDeviceList}
            deviceTypes={deviceTypes}
            setDeviceTypes={setDeviceTypes}
            deviceModels={deviceModels}
            setDeviceModels={setDeviceModels}
            stockAreas={stockAreas}
            setStockAreas={setStockAreas}
            wards={wards}
            setWards={setWards}
            rooms={rooms}
            setRooms={setRooms}
            maintenanceTypes={maintenanceTypes}
            setMaintenanceTypes={setMaintenanceTypes}
            histories={histories}
            fetchHistories={fetchHistories}
            getWardDeviceList={getWardDeviceList}
            getLatestMaintenanceTask={getLatestMaintenanceTask}
            handleLogout={handleLogout} 
            hospitalId={currentUser.hospitalId}
            userName={currentUser.displayName}
            role={currentUser.role}
            userId={currentUser.id}
            email={currentUser.email}
            hospitalName={currentUser.hospitalName}
            infectionTypes={infectionTypes}
            setInfectionTypes={setInfectionTypes}
            setStockLastUpdated={setStockLastUpdated}
            setWardLastUpdated={setWardLastUpdated}
            hospitalSettings={hospitalSettings}
            setHospitalSettings={setHospitalSettings}
            inspectionTypes={inspectionTypes}
            setInspectionTypes={setInspectionTypes}   
            inspectionItemCategories={inspectionItemCategories}
            setInspectionItemCategories={setInspectionItemCategories}    
          />
        </div>

        {/* drag layer（元の吸い付く計算のまま完全維持） */}
        <div className={styles.dragLayer}>
          <DragLayer
            deviceTypes={deviceTypes}
            deviceModels={deviceModels}
            draggingDevice={draggingDevice}
            mousePos={mousePos}
            getMAlert={getMAlert}
          />
        </div>

        {/* ⭕ 開いている時だけ描画（ドラッグ中に閉じたモーダルが実行されるのを完全遮断） */}
        {roomModalOpen && (
          <RoomModal
            isOpen={roomModalOpen}
            onClose={handleRoomCancel}
            onSubmit={handleRoomSubmit}
            wardId={targetWardId}
            wards={wards}
            rooms={rooms}
            pendingDevice={pendingDevice}
          />
        )}

        {roomToRoomModalOpen && (
          <RoomToRoomModal
            deviceList={deviceList}
            isOpen={roomToRoomModalOpen}
            onClose={handleRoomToRoomCancel}
            onSubmit={handleRoomToRoomSubmit}
            wards={wards}
            rooms={rooms}
            deviceTypes={deviceTypes}
            deviceModels={deviceModels}
            pendingDevice={pendingDevice}
            initialWardId={targetWardId}
          />
        )}

        {stockInfoModalOpen && selectedDevice && (
          <StockInfoModal
            isOpen={stockInfoModalOpen}
            selectedDevice={selectedDevice}
            deviceTypes={deviceTypes}
            deviceModels={deviceModels}
            stockAreas={stockAreas}
            onCancel={handleStockInfoCancel}
            renameManagementNumber={renameManagementNumber}
            renameSerialNumber={renameSerialNumber}
            renameNote={renameNote}
            renameRentalDates={renameRentalDates}
            renameMaintenanceDates={renameMaintenanceDates}
            toggleDeviceMaintenance={toggleDeviceMaintenance}
            tasks={getDeviceTasks(selectedDevice.id)}
            maintenanceTypes={maintenanceTypes}
            onCompleteTask={handleCompleteTask}
            renameMaintenanceTaskDueAt={renameMaintenanceTaskDueAt}
            cancelTask={cancelTask}
            onDelete={deleteDevice}
            todayInspections={todayInspections}
          />
        )}

        {roomDeviceInfoModalOpen && selectedRoomDevice && (
          <RoomDeviceInfoModal
            isOpen={roomDeviceInfoModalOpen}
            selectedRoomDevice={selectedRoomDevice}
            deviceTypes={deviceTypes}
            deviceModels={deviceModels}
            onCancel={handleRoomDeviceInfoCancel}
            rooms={rooms}
            wards={wards}
            tasks={getDeviceTasks(selectedRoomDevice.id)}
            maintenanceTypes={maintenanceTypes}
            onCompleteTask={handleCompleteTask}
            renamePatientName={renamePatientName}
            renameManagementNumber={renameManagementNumber}
            renameSerialNumber={renameSerialNumber}
            renameNote={renameNote}
            toggleDeviceStandby={toggleDeviceStandby}
            renameRentalDates={renameRentalDates}
            renameMaintenanceTaskDueAt={renameMaintenanceTaskDueAt}
            cancelTask={cancelTask}
            infectionTypes={infectionTypes}
            roomInfections={roomInfections}
            setRoomInfections={setRoomInfections}
            onDelete={deleteDevice}
            hospitalSettings={hospitalSettings}
            todayInspections={todayInspections}
          />
        )}

        {wardInfoModalOpen && (
          <WardInfoModal
            isOpen={wardInfoModalOpen}
            ward={selectedWard}
            onClose={closeWardInfoModal}
            infectionTypes={infectionTypes}
            wardInfections={wardInfections}
            setWardInfections={setWardInfections}
            onSubmit={handleSubmitWardInfo}
            setWards={setWards}
          />
        )}

        <ConfirmModal
          open={confirmModal.isOpen}
          onClose={confirmModal.closeConfirmModal}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          subMessage={confirmModal.subMessage}
          icon={confirmModal.icon}
          buttonPattern={confirmModal.buttonPattern}
          confirmVariant={confirmModal.confirmVariant}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
        />
      </div>
      <LoadingOverlay loading={loading} />
    </>
  )
}