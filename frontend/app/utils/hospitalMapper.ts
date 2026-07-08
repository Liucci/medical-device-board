import {
  Hospital,
  HospitalDB,
  AddHospitalRequest,
  UpdateHospitalRequest,
} from "../types/hospitalTypes"

// DB → UI
export const normalizeHospital = (
  hospital: HospitalDB
): Hospital => ({
  hospitalName: hospital.hospital_name,
  createdAt: hospital.created_at,
  isActive: hospital.is_active,
  updatedAt: hospital.updated_at,
  pricePlan: hospital.price_plan,
  note: hospital.note,
  userCount: hospital.user_count,
  deviceCount: hospital.device_count,
})

// Create
export const toAddHospitalRequest = (
  hospital: Hospital
): AddHospitalRequest => ({
  hospital_name: hospital.hospitalName,
  price_plan: hospital.pricePlan ?? "free",
  note: hospital.note ?? null,
})

// Update
export const toUpdateHospitalRequest = (
  hospital: Hospital
): UpdateHospitalRequest => ({
  hospital_id: hospital.id!,
  hospital_name: hospital.hospitalName,
  price_plan: hospital.pricePlan ?? "free",
  is_active: hospital.isActive,
  note: hospital.note ?? null,
})