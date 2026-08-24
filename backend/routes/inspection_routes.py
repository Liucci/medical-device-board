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
    AddInspectionRequest,CreateInspectionTransactionRequest
)
from schemas.inspection_schemas.inspection_result_schemas import (
    AddInspectionResultRequest
)

from transactions.inspection.create_inspection_transaction import (
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
from inspection.inspection_types.delete_inspection_types import (
    delete_inspection_types
)

from schemas.inspection_schemas.inspection_item_type_schemas import (
    AddInspectionItemTypeRequest,
    UpdateInspectionItemTypeRequest,
    DeleteInspectionItemTypesRequest
)

from inspection.inspection_item_types.add_inspection_item_type import (
    add_inspection_item_type
)
from inspection.inspection_item_types.update_inspection_item_type import (
    update_inspection_item_type
)
from inspection.inspection_item_types.delete_inspection_item_types import (
    delete_inspection_item_types
)


from schemas.inspection_schemas.inspection_checklist_schemas import (
    AddInspectionChecklistRequest,
    UpdateInspectionChecklistRequest,
    DeleteInspectionChecklistsRequest
)

from schemas.inspection_schemas.inspection_checklist_item_schemas import (
    AddInspectionChecklistItemRequest,
    UpdateInspectionChecklistItemRequest
)

from transactions.inspection.create_inspection_checklist_transaction import (
    create_inspection_checklist_transaction
)

from transactions.inspection.update_inspection_checklist_transaction import (
    update_inspection_checklist_transaction
)

from transactions.inspection.delete_inspection_checklist_transaction import (
    delete_inspection_checklist_transaction
)

from schemas.inspection_schemas.inspection_schemas import (
    AddInspectionRequest
)

from schemas.inspection_schemas.inspection_result_schemas import (
    AddInspectionResultRequest
)

from transactions.inspection.create_inspection_transaction import (
    create_inspection_transaction
)

inspection_router = APIRouter()


# inspection_types
@inspection_router.get("/inspection-types")
def get_inspection_types(
    session: BackendSession = Depends(get_current_session),
):
    return fetch_inspection_types(
        client=session.client
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
    request: CreateInspectionTransactionRequest,
    session: BackendSession = Depends(get_current_session),
):
    return create_inspection_transaction(
        client=session.client,
        inspection=request.inspection,
        results=request.results,
        hospital_id=session.hospital_id,
        performed_by=session.user_id
    )


@inspection_router.post("/inspection-types")
def create_inspection_type(
    inspection_type: AddInspectionTypeRequest,
    session: BackendSession = Depends(get_current_session),
):
    return add_inspection_type(
        client=session.client,
        inspection_type=inspection_type
    )


@inspection_router.put("/inspection-types")
def update_inspection_type_route(
    inspection_type: UpdateInspectionTypeRequest,
    session: BackendSession = Depends(get_current_session),
):
    return update_inspection_type(
        client=session.client,
        inspection_type=inspection_type
    )


@inspection_router.delete("/inspection-types")
def delete_inspection_types_route(
    inspection_types: DeleteInspectionTypesRequest,
    session: BackendSession = Depends(get_current_session),
):
    return delete_inspection_types(
        client=session.client,
        inspection_type=inspection_types
    )


@inspection_router.post("/inspection-item-types")
def create_inspection_item_type(
    inspection_item_type: AddInspectionItemTypeRequest,
    session: BackendSession = Depends(get_current_session),
):
    return add_inspection_item_type(
        client=session.client,
        inspection_item_type=inspection_item_type
    )


@inspection_router.put("/inspection-item-types")
def update_inspection_item_type_route(
    inspection_item_type: UpdateInspectionItemTypeRequest,
    session: BackendSession = Depends(get_current_session),
):
    return update_inspection_item_type(
        client=session.client,
        inspection_item_type=inspection_item_type
    )


@inspection_router.delete("/inspection-item-types")
def delete_inspection_item_types_route(
    inspection_item_types: DeleteInspectionItemTypesRequest,
    session: BackendSession = Depends(get_current_session),
):
    return delete_inspection_item_types(
        client=session.client,
        inspection_item_type=inspection_item_types
    )


@inspection_router.post("/create-inspection-checklist")
def create_inspection_checklist(
    inspection_checklist: AddInspectionChecklistRequest,
    items: list[AddInspectionChecklistItemRequest],
    session: BackendSession = Depends(get_current_session),
):
    return create_inspection_checklist_transaction(
        client=session.client,
        inspection_checklist=inspection_checklist,
        items=items,
        hospital_id=session.hospital_id
    )


@inspection_router.put("/update-inspection-checklist")
def update_inspection_checklist(
    inspection_checklist: UpdateInspectionChecklistRequest,
    delete_item_ids: list[int],
    update_items: list[UpdateInspectionChecklistItemRequest],
    add_items: list[AddInspectionChecklistItemRequest],
    item_orders: list,
    session: BackendSession = Depends(get_current_session),
):
    return update_inspection_checklist_transaction(
        client=session.client,
        inspection_checklist=inspection_checklist,
        delete_item_ids=delete_item_ids,
        update_items=update_items,
        add_items=add_items,
        item_orders=item_orders,
        hospital_id=session.hospital_id
    )


@inspection_router.delete("/delete-inspection-checklist")
def delete_inspection_checklist(
    inspection_checklists: DeleteInspectionChecklistsRequest,
    session: BackendSession = Depends(get_current_session),
):
    return delete_inspection_checklist_transaction(
        client=session.client,
        checklist_ids=inspection_checklists.ids,
        hospital_id=session.hospital_id
    )