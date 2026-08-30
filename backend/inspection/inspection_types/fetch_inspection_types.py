from supabase import Client

#自組織用点検表と共通点検表を取得する関数
def fetch_inspection_types(
    client: Client,
    hospital_id: str
):
    print("fetch_inspection_types")
    response = (
        client
        .table("inspection_types")
        .select("*")
        .or_(
            f"hospital_id.eq.{hospital_id},hospital_id.is.null"
        )
        .execute()
    )
    return response.data

def fetch_inspection_type(
    client: Client,
    inspection_type_id: int
):
    print("fetch_inspection_type")
    response = (
        client
        .table("inspection_types")
        .select("*")
        .eq("id", inspection_type_id)
        .single()
        .execute()
    )
    return response.data