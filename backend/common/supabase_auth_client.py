import os

from dotenv import load_dotenv
from supabase import create_client, ClientOptions


#supabase 一般ユーザーANON Keyで認証させるために必要
load_dotenv()

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

options = ClientOptions(
    auto_refresh_token=True
)

supabase_auth = create_client(
    url,
    key,
    options
)