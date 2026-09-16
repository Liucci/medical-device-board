from supabase import Client
from schemas.inspection_schemas.inspection_type_schemas import AddInspectionTypeRequest

#引数にhospital idをもたせてそれをinsertする
def add_inspection_type(
    client: Client,
    inspection_type: AddInspectionTypeRequest,
    hospital_id: str
):
    print("add_inspection_type")
    response = (
        client
        .table("inspection_types")
        .insert({
            "hospital_id": hospital_id,
            "name": inspection_type.name
        })
        .select("*")
        .execute()
    )
    return response.data[0]