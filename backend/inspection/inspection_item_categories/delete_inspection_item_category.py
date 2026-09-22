from supabase import Client


# 指定したinspection item categoryを削除する
def delete_inspection_item_category(
    client: Client,
    category_id: int,
    hospital_id: str,
):
    print("delete_inspection_item_category")
    response=(
        client
        .table("inspection_item_categories")
        .delete()
        .eq("id", category_id)
        .eq("hospital_id", hospital_id)
        .execute()
    )
