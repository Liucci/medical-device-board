from inspection.inspections.fetch_inspections import fetch_today_inspections
from histories.fetch_histories import fetch_latest_move_history


def fetch_today_inspections_transaction(
    client,
    hospital_id: str
):
    inspections = fetch_today_inspections(
        client=client,
        hospital_id=hospital_id
    )

    result = []

    # deviceごとの最新move時刻をキャッシュ
    latest_move_cache = {}

    for inspection in inspections:
        device_id = inspection["device_id"]

        if device_id not in latest_move_cache:
            latest_move_cache[device_id] = fetch_latest_move_history(
                client=client,
                device_id=device_id,
                hospital_id=hospital_id
            )

        latest_move_at = latest_move_cache[device_id]

        # 最新moveより前の点検は除外
        if latest_move_at is not None:
            if inspection["created_at"] < latest_move_at:
                continue

        # 必要な情報だけ返す
        result.append({
            "device_id": device_id,
            "created_at": inspection["created_at"]
        })

    print("result", result)

    return result