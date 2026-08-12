import os
import time

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
    print("start get_auth_client")

    start = time.perf_counter()

    client = create_client(url, key, options)

    print(
        f"create_client: {time.perf_counter() - start:.6f}s"
    )


    """
        for i in range(3):
            start = time.perf_counter()

            client.postgrest.auth(access_token)

            print(
                i,
                time.perf_counter() - start
            )
    """       
    print("before postgrest.auth")
    # PostgRESTへJWTを設定（RLS用）
    start = time.perf_counter()
    client.postgrest.auth(access_token)
    elapsed = time.perf_counter() - start

    print(f"postgrest.auth: {elapsed:.6f}s")
    print("end get_auth_client")
    return client