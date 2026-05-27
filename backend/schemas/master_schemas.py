from pydantic import BaseModel


class AddDeviceTypeRequest(BaseModel):

    hospital_id: str

    name: str


class AddDeviceModelRequest(BaseModel):

    hospital_id: str

    device_type_id: int | None = None

    name: str