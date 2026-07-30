from datetime import datetime

from io import BytesIO, StringIO 
import csv


def create_device_list_csv(
    rows: list[dict],
    show_patient_name: bool
) -> BytesIO:

    text_buffer = StringIO()
    writer = csv.writer(text_buffer)

    header = [
        "状態",
        "保守/待機",
        "病棟",
        "病室/保管場所"
    ]

    if show_patient_name:
        header.append("患者名")

    header.extend([
        "機種",
        "型式",
        "管理番号",
        "シリアル番号",
        "備考",
        "直近メンテナンス"
    ])

    writer.writerow(header)

    for row in rows:

        maintenance_info = ""

        if row["maintenance_name"]:
            maintenance_info = row["maintenance_name"]

        if row["due_at"]:
            due_at = (
                datetime
                .fromisoformat(
                    row["due_at"].replace(
                        "Z",
                        "+00:00"
                    )
                )
                .strftime("%Y/%m/%d")
            )
            maintenance_info += f" {due_at}"

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

        csv_row = [
            row["status"],
            status_detail,
            row["ward_name"] or "",
            location_name
        ]

        if show_patient_name:
            csv_row.append(row["patient_name"] or "")

        csv_row.extend([
            row["device_type_name"] or "",
            row["device_model_name"] or "",
            row["management_number"] or "",
            row["serial_number"] or "",
            row["note"] or "",
            maintenance_info
        ])

        writer.writerow(csv_row)

    buffer = BytesIO()

    buffer.write(
        (
            "\ufeff"
            + text_buffer.getvalue()
        ).encode("utf-8")
    )

    buffer.seek(0)

    return buffer