import {
  Room,
  RoomDB
} from "../types/wards"
export const normalizeRoom = (
    r: RoomDB): Room => ({
                        id: r.id,
                        wardId:r.ward_id,
                        roomName:r.name,
                        patientName:r.patient_name ?? ""
                        })