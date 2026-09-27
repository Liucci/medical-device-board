/**
 * 認証エラー発生時の共通処理
 *
 * Token関連エラーが発生した場合にログイン画面へ遷移する。
 */
export function handleAuthError(): void {
  // SSR対策
  if (typeof window === "undefined") {
    return
  }

  // すでにログイン画面にいる場合は何もしない
  if (window.location.pathname === "/login") {
    return
  }

  // 現在のページを履歴に残さずログイン画面へ遷移
  window.location.replace("/login")
}