import os
import requests
from schemas.invite_schemas import (SendInviteMailRequest)


print("RESEND =", os.getenv("RESEND_API_KEY"))
def send_invite_mail(
                        invite:SendInviteMailRequest
                    ):

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
                                        <p>以下のリンクから登録してください</p>
                                        <p><a href="{invite.invite_url}">登録する</a></p>
                                        <p>{invite.invite_url}</p>
                                        """
                                     }
                            )


    print("RESEND_API_KEY =", resend_api_key)
    print("status =", response.status_code)
    print("body =", response.text)

    response.raise_for_status()

    return response.json()