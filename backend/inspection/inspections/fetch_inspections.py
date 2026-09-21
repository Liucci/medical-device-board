from supabase import Client
from datetime import datetime, timezone

def fetch_inspections(
    client: Client,
    hospital_id: str
):
    print("fetch_inspections")

    response = (
        client
        .table("inspections")
        .select("*")
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data


def fetch_inspection(
    client: Client,
    inspection_id: int,
    hospital_id: str
):
    print("fetch_inspection")

    response = (
        client
        .table("inspections")
        .select("*")
        .eq("id", inspection_id)
        .eq("hospital_id", hospital_id)
        .single()
        .execute()
    )

    return response.data


#複数のinspection idから情報を取得するとき
def fetch_inspections_by_ids(
    client: Client,
    inspection_ids: list[int],
    hospital_id: str
):

    print("fetch_inspections_by_ids")

    response = (
        client
        .table("inspections")
        .select("*")
        .in_("id", inspection_ids)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data


#件数指定でinspection情報を取得する
def fetch_inspections_by_limit(
    client: Client,
    device_id: int,
    checklist_id: int,
    hospital_id: str,
    limit: int,
):
    print("fetch_inspections_by_limit")

    response = (
        client
        .table("inspections")
        .select("*")
        .eq("hospital_id", hospital_id)
        .eq("device_id", device_id)
        .eq("checklist_id", checklist_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )

    return response.data


#当日実施したinspection情報を取得する
def fetch_today_inspections(client: Client, hospital_id: str):
    print("fetch_today_inspections")

    now = datetime.now(timezone.utc)
    start_at = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_at = start_at.replace(day=start_at.day + 1)

    response = (
        client.table("inspections")
        .select("device_id, created_at")
        .eq("hospital_id", hospital_id)
        .gte("created_at", start_at.isoformat())
        .lt("created_at", end_at.isoformat())
        .execute()
    )

    return response.data