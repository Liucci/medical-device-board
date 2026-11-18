import { initPasswordResetPage } from "../../../api/passwordReset/initPasswordResetPage"

// パスワード変更ページの初期化
export const initPasswordResetPageTransaction = async (code: string) => {
    console.log("initPasswordResetPageTransaction")

    const response = await initPasswordResetPage(code)

    return response
}