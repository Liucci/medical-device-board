from pydantic import BaseModel

class UserResponse(BaseModel):
    id: str
    hospital_id: str
    email: str
    display_name: str
    role: str
    is_active: bool
    created_at: str
    updated_at: str


class AddUserRequest(BaseModel):
    id: str
    hospital_id: str
    email: str
    display_name: str
    role: str
    is_active: bool


class UpdateUserRequest(BaseModel):
    id: str
    role: str
    is_active: bool

#fetch current user専用
class FetchCurrentUserResponse(BaseModel):
    id:str
    email:str
    display_name:str
    role:str
    hospital_id:str
    hospital_name:str
    is_active:bool

class UserManagementResponse(BaseModel):
    id: str
    hospital_name: str
    email: str
    display_name: str
    role: str
    is_active: bool
    created_at: str
    updated_at: str