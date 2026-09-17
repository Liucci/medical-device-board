from supabase import Client

from schemas.inspection_schemas.inspection_item_category_schema import (
    SaveInspectionItemCategoriesRequest,
)

from transactions.inspection.inspection_item_categories.add_inspection_item_category_transaction import (
    add_inspection_item_category_transaction,
)

from transactions.inspection.inspection_item_categories.update_inspection_item_category_transaction import (
    update_inspection_item_category_transaction,
)
#id is None ならADD、idありならUPDATE
def save_inspection_item_categories_transaction(
    client: Client,
    request: SaveInspectionItemCategoriesRequest,
    hospital_id: str,
):
    print("save_inspection_item_categories_transaction")

    results = []

    for category in request.categories:

        if category.id is None:

            result = add_inspection_item_category_transaction(
                client=client,
                inspection_item_category=category,
                hospital_id=hospital_id,
            )

        else:

            result = update_inspection_item_category_transaction(
                client=client,
                inspection_item_category=category,
                hospital_id=hospital_id,
            )

        results.append(result)

    return results