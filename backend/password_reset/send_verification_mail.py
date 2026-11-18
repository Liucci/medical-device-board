
import os
import requests

from datetime import datetime
from zoneinfo import ZoneInfo


def send_verification_mail(
    email: str,
    verification_url: str,
    expires_at: datetime
):
    print("send_verification_mail")
    jst_expires_at = expires_at.astimezone(ZoneInfo("Asia/Tokyo"))
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
            "subject": "パスワードリセット申請のご案内",
            "html": f"""
                <h2>パスワードリセット申請のご案内</h2>

                <p>
                    パスワードリセットの申請を受け付けました。
                </p>

                <p>
                    以下のURLからユーザー登録確認を実施してください。<br>
                    必ずパスワード変更申請した同一の端末からアクセスしてください。<br>
                    リンクの有効期限は30分です。

                </p>

                <p>
                    <a href="{verification_url}">
                        ユーザー登録確認はこちら
                    </a>
                </p>

                <p>
                    URLの有効期限：
                    <strong>
                    {jst_expires_at.strftime("%Y/%m/%d %H:%M")}
                    </strong>
                </p>

                <hr>

                <h3>【重要】手続きに関する注意事項</h3>

                <p>
                    本人確認およびパスワード変更の手続きは、
                    パスワードリセットを申請した際と同じ端末・
                    同じブラウザで実施してください。
                </p>

                <p>
                    異なる端末やブラウザで操作した場合、
                    正常に手続きが完了しないことがあります。
                </p>

                <hr>

                <p>
                    ユーザー登録確認が完了しましたら、
                    運営より申請者宛てに改めてメールを送信いたします。
                </p>

                <p>
                    このメールに心当たりがない場合は破棄してください。<br>
                    このメールアドレスは送信専用です。<br>
                    返信しないでください。
                </p>
            """
        }
    )

    response.raise_for_status()

    return response.json()
