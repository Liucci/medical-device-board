from reportlab.platypus import Table
from reportlab.platypus import TableStyle
from reportlab.platypus import Paragraph
from reportlab.platypus import Spacer
from reportlab.platypus import SimpleDocTemplate
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

from exports.pdf.create_pdf_doc import create_pdf_doc


def create_history_pdf(
                            rows: list[dict],
                             hospital_name:str
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
            "操作",
            "保守開始",
            "保守終了",
            "場所",
            "患者名",
            "内容"
        ]
    ]
    for row in rows:

        created_at = ""

        if row["created_at"]:
            created_at = (
                datetime
                .fromisoformat(
                    row["created_at"].replace("Z", "+00:00")
                )
                .strftime("%Y/%m/%d\n%H:%M")
            )
        location_name = (
                                row["room_name"]
                                or row["stock_area_name"]
                                or ""
                            )
        table_data.append(
            [
                created_at,
                str(row["device_id"]),
                row["device_type_name"] or "",
                row["device_model_name"] or "",
                row["action_type"] or "",
                row["maintenance_started_at"] or "",
                row["maintenance_finished_at"] or "",
                location_name ,
                row["patient_name"] or "",
                row["message"] or ""
            ]
        )
    #table名を全ページに表示される
    table = Table(
        table_data,
        repeatRows=1,
        colWidths=[
            70,  # 日時
            30,  # ID
            70,  # 機種
            70,  # 型式
            50,  # 操作
            70,  # 保守開始
            70,  # 保守終了
            55,  # 場所
            70,  # 患者名
            150   # 内容
        ]
    )
    table.setStyle(
            TableStyle(
                        [
                            ("FONTNAME", (0, 0), (-1, 0), "NotoSansJP-Bold"),
                            ("FONTNAME", (0, 1), (-1, -1), "NotoSansJP"),
                            ("FONTSIZE", (0, 0), (-1, 0), 7),
                            ("FONTSIZE", (0, 1), (-1, -1), 7),
                            ("LEADING", (0, 0), (-1, -1), 8),
                            ("TOPPADDING", (0, 0), (-1, -1), 2),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                            ("BOX",(0, 0),(-1, -1),1,colors.black),
                            ("GRID", (0, 0), (-1, -1),0.5,colors.black)

                        ]
                        )
            )
    #印刷日作成
    printed_at = datetime.now().strftime("%Y/%m/%d %H:%M")
    def draw_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont("NotoSansJP", 8)
        canvas.drawString(30, 20, hospital_name)
        canvas.drawCentredString(420, 20, printed_at)
        canvas.drawRightString(800, 20, f"Page {doc.page}")
        canvas.restoreState()

    elements.append(table)

    doc.build(elements,
                onFirstPage=draw_footer,
                onLaterPages=draw_footer)

    buffer.seek(0)

    return buffer