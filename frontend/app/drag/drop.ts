//Dropした場所が何なのかを示す型
// Dropした場所が何なのかを示す型
export type DropTarget =
                            | {
                                type: "stock"
                                stockAreaId: number
                                }
                            | {
                                type: "ward"
                                wardId: number
                                }
                            | null

export const getDropTarget = (
                                clientX: number,
                                clientY: number
                                ): DropTarget => {

  const element =document.elementFromPoint(
                                            clientX,
                                            clientY
                                            )
  if (!element) return null
  const wardElement =element.closest("[data-ward-id]")

  if (wardElement) {
    return {
            type: "ward",
            wardId: Number(
                wardElement.getAttribute(
                "data-ward-id"
                )
            )
            }
  }

  const stockElement =element.closest("[data-stock-area-id]")

  if (stockElement) {
    return {
            type: "stock",
            stockAreaId: Number(
                stockElement.getAttribute(
                "data-stock-area-id"
                )
            )
            }
  }

  return null
}