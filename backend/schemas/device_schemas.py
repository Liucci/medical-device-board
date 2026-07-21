from pydantic import BaseModel


# =========================
# Response
# =========================

class DeviceResponse(BaseModel):
    id: int
    hospital_id: str
    type: int
    model: int
    asset_type: str
    status: str
    stock_area_id: int | None = None
    room_id: int | None = None
    management_number: str | None = None
    serial_number: str | None = None
    note: str | None = None
    rental_start_date: str | None = None
    rental_end_date: str | None = None
    is_under_maintenance: bool
    maintenance_started_at: str | None = None
    maintenance_finished_at: str | None = None
    standby: bool
    standby_started_at: str | None = None
    standby_finished_at: str | None = None
    created_by: str | None = None
    updated_by: str | None = None


# =========================
# Create
# =========================

class AddDeviceRequest(BaseModel):
    #id自動付与
    #hospital_idはback付与
    type: int
    model: int
    asset_type: str
    stock_area_id:int
    rental_start_date: str | None = None
    rental_end_date: str | None = None
    quantity: int = 1

# =========================
# Delete
# =========================

class DeleteDeviceRequest(BaseModel):
    id:int

# =========================
# Basic Info Update
# =========================


class UpdateManagementNumberRequest(BaseModel):
    id: int
    management_number: str | None = None

class UpdateSerialNumberRequest(BaseModel):
    id: int
    serial_number: str | None = None

class UpdateNoteRequest(BaseModel):
    id: int
    note: str | None = None


# =========================
# Move Device
# =========================

class MoveDeviceRequest(BaseModel):
    id: int
    stock_area_id: int | None = None
    room_id: int | None = None
    

# =========================
# Maintenance
# =========================

class StartMaintenanceRequest(BaseModel):
    id: int

class FinishMaintenanceRequest(BaseModel):
    id: int
#保守開始日だけ編集できる。終了日の編集機能は不要
class UpdateMaintenanceDatesRequest(BaseModel):
    id: int
    maintenance_started_at: str | None = None
    #maintenance_finished_at: str | None = None

# =========================
# Standby
# =========================

class StartStandbyRequest(BaseModel):
    id: int

class FinishStandbyRequest(BaseModel):
    id: int


class UpdateDeviceRentalDatesRequest(BaseModel):
    id: int
    rental_start_date: str | None = None
    rental_end_date: str | None = None


# =========================
# task
# =========================
#maintenance tasks table更新でdevice tableのupdate atのみを更新する用
class UpdateDeviceUpdateAtRequest(BaseModel):
    id: int

