#複数のtableにまたぐschema

class CreateInspectionChecklistTransactionRequest(BaseModel):
    inspection_type_id: int
    device_type_id: int
    device_model_id: int | None
    name: str

    display_order: int
    item_name: str
    item_type_id: int
    required: bool
    default_value: str | None
    options: list[str] | None
    unit: str | None