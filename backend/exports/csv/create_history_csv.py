from io import BytesIO, StringIO
import csv
from datetime import datetime


def create_history_csv(
    rows: list[dict]
) -> BytesIO:

    text_buffer = StringIO()
    writer = csv.writer(text_buffer)

    writer.writerow(
        [
            "日時",
            "機器ID",
            "機種",
            "型式",
            "操作",
            "保守開始",
            "保守終了",
            "場所",
            "患者名",
            "内容"
        ]
    )

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

        writer.writerow(
            [
                created_at,
                str(row["device_id"]),
                row["device_type_name"] or "",
                row["device_model_name"] or "",
                row["action_type"] or "",
                row["maintenance_started_at"] or "",
                row["maintenance_finished_at"] or "",
                location_name,
                row["patient_name"] or "",
                row["message"] or ""
            ]
        )

    buffer = BytesIO()

    buffer.write(
        (
            "\ufeff" +
            text_buffer.getvalue()
        ).encode("utf-8")
    )

    buffer.seek(0)

    return buffer