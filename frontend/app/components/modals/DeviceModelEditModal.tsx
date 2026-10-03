"use client"

import { useState, useEffect } from "react"
import CommonModal from "../common/CommonModal"
import { DeviceModelType } from "../../types/deviceModelTypes"

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
  onSave,
}: Props) {
  const [name, setName] = useState("")
  const [displayRemainingCount, setDisplayRemainingCount] = useState(false)
  const [remainingAlertCount, setRemainingAlertCount] = useState(0)

  const handleSave = async () => {
    if (!deviceModel) return

    await onSave({
      ...deviceModel,
      name: name.trim(),
      displayRemainingCount,
      remainingAlertCount,
    })
    onClose()
  }

  useEffect(() => {
    if (!deviceModel) return
    setName(deviceModel.name)
    setDisplayRemainingCount(deviceModel.displayRemainingCount)
    setRemainingAlertCount(deviceModel.remainingAlertCount)
  }, [deviceModel])

  if (!isOpen || !deviceModel) return null

  return (
    <CommonModal
      open={isOpen}
      onClose={onClose}
      title="型式情報の編集"
      maxWidth="max-w-md"
    >
      <div className="bg-slate-50 p-4 sm:p-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 space-y-4">

          {/* 型式名 */}
          <div>
            <label className="block text-xs font-bold text-slate-700">
              型式名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：Servo-i"
              className="
                mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3
                text-sm font-bold text-slate-900 outline-none transition-colors
                focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15
              "
            />
          </div>

          {/* 残数監視設定カード */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={displayRemainingCount}
                onChange={(e) => setDisplayRemainingCount(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span className="text-xs font-bold text-slate-800">
                ダッシュボードの残数監視パネルに表示する
              </span>
            </label>

            {displayRemainingCount && (
              <div className="border-t border-slate-200/80 pt-3">
                <label className="block text-[11px] font-medium text-slate-500">
                  警告発生の基準残数（この数以下でアラート表示）
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={remainingAlertCount}
                    onChange={(e) =>
                      setRemainingAlertCount(Math.max(0, Number(e.target.value)))
                    }
                    className="
                      h-10 w-24 rounded-lg border border-slate-300 bg-white px-3
                      text-sm font-bold text-slate-900 outline-none
                      focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15
                    "
                  />
                  <span className="text-xs font-bold text-slate-600">台以下</span>
                </div>
              </div>
            )}
          </div>

          {/* 操作ボタン */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="
                h-10 rounded-lg border border-slate-200 bg-slate-50 px-4
                text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer
              "
            >
              キャンセル
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="
                h-10 rounded-lg bg-teal-700 px-5 text-xs font-bold text-white
                shadow-xs transition-all hover:bg-teal-800 active:scale-[0.99] cursor-pointer
              "
            >
              保存
            </button>
          </div>

        </div>
      </div>
    </CommonModal>
  )
}