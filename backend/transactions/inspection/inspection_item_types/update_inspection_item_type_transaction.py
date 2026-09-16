from inspection.inspection_item_types import (
    update_inspection_item_type
)

from inspection.inspection_item_types import (
    fetch_inspection_item_types
)


def update_inspection_item_type_transaction(
    client,
    inspection_item_type
):
    print("update_inspection_item_type_transaction")

    # 更新
    update_inspection_item_type(
        client,
        inspection_item_type
    )

    # 最新一覧を取得
    return fetch_inspection_item_types(client)