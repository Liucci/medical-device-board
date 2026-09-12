import math
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


BASE_DIR = Path(__file__).resolve().parents[2]

FONT_PATH = (
    BASE_DIR
    / "fonts"
    / "NotoSansJP-Regular.ttf"
)

FONT_BOLD_PATH = (
    BASE_DIR
    / "fonts"
    / "NotoSansJP-Bold.ttf"
)

pdfmetrics.registerFont(
    TTFont(
        "NotoSansJP",
        str(FONT_PATH)
    )
)

pdfmetrics.registerFont(
    TTFont(
        "NotoSansJP-Bold",
        str(FONT_BOLD_PATH)
    )
)


def generate_inspection_pdf(
    pdf_tables_by_checklist: dict,
    orientation: str,
    font_size: int,
    hospital_name: str
) -> bytes:

    print(
        "generate_inspection_pdf"
    )

    buffer = __import__("io").BytesIO()

    if orientation == "landscape":
        page_width, page_height = landscape(A4)
    else:
        page_width, page_height = A4

    pdf = canvas.Canvas(
        buffer,
        pagesize=(page_width, page_height)
    )

    margin_left = 12 * mm
    margin_right = 12 * mm
    margin_top = 12 * mm
    margin_bottom = 15 * mm

    footer_height = 8 * mm

    available_width = (
        page_width
        - margin_left
        - margin_right
    )

    available_height = (
        page_height
        - margin_top
        - margin_bottom
        - footer_height
    )

    title_style = ParagraphStyle(
        "title",
        fontName="NotoSansJP-Bold",
        fontSize=11,
        leading=14,
        alignment=TA_LEFT
    )

    header_label_style = ParagraphStyle(
        "header_label",
        fontName="NotoSansJP-Bold",
        fontSize=font_size,
        leading=font_size + 2,
        alignment=TA_LEFT
    )

    header_value_style = ParagraphStyle(
        "header_value",
        fontName="NotoSansJP",
        fontSize=font_size,
        leading=font_size + 2,
        alignment=TA_LEFT
    )

    table_header_style = ParagraphStyle(
        "table_header",
        fontName="NotoSansJP-Bold",
        fontSize=font_size,
        leading=font_size + 1,
        alignment=TA_CENTER
    )

    table_body_style = ParagraphStyle(
        "table_body",
        fontName="NotoSansJP",
        fontSize=font_size,
        leading=font_size + 1,
        alignment=TA_LEFT
    )

    table_center_style = ParagraphStyle(
        "table_center",
        fontName="NotoSansJP",
        fontSize=font_size,
        leading=font_size + 1,
        alignment=TA_CENTER
    )

    jst = ZoneInfo(
        "Asia/Tokyo"
    )

    def format_created_at(
        created_at
    ):

        if not created_at:
            return ""

        if isinstance(
            created_at,
            datetime
        ):
            dt = created_at
        else:
            dt = datetime.fromisoformat(
                str(created_at).replace(
                    "Z",
                    "+00:00"
                )
            )

        if dt.tzinfo is not None:
            dt = dt.astimezone(
                jst
            )

        return dt.strftime(
            "%Y/%m/%d %H:%M"
        )

    def draw_footer():

        created_at = datetime.now(
            jst
        )

        created_text = (
            "作成日時: "
            + created_at.strftime(
                "%Y/%m/%d %H:%M"
            )
        )

        pdf.setFont(
            "NotoSansJP",
            7
        )

        pdf.drawString(
            margin_left,
            7 * mm,
            hospital_name
        )

        pdf.drawRightString(
            page_width - margin_right,
            7 * mm,
            created_text
        )

    def draw_inspection_header(
        checklist_name,
        checklist_version,
        inspection
    ):

        y = page_height - margin_top

        title = (
            f"{checklist_name} "
            f"（Ver.{checklist_version}）"
        )

        title_paragraph = Paragraph(
            title,
            title_style
        )

        title_width, title_height = (
            title_paragraph.wrap(
                available_width,
                20 * mm
            )
        )

        title_paragraph.drawOn(
            pdf,
            margin_left,
            y - title_height
        )

        y -= (
            title_height
            + 5 * mm
        )

        header_data = [
            [
                Paragraph(
                    "患者名",
                    header_label_style
                ),
                Paragraph(
                    str(
                        inspection.get(
                            "patient_name"
                        ) or ""
                    ),
                    header_value_style
                ),
                Paragraph(
                    "機器種別",
                    header_label_style
                ),
                Paragraph(
                    str(
                        inspection.get(
                            "device_type_name"
                        ) or ""
                    ),
                    header_value_style
                )
            ],
            [
                Paragraph(
                    "機種名",
                    header_label_style
                ),
                Paragraph(
                    str(
                        inspection.get(
                            "device_model_name"
                        ) or ""
                    ),
                    header_value_style
                ),
                Paragraph(
                    "管理番号",
                    header_label_style
                ),
                Paragraph(
                    str(
                        inspection.get(
                            "management_number"
                        ) or ""
                    ),
                    header_value_style
                )
            ],
            [
                Paragraph(
                    "シリアル番号",
                    header_label_style
                ),
                Paragraph(
                    str(
                        inspection.get(
                            "serial_number"
                        ) or ""
                    ),
                    header_value_style
                ),
                Paragraph(
                    "病棟",
                    header_label_style
                ),
                Paragraph(
                    str(
                        inspection.get(
                            "ward_name"
                        ) or ""
                    ),
                    header_value_style
                )
            ],
            [
                Paragraph(
                    "病室",
                    header_label_style
                ),
                Paragraph(
                    str(
                        inspection.get(
                            "room_name"
                        ) or ""
                    ),
                    header_value_style
                ),
                Paragraph(
                    "点検区分",
                    header_label_style
                ),
                Paragraph(
                    str(
                        inspection.get(
                            "inspection_type_name"
                        ) or ""
                    ),
                    header_value_style
                )
            ]
        ]

        header_table = Table(
            header_data,
            colWidths=[
                25 * mm,
                55 * mm,
                25 * mm,
                available_width - 105 * mm
            ]
        )

        header_table.setStyle(
            TableStyle(
                [
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.4,
                        colors.grey
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "MIDDLE"
                    ),
                    (
                        "BACKGROUND",
                        (0, 0),
                        (0, -1),
                        colors.lightgrey
                    ),
                    (
                        "BACKGROUND",
                        (2, 0),
                        (2, -1),
                        colors.lightgrey
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        3
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        3
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        2
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        2
                    )
                ]
            )
        )

        _, header_height = header_table.wrap(
            available_width,
            available_height
        )

        header_table.drawOn(
            pdf,
            margin_left,
            y - header_height
        )

        return (
            y
            - header_height
            - 5 * mm
        )

    def draw_matrix(
        checklist_inspections,
        rows,
        start_y
    ):

        if not checklist_inspections:
            return

        item_width = 58 * mm

        inspection_area_width = (
            available_width
            - item_width
        )

        min_inspection_column_width = max(
            16 * mm,
            font_size * 5.0
        )

        max_columns = max(
            1,
            math.floor(
                inspection_area_width
                / min_inspection_column_width
            )
        )

        for start_index in range(
            0,
            len(checklist_inspections),
            max_columns
        ):

            page_inspections = checklist_inspections[
                start_index:
                start_index + max_columns
            ]

            inspection_count = len(
                page_inspections
            )

            inspection_column_width = (
                inspection_area_width
                / inspection_count
            )

            table_data = []

            dates = []
            times = []
            performed_by_names = []

            for inspection in page_inspections:

                created_at = datetime.fromisoformat(
                    inspection["created_at"]
                )

                created_at_jst = (
                    created_at.astimezone(
                        jst
                    )
                )

                dates.append(
                    created_at_jst.strftime(
                        "%Y/%m/%d"
                    )
                )

                times.append(
                    created_at_jst.strftime(
                        "%H:%M"
                    )
                )

                performed_by_names.append(
                    inspection.get(
                        "performed_by_name"
                    ) or ""
                )

            table_data.append(
                [
                    Paragraph(
                        "点検項目",
                        table_header_style
                    ),
                    *[
                        Paragraph(
                            date,
                            table_header_style
                        )
                        for date in dates
                    ]
                ]
            )

            table_data.append(
                [
                    "",
                    *[
                        Paragraph(
                            time,
                            table_header_style
                        )
                        for time in times
                    ]
                ]
            )

            table_data.append(
                [
                    "",
                    *[
                        Paragraph(
                            name,
                            table_header_style
                        )
                        for name in performed_by_names
                    ]
                ]
            )

            for row in rows:

                table_data.append(
                    [
                        Paragraph(
                            row["item_name"],
                            table_body_style
                        ),
                        *[
                            Paragraph(
                                ""
                                if value is None
                                else str(value),
                                table_center_style
                            )
                            for value in row["values"][
                                start_index:
                                start_index + max_columns
                            ]
                        ]
                    ]
                )

            col_widths = [
                item_width
            ] + [
                inspection_column_width
                for _ in page_inspections
            ]

            table = Table(
                table_data,
                colWidths=col_widths,
                repeatRows=3
            )

            table.setStyle(
                TableStyle(
                    [
                        (
                            "GRID",
                            (0, 0),
                            (-1, -1),
                            0.4,
                            colors.grey
                        ),
                        (
                            "BACKGROUND",
                            (0, 0),
                            (-1, 2),
                            colors.lightgrey
                        ),
                        (
                            "SPAN",
                            (0, 0),
                            (0, 2)
                        ),
                        (
                            "VALIGN",
                            (0, 0),
                            (-1, -1),
                            "MIDDLE"
                        ),
                        (
                            "ALIGN",
                            (1, 0),
                            (-1, -1),
                            "CENTER"
                        ),
                        (
                            "LEFTPADDING",
                            (0, 0),
                            (-1, -1),
                            2
                        ),
                        (
                            "RIGHTPADDING",
                            (0, 0),
                            (-1, -1),
                            2
                        ),
                        (
                            "TOPPADDING",
                            (0, 0),
                            (-1, -1),
                            2
                        ),
                        (
                            "BOTTOMPADDING",
                            (0, 0),
                            (-1, -1),
                            2
                        )
                    ]
                )
            )

            table_width, table_height = table.wrap(
                available_width,
                available_height
            )

            if (
                start_index > 0
                or start_y - table_height < margin_bottom + footer_height
            ):

                pdf.showPage()

                draw_footer()

                start_y = (
                    page_height
                    - margin_top
                )

                inspection = page_inspections[0]

                start_y = draw_inspection_header(
                    inspection["checklist_name"],
                    inspection["checklist_version"],
                    inspection
                )

            table.drawOn(
                pdf,
                margin_left,
                start_y - table_height
            )

            draw_footer()

            if (
                start_index + max_columns
                < len(checklist_inspections)
            ):
                pdf.showPage()

    for checklist_id, checklist_data in (
        pdf_tables_by_checklist.items()
    ):

        inspections = checklist_data[
            "inspections"
        ]

        rows = checklist_data[
            "rows"
        ]

        if not inspections:
            continue

        first_inspection = inspections[0]

        start_y = draw_inspection_header(
            first_inspection["checklist_name"],
            first_inspection["checklist_version"],
            first_inspection
        )

        draw_matrix(
            inspections,
            rows,
            start_y
        )

        pdf.showPage()

    pdf.save()

    return buffer.getvalue()