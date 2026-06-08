from common.supabase_client import supabase
from devices.update_note import update_note
from schemas.device_schemas import UpdateNoteRequest

def update_note_transaction(
                              device: UpdateNoteRequest,
                              hospital_id: str,
                              user_id: str,
                              action_type: str,
                              message: str
                           ):

    print("update_note_transaction")

    updated_device = update_note(
                                  device=device,
                                  hospital_id=hospital_id
                                )

    supabase.table("device_histories").insert({
                                                "hospital_id": hospital_id,
                                                "device_id": device.id,
                                                "action_by": user_id,
                                                "action_type": action_type,
                                                "message": message,
                                                "note": device.note
                                              }).execute()

    return updated_device