import { executeWithLoading } from "./executeWithLoading"
import { showError } from "./showError"
import { isTokenError } from "./isTokenError"
import { handleAuthError } from "./handleAuthError"


// executeWithLoadingにエラー処理を追加する
type ExecuteWithErrorAndLoadingParams = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  action: () => Promise<void>
}

export async function executeWithErrorAndLoading({
  setLoading,
  action,
}: ExecuteWithErrorAndLoadingParams) {

  console.log("executeWithErrorAndLoading")

  try {
    await executeWithLoading({
      setLoading,
      action,
    })

  } catch (error) {

    // ----------------------------------------
    // Token / 認証関連エラー
    // ----------------------------------------

    if (isTokenError(error)) {

      console.error(
        "Authentication error detected. Redirecting to login.",
        error
      )

      handleAuthError()

      return
    }

    // ----------------------------------------
    // 通常のエラー
    // ----------------------------------------

    showError(error)

    throw error
  }
}