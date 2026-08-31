from inspection.inspection_item_types import (
    add_inspection_item_type
)

from inspection.inspection_item_types import (
    fetch_inspection_item_types
)


def add_inspection_item_type_transaction(
    client,
    inspection_item_type
):
    print("add_inspection_item_type_transaction")

    # 追加
    add_inspection_item_type(
        client,
        inspection_item_type
    )

    # 最新一覧を取得
    return fetch_inspection_item_types(client)