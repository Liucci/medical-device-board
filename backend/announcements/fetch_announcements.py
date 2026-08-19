from supabase import Client


def fetch_announcements( client:Client,):
    print("fetch_announcements")

    response = (
        client
            .table("announcements")
            .select("""
                        *,
                        announcement_hospitals(hospital_id)
                    """)            
            .order("created_at", desc=True)
            .execute()
    )

    return response.data