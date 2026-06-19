履歴PDF出力機能


HistoryModal
↓
filteredHistories
↓
exportHistoryPdfTransaction()
↓
toExportHistoriesRequest()
↓
POST /export-history-pdf

型

HistoryExportRow

createdAt
deviceId
deviceTypeName
deviceModelName
actionType
maintenanceStartedAt
maintenanceFinishedAt
roomName
stockAreaName
patientName
message


HistoryExportRowDB

created_at
device_id
device_type_name
device_model_name
action_type
maintenance_started_at
maintenance_finished_at
room_name
stock_area_name
patient_name
message


配置は

room_name or stock_area_name


route

auth_user_id = Depends(get_auth_user_id)

current_user = fetch_current_user(auth_user_id)

hospital = fetch_hospital(
    current_user["hospital_id"]
)

hospital_name = hospital["hospital_name"]

pdf_buffer = export_history_pdf_transaction(
    request.rows,
    hospital_name
)
PDF作成仕様
create_pdf_doc
pagesize=landscape(A4)

横向き A4。

Table
Table(
    table_data,
    repeatRows=1,
    colWidths=[...]
)
列名を全ページに表示
colWidthsで幅調整
フォント
("FONTNAME",(0,0),(-1,0),"NotoSansJP-Bold")
("FONTNAME",(0,1),(-1,-1),"NotoSansJP")
("FONTSIZE",(0,0),(-1,0),7)
("FONTSIZE",(0,1),(-1,-1),7)
("LEADING",(0,0),(-1,-1),8)
("TOPPADDING",(0,0),(-1,-1),2)
("BOTTOMPADDING",(0,0),(-1,-1),2)
日時表示

created_at

datetime.fromisoformat(
    row["created_at"].replace("Z","+00:00")
).strftime("%Y/%m/%d\n%H:%M")

2行表示。

フッター

全ページ共通

左

hospital_name

中央

datetime.now().strftime("%Y/%m/%d %H:%M")

右

Page {doc.page}

実装

doc.build(
    elements,
    onFirstPage=draw_footer,
    onLaterPages=draw_footer
)
デバッグ方針.md

大量ログ防止ルール

list

先頭5件のみ

print(rows[:5])
list[dict]

代表1件のみ

for key, value in rows[0].items():
    print(f"・{key}: {value}")
JSON

代表1件

console.log(request.rows[0])
Exception

禁止

except Exception:
    return None

推奨

except Exception as e:
    print(e)
    return None