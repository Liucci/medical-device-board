from inspection.inspections.fetch_inspections import fetch_inspections_by_ids
from inspection.inspection_results.fetch_inspection_results import fetch_inspection_results_by_ids
from hospitals.fetch_hospital import fetch_hospital


def create_inspection_csv_transaction(
    client,
    inspection_ids: list[int],
    hospital_id: str
):

    print(
        "create_inspection_csv_transaction"
    )

    hospital = fetch_hospital(
        client,
        hospital_id
    )

    if not hospital:
        raise Exception(
            "Hospital not found"
        )

    hospital_name = hospital["hospital_name"]

    inspections = fetch_inspections_by_ids(
        client=client,
        inspection_ids=inspection_ids,
        hospital_id=hospital_id
    )

    inspection_results = fetch_inspection_results_by_ids(
        client=client,
        inspection_ids=inspection_ids
    )

    inspections_by_checklist = {}

    for inspection in inspections:
        checklist_id = inspection["checklist_id"]

        if checklist_id not in inspections_by_checklist:
            inspections_by_checklist[checklist_id] = []

        inspections_by_checklist[checklist_id].append(
            inspection
        )

    inspection_results_by_inspection = {}

    for result in inspection_results:
        inspection_id = result["inspection_id"]

        if inspection_id not in inspection_results_by_inspection:
            inspection_results_by_inspection[inspection_id] = []

        inspection_results_by_inspection[inspection_id].append(
            result
        )

    for checklist_id, checklist_inspections in inspections_by_checklist.items():
        checklist_inspections.sort(
            key=lambda inspection: inspection["created_at"]
        )

    items_by_checklist = {}

    for checklist_id, checklist_inspections in inspections_by_checklist.items():

        items = []

        for inspection in checklist_inspections:

            results = inspection_results_by_inspection.get(
                inspection["id"],
                []
            )

            for result in results:

                item = {
                    "category_name": result["category_name"],
                    "category_display_order": result["category_display_order"],
                    "item_name": result["item_name"],
                    "item_display_order": result["item_display_order"],
                    "unit": result["unit"]
                }

                if item not in items:
                    items.append(item)

        items.sort(
            key=lambda item: (
                item["category_display_order"],
                item["item_display_order"]
            )
        )

        items_by_checklist[checklist_id] = items

    csv_tables_by_checklist = {}

    for checklist_id, checklist_inspections in inspections_by_checklist.items():

        items = items_by_checklist[checklist_id]

        rows = []

        for item in items:

            item_name = item["item_name"]

            if item["unit"]:
                item_name = (
                    f"{item_name} ({item['unit']})"
                )

            row = {
                "category_name": item["category_name"],
                "item_name": item_name,
                "unit": item["unit"],
                "values": []
            }

            for inspection in checklist_inspections:

                results = inspection_results_by_inspection.get(
                    inspection["id"],
                    []
                )

                value = None

                for result in results:

                    if (
                        result["item_name"] == item["item_name"]
                        and result["category_name"] == item["category_name"]
                    ):
                        value = result["value"]
                        break

                row["values"].append(
                    value
                )

            rows.append(
                row
            )

        csv_tables_by_checklist[checklist_id] = {
            "inspections": checklist_inspections,
            "rows": rows
        }

    return (
        csv_tables_by_checklist,
        hospital_name
    )