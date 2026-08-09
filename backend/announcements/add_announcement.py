from supabase import Client
from datetime import datetime, timezone
from schemas.announcement_schemas import AddAnnouncementCRUDRequest


def add_announcement(
                    client:Client,
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
        client
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
    return response.data[0]