from common.supabase_admin_client import supabase

from schemas.announcement_schemas import AddAnnouncementCRUDRequest


def add_announcement(
    request: AddAnnouncementCRUDRequest
):
    print("add_announcement")

    response = (
        supabase
            .table("announcements")
            .insert(
                {
                    "message": request.message,
                    "start_at": request.start_at,
                    "end_at": request.end_at
                }
            )
            .execute()
    )

    return response.data[0]