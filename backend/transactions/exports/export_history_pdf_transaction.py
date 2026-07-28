from exports.pdf.create_history_pdf import create_history_pdf
from schemas.export_schemas import HistoryExportRow


def export_history_pdf_transaction(
                                    rows: list[HistoryExportRow],
                                    hospital_name:str,
                                    show_patient_name: bool
                                  ):

    return create_history_pdf(
                                [
                                  row.model_dump()
                                  for row in rows
                                ],
                                hospital_name=hospital_name,
                                show_patient_name=show_patient_name
                             )