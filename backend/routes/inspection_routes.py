import fastapi
from fastapi import Body

from fastapi import APIRouter, Depends
from fastapi import Depends, Response
from schemas.session_schemas import BackendSession
from auth.get_current_session import get_current_session
from auth.check_permission import check_permission
#CRUD
from inspection.inspection_types.add_inspection_type import add_inspection_type
from inspection.inspection_types.update_inspection_type import update_inspection_type
from inspection.inspection_types.fetch_inspection_types import fetch_inspection_types
from inspection.inspection_item_types.fetch_inspection_item_types import fetch_inspection_item_types
from inspection.inspection_checklists.fetch_inspection_checklists import (fetch_inspection_checklists,fetch_inspection_checklist)
from inspection.inspection_checklist_items.fetch_inspection_checklist_items import fetch_inspection_checklist_items
from inspection.inspections.fetch_inspections import fetch_inspections
from inspection.inspection_results.fetch_inspection_results import fetch_inspection_results
from inspection.inspection_item_categories.fetch_inspection_item_categories import fetch_inspection_item_categories
from inspection.inspection_checklist_item_options.add_inspection_checklist_item_options import add_inspection_checklist_item_options
from inspection.inspection_checklist_item_options.fetch_inspection_checklist_item_options import fetch_inspection_checklist_item_options
from devices.fetch_devices import fetch_device
#schemas
from schemas.inspection_schemas.inspection_schemas import AddInspectionRequest
from schemas.inspection_schemas.inspection_result_schemas import AddInspectionResultRequest
from schemas.inspection_schemas.inspection_type_schemas import (
    AddInspectionTypeRequest,
    UpdateInspectionTypeRequest,
    DeleteInspectionTypesRequest,
)
from schemas.inspection_schemas.inspection_item_type_schemas import (
    AddInspectionItemTypeRequest,
    UpdateInspectionItemTypeRequest,
    DeleteInspectionItemTypesRequest,
)
from schemas.inspection_schemas.inspection_checklist_schemas import (
    AddInspectionChecklistRequest,
    UpdateInspectionChecklistRequest,
    DeleteInspectionChecklistsRequest,
)
from schemas.inspection_schemas.inspection_checklist_item_schemas import (AddInspectionChecklistItemRequest,)
from schemas.inspection_schemas.inspection_item_category_schema import (SaveInspectionItemCategoriesRequest)
from schemas.inspection_schemas.transaction_schemas.inspection_checklist_transaction_schemas import (CreateInspectionChecklistTransactionRequest,)
from schemas.inspection_schemas.transaction_schemas.inspection_transaction_schemas import (CreateInspectionTransactionRequest,)
from schemas.inspection_schemas.transaction_schemas.inspection_transaction_schemas import CreateInspectionPdfRequest
from schemas.inspection_schemas.transaction_schemas.inspection_transaction_schemas import (CreateInspectionTransactionRequest,InspectionsByLimitRequest,)
#transactions
from transactions.inspection.inspections.create_inspection_transaction import create_inspection_transaction
from transactions.inspection.inspection_item_types.add_inspection_item_type_transaction import add_inspection_item_type_transaction
from transactions.inspection.inspection_item_types.update_inspection_item_type_transaction import update_inspection_item_type_transaction
from transactions.inspection.inspection_item_types.delete_inspection_item_type_transaction import delete_inspection_item_type_transaction
from transactions.inspection.inspection_checklists.add_inspection_checklist_transaction import add_inspection_checklist_transaction
from transactions.inspection.inspection_checklists.fetch_inspection_checklist_items_with_options import (fetch_inspection_checklist_items_with_options)
from transactions.inspection.inspection_checklist_items.add_inspection_checklist_items_transaction import add_inspection_checklist_items_transaction
from transactions.inspection.inspection_item_categories.add_inspection_item_category_transaction import add_inspection_item_category_transaction
from transactions.inspection.inspection_item_categories.update_inspection_item_category_transaction import update_inspection_item_category_transaction
from transactions.inspection.inspections.fetch_today_inspections_transaction import (fetch_today_inspections_transaction)
from transactions.exports.create_inspection_pdf_transaction import create_inspection_pdf_transaction
from exports.pdf.generate_inspection_pdf import generate_inspection_pdf
from transactions.exports.create_inspection_csv_transaction import (create_inspection_csv_transaction)
from exports.csv.generate_inspection_csv import generate_inspection_csv
from transactions.inspection.inspection_checklists.delete_inspection_checklist_transaction import (delete_inspection_checklist_transaction)
from transactions.inspection.inspection_item_categories.save_inspection_item_categories_transaction import (save_inspection_item_categories_transaction)
from transactions.inspection.inspection_types.delete_inspection_type_transaction import (delete_inspection_type_transaction,)
from transactions.inspection.inspections.fetch_inspections_by_limit_transaction import (fetch_inspections_by_limit_transaction)
#init
from inits.fetch_init_inspection_excution import (fetch_init_inspection_execution)
from inits.fetch_init_inspection_editor import fetch_init_inspection_editor

inspection_router = APIRouter()

# inspection execution init
@inspection_router.get("/init-inspection-execution")
def get_init_inspection_execution(
    session: BackendSession = Depends(get_current_session),
):
    check_permission(
        current_user=session,
        allowed_roles=["admin"],
    )
    
    return fetch_init_inspection_execution(
        client=session.client,
        hospital_id=session.hospital_id,
        display_name=session.display_name,
        role=session.role
    )

# inspection editor init
@inspection_router.get("/init-inspection-editor")
def get_init_inspection_editor(
    session: BackendSession = Depends(get_current_session),
):
    check_permission(
        current_user=session,
        allowed_roles=["admin"],
    )
    
    return fetch_init_inspection_editor(
        client=session.client,
        hospital_id=session.hospital_id,
    )


# inspection_types
@inspection_router.get("/inspection-types")
def get_inspection_types(
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspection_types(
        client=session.client,
        hospital_id=session.hospital_id
    )

@inspection_router.delete("/delete-inspection-type")
def delete_inspection_type(
    request: DeleteInspectionTypesRequest,
    session: BackendSession = Depends(get_current_session),
):
    delete_inspection_type_transaction(
        client=session.client,
        inspection_type_id=request.id,
        hospital_id=session.hospital_id,
    )


# inspection_item_types
@inspection_router.get("/inspection-item-types")
def get_inspection_item_types(
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspection_item_types(
        client=session.client
    )


# inspection_checklists
@inspection_router.get("/inspection-checklists")
def get_inspection_checklists(
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspection_checklists(
        client=session.client,
        hospital_id=session.hospital_id
    )

@inspection_router.delete("/delete-inspection-checklist")
def delete_inspection_checklist(
    checklist_id: int,
    session: BackendSession = Depends(get_current_session),
):
    # 対象checklistを取得
    checklist = fetch_inspection_checklist(
        client=session.client,
        inspection_checklist_id=checklist_id,
        hospital_id=session.hospital_id,
    )

    return delete_inspection_checklist_transaction(
        client=session.client,
        hospital_id=session.hospital_id,
        inspection_type_id=checklist["inspection_type_id"],
        device_type_id=checklist["device_type_id"],
        device_model_id=checklist["device_model_id"],
        name=checklist["name"],
    )


# inspection_checklist_items
@inspection_router.get("/inspection-checklist-items/{checklist_id}")
def get_inspection_checklist_items(
    checklist_id: int,
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspection_checklist_items(
        client=session.client,
        checklist_id=checklist_id
    )

# inspection_checklist_items_with_options
@inspection_router.get("/inspection-checklist-items-with-options/{checklist_id}")
def get_inspection_checklist_items_with_options(
    checklist_id: int,
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspection_checklist_items_with_options(
        client=session.client,
        checklist_id=checklist_id
    )

# inspections
#inspection table取得
@inspection_router.get("/inspections")
def get_inspections(
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspections(
        client=session.client,
        hospital_id=session.hospital_id
    )

#inspectionの取得数を指定する
@inspection_router.get("/inspections/by-limit")
def get_inspections_by_limit(
    request: InspectionsByLimitRequest = Depends(),
    session: BackendSession = Depends(get_current_session),
):
    limit=10
    return fetch_inspections_by_limit_transaction(
        client=session.client,
        device_id=request.device_id,
        checklist_id=request.checklist_id,
        hospital_id=session.hospital_id,
        limit=limit
    )



@inspection_router.get("/inspections/today")
def get_today_inspections(
    session: BackendSession = Depends(get_current_session),
):
    return fetch_today_inspections_transaction(
        client=session.client,
        hospital_id=session.hospital_id
    )


# inspection_results
@inspection_router.get("/inspection-results/{inspection_id}")
def get_inspection_results(
    inspection_id: int,
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspection_results(
        client=session.client,
        inspection_id=inspection_id
    )



@inspection_router.post("/create-inspection")
def create_inspection(
    request: CreateInspectionTransactionRequest,
    session: BackendSession = Depends(get_current_session),
):
    #保存時管理番号とシリアルの入力を確認する
    device = fetch_device(
                        client=session.client,
                        device_id=request.inspection.device_id,
                        hospital_id=session.hospital_id,
    )

    management_number = device.get("management_number")
    serial_number = device.get("serial_number")

    if not management_number and not serial_number:
        return {"error": "管理番号またはシリアル番号を入力してください"}

    return create_inspection_transaction(
                                        client=session.client,
                                        inspection=request.inspection,
                                        results=request.results,
                                        hospital_id=session.hospital_id,
                                        user_id=session.user_id
    )


@inspection_router.post("/create-inspection-type-transaction")
def create_inspection_type(
    inspection_type: AddInspectionTypeRequest,
    session: BackendSession = Depends(get_current_session),
):
    return add_inspection_type(
        client=session.client,
        inspection_type=inspection_type,
        hospital_id=session.hospital_id,
    )


@inspection_router.post("/create-inspection-pdf")
def create_inspection_pdf(
                            request: CreateInspectionPdfRequest = Body(...),
                            session: BackendSession = Depends(get_current_session),
):

    (pdf_tables_by_checklist,
     hospital_name,
     display_patient_name
     ) =create_inspection_pdf_transaction(
                                                                    client=session.client,
                                                                    inspection_ids=request.inspection_ids,
                                                                    hospital_id=session.hospital_id,
                                                                    display_patient_name=request.show_patient_name
                                                )

    pdf_bytes = generate_inspection_pdf(
                                        pdf_tables_by_checklist=pdf_tables_by_checklist,
                                        orientation="portrait",
                                        font_size=8,
                                        hospital_name=hospital_name,
                                        display_patient_name=request.show_patient_name
                )

    print("PDF bytes:",len(pdf_bytes))

    return Response(
                    content=pdf_bytes,
                    media_type="application/pdf"
    )    

@inspection_router.post("/create-inspection-csv")
def create_inspection_csv(
    inspection_ids: list[int],
    session: BackendSession = Depends(get_current_session),
):

    (
        csv_tables_by_checklist,
        hospital_name
    ) = create_inspection_csv_transaction(
        client=session.client,
        inspection_ids=inspection_ids,
        hospital_id=session.hospital_id
    )

    csv_bytes = generate_inspection_csv(
        csv_tables_by_checklist=csv_tables_by_checklist
    )

    print(
        "CSV bytes:",
        len(csv_bytes)
    )

    return Response(
        content=csv_bytes,
        media_type="text/csv; charset=utf-8"
    )


@inspection_router.post("/update-inspection-type-transaction")
def update_inspection_type_route(
    inspection_type: UpdateInspectionTypeRequest,
    session: BackendSession = Depends(get_current_session),
):
    return update_inspection_type(
        client=session.client,
        inspection_type=inspection_type,
        hospital_id=session.hospital_id,
    )




@inspection_router.post("/inspection-item-types")
def create_inspection_item_type(
    inspection_item_type: AddInspectionItemTypeRequest,
    session: BackendSession = Depends(get_current_session),
):
    return add_inspection_item_type_transaction(
        client=session.client,
        inspection_item_type=inspection_item_type
    )


@inspection_router.put("/inspection-item-types")
def update_inspection_item_type_route(
    inspection_item_type: UpdateInspectionItemTypeRequest,
    session: BackendSession = Depends(get_current_session),
):
    return update_inspection_item_type_transaction(
        client=session.client,
        inspection_item_type=inspection_item_type
    )


@inspection_router.delete("/inspection-item-types")
def delete_inspection_item_types_route(
    inspection_item_types: DeleteInspectionItemTypesRequest,
    session: BackendSession = Depends(get_current_session),
):
    return delete_inspection_item_type_transaction(
        client=session.client,
        inspection_item_type=inspection_item_types
    )


@inspection_router.post("/create-inspection-checklist")
def create_inspection_checklist(
                            request: CreateInspectionChecklistTransactionRequest,
                            session: BackendSession = Depends(get_current_session),
):
    #print("session:",session)
    #print("session.client:", session.client)
    #print("session.hospital_id:", session.hospital_id)

    #response = session.client.auth.get_user()
    #print("AUTH USER:", response)
    return add_inspection_checklist_transaction(
                                        client=session.client,
                                        request=request,
                                        hospital_id=session.hospital_id,
    )



@inspection_router.post("/create-inspection-checklist-items")
def create_inspection_checklist_items(
                                    inspection_checklist_items: list[AddInspectionChecklistItemRequest],
                                    session: BackendSession = Depends(get_current_session),
):
    return add_inspection_checklist_items_transaction(
                                                    client=session.client,
                                                    inspection_checklist_items=inspection_checklist_items
    )


# inspection_item_categories
@inspection_router.get("/get-inspection-item-categories")
def get_inspection_item_categories(
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspection_item_categories(
        client=session.client,
        hospital_id=session.hospital_id
    )

@inspection_router.post("/save-inspection-item-categories")
def save_inspection_item_categories_route(
    request: SaveInspectionItemCategoriesRequest,
    session: BackendSession = Depends(get_current_session),
):
    return save_inspection_item_categories_transaction(
        client=session.client,
        request=request,
        hospital_id=session.hospital_id,
    )

""" @inspection_router.post("/create-inspection-item-categories")
def create_inspection_item_category(
    inspection_item_category: SaveInspectionItemCategoriesRequest,
    session: BackendSession = Depends(get_current_session),
):
    return add_inspection_item_category_transaction(
        client=session.client,
        inspection_item_category=inspection_item_category,
        hospital_id=session.hospital_id,
    )

@inspection_router.post("/update-inspection-item-category")
def update_inspection_item_category_route(
    inspection_item_category: SaveInspectionItemCategoriesRequest,
    session: BackendSession = Depends(get_current_session),
):
    return update_inspection_item_category_transaction(
        client=session.client,
        inspection_item_category=inspection_item_category,
        hospital_id=session.hospital_id,
    )
 """



# inspection_checklist_item_options
@inspection_router.get("/fetch-inspection-checklist-item-options/{checklist_item_id}")
def get_inspection_checklist_item_options(
    checklist_item_id: int,
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspection_checklist_item_options(
        client=session.client,
        checklist_item_id=checklist_item_id,
    )



















#テスト用関数
@inspection_router.post("/test-add-inspection-checklist-item-options")
def test_add_inspection_checklist_item_options(
    session: BackendSession = Depends(get_current_session),
):
    print("POSTGREST HEADERS:", session.client.postgrest.headers)
    print("AUTH USER:", session.client.auth.get_user())

    checklist_item_id = 1

    options = [
        {
            "value": "TEST_OK",
            "display_order": 1,
        },
        {
            "value": "TEST_NG",
            "display_order": 2,
        },
        {
            "value": "TEST_UNKNOWN",
            "display_order": 3,
        },
    ]
    result = (
        session.client
        .rpc("debug_auth_context")
        .execute()
    )

    print("AUTH CONTEXT:", result.data)
    return add_inspection_checklist_item_options(
        client=session.client,
        checklist_item_id=checklist_item_id,
        options=options,
    )