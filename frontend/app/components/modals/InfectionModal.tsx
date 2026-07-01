import { useState } from "react"
import { InfectionTypeType } from "../../types/infectionTypeTypes"
import { createInfectionTypeTransaction } from "../../api/transactions/infectionTypes/createInfectionTypeTransaction"
import { updateInfectionTypeTransaction } from "../../api/transactions/infectionTypes/updateInfectionTypeTransaction"
import { deleteInfectionTypesTransaction } from "../../api/transactions/infectionTypes/deleteInfectionTypesTransaction"
import { executeWithLoading } from "../common/executeWithLoading"
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

    await executeWithLoading({
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

    await executeWithLoading({
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

    await executeWithLoading({
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

    await executeWithLoading({
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
      <div className="space-y-4">

        {/* 一覧 */}
        <div className="border rounded p-2 max-h-60 overflow-y-auto">

          {infectionTypes.map(infectionType => (

            <div
              key={infectionType.id}
              className="flex items-center gap-3 py-1"
            >

              <input
                type="checkbox"
                checked={checkedIds.includes(infectionType.id)}
                onChange={() => toggleCheck(infectionType.id)}
              />

              <span className="flex-1">
                {infectionType.name}
              </span>

              <input
                type="color"
                value={infectionType.color}
                onChange={e =>
                  handleColorChange(
                    infectionType,
                    e.target.value
                  )
                }
                className="w-10 h-8 border rounded cursor-pointer"
              />

              <button
                onClick={() => handleRename(infectionType)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                編集
              </button>

            </div>

          ))}

        </div>

        {/* 追加 */}
        <div className="flex items-center gap-2">

          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="感染症名"
            className="border px-2 py-1 flex-1 rounded"
          />

          <input
            type="color"
            value={newColor}
            onChange={e => setNewColor(e.target.value)}
            className="w-10 h-10 border rounded cursor-pointer"
          />

          <button
            onClick={handleAdd}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            追加
          </button>

        </div>

        {/* 削除 */}
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          選択削除
        </button>

      </div>

      <LoadingOverlay loading={loading} />
    </>
  )
}