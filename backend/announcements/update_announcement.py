from common.supabase_admin_client import supabase

from schemas.announcement_schemas import UpdateAnnouncementCRUDRequest


def update_announcement(
    request: UpdateAnnouncementCRUDRequest
):
    print("update_announcement")

    response = (
        supabase
            .table("announcements")
            .update(
                {
                    "message": request.message,
                    "start_at": request.start_at,
                    "end_at": request.end_at,
                    "is_active": request.is_active
                }
            )
            .eq("id", request.id)
            .execute()
    )

    return response.data[0]