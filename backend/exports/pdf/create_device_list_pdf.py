from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle

from exports.pdf.create_pdf_doc import create_pdf_doc


def create_device_list_pdf(
                            rows: list[dict],
                            hospital_name: str
                          ):

    doc, buffer = create_pdf_doc()
    styles = getSampleStyleSheet()

    title_style = styles["Heading1"]
    title_style.fontName = "NotoSansJP-Bold"

    elements = []
    elements.append(
                    Paragraph(
                                "登録機器一覧",
                                title_style
                              )
                  )
    elements.append(Spacer(1,20))

    table_data = [[
                    "状態",
                    "保守/待機",
                    
                    "病棟",
                    "病室/保管場所",
                    "患者名",
                    "機種",
                    "型式",
                    "管理番号",
                    "シリアル番号",
                    "備考",
                    "直近メンテナンス"
                  ]]

    for row in rows:

        maintenance_info = ""
        if row["maintenance_name"]:
            maintenance_info = row["maintenance_name"]
        if row["due_at"]:
            maintenance_info += f" {row['due_at']}"
        
        location_name = (
                          row["room_name"]
                          or
                          row["stock_area_name"]
                          or
                          ""
                        )
        
        status_detail = ""
        if row["is_under_maintenance"]:
            status_detail = "保守中"
        elif row["standby"]:
            status_detail = "待機中"

        table_data.append([
                            row["status"],
                            status_detail,
                            row["ward_name"] or "",
                            location_name,
                            row["patient_name"] or "",
                            row["device_type_name"] or "",
                            row["device_model_name"] or "",
                            row["management_number"] or "",
                            row["serial_number"] or "",
                            row["note"] or "",
                            maintenance_info
                          ])

    table = Table(
                    table_data,
                    repeatRows=1,
                    colWidths=[
                                30,
                                40,
                                50,
                                60,
                                60,
                                80,
                                80,
                                60,
                                80,
                                120,
                                120
                              ]
                  )

    table.setStyle(
                    TableStyle([
                                ("FONTNAME",(0,0),(-1,0),"NotoSansJP-Bold"),
                                ("FONTNAME",(0,1),(-1,-1),"NotoSansJP"),

                                ("FONTSIZE",(0,0),(-1,-1),7),
                                ("LEADING",(0,0),(-1,-1),8),

                                ("TOPPADDING",(0,0),(-1,-1),2),
                                ("BOTTOMPADDING",(0,0),(-1,-1),2),

                                ("BACKGROUND",(0,0),(-1,0),colors.lightgrey),

                                ("BOX",(0,0),(-1,-1),1,colors.black),
                                ("GRID",(0,0),(-1,-1),0.5,colors.black)
                               ])
                  )

    elements.append(table)

    printed_at = datetime.now().strftime("%Y/%m/%d %H:%M")

    def draw_footer(canvas,doc):

        canvas.saveState()
        canvas.setFont("NotoSansJP",8)

        canvas.drawString(
                          30,
                          20,
                          f"印刷日: {printed_at}"
                         )

        canvas.drawCentredString(
                                 420,
                                 20,
                                 hospital_name
                                )

        canvas.drawRightString(
                               800,
                               20,
                               f"{doc.page}"
                              )

        canvas.restoreState()

    doc.build(
              elements,
              onFirstPage=draw_footer,
              onLaterPages=draw_footer
             )

    buffer.seek(0)

    return buffer