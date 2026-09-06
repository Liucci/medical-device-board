from io import BytesIO

from reportlab.platypus import SimpleDocTemplate
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from reportlab.lib.pagesizes import landscape
from reportlab.lib.pagesizes import portrait


# ============================================================
# 日本語フォント登録
# ============================================================

pdfmetrics.registerFont(
    TTFont(
        "NotoSansJP",
        "fonts/NotoSansJP-Regular.ttf",
    )
)

pdfmetrics.registerFont(
    TTFont(
        "NotoSansJP-Bold",
        "fonts/NotoSansJP-Bold.ttf",
    )
)


# ============================================================
# PDF document作成
# ============================================================

def create_pdf_doc(
    orientation: str = "landscape",
):
    """
    共通PDF Documentを作成する。

    orientation:
        "landscape" -> A4横
        "portrait"  -> A4縦

    引数省略時は既存PDFとの互換性のため
    A4横を使用する。
    """

    buffer = BytesIO()

    # ========================================================
    # 用紙方向
    # ========================================================

    if orientation == "portrait":

        pagesize = portrait(A4)

    else:

        # 従来どおり横
        pagesize = landscape(A4)

    # ========================================================
    # Document
    # ========================================================

    doc = SimpleDocTemplate(
        buffer,
        pagesize=pagesize,
    )

    return doc, buffer