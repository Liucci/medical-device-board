from supabase import Client
from schemas.inspection_schemas.inspection_schemas import (AddInspectionRequest)
from schemas.inspection_schemas.inspection_result_schemas import (AddInspectionResultRequest)
from inspection.inspections.add_inspection import (add_inspection)
from inspection.inspection_results.add_inspection_result import (add_inspection_result)


def create_inspection_transaction(
    client: Client,
    inspection: AddInspectionRequest,
    results: list[AddInspectionResultRequest],
    hospital_id: str,
    user_id: str
):
    print("create_inspection_transaction")

    inspection_response = add_inspection(
        client=client,
        inspection=inspection,
        hospital_id=hospital_id,
        performed_by=user_id
    )

    inspection_id = inspection_response["id"]

    for result in results:
        add_inspection_result(
            client=client,
            inspection_result=result,
            inspection_id=inspection_id
        )

    return inspection_response