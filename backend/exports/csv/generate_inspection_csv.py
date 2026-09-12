import csv
import io
from datetime import datetime
from zoneinfo import ZoneInfo


def generate_inspection_csv(
    csv_tables_by_checklist: dict,
) -> bytes:

    print(
        "generate_inspection_csv"
    )

    output = io.StringIO(
        newline=""
    )

    writer = csv.writer(
        output
    )

    jst = ZoneInfo(
        "Asia/Tokyo"
    )

    for checklist_id, checklist_data in csv_tables_by_checklist.items():

        inspections = checklist_data["inspections"]
        rows = checklist_data["rows"]

        if not inspections:
            continue

        first_inspection = inspections[0]

        checklist_name = (
            first_inspection["checklist_name"]
        )

        checklist_version = (
            first_inspection["checklist_version"]
        )

        writer.writerow(
            ["CHECKLIST"]
        )

        writer.writerow(
            [
                "点検表名",
                checklist_name
            ]
        )

        writer.writerow(
            [
                "バージョン",
                f"Ver.{checklist_version}"
            ]
        )

        writer.writerow([])

        inspection_datetimes = []

        for inspection in inspections:

            created_at = datetime.fromisoformat(
                inspection["created_at"]
            )

            created_at_jst = created_at.astimezone(
                jst
            )

            inspection_datetimes.append(
                created_at_jst.strftime(
                    "%Y/%m/%d %H:%M"
                )
            )

        writer.writerow(
            [
                "項目",
                "",
                "",
                *inspection_datetimes
            ]
        )

        inspection_fields = [
            ("実施者", "performed_by_name"),
            ("患者名", "patient_name"),
            ("機器種別", "device_type_name"),
            ("機種名", "device_model_name"),
            ("管理番号", "management_number"),
            ("シリアル番号", "serial_number"),
            ("病棟", "ward_name"),
            ("病室", "room_name"),
            ("点検区分", "inspection_type_name"),
            ("総合結果", "overall_result"),
            ("コメント", "comment"),
        ]

        for label, field in inspection_fields:

            values = []

            for inspection in inspections:
                values.append(
                    inspection.get(field)
                )

            writer.writerow(
                [
                    label,
                    "",
                    "",
                    *values
                ]
            )

        writer.writerow([])

        writer.writerow(
            [
                "カテゴリ",
                "点検項目",
                "単位",
                *inspection_datetimes
            ]
        )

        for row in rows:

            writer.writerow(
                [
                    row["category_name"],
                    row["item_name"],
                    row["unit"],
                    *row["values"]
                ]
            )

        writer.writerow([])

    return output.getvalue().encode(
        "utf-8-sig"
    )