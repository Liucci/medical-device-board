from common.supabase_client import supabase


def add_hospital(
                  hospital_name: str
                ):

    response = (
                  supabase
                  .table("hospitals")
                  .insert(
                            {
                              "hospital_name": hospital_name,
                              "is_active": True,
                              "price_plan": "free"
                            }
                          )
                  .execute()
               )

    return response.data[0]