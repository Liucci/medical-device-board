from supabase import Client


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