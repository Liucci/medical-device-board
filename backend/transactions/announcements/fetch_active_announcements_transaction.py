from announcements.fetch_active_announcements import fetch_active_announcements
from schemas.announcement_schemas import FetchActiveAnnouncementsResponse
from supabase import Client


def fetch_active_announcements_transaction(
                                            client:Client,
                                            hospital_id: str,
                                        ) -> list[FetchActiveAnnouncementsResponse]:
    print("fetch_active_announcements_transaction")

    return fetch_active_announcements(
                                        client,
                                        hospital_id
                                    )