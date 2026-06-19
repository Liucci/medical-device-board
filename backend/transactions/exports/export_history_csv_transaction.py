from io import BytesIO

from exports.csv.create_history_csv import (
    create_history_csv
)

from schemas.export_schemas import (
    HistoryExportRow
)


def export_history_csv_transaction(
    rows: list[HistoryExportRow]
) -> BytesIO:

    return create_history_csv(
        [
            row.model_dump()
            for row in rows
        ]
    )