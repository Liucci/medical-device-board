from common.supabase_admin_client import supabase
from datetime import datetime, timezone
from schemas.announcement_schemas import AddAnnouncementCRUDRequest


def add_announcement(
    request: AddAnnouncementCRUDRequest
):
    print("add_announcement")
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
            .insert(
                {
                    "message": request.message,
                    "start_at": start_at,
                    "end_at": end_at
                }
            )
            .execute()
    )
    print(request.start_at)
    print(start_at)
    return response.data[0]