from fastapi import APIRouter, Depends

from schemas.session_schemas import BackendSession
from auth.get_current_session import get_current_session



from inspection.inspection_types.fetch_inspection_types import (
    fetch_inspection_types
)
from inspection.inspection_item_types.fetch_inspection_item_types import (
    fetch_inspection_item_types
)
from inspection.inspection_checklists.fetch_inspection_checklists import (
    fetch_inspection_checklists
)
from inspection.inspection_checklist_items.fetch_inspection_checklist_items import (
    fetch_inspection_checklist_items
)
from inspection.inspections.fetch_inspections import (
    fetch_inspections
)
from inspection.inspection_results.fetch_inspection_results import (
    fetch_inspection_results
)



from schemas.inspection_schemas.inspection_schemas import (
    AddInspectionRequest
)
from schemas.inspection_schemas.inspection_result_schemas import (
    AddInspectionResultRequest
)
from schemas.inspection_schemas.transaction_schemas.inspection_checklist_transaction_schemas import (
    CreateInspectionChecklistTransactionRequest,
)
from transactions.inspection.inspections.create_inspection_transaction import (
    create_inspection_transaction
)


from schemas.inspection_schemas.inspection_type_schemas import (
    AddInspectionTypeRequest,
    UpdateInspectionTypeRequest,
    DeleteInspectionTypesRequest
)

from inspection.inspection_types.add_inspection_type import (
    add_inspection_type
)
from inspection.inspection_types.update_inspection_type import (
    update_inspection_type
)

from schemas.inspection_schemas.inspection_item_type_schemas import (
    AddInspectionItemTypeRequest,
    UpdateInspectionItemTypeRequest,
    DeleteInspectionItemTypesRequest
)

from transactions.inspection.inspection_item_types.add_inspection_item_type_transaction import (
    add_inspection_item_type_transaction
)

from transactions.inspection.inspection_item_types.update_inspection_item_type_transaction import (
    update_inspection_item_type_transaction
)

from transactions.inspection.inspection_item_types.delete_inspection_item_type_transaction import (
    delete_inspection_item_type_transaction
)

from schemas.inspection_schemas.inspection_checklist_schemas import (
    AddInspectionChecklistRequest,
    UpdateInspectionChecklistRequest,
    DeleteInspectionChecklistsRequest,
    
)

from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    AddInspectionChecklistItemRequest,
    UpdateInspectionChecklistItemRequest,
    DeleteInspectionChecklistItemsRequest
)

from transactions.inspection.inspection_checklists.add_inspection_checklist_transaction import (
    add_inspection_checklist_transaction
)


from schemas.inspection_schemas.inspection_schemas import (
    AddInspectionRequest
)

from schemas.inspection_schemas.inspection_result_schemas import (
    AddInspectionResultRequest
)

from transactions.inspection.inspections.create_inspection_transaction import (
    create_inspection_transaction
)
from transactions.inspection.inspection_checklist_items.add_inspection_checklist_items_transaction import (
    add_inspection_checklist_items_transaction
)
from schemas.inspection_schemas.transaction_schemas.inspection_checklist_transaction_schemas import (
    CreateInspectionChecklistTransactionRequest
)

from transactions.inspection.inspection_checklists.create_inspection_checklist_new_ver_transaction import (
    create_inspection_checklist_new_ver_transaction
)

from fastapi import APIRouter, Depends

from schemas.inspection_schemas.inspection_item_category_schema import (
    AddInspectionItemCategoryRequest,
    UpdateInspectionItemCategoryRequest,
)

from inspection.inspection_item_categories.fetch_inspection_item_categories import (
    fetch_inspection_item_categories
)

from transactions.inspection.inspection_item_categories.add_inspection_item_category_transaction import (
    add_inspection_item_category_transaction,
)

from transactions.inspection.inspection_item_categories.update_inspection_item_category_transaction import (update_inspection_item_category_transaction)

inspection_router = APIRouter()


# inspection_types
@inspection_router.get("/inspection-types")
def get_inspection_types(
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspection_types(
        client=session.client,
        hospital_id=session.hospital_id
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


# inspections
@inspection_router.get("/inspections")
def get_inspections(
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspections(
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
    request: AddInspectionRequest,
    session: BackendSession = Depends(get_current_session),
):
    return create_inspection_transaction(
        client=session.client,
        inspection=request.inspection,
        results=request.results,
        hospital_id=session.hospital_id,
        performed_by=session.user_id
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

@inspection_router.post("/create-inspection-checklist-new-ver")
def create_inspection_checklist_new_ver(
                                        request: CreateInspectionChecklistTransactionRequest,
                                        session: BackendSession = Depends(get_current_session),
):
    return create_inspection_checklist_new_ver_transaction(
                                                            client=session.client,
                                                            request=request,
                                                            hospital_id=session.hospital_id,
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

@inspection_router.post("/create-inspection-item-categories")
def create_inspection_item_category(
    inspection_item_category: AddInspectionItemCategoryRequest,
    session: BackendSession = Depends(get_current_session),
):
    return add_inspection_item_category_transaction(
        client=session.client,
        inspection_item_category=inspection_item_category,
        hospital_id=session.hospital_id,
    )

@inspection_router.post("/update-inspection-item-category")
def update_inspection_item_category_route(
    inspection_item_category: UpdateInspectionItemCategoryRequest,
    session: BackendSession = Depends(get_current_session),
):
    return update_inspection_item_category_transaction(
        client=session.client,
        inspection_item_category=inspection_item_category,
        hospital_id=session.hospital_id,
    )