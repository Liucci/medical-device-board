from announcements.update_announcement import update_announcement

from announcement_hospitals.delete_announcement_hospitals import (
    delete_announcement_hospitals
)

from announcement_hospitals.add_announcement_hospitals import (
    add_announcement_hospital
)

from schemas.announcement_schemas import (
    UpdateAnnouncementRequest,
    UpdateAnnouncementCRUDRequest
)


def update_announcement_transaction(
    request: UpdateAnnouncementRequest
):
    print("update_announcement_transaction")

    update_announcement(
        UpdateAnnouncementCRUDRequest(
            id=request.id,
            message=request.message,
            start_at=request.start_at,
            end_at=request.end_at,
            is_active=request.is_active
        )
    )

    delete_announcement_hospitals(
        request.id
    )

    for hospital_id in request.hospital_ids:

        add_announcement_hospital(
            request.id,
            hospital_id
        )