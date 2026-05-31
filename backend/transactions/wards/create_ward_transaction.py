# transactions/create_ward_transaction.py

from wards.add_wards import add_ward

def create_ward_transaction(
                                ward,
                                current_user
                            ):

    response = add_ward(
                            hospital_id=current_user["hospital_id"],
                            name=ward.name
                        )

    return response