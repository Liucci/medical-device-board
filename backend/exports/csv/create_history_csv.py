from io import BytesIO, StringIO
import csv
from datetime import datetime


def create_history_csv(
    rows: list[dict],
    show_patient_name: bool
) -> BytesIO:

    text_buffer = StringIO()
    writer = csv.writer(text_buffer)

    header = [
        "日時",
        "機器ID",
        "機種",
        "型式",
        "操作",
        "操作者",
        "保守開始",
        "保守終了",
        "場所"
    ]

    if show_patient_name:
        header.append("患者名")

    header.append("内容")

    writer.writerow(header)

    for row in rows:

        created_at = ""

        if row["created_at"]:
            created_at = (
                datetime
                .fromisoformat(
                    row["created_at"].replace(
                        "Z",
                        "+00:00"
                    )
                )
                .strftime("%Y/%m/%d %H:%M")
            )

        location_name = (
            row["room_name"]
            or row["stock_area_name"]
            or ""
        )

        csv_row = [
            created_at,
            str(row["device_id"]),
            row["device_type_name"] or "",
            row["device_model_name"] or "",
            row["action_type"] or "",
            row["action_by_name"] or "",
            row["maintenance_started_at"] or "",
            row["maintenance_finished_at"] or "",
            location_name
        ]

        if show_patient_name:
            csv_row.append(row["patient_name"] or "")

        csv_row.append(row["message"] or "")

        writer.writerow(csv_row)

    buffer = BytesIO()

    buffer.write(
        (
            "\ufeff" +
            text_buffer.getvalue()
        ).encode("utf-8")
    )

    buffer.seek(0)

    return buffer