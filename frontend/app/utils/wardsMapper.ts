import {
  Ward,
  WardDB
} from "../types/wards"

export const normalizeWard = (
  w: WardDB
): Ward => ({

  wardId:
    w.id,

  wardName:
    w.name ?? ""
})