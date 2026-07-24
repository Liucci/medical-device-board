"use client"

import CommonModal from "../common/CommonModal"
import { DeviceModelType } from "../../types/deviceModelTypes"
import { useState ,useEffect} from "react"
import {LoadingOverlay} from "../common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

type Props = {
              isOpen: boolean
              deviceModel: DeviceModelType | null
              onClose: () => void
              onSave: (deviceModel: DeviceModelType) => Promise<void>
}

export default function DeviceModelEditModal({
                                                isOpen,
                                                deviceModel,
                                                onClose,
                                                onSave
                                              }: Props) 
{
const [name, setName] = useState("")
const [displayRemainingCount, setDisplayRemainingCount] = useState(false)
const [remainingAlertCount, setRemainingAlertCount] = useState(0)


const handleSave = async () => {
  if (!deviceModel) {return}

        await onSave({
                        ...deviceModel,
                        name,
                        displayRemainingCount,
                        remainingAlertCount
                      })
        onClose()
      }
   


useEffect(() => {
  if (!deviceModel) {return}

  setName(deviceModel.name)
  setDisplayRemainingCount(deviceModel.displayRemainingCount)
  setRemainingAlertCount(deviceModel.remainingAlertCount)
}, [deviceModel])

if (!isOpen || !deviceModel) {return null}

return (
  
  <CommonModal
    open={isOpen}
    onClose={onClose}
    title="型式編集"
  >

    <div className="space-y-4">

      <div>
        <div className="mb-1">型式名</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={displayRemainingCount}
          onChange={(e) => setDisplayRemainingCount(e.target.checked)}
        />
        残数表示対象
      </label>

      <div>
        <div className="mb-1">警告残数</div>
        <input
          type="number"
          min={0}
          value={remainingAlertCount}
          onChange={(e) =>
            setRemainingAlertCount(Number(e.target.value))
          }
          className="w-24 border rounded px-2 py-1"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            キャンセル
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            保存
          </button>

        </div>

      </div>

    </div>

  </CommonModal>

  )}