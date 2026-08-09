from ward_infections.add_ward_infection import add_ward_infection
from ward_infections.delete_ward_infections import delete_ward_infections_by_ward_id
from ward_infections.fetch_ward_infections import fetch_ward_infections_by_ward_id
from schemas.ward_infection_schemas import (
    AddWardInfectionRequest,
    UpdateWardInfectionsRequest
)
from supabase import Client


def update_ward_infections_transaction(
                                    client:Client,
                                    ward_infection: UpdateWardInfectionsRequest,
                                    hospital_id: str
):

    print("update_ward_infections_transaction")

    # まず既存を削除
    delete_ward_infections_by_ward_id(
                                        client, 
                                        ward_infection.ward_id,
                                        hospital_id
                                    )

    # 新しい感染情報を登録
    for infection_type_id in ward_infection.infection_type_ids:

        add_ward_infection(
            client, 
            AddWardInfectionRequest(
                                    ward_id=ward_infection.ward_id,
                                    infection_type_id=infection_type_id
                                ),
            hospital_id
        )

    return fetch_ward_infections_by_ward_id(
                                            client, 
                                            ward_infection.ward_id,
                                            hospital_id
                                        )