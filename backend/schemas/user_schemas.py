from pydantic import BaseModel


class AddUserRequest(BaseModel):

    id:str
    hospital_id:str
    email:str
    display_name:str
    role:str
    is_active:bool

class UserResponse(BaseModel):
    id:str
    email:str
    display_name:str
    role:str
    hospital_id:str
    hospital_name:str
    is_active:bool