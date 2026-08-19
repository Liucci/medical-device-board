from supabase import Client


def fetch_announcement_hospitals(
                                client:Client,
                                announcement_id: int
):
    print("fetch_announcement_hospitals")

    response = (
        client
            .table("announcement_hospitals")
            .select("hospital_id")
            .eq("announcement_id", announcement_id)
            .execute()
    )

    return response.data