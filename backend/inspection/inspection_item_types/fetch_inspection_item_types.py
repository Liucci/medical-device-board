from supabase import Client


def fetch_inspection_item_types(client: Client):
    print("fetch_inspection_item_types")

    response = (
        client
        .table("inspection_item_types")
        .select("*")
        .execute()
    )

    return response.data


def fetch_inspection_item_type(
    client: Client,
    inspection_item_type_id: int
):
    print("fetch_inspection_item_type")

    response = (
        client
        .table("inspection_item_types")
        .select("*")
        .eq("id", inspection_item_type_id)
        .single()
        .execute()
    )

    return response.data