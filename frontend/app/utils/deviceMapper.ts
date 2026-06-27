import {
         DeviceDB,
         Device,
         CreateDeviceType,
         AddDeviceRequest,
         DeleteDeviceRequest,
         UpdateManagementNumberRequest,
         UpdateSerialNumberRequest,
         UpdateNoteRequest,
         UpdateDeviceRentalDatesRequest,
         UpdateMaintenanceDatesRequest,
         MoveDeviceRequest,
         StartMaintenanceRequest,
         FinishMaintenanceRequest,
         StartStandbyRequest,
         FinishStandbyRequest,

       } from "../types/deviceTypes"


// DBのDeviceと、フロントエンドで扱うDeviceの相互変換関数
export const normalizeDevice = (d: DeviceDB): Device => ({
  id: d.id,
  hospitalId:d.hospital_id,
  type: d.type,
  model: d.model,
  assetType: d.asset_type as Device["assetType"], // ←ここだけ改善余地
  status: d.status,
  stockAreaId: d.stock_area_id ?? undefined,
  roomId: d.room_id ?? undefined,
  managementNumber: d.management_number ?? undefined,
  serialNumber: d.serial_number ?? undefined,
  note: d.note ?? undefined,
  createAt: d.created_at?? undefined,
  updateAt: d.updated_at?? undefined,
  rentalStartDate: d.rental_start_date ?? undefined,
  rentalEndDate: d.rental_end_date ?? undefined,
  isUnderMaintenance: d.is_under_maintenance ?? false,
  maintenanceStartedAt:d.maintenance_started_at ?? undefined,
  maintenanceFinishedAt:d.maintenance_finished_at ?? undefined,
  standby: d.standby ?? false,
  standbyStartedAt: d.standby_started_at ?? undefined,
  standbyFinishedAt: d.standby_finished_at ?? undefined,
  createdBy:d.created_by?? undefined,
  updatedBy:d.updated_by?? undefined,

  // UI専用
  row: 0,
  col: 0,
})
// フロントエンドのDeviceをDB用のDeviceDBに変換する関数
export const toDBDevice = (d: Device) => ({
  //id: d.id,
  hospital_id:d.hospitalId,
  type: d.type,
  model: d.model,
  asset_type: d.assetType,
  status: d.status,
  stock_area_id: d.stockAreaId ?? null,
  room_id: d.roomId ?? null,
  management_number: d.managementNumber ?? null,
  serial_number: d.serialNumber ?? null,
  note: d.note ?? null,
  created_at: d.createAt?? null,
  updated_at: d.updateAt?? null,
  rental_start_date: d.rentalStartDate ?? null,
  rental_end_date: d.rentalEndDate ?? null,
  is_under_maintenance:d.isUnderMaintenance ?? false,
  maintenance_started_at:d.maintenanceStartedAt ?? null,
  maintenance_finished_at:d.maintenanceFinishedAt ?? null,
  standby: d.standby ?? false,
  standby_started_at: d.standbyStartedAt ?? null,
  standby_finished_at: d.standbyFinishedAt ?? null,
  created_by:d.createdBy??null,
  updated_by:d.updatedBy??null
})


//他ファイルも随時下記のMapperを参照する構造に修正していく
export const toCreateDeviceRequest = (
                                        device: CreateDeviceType
                                      ): AddDeviceRequest => ({
                                                                type: device.type,
                                                                model: device.model,
                                                                asset_type: device.assetType,
                                                                stock_area_id: device.stockAreaId!,
                                                                rental_start_date: device.rentalStartDate,
                                                                rental_end_date: device.rentalEndDate,
                                                                quantity: device.quantity ?? 1
                                                              })

export const toDeleteDeviceRequest = (
                                        deviceId: number
                                      ): DeleteDeviceRequest => ({
                                                                    id: deviceId
                                                                  })

export const toUpdateManagementNumberRequest = (
                                                  device: Device
                                                ): UpdateManagementNumberRequest => ({
                                                                                       id: device.id!,
                                                                                       management_number: device.managementNumber ?? ""
                                                                                     })

export const toUpdateSerialNumberRequest = (
                                              device: Device
                                            ): UpdateSerialNumberRequest => ({
                                                                               id: device.id!,
                                                                               serial_number: device.serialNumber ?? ""
                                                                             })

export const toUpdateNoteRequest = (
                                      device: Device
                                    ): UpdateNoteRequest => ({
                                                               id: device.id!,
                                                               note: device.note ?? ""
                                                             })

export const toUpdateDeviceRentalDatesRequest = (
                                                   device: Device
                                                 ): UpdateDeviceRentalDatesRequest => ({
                                                                                         id: device.id!,
                                                                                         rental_start_date: device.rentalStartDate || null,
                                                                                         rental_end_date: device.rentalEndDate || null
                                                                                       })                                                            




export const toMoveDeviceRequest = (
                                      device: Device
                                    ): MoveDeviceRequest => ({
                                                               id: device.id!,
                                                               stock_area_id: device.stockAreaId ?? null,
                                                               room_id: device.roomId ?? null
                                                             })

export const toStartMaintenanceRequest = (
                                            deviceId: number
                                          ): StartMaintenanceRequest => ({
                                                                          id: deviceId
                                                                        })

export const toFinishMaintenanceRequest = (
                                             deviceId: number
                                           ): FinishMaintenanceRequest => ({
                                                                            id: deviceId
                                                                          })


export const toUpdateMaintenanceDatesRequest = (
                                                  device: Device
                                                ): UpdateMaintenanceDatesRequest => ({
                                                                                       id: device.id!,
                                                                                       maintenance_started_at:device.maintenanceStartedAt || null,
                                                                                       //maintenance_finished_at:device.maintenanceFinishedAt || null
                                                                                     })



export const toStartStandbyRequest = (
                                        deviceId: number
                                      ): StartStandbyRequest => ({
                                                                    id: deviceId
                                                                  })

export const toFinishStandbyRequest = (
                                         deviceId: number
                                       ): FinishStandbyRequest => ({
                                                                      id: deviceId
                                                                    })