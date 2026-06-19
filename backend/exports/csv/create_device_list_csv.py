from io import BytesIO, StringIO
import csv


def create_device_list_csv(
    rows: list[dict]
) -> BytesIO:

    text_buffer = StringIO()
    writer = csv.writer(text_buffer)

    writer.writerow(
        [
            "状態",
            "保守/待機",
            "病棟",
            "病室/保管場所",
            "患者名",
            "機種",
            "型式",
            "管理番号",
            "シリアル番号",
            "備考",
            "直近メンテナンス"
        ]
    )

    for row in rows:

        maintenance_info = ""

        if row["maintenance_name"]:
            maintenance_info = row["maintenance_name"]

        if row["due_at"]:
            maintenance_info += f" {row['due_at']}"

        location_name = (
            row["room_name"]
            or row["stock_area_name"]
            or ""
        )

        status_detail = ""

        if row["is_under_maintenance"]:
            status_detail = "保守中"

        elif row["standby"]:
            status_detail = "待機中"

        writer.writerow(
            [
                row["status"],
                status_detail,
                row["ward_name"] or "",
                location_name,
                row["patient_name"] or "",
                row["device_type_name"] or "",
                row["device_model_name"] or "",
                row["management_number"] or "",
                row["serial_number"] or "",
                row["note"] or "",
                maintenance_info
            ]
        )

    buffer = BytesIO()
    buffer.write(
        ("\ufeff" + text_buffer.getvalue()).encode("utf-8")
    )
    buffer.seek(0)

    return buffer