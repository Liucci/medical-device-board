# fetch_maintenance_tasks.py

from common.supabase_client import (
    supabase
)


def fetch_maintenance_tasks(
    hospital_id: str
):
    try:

        response = (
            supabase
            .table(
                "device_maintenance_tasks"
            )
            .select("*")
            .eq(
                "hospital_id",
                hospital_id
            )
            .execute()
        )

        return response.data

    except Exception as e:

        print(
            f"fetch_maintenance_tasks "
            f"error: {e}"
        )

        return []