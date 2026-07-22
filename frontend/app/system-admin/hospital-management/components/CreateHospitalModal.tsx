"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { HospitalManagementType } from "../../../types/hospitalTypes"
import { createHospitalTransaction }from "../../../api/transactions/hospitals/createHospitalTransaction"

type Props = {
              isOpen: boolean
              onClose: () => void
              setHospitals: React.Dispatch<React.SetStateAction<HospitalManagementType[]>>
}
export default function CreateHospitalModal({
                                              isOpen,
                                              onClose,
                                              setHospitals,
                                            }: Props) 
{
  const [hospitalName, setHospitalName] = useState("")
  const [pricePlan, setPricePlan] = useState("Basic")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  
  const initialHospital = {
      hospitalName: "",
      pricePlan: "standard",
      note: ""
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
          note
        },
        setHospitals,
        onClose:closeModal
      })

    } finally {

      setLoading(false)

    }

  }




  if (!isOpen) return null
  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
      onClick={closeModal}
    >

      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ×ボタン */}
        <button
        onClick={closeModal}
          className="
            absolute
            left-4
            top-4
            text-2xl
            text-gray-500
            hover:text-black
          "
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          病院新規登録
        </h2>

        <div className="space-y-4">

          <div>

            <div className="text-sm mb-1">
              病院名
            </div>

            <input
                value={hospitalName}
                onChange={e => setHospitalName(e.target.value)}
                className="                
                border
                border-gray-300
                rounded
                px-3
                py-2
                w-full
              "
            />

          </div>

          <div>

            <div className="text-sm mb-1">
              料金プラン
            </div>

            <select
              value={pricePlan}
              onChange={e => setPricePlan(e.target.value)}
              className="
                border
                border-gray-300
                rounded
                px-3
                py-2
                w-full
              "
            >
            <option value="free">Free</option>
            <option value="standard">Standard</option>
            <option value="enterprise">Enterprise</option>
            </select>

          </div>

          <div>

            <div className="text-sm mb-1">
              備考
            </div>

            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={5}
              className="
                border
                border-gray-300
                rounded
                px-3
                py-2
                w-full
                resize-none
              "
            />

          </div>

        </div>

        <div className="flex justify-end gap-4 mt-6">

          <button
          onClick={closeModal}
            className="
              px-4
              py-2
              rounded-lg
              bg-gray-300
              hover:bg-gray-400
            "
          >
            キャンセル
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              px-4
              py-2
              rounded-lg
              bg-blue-500
              text-white
              hover:bg-blue-600
            "
          >
            {loading ? "登録中..." : "登録"}
          </button>

        </div>

      </div>

    </div>,
    document.body
  )
}