from announcements.update_announcement import update_announcement
from announcement_hospitals.delete_announcement_hospitals import (delete_announcement_hospitals)
from announcement_hospitals.add_announcement_hospitals import (add_announcement_hospital)
from schemas.announcement_schemas import (UpdateAnnouncementRequest,UpdateAnnouncementCRUDRequest)
from supabase import Client

def update_announcement_transaction(
                                    client:Client,
                                    request: UpdateAnnouncementRequest
                                    ):
    print("update_announcement_transaction")
    update_announcement(client, 
                        UpdateAnnouncementCRUDRequest(
                                                        id=request.id,
                                                        message=request.message,
                                                        start_at=request.start_at,
                                                        end_at=request.end_at,
                                                        is_active=request.is_active
                                                    )
    )

    delete_announcement_hospitals(
                                client, 
                                request.id
                                )
    hospital_ids = request.hospital_ids
    for hospital_id in hospital_ids:
                                    add_announcement_hospital(
                                                                client, 
                                                                request.id,
                                                                hospital_id
                                                            )