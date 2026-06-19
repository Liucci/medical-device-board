from io import BytesIO
from exports.pdf.create_device_list_pdf import (create_device_list_pdf)
from schemas.export_schemas import (DeviceListExportSchema)


def export_device_list_pdf_transaction(
                                        rows: list[
                                                  DeviceListExportSchema
                                                 ],
                                        hospital_name: str
                                      ) -> BytesIO:

    return create_device_list_pdf(
                                    [
                                      row.model_dump()
                                      for row in rows
                                    ],
                                    hospital_name
                                 )