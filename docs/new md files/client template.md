from supabase import Client
from schemas.device_schemas import (AddDeviceRequest)

def add_device(
                client:Client,
                device: AddDeviceRequest,
                hospital_id:str,
                #stock_area_id:int,
                status:str
              ):

    print("add_device")
    #device_idはDBで自動付与なのでreturnでadd device後取得できるようにする
    #DB側でcreate at,update atはnowで値が作成される
    response =(
              client
              .table("devices")
              .insert({
                          "hospital_id": hospital_id,
                          "type": device.type,
                          "model": device.model,
                          "asset_type": device.asset_type,
                          "stock_area_id":device.stock_area_id,
                          "status":status,
                          "rental_start_date": device.rental_start_date or None,
                          "rental_end_date": device.rental_end_date or None
                          })
              .execute()
              )
    return response.data[0]


   from common.supabase_admin_client import supabase
from supabase import Client
from devices.add_device import add_device
from stock_areas.fetch_stock_areas import fetch_stock_area
from device_types.fetch_device_type import fetch_device_type
from device_models.fetch_device_models import fetch_device_model
from schemas.device_schemas import AddDeviceRequest


def create_device_transaction(
                                client:Client,
                                device: AddDeviceRequest,
                                hospital_id: str,
                                user_id: str,
                                #stock_area_id: int,
                                status: str,
                                action_type: str,
                                message: str
                             ):

    print("create_device_transaction")

    stock_area = fetch_stock_area(
                                    device.stock_area_id,
                                    hospital_id
                                 )

    device_type = fetch_device_type(device.type,
                                      hospital_id
                                   )

    device_model = fetch_device_model(device.model,
                                        hospital_id
                                     )
   #frontのquantityで指定した台数分for inで回して複数台登録する
   #created_devices=[] listに格納しlistを返す 
    created_devices = []
    for _ in range(device.quantity):
      created_device = add_device(
                                  client=client,
                                  device=device,
                                  hospital_id=hospital_id,
                                  #stock_area_id=stock_area_id,
                                  status=status
                                 )

      supabase.table("device_histories").insert({
                                                "hospital_id": hospital_id,
                                                "device_id": created_device["id"],
                                                "action_by": user_id,
                                                "action_type": action_type,
                                                "message": message,

                                                "device_type_name": device_type["name"],
                                                "device_model_name": device_model["name"],

                                                "stock_area_name": stock_area["name"]
                                              }).execute()

      created_devices.append(created_device)
    return created_device