from common.supabase_admin_client import supabase
from supabase import Client
from schemas.inspection_schemas.inspection_result_schemas import (
    DeleteInspectionResultsRequest
)


def delete_inspection_results(
    client: Client,
    inspection_results: DeleteInspectionResultsRequest
):
    print("delete_inspection_results")

    (
        client
        .table("inspection_results")
        .delete()
        .in_("id", inspection_results.ids)
        .execute()
    )