import {
  Ward,
  WardDB
} from "../types/wardTypes"
//DB情報をUI用に変換
export const normalizeWard = (
  w: WardDB
): Ward => ({
  wardId:w.id,
  hospitalId:w.hospital_id,
  wardName:w.name ?? ""
})