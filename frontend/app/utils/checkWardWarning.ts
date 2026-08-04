import { WardType } from "../types/wardTypes"
import { WardInfectionType } from "../types/wardInfectionTypes"

export function checkWardWarning(
                                ward: WardType,
                                wardInfections: WardInfectionType[]
                                ): boolean {
const hasInfection =wardInfections.some(
                                        w => w.wardId === ward.id
                                        )
const isClosed =
  ["閉鎖中", "制限中", "消毒中"].includes(ward.status?? "")
  if (!hasInfection && !isClosed) {
    return true
  }

  return confirm(
    "対象の病棟は感染症または閉鎖中です。\n\n機器を配置しますか？"
  )
}