from supabase import Client


def delete_announcement_hospitals(
                                client:Client,
                                announcement_id: int
):
    print("delete_announcement_hospitals")

    (
        client
            .table("announcement_hospitals")
            .delete()
            .eq("announcement_id", announcement_id)
            .execute()
    )