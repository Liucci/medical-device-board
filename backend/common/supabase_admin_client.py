import os
from dotenv import load_dotenv
from supabase import (create_client,ClientOptions)

print("supabase_admin_client")

#supabase service keyで認証させるために必要
load_dotenv()
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

options = ClientOptions(
    auto_refresh_token=False,
    persist_session=False
)


supabase = create_client(url,key,options)
CLIENT_NAME = "[admin_client]"

# print("URL =", url)
# print("SERVICE KEY PREFIX =", key[:20], "...", key[-20:])
# print("admin client =", id(supabase))
# print("admin headers =", supabase.postgrest.headers)