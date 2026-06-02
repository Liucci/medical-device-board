from common.supabase_client import (supabase)
from devices.add_devices import (add_device)
from stock_areas.fetch_stock_areas import (fetch_stock_area)
from schemas.device_schemas import (AddDeviceRequest)

def create_device_transaction(
                                device: AddDeviceRequest,
                                user_id,
                                hospital_id,
                                stock_area_id
                              ):

    print("create_device_transaction")
    #stock arera idに対応したstock_areaを取得
    stock_area = fetch_stock_area(
                                    stock_area_id,
                                    hospital_id
                                  )
    device_response = add_device(
                                    AddDeviceRequest(
                                                        type=device.type,
                                                        model=device.model,
                                                        asset_type=device.asset_type,
                                                        stock_area_id=stock_area_id,
                                                        rental_start_date=device.rental_start_date,
                                                        rental_end_date=device.rental_end_date
                                                    ),
                                    hospital_id=hospital_id,
                                )

    supabase.table("device_histories").insert({
                                                "hospital_id": hospital_id,
                                                "device_id": device_response["id"],
                                                "user_id": user_id,
                                                "action_type": "create",
                                                "message": "新規登録",
                                                "status": "stock",
                                                "stock_area_id": stock_area["id"],
                                                "stock_area_name": stock_area["name"]
                                              }).execute()

