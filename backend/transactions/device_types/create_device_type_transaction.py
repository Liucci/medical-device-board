from device_types.add_device_type import add_device_type
from schemas.device_type_schemas import (AddDeviceTypeRequest)
from device_types.fetch_device_type import get_max_device_type_display_order
from supabase import Client

def create_device_type_transaction(
                                    client:Client,
                                    device_type:AddDeviceTypeRequest,
                                    hospital_id:str
                                  ):

    print("create_device_type_transaction")
    # 最後の順番を取得し、その次の順番を設定
    display_order = get_max_device_type_display_order(
                                                      client,
                                                      hospital_id
                                                  ) + 1

    add_device_type(
                    client, 
                    device_type,
                    hospital_id,
                    display_order=display_order
                    )