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

  try {
    await action()
  } finally {
    setLoading(false)
  }
}