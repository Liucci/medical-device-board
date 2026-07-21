from common.supabase_admin_client import supabase


def delete_announcement_hospitals(
    announcement_id: int
):
    print("delete_announcement_hospitals")

    (
        supabase
            .table("announcement_hospitals")
            .delete()
            .eq("announcement_id", announcement_id)
            .execute()
    )