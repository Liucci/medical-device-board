from pydantic import BaseModel, ConfigDict
from supabase import Client

class BackendSession(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    user_id: str
    hospital_id: str
    hospital_name: str
    #price_plan: str
    role: str
    email: str
    display_name: str
    access_token: str
    refresh_token: str

    client: Client

class CurrentUserResponse(BaseModel):
    id: str
    hospital_id: str
    hospital_name: str
    #price_plan: str
    role: str
    email: str
    display_name: str