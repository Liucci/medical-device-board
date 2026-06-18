import os
import requests
from datetime import datetime
from schemas.invite_schemas import (SendInviteMailRequest)


def send_invite_mail(
                        invite:SendInviteMailRequest
                    ):
    
    print("send_invite_mail")
    expires_at = datetime.fromisoformat(
                                        invite.expires_at
                                        )
    resend_api_key = os.getenv("RESEND_API_KEY")
    print(resend_api_key)
    response = requests.post(
                                "https://api.resend.com/emails",
                                headers={
                                            "Authorization":f"Bearer {resend_api_key}",
                                            "Content-Type":"application/json"
                                        },
                                json={
                                    "from":"Devix <invite@devix.jp>",
                                    "to":[invite.email],
                                    "subject":"医療機器管理システム招待",
                                    "html":f"""
                                        <h2>招待メール</h2>

                                        <p>
                                        医療機器管理システムへの招待を受けています。
                                        </p>

                                        <p>
                                        以下のリンクからユーザー登録を行ってください。
                                        </p>

                                        <p>
                                            <a href="{invite.invite_url}">
                                                登録する
                                            </a>
                                        </p>

                                        <p>
                                            {invite.invite_url}
                                        </p>

                                        <hr>

                                        <p>
                                            招待コード有効期限
                                        </p>

                                        <p>
                                            <strong>
                                                {expires_at.strftime("%Y/%m/%d %H:%M")}
                                            </strong>
                                        </p>

                                        <p>
                                            期限切れの場合は管理者へ再発行をご依頼ください。
                                        </p>
                                    """
                                }
                                                            
    )


    print("RESEND_API_KEY =", resend_api_key)
    print("status =", response.status_code)
    print("body =", response.text)

    response.raise_for_status()

    return response.json()