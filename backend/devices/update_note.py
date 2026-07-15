from common.supabase_admin_client import supabase
from schemas.device_schemas import UpdateNoteRequest

def update_note(
                 device: UpdateNoteRequest,
                 hospital_id: str
               ):

    print("update_note")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "note": device.note
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]