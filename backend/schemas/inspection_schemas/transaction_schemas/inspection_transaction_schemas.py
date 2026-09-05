from pydantic import BaseModel

from schemas.inspection_schemas.inspection_schemas import (
    AddInspectionRequest
)

from schemas.inspection_schemas.inspection_result_schemas import (
    AddInspectionResultRequest
)

""" 
performed_by → 含めない
created_at → 含めない
inspection_id → 含めない
 """

class CreateInspectionTransactionRequest(BaseModel):
    inspection: AddInspectionRequest
    results: list[AddInspectionResultRequest]