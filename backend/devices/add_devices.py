from common.supabase_client import (supabase)
from schemas.device_schemas import (AddDeviceRequest)

def add_device(
                device: AddDeviceRequest,
                hospital_id:str,
                stock_area_id:int,
                status:str
              ):

    print("add_device")
    #device_idはDBで自動付与なのでreturnでadd device後取得できるようにする
    response =(
              supabase
              .table("devices")
              .insert({
                          "hospital_id": hospital_id,
                          "type": device.type,
                          "model": device.model,
                          "asset_type": device.asset_type,
                          "stock_area_id":stock_area_id,
                          "status":status,
                          "rental_start_date": device.rental_start_date or None,
                          "rental_end_date": device.rental_end_date or None
                          })
              .execute()
              )
    return response.data[0]

