import os
from dotenv import load_dotenv
from supabase import create_client, ClientOptions

print("supabase_auth_client")

#supabase 一般ユーザーANON Keyで認証させるために必要
load_dotenv()

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

options = ClientOptions(
                        auto_refresh_token=False,
                        persist_session=False
)

supabase_auth = create_client(
                                url,
                                key,
                                options
)

# print("URL =", url)
# print("ANON KEY PREFIX =", key[:20], "...", key[-20:])
# print("auth client =", id(supabase_auth))
# print("auth headers =", supabase_auth.postgrest.headers)