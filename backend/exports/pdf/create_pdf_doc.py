from io import BytesIO

from reportlab.platypus import SimpleDocTemplate
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from reportlab.lib.pagesizes import landscape


pdfmetrics.registerFont(
    TTFont(
        "NotoSansJP",
        "fonts/NotoSansJP-Regular.ttf"
    )
)

pdfmetrics.registerFont(
    TTFont(
        "NotoSansJP-Bold",
        "fonts/NotoSansJP-Bold.ttf"
    )
)


def create_pdf_doc():

    buffer = BytesIO()

    doc = SimpleDocTemplate(
                                buffer,
                                pagesize=landscape(A4)
                             )

    return doc, buffer