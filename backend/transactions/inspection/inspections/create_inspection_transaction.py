from supabase import Client

from schemas.inspection_schemas.inspection_schemas import (
    AddInspectionRequest
)
from schemas.inspection_schemas.inspection_result_schemas import (
    AddInspectionResultRequest
)

from inspection.inspections.add_inspection import add_inspection
from inspection.inspection_results.add_inspection_result import (
    add_inspection_result
)


def create_inspection_transaction(
    client: Client,
    inspection: AddInspectionRequest,
    results: list[AddInspectionResultRequest],
    hospital_id: str,
    performed_by: str
):
    print("create_inspection_transaction")

    inspection_data = add_inspection(
        client,
        inspection,
        hospital_id,
        performed_by
    )

    inspection_id = inspection_data["id"]

    for result in results:
        add_inspection_result(
            client,
            result,
            inspection_id
        )

    return inspection_data