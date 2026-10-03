"use client"

import { useState, useEffect } from "react"
import { Edit2, ShieldAlert } from "lucide-react"
import { FaVirus } from "react-icons/fa"

import { WardType, UpdateWardInfoType } from "../../types/wardTypes"
import { InfectionTypeType } from "../../types/infectionTypeTypes"
import { WardInfectionType } from "../../types/wardInfectionTypes"

import WardInfectionSelectModal from "./WardInfectionSelectModal"
import CommonModal from "../common/CommonModal"
import InputModal from "../common/InputModal"
import useInputModal from "../common/useInputModal"

import { LoadingOverlay } from "../common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../common/executeWithErrorAndLoading"

type Props = {
  isOpen: boolean
  ward: WardType | null
  onClose: () => void
  setWards: React.Dispatch<React.SetStateAction<WardType[]>>
  infectionTypes: InfectionTypeType[]
  wardInfections: WardInfectionType[]
  setWardInfections: React.Dispatch<React.SetStateAction<WardInfectionType[]>>
  onSubmit: (
    ward: UpdateWardInfoType,
    infectionTypeIds: number[]
  ) => Promise<void>
}

export default function WardInfoModal({
  isOpen,
  ward,
  setWards,
  onClose,
  infectionTypes,
  wardInfections,
  setWardInfections,
  onSubmit,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [note, setNote] = useState("")
  const [selectedInfectionIds, setSelectedInfectionIds] = useState<number[]>([])

  const [isInfectionModalOpen, setIsInfectionModalOpen] = useState(false)
  const inputModal = useInputModal()

  // 保存処理
  async function handleSave() {
    if (!ward) return
    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {
        await onSubmit(
          {
            id: ward.id,
            status,
            note,
          },
          selectedInfectionIds
        )
        onClose()
      },
    })
  }

 

  // クリア処理（InputModalの二択確認を使用）
  function handleClear() {
    inputModal.openInputModal({
      title: "病棟情報のクリア",
      message: "病棟情報をクリアしますか？",
      subMessage: "「保存」を押すと最終確定します。",
      type: "confirm",
      buttonPattern: "yes_no",
      confirmVariant: "danger",
      icon: "warning",
      onConfirm: () => {
        setSelectedInfectionIds([])
        setStatus("")
        setNote("")
        inputModal.closeInputModal()
      },
    })
  }

  useEffect(() => {
    if (!ward) return

    setStatus(ward.status ?? "")
    setNote(ward.note ?? "")

    setSelectedInfectionIds(
      wardInfections
        .filter((w) => w.wardId === ward.id)
        .map((w) => w.infectionTypeId)
    )
  }, [ward, wardInfections])

  if (!isOpen || !ward) return null

  // 状態ごとのセマンティックカラー判定
  const getStatusBadge = (st: string) => {
    switch (st) {
      case "閉鎖中":
        return "bg-rose-100 text-rose-800 border-rose-300"
      case "制限中":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "消毒中":
        return "bg-teal-100 text-teal-800 border-teal-300"
      case "工事中":
        return "bg-slate-200 text-slate-800 border-slate-300"
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
    }
  }

  return (
    <>
      <CommonModal
        open={isOpen}
        onClose={onClose}
        title={ward.name}
        maxWidth="max-w-[560px]"
      >
        <div className="w-full bg-slate-50 p-3 sm:p-4">
          <div className="space-y-4">

            {/* =====================================================
                ヘッダーカード（Devix 標準ダークヘッダー）
            ===================================================== */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-700 bg-slate-900 px-4 py-3 sm:px-5">
                <div className="mb-0.5 text-[11px] font-semibold text-slate-400">
                  病棟管理 / 設定
                </div>
                <h3 className="truncate text-base font-bold text-white sm:text-lg">
                  {ward.name}
                </h3>
              </div>

              {/* 運用ステータス要約バー */}
              <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
                <div className="border-r border-slate-200 px-4 py-2.5 sm:px-5">
                  <div className="text-[10px] font-semibold tracking-wide text-slate-500">
                    現在の運用状態
                  </div>
                  <div className="mt-0.5">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-xs font-bold ${getStatusBadge(
                        status
                      )}`}
                    >
                      {status || "通常稼働"}
                    </span>
                  </div>
                </div>

                <div className="px-4 py-2.5 sm:px-5">
                  <div className="text-[10px] font-semibold tracking-wide text-slate-500">
                    感染症指定
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-slate-800">
                    {selectedInfectionIds.length > 0
                      ? `${selectedInfectionIds.length} 件指定あり`
                      : "指定なし"}
                  </div>
                </div>
              </div>
            </section>

            {/* =====================================================
                病棟設定セクション
            ===================================================== */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                <div className="text-xs font-bold tracking-wide text-slate-700">
                  病棟情報設定
                </div>
              </div>

              <div className="space-y-3 p-4 sm:p-5">

                {/* 運用状態の変更（編集可能カード） */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <label className="block text-[11px] font-medium text-slate-400">
                    運用状態
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="
                      mt-1.5 h-10 w-full rounded-lg
                      border border-slate-300 bg-white px-3
                      text-sm font-bold text-slate-900
                      outline-none transition-colors
                      focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15
                    "
                  >
                    <option value="">通常稼働（なし）</option>
                    <option value="閉鎖中">閉鎖中</option>
                    <option value="制限中">制限中</option>
                    <option value="消毒中">消毒中</option>
                    <option value="工事中">工事中</option>
                  </select>
                </div>



                {/* 感染症区分（編集可能カード + FaVirus） */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">
                      病棟感染症区分
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsInfectionModalOpen(true)}
                      className="
                        rounded-md p-1.5 text-slate-400
                        transition-colors hover:bg-slate-200 hover:text-slate-700
                        cursor-pointer
                      "
                      title="感染症区分を編集"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedInfectionIds.length === 0 ? (
                      <span className="text-xs text-slate-400 font-normal">
                        特記なし
                      </span>
                    ) : (
                      selectedInfectionIds.map((id) => {
                        const infection = infectionTypes.find((i) => i.id === id)
                        return (
                          <span
                            key={id}
                            className="
                              inline-flex items-center gap-1.5
                              rounded-md border border-slate-300 bg-white
                              px-2.5 py-1 text-xs font-bold text-slate-800
                            "
                          >
                            <FaVirus
                              className="h-3.5 w-3.5 shrink-0"
                              style={{ color: infection?.color || "#e11d48" }}
                            />
                            <span>{infection?.name}</span>
                          </span>
                        )
                      })
                    )}
                  </div>
                </div>

              </div>
            </section>

            {/* =====================================================
                アクションボタン（Devix 標準ボタン階層）
            ===================================================== */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              {/* 破壊的アクション：クリア */}
              <button
                type="button"
                onClick={handleClear}
                className="
                  h-9 sm:h-10 rounded-lg
                  border border-rose-200 bg-rose-50/70 px-4
                  text-xs font-bold text-rose-700
                  transition-colors hover:bg-rose-100 active:bg-rose-200
                  cursor-pointer
                "
              >
                クリア
              </button>

              <div className="flex items-center gap-2">
                {/* セカンダリアクション：キャンセル */}
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    h-9 sm:h-10 rounded-lg
                    border border-slate-200 bg-slate-50 px-4
                    text-xs font-bold text-slate-700
                    transition-colors hover:bg-slate-100 active:bg-slate-200
                    cursor-pointer
                  "
                >
                  キャンセル
                </button>

                {/* プライマリアクション：保存（Teal） */}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="
                    h-9 sm:h-10 rounded-lg
                    bg-teal-700 hover:bg-teal-800
                    px-5 sm:px-6
                    text-xs font-bold text-white
                    shadow-xs transition-all active:scale-[0.99]
                    disabled:cursor-not-allowed disabled:bg-slate-300
                    cursor-pointer
                  "
                >
                  {loading ? "保存中..." : "保存"}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 感染症選択モーダル */}
        <WardInfectionSelectModal
          isOpen={isInfectionModalOpen}
          onClose={() => setIsInfectionModalOpen(false)}
          infectionTypes={infectionTypes}
          selectedInfectionIds={selectedInfectionIds}
          setSelectedInfectionIds={setSelectedInfectionIds}
        />

        {/* 備考編集・クリア二択兼用の InputModal（スマホ下部スライドアップ） */}
        <InputModal
          open={inputModal.isOpen}
          onClose={inputModal.closeInputModal}
          onConfirm={inputModal.onConfirm}
          title={inputModal.title}
          message={inputModal.message}
          subMessage={inputModal.subMessage}
          icon={inputModal.icon}
          label={inputModal.label}
          type={inputModal.type}
          defaultValue={inputModal.value}
          placeholder={inputModal.placeholder}
          buttonPattern={inputModal.buttonPattern}
          confirmVariant={inputModal.confirmVariant}
          required={inputModal.required}
        />
      </CommonModal>

      <LoadingOverlay loading={loading} />
    </>
  )
}