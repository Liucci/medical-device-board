
"use client"

import { useState } from "react"
import { HospitalManagementType } from "../../../types/hospitalTypes"
import { createHospitalTransaction } from "../../../api/transactions/hospitals/createHospitalTransaction"
import CommonModal from "../../../components/common/CommonModal"
import { LoadingOverlay } from "../../../components/common/LoadingOverlay"

type Props = {
  isOpen: boolean
  onClose: () => void
  setHospitals: React.Dispatch<React.SetStateAction<HospitalManagementType[]>>
}

export default function CreateHospitalModal({
  isOpen,
  onClose,
  setHospitals,
}: Props) {
  const [hospitalName, setHospitalName] = useState("")
  const [pricePlan, setPricePlan] = useState("Basic")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const initialHospital = {
    hospitalName: "",
    pricePlan: "standard",
    note: "",
  }

  const closeModal = () => {
    setHospitalName(initialHospital.hospitalName)
    setPricePlan(initialHospital.pricePlan)
    setNote(initialHospital.note)
    onClose()
  }

  const handleSubmit = async () => {
    if (hospitalName.trim() === "") {
      alert("病院名を入力してください")
      return
    }

    setLoading(true)

    try {
      await createHospitalTransaction({
        hospital: {
          hospitalName,
          pricePlan,
          note,
        },
        setHospitals,
        onClose: closeModal,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const labelClass = "block text-xs font-bold text-slate-700"

  const inputClass = `
    h-11 w-full rounded-lg border border-slate-300 bg-white px-3
    text-sm font-medium text-slate-900 outline-none transition-colors
    focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15
  `

  return (
    <>
      <CommonModal
        open={isOpen}
        onClose={onClose}
        title="病院新規登録"
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
                {loading ? "登録中..." : "登録"}
              </button>
            </div>
          </div>
        </div>
      </CommonModal>

      <LoadingOverlay loading={loading} />
    </>
  )
}
