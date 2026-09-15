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
    <div className="w-full rounded-2xl bg-gray-200 p-5">

      <div className="flex h-[600px] min-h-0 w-full flex-col rounded-xl bg-white p-6 shadow-sm">

        {/* ================================================= */}
        {/* タイトル */}
        {/* ================================================= */}
        <div className="mb-6 shrink-0">

          <h3 className="text-lg font-semibold text-gray-800">
            点検表種類
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            点検表種類の追加、名前の変更、有効・無効の切り替えを行います
          </p>

        </div>


        {/* ================================================= */}
        {/* 一覧ヘッダー */}
        {/* ================================================= */}
        <div className="mb-3 flex shrink-0 items-center justify-between">

          <div>

            <div className="text-sm font-semibold text-gray-800">
              登録されている点検表種類
            </div>

            <div className="mt-1 text-xs text-gray-500">
              {inspectionTypes.length} 件
            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* 一覧 */}
        {/* ================================================= */}
        <div className="min-h-0 flex-1 overflow-y-auto">

          {inspectionTypes.length === 0 ? (

            <div className="py-12 text-center text-sm text-gray-400">
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
                      flex
                      items-center
                      gap-3
                      border-b
                      border-gray-100
                      py-3
                      last:border-b-0
                      hover:bg-gray-50
                    "
                  >

                    {/* ================================================= */}
                    {/* 点検表種類名 */}
                    {/* ================================================= */}
                    <div className="min-w-0 flex-1">

                      <div className="truncate text-sm text-gray-800">
                        {inspectionType.name}
                      </div>

                      {/* ステータス */}
                      <div className="mt-1">

                        {isCommon ? (

                          <span className="text-xs text-gray-400">
                            共通・編集不可
                          </span>

                        ) : inspectionType.isActive ? (

                          <span className="text-xs text-blue-500">
                            有効
                          </span>

                        ) : (

                          <span className="text-xs text-gray-400">
                            無効
                          </span>

                        )}

                      </div>

                    </div>


                    {/* ================================================= */}
                    {/* 操作ボタン */}
                    {/* ================================================= */}
                    {!isCommon && (
                      <div className="flex shrink-0 items-center gap-2">

                        {/* 名前変更 */}
                        <button
                          onClick={() =>
                            handleRename(inspectionType)
                          }
                          className="
                            rounded-lg
                            bg-gray-100
                            px-3
                            py-1.5
                            text-sm
                            font-medium
                            text-gray-600
                            transition
                            hover:bg-gray-200
                            hover:text-gray-800
                          "
                        >
                          ✏
                        </button>


                        {/* 有効・無効 */}
                        <button
                          onClick={() =>
                            handleToggleActive(inspectionType)
                          }
                          className={`
                            rounded-lg
                            px-3
                            py-1.5
                            text-sm
                            font-medium
                            transition
                            ${
                              inspectionType.isActive
                                ? `
                                  bg-gray-100
                                  text-gray-600
                                  hover:bg-gray-200
                                  hover:text-gray-800
                                `
                                : `
                                  bg-blue-50
                                  text-blue-600
                                  hover:bg-blue-100
                                `
                            }
                          `}
                        >
                          {inspectionType.isActive
                            ? "無効"
                            : "有効"}
                        </button>

                      </div>
                    )}

                  </div>
                )

              })}

            </div>

          )}

        </div>


        {/* ================================================= */}
        {/* 点検表種類追加 */}
        {/* ================================================= */}
        <div className="mt-8 shrink-0">

          <div className="mb-4">

            <h4 className="text-sm font-semibold text-gray-800">
              新しい点検表種類を追加
            </h4>

            <p className="mt-1 text-xs text-gray-500">
              新しい点検表種類名を入力してください
            </p>

          </div>


          <div className="flex gap-3">

            <input
              type="text"
              value={newName}
              onChange={(e) =>
                setNewName(e.target.value)
              }
              placeholder="例：定期点検"
              className="
                min-w-0
                flex-1
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2.5
                text-sm
                text-gray-700
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />


            <button
              onClick={handleAdd}
              className="
                shrink-0
                rounded-lg
                bg-blue-500
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-600
              "
            >
              追加
            </button>

          </div>

        </div>

      </div>

    </div>


    {/* ================================================= */}
    {/* Loading */}
    {/* ================================================= */}
    <LoadingOverlay loading={loading} />

  </>
) 

}
