from pydantic import BaseModel


class AddUserRequest(
    BaseModel
):

    hospital_id: str

    email: str

    display_name: str

    role: str

    is_active: bool