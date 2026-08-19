from announcements.add_announcement import add_announcement

from announcement_hospitals.add_announcement_hospitals import (
    add_announcement_hospital
)

from schemas.announcement_schemas import (
    AddAnnouncementRequest,
    AddAnnouncementCRUDRequest
)
from supabase import Client


def create_announcement_transaction(
                                    client:Client,
                                    request: AddAnnouncementRequest
                                    ):
    print("create_announcement_transaction")

    announcement = add_announcement(
                                    client, 
                                    AddAnnouncementCRUDRequest(
                                        message=request.message,
                                        start_at=request.start_at,
                                        end_at=request.end_at
                                    )
                                )

    for hospital_id in request.hospital_ids:
        add_announcement_hospital(
                                    client, 
                                    announcement["id"],
                                    hospital_id
                                )

    return announcement