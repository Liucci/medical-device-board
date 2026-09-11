from supabase import Client


def fetch_inspection_checklists(
    client: Client,
    hospital_id: str
):
    print("fetch_inspection_checklists")

    response = (
        client
        .table("inspection_checklists")
        .select("*")
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data


def fetch_inspection_checklist(
    client: Client,
    inspection_checklist_id: int,
    hospital_id: str
):
    print("fetch_inspection_checklist")

    response = (
        client
        .table("inspection_checklists")
        .select("*")
        .eq("id", inspection_checklist_id)
        .eq("hospital_id", hospital_id)
        .single()
        .execute()
    )

    return response.data

#device type idを条件にchecklistを取得する
def fetch_inspection_checklists_by_device_type_id(
                                                    client: Client,
                                                    device_type_id: int,
                                                    hospital_id: str
                                                  ):
    print("fetch_inspection_checklists_by_device_type_id")

    response = (
        client
        .table("inspection_checklists")
        .select("id")
        .eq("device_type_id", device_type_id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data

#device model idを条件にchecklistを取得する
def fetch_inspection_checklists_by_device_model_ids(
                                                    client: Client,
                                                    device_model_ids: list[int],
                                                    hospital_id: str
                                                  ):
    print("fetch_inspection_checklists_by_device_model_ids")

    response = (
        client
        .table("inspection_checklists")
        .select("id")
        .in_("device_model_id", device_model_ids)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data