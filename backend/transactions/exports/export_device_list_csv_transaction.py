from io import BytesIO

from exports.csv.create_device_list_csv import (
    create_device_list_csv
)

from schemas.export_schemas import (
    DeviceListExportSchema
)


def export_device_list_csv_transaction(
    rows: list[DeviceListExportSchema]
) -> BytesIO:

    return create_device_list_csv(
        [
            row.model_dump()
            for row in rows
        ]
    )