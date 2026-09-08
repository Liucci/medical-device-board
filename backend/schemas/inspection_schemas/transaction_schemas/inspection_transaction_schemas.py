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
#点検結果を保存するとき用
class CreateInspectionTransactionRequest(BaseModel):
    inspection: AddInspectionRequest
    results: list[AddInspectionResultRequest]

#点検結果内の各idをもとに他tableから情報取得し加工しfrontに点検結果として表示させる
#checklist_idをもたせてresult tableと紐づけ
class InspectionListResponse(BaseModel):
    id: int
    checklist_id:int
    created_at: str
    inspection_type_name: str
    device_type_name: str
    device_model_name: str
    management_number: str | None
    serial_number: str | None
    ward_name: str
    room_name: str
    performed_by_name: str
    comment: str | None
    overall_result: str | None

#result内のitem id,category idをもとに他tableから情報取得し加工しfrontに点検結果として表示させる
class InspectionResultDetailResponse(BaseModel):
    category_name: str
    category_display_order: int
    item_name: str
    unit: str | None
    item_display_order: int
    value: str | None