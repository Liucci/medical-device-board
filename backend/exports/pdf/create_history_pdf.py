from reportlab.platypus import Table
from reportlab.platypus import TableStyle
from reportlab.platypus import Paragraph
from reportlab.platypus import Spacer
from reportlab.platypus import SimpleDocTemplate

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

from exports.pdf.create_pdf_doc import create_pdf_doc


def create_history_pdf(
                            rows: list[dict]
                      ):

    doc, buffer = create_pdf_doc()

    styles = getSampleStyleSheet()

    title_style = styles["Heading1"]
    title_style.fontName = "NotoSansJP-Bold"

    body_style = styles["BodyText"]
    body_style.fontName = "NotoSansJP"

    elements = []

    elements.append(
                        Paragraph(
                                    "機器履歴一覧",
                                    title_style
                                )
                    )

    elements.append(
                        Spacer(
                                1,
                                20
                              )
                    )

    table_data = [
                    [
                        "日時",
                        "機器ID",
                        "機種",
                        "型式",
                        "内容"
                    ]
                 ]

    for row in rows:

        table_data.append(
                            [
                                row["created_at"],
                                str(row["device_id"]),
                                row["device_type_name"],
                                row["device_model_name"],
                                row["message"]
                            ]
                         )

    table = Table(table_data)

    table.setStyle(
                    TableStyle(
                                [
                                    (
                                        "BACKGROUND",
                                        (0, 0),
                                        (-1, 0),
                                        colors.lightgrey
                                    ),
                                    (
                                        "FONTNAME",
                                        (0, 0),
                                        (-1, 0),
                                        "NotoSansJP-Bold"
                                    ),
                                    (
                                        "FONTNAME",
                                        (0, 1),
                                        (-1, -1),
                                        "NotoSansJP"
                                    ),
                                    (
                                        "BOX",
                                        (0, 0),
                                        (-1, -1),
                                        1,
                                        colors.black
                                    ),
                                    (
                                        "GRID",
                                        (0, 0),
                                        (-1, -1),
                                        0.5,
                                        colors.black
                                    )
                                ]
                              )
                 )

    elements.append(table)

    doc.build(elements)

    buffer.seek(0)

    return buffer