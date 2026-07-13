import os
import requests

from datetime import datetime
from schemas.account_edit_code_schemas import (
    SendAccountEditMailRequest
)


def send_account_edit_mail(
    request: SendAccountEditMailRequest
):
    print("send_account_edit_mail")

    expires_at = datetime.fromisoformat(
        request.expires_at
    )

    resend_api_key = os.getenv("RESEND_API_KEY")

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {resend_api_key}",
            "Content-Type": "application/json"
        },
        json={
            "from": "Devix <invite@devix.jp>",
            "to": [request.email],
            "subject": "アカウント情報編集",
            "html": f"""
                <h2>アカウント情報編集</h2>

                <p>
                アカウント情報を編集するためのURLです。
                </p>

                <p>
                以下のリンクから編集画面へアクセスしてください。
                </p>

                <p>
                    <a href="{request.account_edit_url}">
                        アカウント情報を編集する
                    </a>
                </p>

                <p>
                    {request.account_edit_url}
                </p>

                <hr>

                <p>
                    このURLの有効期限
                </p>

                <p>
                    <strong>
                        {expires_at.strftime("%Y/%m/%d %H:%M")}
                    </strong>
                </p>

                <p>
                    このメールに心当たりがない場合は破棄してください。
                </p>
            """
        }
    )

    print("RESEND_API_KEY =", resend_api_key)
    print("status =", response.status_code)
    print("body =", response.text)

    response.raise_for_status()

    return response.json()