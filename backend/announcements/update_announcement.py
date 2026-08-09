from supabase import Client
from datetime import datetime, timezone
from schemas.announcement_schemas import UpdateAnnouncementCRUDRequest


def update_announcement(
                        client:Client,
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
        client
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