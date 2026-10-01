"use client"

import { useState } from "react"

import type {
    InspectionType,
    CreateInspectionTypeFrontType,
    UpdateInspectionTypeFrontType,
} from "../../../types/inspectionTypes/inspectionTypeTypes"

import { createInspectionTypeTransaction } from "../../../api/transactions/inspection/inspectionTypes/createInspectionTypeTransaction"
import { updateInspectionTypeTransaction } from "../../../api/transactions/inspection/inspectionTypes/updateInspectionTypeTransaction"

import { executeWithErrorAndLoading } from "../../common/executeWithErrorAndLoading"
import { LoadingOverlay } from "../../common/LoadingOverlay"
import { deleteInspectionTypeTransaction } from "../../../api/transactions/inspection/inspectionTypes/deleteInspectionTypeTransaction"

type Props = {
    inspectionTypes: InspectionType[]
    setInspectionTypes: React.Dispatch<
        React.SetStateAction<InspectionType[]>
    >
}


export default function EditChecklistTypeModal({
    inspectionTypes,
    setInspectionTypes,
}: Props) {

    const [newName, setNewName] = useState("")
    const [loading, setLoading] = useState(false)


    // =========================
    // 編集
    // =========================

    const handleRename = async (
        inspectionType: InspectionType
    ) => {

        const newName = prompt(
            "新しい点検表種類名を入力",
            inspectionType.name
        )

        if (!newName) {
            return
        }

        const trimmed = newName.trim()

        if (!trimmed) {
            return
        }

        if (trimmed === inspectionType.name) {
            return
        }

        // 同名チェック
        const exists = inspectionTypes.some(
            type =>
                type.id !== inspectionType.id &&
                type.name.trim().toLowerCase() ===
                    trimmed.toLowerCase()
        )

        if (exists) {
            alert("同名の点検表種類がすでに存在します")
            return
        }

        const updateData: UpdateInspectionTypeFrontType = {
            id: inspectionType.id,
            name: trimmed,
            isActive: inspectionType.isActive,
        }

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {

                await updateInspectionTypeTransaction({
                    inspectionType: updateData,
                    setInspectionTypes,
                })

            },
        })
    }


    // =========================
    // 有効 / 無効
    // =========================

/* 
    const handleToggleActive = async (
        inspectionType: InspectionType
    ) => {

        const nextIsActive = !inspectionType.isActive

        const updateData: UpdateInspectionTypeFrontType = {
            id: inspectionType.id,
            name: inspectionType.name,
            isActive: nextIsActive,
        }

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {

                await updateInspectionTypeTransaction({
                    inspectionType: updateData,
                    setInspectionTypes,
                })

            },
        })
    }
 */

// =========================
// 削除
// =========================

const handleDelete = async (
    inspectionType: InspectionType
) => {

    const confirmed = window.confirm(
        `「${inspectionType.name}」を削除しますか？\n\n` +
        "この点検表種類に紐づく点検表・点検項目も削除されます。\n" +
        "過去の点検記録は削除されません。"
    )

    if (!confirmed) {
        return
    }

    await executeWithErrorAndLoading({
        setLoading,
        action: async () => {

            await deleteInspectionTypeTransaction({
                inspectionType: {
                    id: inspectionType.id
                },
                setInspectionTypes,
            })

        },
    })
}

    // =========================
    // 追加
    // =========================

    const handleAdd = async () => {

        const trimmed = newName.trim()

        if (!trimmed) {
            return
        }

        // 同名チェック
        const exists = inspectionTypes.some(
            type =>
                type.name.trim().toLowerCase() ===
                trimmed.toLowerCase()
        )

        if (exists) {
            alert("同名の点検表種類がすでに存在します")
            return
        }

        const inspectionType: CreateInspectionTypeFrontType = {
            name: trimmed,
        }

        await executeWithErrorAndLoading({
            setLoading,
            action: async () => {

                await createInspectionTypeTransaction({
                    inspectionType,
                    setInspectionTypes,
                })

            },
        })

        setNewName("")
    }
  return (
    <>
      <div className="w-full rounded-2xl bg-slate-50 p-4 sm:p-5">
        <div className="flex h-[600px] min-h-0 w-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 shrink-0">
            <h3 className="text-sm font-bold tracking-wide text-slate-700">
              点検表種類
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              点検表種類の追加、名前の変更、有効・無効の切り替えを行います
            </p>
          </div>

          <div className="mb-3 flex shrink-0 items-center justify-between">
            <div>
              <div className="text-xs font-bold tracking-wide text-slate-700">
                登録されている点検表種類
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {inspectionTypes.length} 件
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 px-3">
            {inspectionTypes.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                登録されている点検表種類はありません
              </div>
            ) : (
              <div>
                {inspectionTypes.map((inspectionType) => {
                  const isCommon = inspectionType.hospitalId === null

                  return (
                    <div
                      key={inspectionType.id}
                      className="
                        flex items-center justify-between gap-3
                        border-b border-slate-200
                        py-3
                        last:border-b-0
                        hover:bg-white
                      "
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-slate-900">
                          {inspectionType.name}
                        </div>

                        <div className="mt-1">
                          {isCommon ? (
                            <span className="text-[11px] font-medium text-slate-400">
                              共通・編集不可
                            </span>
                          ) : inspectionType.isActive ? (
                            <span className="text-[11px] font-bold text-emerald-600">
                              有効
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-400">
                              無効
                            </span>
                          )}
                        </div>
                      </div>

                      {!isCommon && (
                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleRename(inspectionType)}
                            className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          >
                            編集
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(inspectionType)}
                            className="h-8 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
                          >
                            削除
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mt-5 shrink-0 border-t border-slate-200 pt-4">
            <div className="mb-3">
              <h4 className="text-xs font-bold tracking-wide text-slate-700">
                新しい点検表種類を追加
              </h4>
              <p className="mt-1 text-[11px] text-slate-500">
                新しい点検表種類名を入力してください
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="例：定期点検"
                className="
                  min-w-0
                  flex-1
                  rounded-lg
                  border border-slate-200
                  bg-slate-50
                  px-3 py-2.5
                  text-sm text-slate-900
                  outline-none
                  transition-colors
                  placeholder:text-slate-400
                  focus:border-teal-600
                  focus:ring-2
                  focus:ring-teal-100
                "
              />

              <button
                type="button"
                onClick={handleAdd}
                className="h-10 shrink-0 rounded-lg bg-teal-700 px-4 text-xs font-bold text-white transition-colors hover:bg-teal-800"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay loading={loading} />
    </>
  )


}
