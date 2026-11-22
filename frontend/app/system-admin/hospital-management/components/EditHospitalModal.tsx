
"use client"

import { useEffect, useState } from "react"

import { HospitalManagementType } from "../../../types/hospitalTypes"
import { updateHospitalTransaction } from "../../../api/transactions/hospitals/updateHospitalTransaction"
import CommonModal from "../../../components/common/CommonModal"
import { LoadingOverlay } from "../../../components/common/LoadingOverlay"

type Props = {
  isOpen: boolean
  onClose: () => void
  hospital: HospitalManagementType | null
  setHospitals: React.Dispatch<React.SetStateAction<HospitalManagementType[]>>
}

export default function EditHospitalModal({
  isOpen,
  onClose,
  hospital,
  setHospitals,
}: Props) {
  const [hospitalName, setHospitalName] = useState("")
  const [pricePlan, setPricePlan] = useState("standard")
  const [isActive, setIsActive] = useState(true)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const initialize = () => {
    if (!hospital) return

    setHospitalName(hospital.hospitalName)
    setPricePlan(hospital.pricePlan ?? "standard")
    setIsActive(hospital.isActive)
    setNote(hospital.note ?? "")
  }

  const closeModal = () => {
    initialize()
    onClose()
  }

  useEffect(() => {
    if (!hospital) return

    setHospitalName(hospital.hospitalName)
    setPricePlan(hospital.pricePlan ?? "standard")
    setIsActive(hospital.isActive)
    setNote(hospital.note ?? "")
  }, [hospital])

  if (!isOpen || !hospital) return null

  const handleSubmit = async () => {
    if (hospitalName.trim() === "") {
      alert("病院名を入力してください")
      return
    }

    setLoading(true)

    try {
      await updateHospitalTransaction({
        hospital: {
          id: hospital.id,
          hospitalName,
          pricePlan,
          isActive,
          note,
        },
        setHospitals,
        onClose,
      })
    } finally {
      setLoading(false)
    }
  }

  const labelClass = "block text-xs font-bold text-slate-700"

  const inputClass = `
    h-11 w-full rounded-lg border border-slate-300 bg-white px-3
    text-sm font-medium text-slate-900 outline-none transition-colors
    focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15
  `

  const readOnlyClass = `
    h-11 w-full rounded-lg border border-slate-200 bg-slate-100 px-3
    text-sm text-slate-600 outline-none
  `

  const formatDate = (value?: string) => {
    return value
      ? new Date(value).toLocaleString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : ""
  }

  return (
    <>
      <CommonModal
        open={isOpen}
        onClose={onClose}
        title="病院情報"
        maxWidth="max-w-[450px]"
      >
        <div className="bg-slate-50 p-4 sm:p-5">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="space-y-1.5">
              <label className={labelClass}>
                病院名
              </label>

              <input
                value={hospitalName}
                onChange={e => setHospitalName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                料金プラン
              </label>

              <select
                value={pricePlan}
                onChange={e => setPricePlan(e.target.value)}
                className={inputClass}
              >
                <option value="free">Free</option>
                <option value="standard">Standard</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className={labelClass}>
                利用状態
              </div>

              <div className="flex gap-6">
                <label className="flex cursor-pointer items-center text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={isActive}
                    onChange={() => setIsActive(true)}
                    className="h-4 w-4 accent-teal-700"
                  />
                  <span className="ml-1.5">利用中</span>
                </label>

                <label className="flex cursor-pointer items-center text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={!isActive}
                    onChange={() => setIsActive(false)}
                    className="h-4 w-4 accent-teal-700"
                  />
                  <span className="ml-1.5">停止</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                備考
              </label>

              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={5}
                className="
                  w-full resize-none rounded-lg border border-slate-300 bg-white
                  px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors
                  focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15
                "
              />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="mb-3 text-xs font-bold tracking-wide text-slate-500">
                登録情報
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    病院ID
                  </label>

                  <input
                    value={hospital.id}
                    readOnly
                    className={readOnlyClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    登録日
                  </label>

                  <input
                    value={formatDate(hospital.createdAt)}
                    readOnly
                    className={readOnlyClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    更新日
                  </label>

                  <input
                    value={formatDate(hospital.updatedAt)}
                    readOnly
                    className={readOnlyClass}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:flex sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="
                  h-11 rounded-lg border border-slate-200 bg-slate-50 px-4
                  text-xs font-bold text-slate-700 transition-colors
                  hover:bg-slate-100 active:bg-slate-200 sm:h-10
                "
              >
                キャンセル
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="
                  h-11 rounded-lg bg-teal-700 px-4
                  text-xs font-bold text-white transition-all
                  hover:bg-teal-800 active:bg-teal-900
                  disabled:cursor-not-allowed disabled:bg-slate-300 sm:h-10
                "
              >
                {loading ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      </CommonModal>

      <LoadingOverlay loading={loading} />
    </>
  )
}
