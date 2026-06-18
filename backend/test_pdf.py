from exports.pdf.create_history_pdf import create_history_pdf

rows = [
            {
                "created_at":"2026-06-18 15:00",
                "device_id":1,
                "device_type_name":"輸液ポンプ",
                "device_model_name":"TE-161",
                "message":"管理番号変更"
            }
       ]

buffer = create_history_pdf(rows)

with open(
            "test.pdf",
            "wb"
         ) as f:

    f.write(buffer.getvalue())