from common.supabase_admin_client import supabase


def fetch_announcement_hospitals(
    announcement_id: int
):
    print("fetch_announcement_hospitals")

    response = (
        supabase
            .table("announcement_hospitals")
            .select("hospital_id")
            .eq("announcement_id", announcement_id)
            .execute()
    )

    return response.data