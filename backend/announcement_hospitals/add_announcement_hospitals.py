from supabase import Client


def add_announcement_hospital(
                                client:Client,
                                announcement_id: int,
                                hospital_id: str
                            ):
    print("add_announcement_hospital")

    response = (
        client
            .table("announcement_hospitals")
            .insert(
                {
                    "announcement_id": announcement_id,
                    "hospital_id": hospital_id
                }
            )
            .execute()
    )

    return response.data[0]