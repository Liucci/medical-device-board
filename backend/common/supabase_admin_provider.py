import os
from dotenv import load_dotenv
from supabase import create_client, ClientOptions

load_dotenv()

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

options = ClientOptions(
    auto_refresh_token=False,
    persist_session=False,
)

_admin_client = create_client(url, key, options)

CLIENT_NAME = "[admin_client]"


def get_admin_client():
    return _admin_client