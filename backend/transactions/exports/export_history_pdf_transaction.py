from exports.pdf.create_history_pdf import create_history_pdf
from schemas.export_schemas import HistoryExportRow


def export_history_pdf_transaction(
                                    rows: list[HistoryExportRow]
                                  ):

    return create_history_pdf(
                                [
                                  row.model_dump()
                                  for row in rows
                                ]
                             )