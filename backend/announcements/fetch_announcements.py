from common.supabase_admin_client import supabase


def fetch_announcements():
    print("fetch_announcements")

    response = (
        supabase
            .table("announcements")
            .select("*")
            .order("created_at", desc=True)
            .execute()
    )

    return response.data