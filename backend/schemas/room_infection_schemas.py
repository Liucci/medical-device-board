from pydantic import BaseModel


# Room Infection Response
#DB→back
class RoomInfectionResponse(BaseModel):
    id: int
    hospital_id: str
    room_id: int
    infection_type_id: int


#back→DB
# Create
class AddRoomInfectionRequest(BaseModel):
    room_id: int
    infection_type_id: int

# Delete
class DeleteRoomInfectionsRequest(BaseModel):
    ids: list[int]