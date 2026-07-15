import os
from dotenv import load_dotenv
from supabase import (create_client,ClientOptions)


#supabase service keyで認証させるために必要
load_dotenv()
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

options = ClientOptions(
    auto_refresh_token=False
)


supabase = create_client(url,key,options)