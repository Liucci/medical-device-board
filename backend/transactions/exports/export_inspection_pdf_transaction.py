from io import BytesIO

from exports.pdf.create_inspection_pdf import create_inspection_pdf
from schemas.export_schemas import InspectionExportRow


def export_inspection_pdf_transaction(
    rows: list[InspectionExportRow],
    hospital_name: str,
) -> BytesIO:

    return create_inspection_pdf(
        [row.model_dump() for row in rows],
        hospital_name=hospital_name,
    )