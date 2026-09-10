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
#frontからFAST apiを叩くときに送られるjsonの型定義
class CreateInspectionTransactionRequest(BaseModel):
    inspection: AddInspectionRequest
    results: list[AddInspectionResultRequest]

#点検結果内の各idをもとに他tableから情報取得し加工しfrontに点検結果として表示させる

class InspectionListResponse(BaseModel):
    id: int
    created_at: str
    inspection_type_name: str
    checklist_name: str
    device_type_name: str
    device_model_name: str
    management_number: str | None
    serial_number: str | None
    ward_name: str | None
    room_name: str | None
    patient_name: str | None
    performed_by_name: str | None
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


#frontから受け取ったAddInspectionRequestをDBのcolumnに合わせて加工後inspection tableに保存する用
#backendとDB間だけの型定義なのでこのschemaのtypr,mapperは不要
class AddInspectionSnapshotRequest(BaseModel):
    device_type_name: str
    device_model_name: str
    management_number: str | None = None
    serial_number: str | None = None
    ward_name: str | None = None
    room_name: str | None = None
    patient_name: str | None = None
    inspection_type_name: str
    checklist_name: str
    overall_result: str | None = None
    comment: str | None = None

class AddInspectionResultSnapshotRequest(BaseModel):
    inspection_id: int
    category_name: str
    category_display_order: int
    item_name: str
    item_display_order: int
    unit: str | None = None
    value: str | None = None