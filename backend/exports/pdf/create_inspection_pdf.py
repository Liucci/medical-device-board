from io import BytesIO
from datetime import datetime

from reportlab.platypus import (
    Table,
    TableStyle,
    Paragraph,
    Spacer,
    PageBreak,
)
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.units import mm

from exports.pdf.create_pdf_doc import create_pdf_doc


# ============================================================
# レイアウト定数
# ============================================================

ITEM_COLUMN_WIDTH = 45 * mm
RESULT_COLUMN_WIDTH = 8 * mm

LEFT_MARGIN = 10 * mm
RIGHT_MARGIN = 10 * mm

TOP_MARGIN = 10 * mm
BOTTOM_MARGIN = 15 * mm

# ヘッダー・機器情報等で使用する高さを考慮した
# 項目の1ページあたり最大行数
MAX_ITEM_ROWS = 38


# ============================================================
# 日時フォーマット
# ============================================================

def format_inspection_datetime(value: str | None) -> str:
    """
    created_at を

        MM/DD
        HH:MM

    の2行に変換する。
    """

    if not value:
        return ""

    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))

        return (
            f"{dt.strftime('%m/%d')}"
            f"<br/>"
            f"{dt.strftime('%H:%M')}"
        )

    except (ValueError, TypeError):
        return value


# ============================================================
# グループ化
# ============================================================

def group_inspection_rows(
    rows: list[dict],
) -> list[dict]:
    """
    同一管理番号 + 同一点検表でグループ化する。
    """

    groups: dict[tuple, dict] = {}

    for row in rows:

        key = (
            row.get("management_number"),
            row.get("checklist_name"),
        )

        if key not in groups:
            groups[key] = {
                "management_number": row.get("management_number"),
                "serial_number": row.get("serial_number"),
                "device_type_name": row.get("device_type_name"),
                "device_model_name": row.get("device_model_name"),
                "inspection_type_name": row.get("inspection_type_name"),
                "checklist_name": row.get("checklist_name"),
                "inspections": [],
            }

        groups[key]["inspections"].extend(
            row.get("inspections") or []
        )

    return list(groups.values())


# ============================================================
# 項目名取得
# ============================================================

def get_unique_item_names(
    inspections: list[dict],
) -> list[str]:
    """
    inspection結果に登場するitem_nameを
    登場順を維持したまま重複排除する。
    """

    item_names: list[str] = []
    seen: set[str] = set()

    for inspection in inspections:

        for result in inspection.get("results") or []:

            item_name = result.get("item_name")

            if not item_name:
                continue

            if item_name in seen:
                continue

            seen.add(item_name)
            item_names.append(item_name)

    return item_names


# ============================================================
# 結果取得
# ============================================================

def get_result_value(
    inspection: dict,
    item_name: str,
) -> str:
    """
    指定されたitem_nameの結果を取得する。

    同一inspection内に同じitem_nameが複数存在した場合は
    最初の値を使用する。
    """

    for result in inspection.get("results") or []:

        if result.get("item_name") != item_name:
            continue

        value = result.get("value")

        if value is None:
            return ""

        return str(value)

    return ""


# ============================================================
# 横方向分割
# ============================================================

def chunk_list(
    values: list,
    size: int,
) -> list[list]:

    if size <= 0:
        return [values]

    return [
        values[index:index + size]
        for index in range(0, len(values), size)
    ]


# ============================================================
# PDF生成
# ============================================================

def create_inspection_pdf(
    rows: list[dict],
    hospital_name: str,
) -> BytesIO:

    # --------------------------------------------------------
    # A4縦
    # --------------------------------------------------------

    doc, buffer = create_pdf_doc(
        orientation="portrait"
    )

    page_width, page_height = A4

    usable_width = (
        page_width
        - LEFT_MARGIN
        - RIGHT_MARGIN
    )

    # --------------------------------------------------------
    # 結果列数をA4横幅から自動計算
    # --------------------------------------------------------

    max_result_columns = int(
        (usable_width - ITEM_COLUMN_WIDTH)
        // RESULT_COLUMN_WIDTH
    )

    if max_result_columns < 1:
        max_result_columns = 1

    # --------------------------------------------------------
    # スタイル
    # --------------------------------------------------------

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "InspectionTitle",
        parent=styles["Normal"],
        fontName="NotoSansJP-Bold",
        fontSize=12,
        leading=15,
        alignment=TA_LEFT,
        spaceAfter=4,
    )

    info_style = ParagraphStyle(
        "InspectionInfo",
        parent=styles["Normal"],
        fontName="NotoSansJP",
        fontSize=7,
        leading=9,
        alignment=TA_LEFT,
    )

    header_style = ParagraphStyle(
        "InspectionHeader",
        parent=styles["Normal"],
        fontName="NotoSansJP-Bold",
        fontSize=6,
        leading=7,
        alignment=TA_CENTER,
    )

    item_style = ParagraphStyle(
        "InspectionItem",
        parent=styles["Normal"],
        fontName="NotoSansJP",
        fontSize=7,
        leading=9,
        alignment=TA_LEFT,
    )

    result_style = ParagraphStyle(
        "InspectionResult",
        parent=styles["Normal"],
        fontName="NotoSansJP",
        fontSize=7,
        leading=8,
        alignment=TA_CENTER,
    )

    # --------------------------------------------------------
    # Story
    # --------------------------------------------------------

    story = []

    groups = group_inspection_rows(rows)

    for group_index, group in enumerate(groups):

        inspections = group.get("inspections") or []

        if not inspections:
            continue

        item_names = get_unique_item_names(
            inspections
        )

        if not item_names:
            continue

        # ====================================================
        # 横方向ページ分割
        # ====================================================

        inspection_chunks = chunk_list(
            inspections,
            max_result_columns,
        )

        # ====================================================
        # 縦方向ページ分割
        # ====================================================

        item_chunks = chunk_list(
            item_names,
            MAX_ITEM_ROWS,
        )

        total_horizontal_pages = len(
            inspection_chunks
        )

        total_vertical_pages = len(
            item_chunks
        )

        total_group_pages = (
            total_horizontal_pages
            * total_vertical_pages
        )

        current_group_page = 0

        for item_chunk_index, current_item_names in enumerate(
            item_chunks
        ):

            for inspection_chunk_index, current_inspections in enumerate(
                inspection_chunks
            ):

                current_group_page += 1

                # --------------------------------------------
                # ページ区切り
                # --------------------------------------------

                if group_index > 0 or current_group_page > 1:
                    story.append(PageBreak())

                # --------------------------------------------
                # タイトル
                # --------------------------------------------

                story.append(
                    Paragraph(
                        "点検結果一覧",
                        title_style,
                    )
                )

                # --------------------------------------------
                # 機器情報
                # --------------------------------------------

                device_info = (
                    f"<b>機種：</b>"
                    f"{group.get('device_type_name') or ''}"
                    f"&nbsp;&nbsp;&nbsp;"
                    f"<b>型式：</b>"
                    f"{group.get('device_model_name') or ''}"
                    f"&nbsp;&nbsp;&nbsp;"
                    f"<b>管理番号：</b>"
                    f"{group.get('management_number') or ''}"
                )

                story.append(
                    Paragraph(
                        device_info,
                        info_style,
                    )
                )

                story.append(
                    Spacer(1, 2 * mm)
                )

                # --------------------------------------------
                # 点検表情報
                # --------------------------------------------

                checklist_info = (
                    f"<b>点検表：</b>"
                    f"{group.get('checklist_name') or ''}"
                    f"&nbsp;&nbsp;&nbsp;"
                    f"<b>点検種別：</b>"
                    f"{group.get('inspection_type_name') or ''}"
                )

                story.append(
                    Paragraph(
                        checklist_info,
                        info_style,
                    )
                )

                story.append(
                    Spacer(1, 3 * mm)
                )

                # --------------------------------------------
                # ヘッダー
                # --------------------------------------------

                header_datetime = [
                    Paragraph(
                        "点検項目",
                        header_style,
                    )
                ]

                header_performer = [""]

                for inspection in current_inspections:

                    created_at = format_inspection_datetime(
                        inspection.get("created_at")
                    )

                    header_datetime.append(
                        Paragraph(
                            created_at,
                            header_style,
                        )
                    )

                    performer = (
                        inspection.get("performed_by_name")
                        or ""
                    )

                    header_performer.append(
                        Paragraph(
                            performer,
                            header_style,
                        )
                    )

                # --------------------------------------------
                # テーブル本体
                # --------------------------------------------

                table_data = [
                    header_datetime,
                    header_performer,
                ]

                for item_name in current_item_names:

                    row_data = [
                        Paragraph(
                            item_name,
                            item_style,
                        )
                    ]

                    for inspection in current_inspections:

                        value = get_result_value(
                            inspection,
                            item_name,
                        )

                        row_data.append(
                            Paragraph(
                                value,
                                result_style,
                            )
                        )

                    table_data.append(row_data)

                # --------------------------------------------
                # 列幅
                # --------------------------------------------

                col_widths = [
                    ITEM_COLUMN_WIDTH
                ] + [
                    RESULT_COLUMN_WIDTH
                    for _ in current_inspections
                ]

                # --------------------------------------------
                # Table
                # --------------------------------------------

                table = Table(
                    table_data,
                    colWidths=col_widths,
                    repeatRows=2,
                    hAlign="LEFT",
                )

                table.setStyle(
                    TableStyle(
                        [
                            (
                                "FONTNAME",
                                (0, 0),
                                (-1, -1),
                                "NotoSansJP",
                            ),
                            (
                                "FONTNAME",
                                (0, 0),
                                (-1, 1),
                                "NotoSansJP-Bold",
                            ),
                            (
                                "BACKGROUND",
                                (0, 0),
                                (-1, 1),
                                colors.lightgrey,
                            ),
                            (
                                "GRID",
                                (0, 0),
                                (-1, -1),
                                0.4,
                                colors.black,
                            ),
                            (
                                "VALIGN",
                                (0, 0),
                                (-1, -1),
                                "MIDDLE",
                            ),
                            (
                                "ALIGN",
                                (1, 0),
                                (-1, -1),
                                "CENTER",
                            ),
                            (
                                "ALIGN",
                                (0, 0),
                                (0, -1),
                                "LEFT",
                            ),
                            (
                                "LEFTPADDING",
                                (0, 0),
                                (-1, -1),
                                2,
                            ),
                            (
                                "RIGHTPADDING",
                                (0, 0),
                                (-1, -1),
                                2,
                            ),
                            (
                                "TOPPADDING",
                                (0, 0),
                                (-1, -1),
                                2,
                            ),
                            (
                                "BOTTOMPADDING",
                                (0, 0),
                                (-1, -1),
                                2,
                            ),
                        ]
                    )
                )

                story.append(table)

    # ========================================================
    # フッター
    # ========================================================

    def draw_footer(canvas, doc):

        canvas.saveState()

        canvas.setFont(
            "NotoSansJP",
            6,
        )

        printed_at = datetime.now().strftime(
            "%Y/%m/%d %H:%M"
        )

        footer_y = 8 * mm

        # 病院名
        canvas.drawString(
            LEFT_MARGIN,
            footer_y,
            hospital_name or "",
        )

        # 印刷日時
        canvas.drawCentredString(
            page_width / 2,
            footer_y,
            f"印刷日時：{printed_at}",
        )

        # ページ番号
        canvas.drawRightString(
            page_width - RIGHT_MARGIN,
            footer_y,
            f"{doc.page}ページ",
        )

        canvas.restoreState()

    # ========================================================
    # PDF build
    # ========================================================

    doc.build(
        story,
        onFirstPage=draw_footer,
        onLaterPages=draw_footer,
    )

    buffer.seek(0)

    return buffer