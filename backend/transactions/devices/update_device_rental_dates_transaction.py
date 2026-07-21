from devices.update_device_rental_dates import update_device_rental_dates
from schemas.device_schemas import UpdateDeviceRentalDatesRequest

def update_device_rental_dates_transaction(
                                              device: UpdateDeviceRentalDatesRequest,
                                              hospital_id: str,
                                              user_id:str
                                           ):

    print("update_device_rental_dates_transaction")

    updated_device = update_device_rental_dates(
                                                  device=device,
                                                  hospital_id=hospital_id,
                                                  user_id=user_id
                                                )

    return updated_device