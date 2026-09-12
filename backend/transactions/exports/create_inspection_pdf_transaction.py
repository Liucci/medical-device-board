from inspection.inspections.fetch_inspections import fetch_inspections_by_ids
from inspection.inspection_results.fetch_inspection_results import fetch_inspection_results_by_ids
from hospitals.fetch_hospital import fetch_hospital

def create_inspection_pdf_transaction(
                                        client,
                                        inspection_ids: list[int],
                                        hospital_id: str
):

    print("create_inspection_pdf_transaction")

    hospital = fetch_hospital(
                                client,
                                hospital_id
    )
    if not hospital:
        raise Exception("Hospital not found")
    hospital_name = hospital["hospital_name"]

    #print("受信したinspection_ids:",inspection_ids)

    inspections = fetch_inspections_by_ids(
                                            client=client,
                                            inspection_ids=inspection_ids,
                                            hospital_id=hospital_id
                    )

    #print("取得したinspections:",inspections)
    inspection_results = fetch_inspection_results_by_ids(
                                                        client=client,
                                                        inspection_ids=inspection_ids
                        )

    #print("取得したinspection_results:",inspection_results)
    inspections_by_checklist = {}
    #取得したinspections内の同一のchecklist idを持つものをグループ化する
    for inspection in inspections:
        checklist_id = inspection["checklist_id"]
        if checklist_id not in inspections_by_checklist:
            inspections_by_checklist[checklist_id] = []
        inspections_by_checklist[checklist_id].append(inspection)

    #print("inspections_by_checklist:",inspections_by_checklist)
    #取得したresultを同じinspection id毎にグループ化する
    inspection_results_by_inspection = {}
    for result in inspection_results:
        inspection_id = result["inspection_id"]
        if inspection_id not in inspection_results_by_inspection:
            inspection_results_by_inspection[inspection_id] = []
        inspection_results_by_inspection[inspection_id].append(result)

    #print("inspection_results_by_inspection:",inspection_results_by_inspection)
    #PDFの横軸になるInspectionを、created_at の順番に並べる
    for checklist_id, checklist_inspections in inspections_by_checklist.items():
        checklist_inspections.sort(
            key=lambda inspection: inspection["created_at"]
        )

        #print("checklist_id:",checklist_id)
        #print("checklist_inspections:",checklist_inspections)
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

    #print("items_by_checklist:",items_by_checklist)
    pdf_tables_by_checklist = {}
    for checklist_id, checklist_inspections in inspections_by_checklist.items():
        items = items_by_checklist[checklist_id]
        rows = []
        for item in items:
            item_name = item["item_name"]
            if item["unit"]:
                item_name = f"{item_name} ({item['unit']})"
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

                row["values"].append(value)

            rows.append(row)

        pdf_tables_by_checklist[checklist_id] = {
            "inspections": checklist_inspections,
            "rows": rows
        }
    """ 
    print("")
    print("========== pdf_tables_by_checklist ==========")

    for checklist_id, checklist_data in pdf_tables_by_checklist.items():

        print("")
        print(f"[checklist_id] {checklist_id}")

        print("  ├─ inspections")

        for inspection in checklist_data["inspections"]:
            print(f"  │    ├─ inspection_id: {inspection['id']}")
            print(f"  │    ├─ checklist_id: {inspection['checklist_id']}")
            print(f"  │    ├─ created_at: {inspection['created_at']}")
            print(f"  │    ├─ patient_name: {inspection['patient_name']}")
            print(f"  │    ├─ device_type_name: {inspection['device_type_name']}")
            print(f"  │    ├─ device_model_name: {inspection['device_model_name']}")
            print(f"  │    ├─ management_number: {inspection['management_number']}")
            print(f"  │    ├─ serial_number: {inspection['serial_number']}")
            print(f"  │    ├─ ward_name: {inspection['ward_name']}")
            print(f"  │    ├─ room_name: {inspection['room_name']}")
            print(f"  │    └─ performed_by_name: {inspection['performed_by_name']}")

        print("  └─ rows")

        for index, row in enumerate(checklist_data["rows"]):
            print(f"       ├─ row {index + 1}")
            print(f"       │    ├─ category_name: {row['category_name']}")
            print(f"       │    ├─ item_name: {row['item_name']}")
            print(f"       │    ├─ unit: {row['unit']}")
            print(f"       │    └─ values: {row['values']}")

    print("")
    print("==============================================")

    """    

    return (
            pdf_tables_by_checklist,
            hospital_name
    )