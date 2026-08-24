from announcements.fetch_announcements import fetch_announcements

from supabase import Client



def fetch_announcements_transaction(client:Client,):
    print("fetch_announcements_transaction")

    announcements = fetch_announcements(client, )

    for announcement in announcements:

        announcement["hospital_ids"] = [
            hospital["hospital_id"]
            for hospital in announcement["announcement_hospitals"]
        ]

        del announcement["announcement_hospitals"]

    return announcements