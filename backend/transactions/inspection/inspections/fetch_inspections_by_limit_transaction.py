from supabase import Client

from inspection.inspections.fetch_inspections import (
    fetch_inspections_by_limit,
)

from inspection.inspection_results.fetch_inspection_results import (
    fetch_inspection_results_by_ids,
)


def fetch_inspections_by_limit_transaction(
    client: Client,
    device_id: int,
    checklist_id: int,
    hospital_id: str,
    limit: int,
):
    print("fetch_inspections_by_limit_transaction")

    # 指定条件でinspectionを指定件数取得
    inspections = fetch_inspections_by_limit(
        client=client,
        device_id=device_id,
        checklist_id=checklist_id,
        hospital_id=hospital_id,
        limit=limit,
    )

    # inspection_idを取得
    inspection_ids = [
        inspection["id"]
        for inspection in inspections
    ]

    # inspectionが存在しない場合
    if not inspection_ids:
        return {
            "inspections": [],
            "results": [],
        }

    # 取得したinspectionの結果を一括取得
    results = fetch_inspection_results_by_ids(
        client=client,
        inspection_ids=inspection_ids,
    )

    return {
        "inspections": inspections,
        "results": results,
    }