import { sendPasswordResetMail } from "../../../api/passwordReset/sendPasswordResetMail"

//本人確認後、パスワード変更メールを送信する
export const sendPasswordResetMailTransaction = async () => {

    const response = await sendPasswordResetMail()

    return response
}