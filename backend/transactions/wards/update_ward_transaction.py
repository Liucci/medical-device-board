from wards.update_ward import (update_ward)
from schemas.ward_schemas import (UpdateWardRequest)
from supabase import Client

def update_ward_transaction(
                                client:Client,
                                ward: UpdateWardRequest,
                                hospital_id: str
                            ):

    print("update_ward_transaction")

    update_ward(
                    client=client, 
                    ward=ward,
                    hospital_id=hospital_id
                )