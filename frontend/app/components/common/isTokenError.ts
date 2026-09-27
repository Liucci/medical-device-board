/**
 * Token / 認証関連のエラーかどうかを判定する
 */
export function isTokenError(error: unknown): boolean {
  if (!error) {
    return false
  }

  // ----------------------------------------
  // status / statusCode
  // ----------------------------------------

  if (typeof error === "object") {
    const errorObject = error as {
      status?: unknown
      statusCode?: unknown
    }

    if (
      errorObject.status === 401 ||
      errorObject.statusCode === 401
    ) {
      return true
    }
  }

  // ----------------------------------------
  // Supabaseなどのerror.code
  // ----------------------------------------

  if (typeof error === "object") {
    const errorObject = error as {
      code?: unknown
    }

    if (typeof errorObject.code === "string") {
      const code = errorObject.code.toLowerCase()

      const authErrorCodes = [
        "invalid_refresh_token",
        "refresh_token_not_found",
        "invalid_token",
        "token_expired",
        "jwt_expired",
        "unauthorized",
      ]

      if (authErrorCodes.some((authCode) => code.includes(authCode))) {
        return true
      }
    }
  }

  // ----------------------------------------
  // error.message
  // ----------------------------------------

  if (typeof error === "object") {
    const errorObject = error as {
      message?: unknown
    }

    if (typeof errorObject.message === "string") {
      const message = errorObject.message.toLowerCase()

      const authErrorMessages = [
        "invalid refresh token",
        "refresh token not found",
        "jwt expired",
        "token expired",
        "invalid token",
        "token is expired",
        "unauthorized",
        "authentication failed",
      ]

      if (
        authErrorMessages.some((authMessage) =>
          message.includes(authMessage)
        )
      ) {
        return true
      }
    }
  }

  // ----------------------------------------
  // Errorインスタンス
  // ----------------------------------------

  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    const authErrorMessages = [
      "invalid refresh token",
      "refresh token not found",
      "jwt expired",
      "token expired",
      "invalid token",
      "token is expired",
      "unauthorized",
      "authentication failed",
    ]

    if (
      authErrorMessages.some((authMessage) =>
        message.includes(authMessage)
      )
    ) {
      return true
    }
  }

  return false
}