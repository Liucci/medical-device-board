from inspection.inspection_item_types import (
    delete_inspection_item_types
)

from inspection.inspection_item_types import (
    fetch_inspection_item_types
)


def delete_inspection_item_type_transaction(
    client,
    inspection_item_types
):
    print("delete_inspection_item_type_transaction")

    # 削除
    delete_inspection_item_types(
        client,
        inspection_item_types
    )

    # 最新一覧を取得
    return fetch_inspection_item_types(client)