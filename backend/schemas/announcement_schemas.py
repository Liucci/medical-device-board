from pydantic import BaseModel


# =========================
# Response
# =========================

class AnnouncementResponse(BaseModel):
    id: int
    hospital_ids: list[str]
    message: str
    start_at: str
    end_at: str
    is_active: bool
    created_at: str
    updated_at: str


# =========================
# API Request
# =========================

class AddAnnouncementRequest(BaseModel):
    hospital_ids: list[str]
    message: str
    start_at: str
    end_at: str


class UpdateAnnouncementRequest(BaseModel):
    id: int
    hospital_ids: list[str]
    message: str | None = None
    start_at: str | None = None
    end_at: str | None = None
    is_active: bool | None = None


# =========================
# CRUD
# =========================

class AddAnnouncementCRUDRequest(BaseModel):
    message: str
    start_at: str
    end_at: str


class UpdateAnnouncementCRUDRequest(BaseModel):
    id: int
    message: str | None = None
    start_at: str | None = None
    end_at: str | None = None
    is_active: bool | None = None


#dashboard表示専用
class FetchActiveAnnouncementsRequest(BaseModel):
    hospital_id: str


class FetchActiveAnnouncementsResponse(BaseModel):
    id: int
    message: str
    start_at: str
    end_at: str