
import os
import requests

from datetime import datetime
from zoneinfo import ZoneInfo

def send_password_reset_mail(
    email: str,
    reset_url: str,
    expires_at: datetime
):
    print("send_password_reset_mail")
    jst_expires_at = expires_at.astimezone(ZoneInfo("Asia/Tokyo"))
    resend_api_key = os.getenv("RESEND_API_KEY")

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {resend_api_key}",
            "Content-Type": "application/json"
        },
        json={
            "from": "Devix <info@devix.jp>",
            "to": [email],
            "subject": "パスワード変更のご案内",
            "html": f"""
                <h2>パスワード変更のご案内</h2>

                <p>
                    本人確認が完了しました。
                </p>

                <p>
                    以下のURLからパスワード変更ページへ進み、
                    新しいパスワードを設定してください。
                </p>

                <p>
                    <a href="{reset_url}">
                        パスワード変更はこちら
                    </a>
                </p>

                <p>
                    URLの有効期限：
                    <strong>
                        {jst_expires_at.strftime("%Y/%m/%d %H:%M")}
                    </strong>
                </p>

                <hr>

                <p>
                    このURLは、パスワード変更の申請を行った本人のみ
                    使用してください。
                </p>

                <p>
                    このメールに心当たりがない場合は破棄してください。
                </p>
            """
        }
    )

    response.raise_for_status()

    return response.json()
