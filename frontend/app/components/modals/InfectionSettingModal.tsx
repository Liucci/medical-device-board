import { useState } from "react"
import { InfectionTypeType } from "../../types/infectionTypeTypes"
import { createInfectionTypeTransaction } from "../../api/transactions/infectionTypes/createInfectionTypeTransaction"
import { updateInfectionTypeTransaction } from "../../api/transactions/infectionTypes/updateInfectionTypeTransaction"
import { deleteInfectionTypesTransaction } from "../../api/transactions/infectionTypes/deleteInfectionTypesTransaction"
import { executeWithLoading } from "../common/executeWithLoading"
import { executeWithErrorAndLoading } from "../../components/common/executeWithErrorAndLoading"

import { LoadingOverlay } from "../common/LoadingOverlay"

type Props = {
  infectionTypes: InfectionTypeType[]
  setInfectionTypes: React.Dispatch<React.SetStateAction<any[]>>
}

export default function InfectionSettingsModal({
                                                 infectionTypes,
                                                 setInfectionTypes,
                                               }: Props) {

  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState("#ff0000")
  const [loading, setLoading] = useState(false)

  // チェックON/OFF
  const toggleCheck = (id: number) => {
    setCheckedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  // 追加
  const handleAdd = async () => {

    const trimmed = newName.trim()

    if (!trimmed) {return}

    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {

        await createInfectionTypeTransaction({
          infectionType: {
            name: trimmed,
            color: newColor
          },
          setInfectionTypes
        })

      }
    })

    setNewName("")
    setNewColor("#ff0000")
  }

  // 名前変更
  const handleRename = async (
    infectionType: InfectionTypeType
  ) => {

    const name =
      prompt(
        "感染症名を入力してください",
        infectionType.name
      )

    if (!name) {return}

    const trimmed = name.trim()

    if (!trimmed) {return}

    if (trimmed === infectionType.name) {return}

    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {

        await updateInfectionTypeTransaction({
          infectionType: {
            id: infectionType.id,
            name: trimmed,
            color: infectionType.color
          },
          setInfectionTypes
        })

      }
    })
  }

  // 色変更
  const handleColorChange = async (
    infectionType: InfectionTypeType,
    color: string
  ) => {

    if (color === infectionType.color) {return}

    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {

        await updateInfectionTypeTransaction({
          infectionType: {
            id: infectionType.id,
            name: infectionType.name,
            color
          },
          setInfectionTypes
        })

      }
    })
  }

  // 削除
  const handleDelete = async () => {

    if (checkedIds.length === 0) {return}

    await executeWithErrorAndLoading({
      setLoading,
      action: async () => {

        await deleteInfectionTypesTransaction({
          infectionTypes: {
            ids: checkedIds
          },
          setInfectionTypes
        })

      }
    })

    setCheckedIds([])
  }

  return (
    <>
      <div className="w-full rounded-2xl bg-gray-200 p-5">

        <div className="w-full rounded-xl bg-white p-6 shadow-sm">

          {/* ================================================= */}
          {/* タイトル */}
          {/* ================================================= */}
          <div className="mb-6">

            <h3 className="text-lg font-semibold text-gray-800">
              感染症
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              感染症の追加、名前や色の変更、削除を行います
            </p>

          </div>


          {/* ================================================= */}
          {/* 一覧ヘッダー */}
          {/* ================================================= */}
          <div className="mb-3 flex items-center justify-between">

            <div>

              <div className="text-sm font-semibold text-gray-800">
                登録されている感染症
              </div>

              <div className="mt-1 text-xs text-gray-500">
                {infectionTypes.length} 件
              </div>

            </div>


            {/* 選択削除 */}
            {checkedIds.length > 0 && (
              <button
                onClick={handleDelete}
                className="
                  rounded-lg
                  bg-red-50
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-red-600
                  transition
                  hover:bg-red-100
                "
              >
                選択削除
              </button>
            )}

          </div>


          {/* ================================================= */}
          {/* 感染症一覧 */}
          {/* ================================================= */}
          <div className="max-h-[calc(90vh-280px)] overflow-y-auto">

            {infectionTypes.length === 0 ? (

              <div className="py-12 text-center text-sm text-gray-400">
                登録されている感染症はありません
              </div>

            ) : (

              <div>

                {infectionTypes.map((infectionType) => (

                  <div
                    key={infectionType.id}
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

                    {/* チェックボックス */}
                    <input
                      type="checkbox"
                      checked={checkedIds.includes(infectionType.id)}
                      onChange={() =>
                        toggleCheck(infectionType.id)
                      }
                      className="
                        h-4
                        w-4
                        cursor-pointer
                        rounded
                        border-gray-300
                        text-blue-500
                        focus:ring-blue-400
                      "
                    />


                    {/* 感染症名 */}
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-800">
                      {infectionType.name}
                    </span>


                    {/* 色 */}
                    <input
                      type="color"
                      value={infectionType.color}
                      onChange={(e) =>
                        handleColorChange(
                          infectionType,
                          e.target.value
                        )
                      }
                      className="
                        h-9
                        w-12
                        shrink-0
                        cursor-pointer
                        rounded-lg
                        border
                        border-gray-300
                        bg-white
                        p-1
                      "
                    />


                    {/* 編集 */}
                    <button
                      onClick={() =>
                        handleRename(infectionType)
                      }
                      className="
                        shrink-0
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

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* ================================================= */}
          {/* 新しい感染症を追加 */}
          {/* ================================================= */}
          <div className="mt-8">

            <div className="mb-4">

              <h4 className="text-sm font-semibold text-gray-800">
                新しい感染症を追加
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                感染症名と表示色を設定してください
              </p>

            </div>


            <div className="flex items-end gap-3">

              {/* 感染症名 */}
              <div className="min-w-0 flex-1">

                <label className="mb-2 block text-xs font-medium text-gray-600">
                  感染症名
                </label>

                <input
                  type="text"
                  value={newName}
                  onChange={(e) =>
                    setNewName(e.target.value)
                  }
                  placeholder="例：MRSA"
                  className="
                    w-full
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

              </div>


              {/* 色 */}
              <div>

                <label className="mb-2 block text-xs font-medium text-gray-600">
                  色
                </label>

                <input
                  type="color"
                  value={newColor}
                  onChange={(e) =>
                    setNewColor(e.target.value)
                  }
                  className="
                    h-10
                    w-14
                    cursor-pointer
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    p-1
                  "
                />

              </div>


              {/* 追加 */}
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