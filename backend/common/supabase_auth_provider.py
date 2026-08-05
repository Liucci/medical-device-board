import os
from dotenv import load_dotenv
from supabase import create_client, ClientOptions

load_dotenv()

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

options = ClientOptions(
    auto_refresh_token=False,
    persist_session=False,
)

_auth_client = create_client(url, key, options)

CLIENT_NAME = "[auth_client]"


def get_auth_client():
    return _auth_client