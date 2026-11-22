
import base64
import json
from datetime import datetime, timezone


def check_access_token_expired(access_token: str) -> bool:
    # JWTのPayloadを取得
    payload = access_token.split(".")[1]

    # Base64URLのPaddingを補完
    payload += "=" * (-len(payload) % 4)

    decoded_payload = base64.urlsafe_b64decode(payload)
    payload_data = json.loads(decoded_payload)

    # 有効期限を取得
    exp = payload_data.get("exp")

    if exp is None:
        raise ValueError("Access Token expiration not found")

    # 現在時刻と比較
    return datetime.now(timezone.utc).timestamp() >= exp
