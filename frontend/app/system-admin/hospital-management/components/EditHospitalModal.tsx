"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { HospitalManagementType } from "../../../types/hospitalTypes"
import { updateHospitalTransaction } from "../../../api/transactions/hospitals/updateHospitalTransaction"

type Props = {
  isOpen: boolean
  onClose: () => void
  hospital: HospitalManagementType | null
  setHospitals: React.Dispatch<
    React.SetStateAction<HospitalManagementType[]>
  >
}

export default function EditHospitalModal({
  isOpen,
  onClose,
  hospital,
  setHospitals
}: Props) {

  const [hospitalName, setHospitalName] = useState("")
  const [pricePlan, setPricePlan] = useState("standard")
  const [isActive, setIsActive] = useState(true)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)


  

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
          note
        },
        setHospitals,
        onClose
      })

    } finally {

      setLoading(false)

    }

  }

  return createPortal(

    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative">

        {/* × */}
        <button
          onClick={onClose}
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
          病院編集
        </h2>

        <div className="space-y-4">

          {/* 病院名 */}

          <div>

            <div className="text-sm mb-1">
              病院名
            </div>

            <input
              value={hospitalName}
              onChange={e =>
                setHospitalName(e.target.value)
              }
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

          {/* プラン */}

          <div>

            <div className="text-sm mb-1">
              料金プラン
            </div>

            <select
              value={pricePlan}
              onChange={e =>
                setPricePlan(e.target.value)
              }
              className="
                border
                border-gray-300
                rounded
                px-3
                py-2
                w-full
              "
            >
              <option value="free">
                Free
              </option>

              <option value="standard">
                Standard
              </option>

              <option value="enterprise">
                Enterprise
              </option>

            </select>

          </div>

          {/* 利用状態 */}

          <div>

            <div className="text-sm mb-2">
              利用状態
            </div>

            <div className="flex gap-6">

              <label>

                <input
                  type="radio"
                  checked={isActive}
                  onChange={() =>
                    setIsActive(true)
                  }
                />

                <span className="ml-1">
                  利用中
                </span>

              </label>

              <label>

                <input
                  type="radio"
                  checked={!isActive}
                  onChange={() =>
                    setIsActive(false)
                  }
                />

                <span className="ml-1">
                  停止
                </span>

              </label>

            </div>

          </div>

          {/* 備考 */}

          <div>

            <div className="text-sm mb-1">
              備考
            </div>

            <textarea
              value={note}
              onChange={e =>
                setNote(e.target.value)
              }
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
            <div>

            <div className="text-sm mb-1">
                病院ID
            </div>

            <input
                value={hospital?.id ?? ""}
                readOnly
                className="
                w-full
                rounded
                border
                border-gray-300
                bg-gray-100
                px-3
                py-2
                text-gray-600
                "
            />

            </div>


            <div>

            <div className="text-sm mb-1">
                登録日
            </div>

            <input
                value={hospital?.createdAt ?? ""}
                readOnly
                className="
                w-full
                rounded
                border
                border-gray-300
                bg-gray-100
                px-3
                py-2
                text-gray-600
                "
            />

            </div>

            <div>

            <div className="text-sm mb-1">
                更新日
            </div>

            <input
                value={hospital?.updatedAt ?? ""}
                readOnly
                className="
                w-full
                rounded
                border
                border-gray-300
                bg-gray-100
                px-3
                py-2
                text-gray-600
                "
            />

            </div>


        </div>

        <div className="flex justify-end gap-4 mt-6">

          <button
            onClick={onClose}
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
              disabled:bg-gray-400
            "
          >
            {loading ? "保存中..." : "保存"}
          </button>

        </div>

      </div>

    </div>,
    document.body
  )
}