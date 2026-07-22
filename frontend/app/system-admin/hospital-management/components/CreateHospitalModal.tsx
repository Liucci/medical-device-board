"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { HospitalManagementType } from "../../../types/hospitalTypes"
import { createHospitalTransaction }from "../../../api/transactions/hospitals/createHospitalTransaction"
import CommonModal from "../../../components/common/CommonModal"
import {LoadingOverlay} from "../../../components/common/LoadingOverlay"

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
  
  return (
       <>
    <CommonModal
        open={isOpen}
        onClose={onClose}
        title="病院新規登録"
        maxWidth="max-w-[450px]"
        >
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


  </CommonModal>

      <LoadingOverlay loading={loading} />
  </>
  )
}