from io import BytesIO

from reportlab.platypus import SimpleDocTemplate
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


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
                                buffer
                             )

    return doc, buffer