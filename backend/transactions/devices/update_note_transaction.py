from common.supabase_admin_client import supabase
from devices.update_note import update_note
from schemas.device_schemas import UpdateNoteRequest
from transactions.histories.create_device_history import (create_device_history)

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
                                  hospital_id=hospital_id,
                                  user_id=user_id
                                )

    create_device_history(
                        device_id=device.id,
                        hospital_id=hospital_id,
                        action_by=user_id,
                        action_type=action_type,
                        message=message
                     )
    return updated_device