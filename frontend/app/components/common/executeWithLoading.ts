import { Dispatch, SetStateAction } from "react"

type ExecuteWithLoadingParams = {
  setLoading: Dispatch<SetStateAction<boolean>>
  action: () => Promise<void>
}

export async function executeWithLoading({
  setLoading,
  action
}: ExecuteWithLoadingParams) {
  setLoading(true)

  const startTime = Date.now()

  try {
    await action()
  } finally {
    const elapsedTime = Date.now() - startTime
    const remainingTime = 1000 - elapsedTime

    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }

    setLoading(false)
  }
}