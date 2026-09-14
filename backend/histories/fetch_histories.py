from supabase import Client


def fetch_device_histories(
                            client:Client,
                            hospital_id: str
                          ):
    print("fetch_device_histories")
    response = (
                client
                .table("device_histories")
                .select("*")
                .eq(
                        "hospital_id",
                        hospital_id
                    )
                .order(
                        "created_at",
                        desc=True
                    )
                .execute()
    )

    return response.data



#historyから対象device idの直近のmove action時刻を取得
def fetch_latest_move_history(
    client: Client,
    device_id: int,
    hospital_id: str
):
    response = (
        client
        .table("device_histories")
        .select("created_at")
        .eq("device_id", device_id)
        .eq("hospital_id", hospital_id)
        .eq("action_type", "move")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if not response.data:
        return None
#返し値はdictではなく、strで返す
    return response.data[0]["created_at"]