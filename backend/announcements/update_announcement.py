from common.supabase_admin_client import supabase
from datetime import datetime, timezone
from schemas.announcement_schemas import UpdateAnnouncementCRUDRequest


def update_announcement(
    request: UpdateAnnouncementCRUDRequest
):
    print("update_announcement")

    start_at = (
                datetime
                .fromisoformat(request.start_at)
                .astimezone(timezone.utc)
                .isoformat()
            )

    end_at = (
                datetime
                .fromisoformat(request.end_at)
                .astimezone(timezone.utc)
                .isoformat()
            )


    response = (
        supabase
            .table("announcements")
            .update(
                {
                    "message": request.message,
                    "start_at": start_at,
                    "end_at": end_at,
                    "is_active": request.is_active
                }
            )
            .eq("id", request.id)
            .execute()
    )

    return response.data[0]