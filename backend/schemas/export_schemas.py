from pydantic import BaseModel


class HistoryExportRow(BaseModel):
    created_at: str
    device_id: int
    device_type_name: str | None = None
    device_model_name: str | None = None
    action_type: str
    maintenance_started_at: str | None = None
    maintenance_finished_at: str | None = None
    room_name: str | None = None
    stock_area_name: str | None = None
    patient_name: str | None = None
    message: str | None = None


class ExportHistoryPdfRequest(BaseModel):
    rows: list[HistoryExportRow]




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