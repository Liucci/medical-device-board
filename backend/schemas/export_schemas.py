from pydantic import BaseModel


class HistoryExportRow(BaseModel):

    created_at: str

    device_id: int

    device_type_name: str | None = None

    device_model_name: str | None = None

    action_type: str

    maintenance_started_at: str | None = None

    maintenance_finished_at: str | None = None

    location_name: str | None = None

    patient_name: str | None = None

    message: str | None = None


class ExportHistoryPdfRequest(BaseModel):

    rows: list[HistoryExportRow]