import { HospitalManagementType,
         HospitalManagementDBType,
          CreateHospitalFrontType, 
          CreateHospitalBackType,
          UpdateHospitalFrontType,
          UpdateHospitalBackType
          
          } from "../types/hospitalTypes"

// DB → UI
export const normalizeHospitalManagement = (
                                              hospital: HospitalManagementDBType
                                            ): HospitalManagementType => ({
                                                                            id: hospital.id,
                                                                            hospitalName: hospital.hospital_name,
                                                                            createdAt: hospital.created_at,
                                                                            isActive: hospital.is_active,
                                                                            updatedAt: hospital.updated_at,
                                                                            pricePlan: hospital.price_plan,
                                                                            note: hospital.note,
                                                                            userCount: hospital.user_count,
                                                                            deviceCount: hospital.device_count
                                                                          })
// Create
export const toAddHospitalRequest = (
                                       hospital: CreateHospitalFrontType
                                     ): CreateHospitalBackType => ({
                                                                 hospital_name: hospital.hospitalName,
                                                                 price_plan: hospital.pricePlan,
                                                                 note: hospital.note ?? null
                                                               })

// Update
export const toUpdateHospitalRequest = (
                                          hospital: UpdateHospitalFrontType
                                        ): UpdateHospitalBackType => ({
                                                                        hospital_id: hospital.id,
                                                                        hospital_name: hospital.hospitalName,
                                                                        price_plan: hospital.pricePlan,
                                                                        is_active: hospital.isActive,
                                                                        note: hospital.note ?? null
                                                                      })