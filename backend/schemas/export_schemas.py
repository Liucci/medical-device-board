from pydantic import BaseModel


class HistoryExportRow(BaseModel):
    created_at: str
    device_id: int
    device_type_name: str | None = None
    device_model_name: str | None = None
    action_type: str
    action_by_name: str | None = None
    maintenance_started_at: str | None = None
    maintenance_finished_at: str | None = None
    room_name: str | None = None
    stock_area_name: str | None = None
    patient_name: str | None = None
    message: str | None = None


class ExportHistoryPdfRequest(BaseModel):
    rows: list[HistoryExportRow]
    show_patient_name: bool




#deviceList表示用
class DeviceListExportSchema(BaseModel):
    status: str

    is_under_maintenance: bool
    standby: bool

    ward_name: str | None = None
    room_name: str | None = None
    stock_area_name: str | None = None

    patient_name: str | None = None

    device_type_name: str | None = None
    device_model_name: str | None = None

    management_number: str | None = None
    serial_number: str | None = None
    note: str | None = None

    maintenance_name: str | None = None
    due_at: str | None = None
class DeviceListExportSchemaRequest(BaseModel):
    rows: list[DeviceListExportSchema]
    show_patient_name: bool

class InspectionResultExportRow(BaseModel):
    item_name: str
    value: str | None = None


class InspectionExportInspectionRow(BaseModel):
    created_at: str
    performed_by_name: str | None = None
    results: list[InspectionResultExportRow]


class InspectionExportRow(BaseModel):
    management_number: str | None = None
    serial_number: str | None = None
    device_type_name: str | None = None
    device_model_name: str | None = None
    inspection_type_name: str | None = None
    checklist_name: str | None = None
    inspections: list[InspectionExportInspectionRow]


class ExportInspectionPdfRequest(BaseModel):
    rows: list[InspectionExportRow]