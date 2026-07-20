from announcements.fetch_active_announcements import fetch_active_announcements
from schemas.announcement_schemas import FetchActiveAnnouncementsRequest, FetchActiveAnnouncementsResponse


def fetch_active_announcements_transaction(
                                            request: FetchActiveAnnouncementsRequest
                                        ) -> list[FetchActiveAnnouncementsResponse]:
    print("fetch_active_announcements_transaction")

    return fetch_active_announcements(
                                        request
                                    )