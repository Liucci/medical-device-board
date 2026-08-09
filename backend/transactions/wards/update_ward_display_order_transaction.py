from schemas.ward_schemas import UpdateWardOrdersRequest
from wards.update_ward import update_ward_display_order
from supabase import Client


def update_ward_display_order_transaction(
                                            client:Client,
                                            wards: UpdateWardOrdersRequest,
                                            hospital_id: str,
                                        ):
    print("update_ward_display_order_transaction")

    for ward in wards.wards:
        update_ward_display_order(
                                    client, 
                                    ward,
                                    hospital_id,
                                )