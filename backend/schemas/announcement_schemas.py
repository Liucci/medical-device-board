from datetime import datetime
from pydantic import BaseModel

#DBからback
class AnnouncementResponse(BaseModel):
    id: int
    hospital_id: str | None
    message: str
    start_at: datetime
    end_at: datetime
    is_active: bool
    updated_at: datetime

#backからDB
class CreateAnnouncementRequest(BaseModel):
    hospital_id: str | None
    message: str
    start_at: datetime
    end_at: datetime

#backからDB
class UpdateAnnouncementRequest(BaseModel):
    
    hospital_id: str | None
    message: str
    start_at: datetime
    end_at: datetime
    is_active: bool