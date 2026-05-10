import {
  Room,
  RoomDB
} from "../types/roomTypes"

//DB情報をUI用に変換
export const normalizeRoom = (
    r: RoomDB): Room => ({
                        roomId: r.id,
                        hospitalId:r.hospital_id,
                        wardId:r.ward_id,
                        roomName:r.name,
                        patientName:r.patient_name ?? ""
                        })