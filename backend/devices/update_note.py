from common.supabase_admin_client import supabase
from schemas.device_schemas import UpdateNoteRequest
from datetime import datetime, timezone
def update_note(
                 device: UpdateNoteRequest,
                 hospital_id: str,
                 user_id:str
               ):

    print("update_note")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "note": device.note,
                              "updated_by": user_id,
                              "updated_at": datetime.now(timezone.utc).isoformat()
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]