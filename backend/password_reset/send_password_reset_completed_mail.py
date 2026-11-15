
import os
import requests


# パスワード変更完了メールを送信
def send_password_reset_completed_mail(email: str):
    print("send_password_reset_completed_mail")

    resend_api_key = os.getenv("RESEND_API_KEY")

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {resend_api_key}",
            "Content-Type": "application/json"
        },
        json={
        "from": "Devix <no-reply@devix.jp>",
            "to": [email],
            "subject": "パスワード変更完了のお知らせ",
            "html": """
                <h2>パスワード変更完了のお知らせ</h2>

                <p>
                    Devixのパスワード変更が正常に完了しました。
                </p>

                <p>
                    次回ログイン時から、新しいパスワードをご利用ください。
                </p>

                <hr>

                <p>
                    <strong>【重要】</strong>
                </p>

                <p>
                    この操作に心当たりがない場合は、第三者によってパスワードが変更された可能性があります。<br>
                    速やかにDevix運営までお問い合わせください。
                </p>

                <p>
                    このメールアドレスは送信専用です。<br>
                    返信しないでください。
                </p>
            """
        }
    )

    response.raise_for_status()

    return response.json()
