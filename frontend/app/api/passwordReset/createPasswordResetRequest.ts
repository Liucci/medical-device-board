import { API_BASE_URL } from "../client/apiClient"

// backendの/password-reset-requestを呼び出す
export async function createPasswordResetRequest(
  email: string
) {
  console.log("createPasswordResetRequest")

  const response = await fetch(
    `${API_BASE_URL}/password-reset-request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
      }),
    }
  )

  const data = await response.json()

  // エラー処理
  if (!response.ok) {
    throw new Error(data.detail)
  }

  return data
}