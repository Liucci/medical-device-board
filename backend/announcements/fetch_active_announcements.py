from datetime import datetime, timezone

from common.supabase_admin_client import supabase
from schemas.announcement_schemas import FetchActiveAnnouncementsRequest, FetchActiveAnnouncementsResponse


def fetch_active_announcements(
                                request: FetchActiveAnnouncementsRequest
                            ) -> list[FetchActiveAnnouncementsResponse]:

    print("fetch_active_announcements")

    now = datetime.now(timezone.utc).isoformat()

    response = (
                    supabase
                    .table("announcements")
                    .select("""
                                id,
                                message,
                                start_at,
                                end_at,
                                announcement_hospitals!inner(
                                    hospital_id
                                )
                            """)
                    .eq("announcement_hospitals.hospital_id", request.hospital_id)
                    .eq("is_active", True)
                    .lte("start_at", now)
                    .gte("end_at", now)
                    .order("start_at")
                    .execute()
                )
    print("active_announcements:",response.data)
    return [
                FetchActiveAnnouncementsResponse(
                                                    id=row["id"],
                                                    message=row["message"],
                                                    start_at=row["start_at"],
                                                    end_at=row["end_at"]
                                                )
                for row in response.data
            ]