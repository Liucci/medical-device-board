from common.supabase_admin_client import supabase


def add_announcement_hospital(
    announcement_id: int,
    hospital_id: str
):
    print("add_announcement_hospital")

    response = (
        supabase
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