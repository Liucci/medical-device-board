import os

from dotenv import load_dotenv
from supabase import Client, ClientOptions, create_client

load_dotenv()

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

options = ClientOptions(
    auto_refresh_token=False,
    persist_session=False,
)

CLIENT_NAME = "[auth_client]"


def get_auth_client(access_token: str) -> Client:
    """
    JWT付きのSupabase Clientを生成する。
    RLS(auth.uid())を有効にするため、
    リクエスト毎に新しいClientを生成する。
    """

    client = create_client(
        url,
        key,
        options,
    )

    # PostgRESTへJWTを設定（RLS用）
    client.postgrest.auth(access_token)

    return client