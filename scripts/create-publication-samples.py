"""Create layout-only downloads. Requires reportlab; not part of the website build."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'public' / 'publicaciones'
OUTPUT.mkdir(parents=True, exist_ok=True)
GOLD = colors.HexColor('#80672e')
BLACK = colors.HexColor('#171717')
GRAY = colors.HexColor('#666666')
styles = {
    'label': ParagraphStyle('label', fontName='Helvetica', fontSize=9, leading=14, textColor=GOLD, spaceAfter=24),
    'title': ParagraphStyle('title', fontName='Times-Roman', fontSize=34, leading=38, textColor=BLACK, spaceAfter=20),
    'intro': ParagraphStyle('intro', fontName='Helvetica', fontSize=12, leading=19, textColor=GRAY, spaceAfter=28),
    'heading': ParagraphStyle('heading', fontName='Times-Roman', fontSize=19, leading=24, textColor=BLACK, spaceAfter=8),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10.5, leading=17, textColor=GRAY, spaceAfter=22),
    'note': ParagraphStyle('note', fontName='Helvetica', fontSize=9, leading=14, textColor=GOLD, spaceBefore=16),
}
publications = [
    ('estrategia-arbitraje-muestra.pdf', 'ARBITRAJE', 'La estrategia comienza antes del arbitraje',
     'Una mirada a la preparación del caso, la organización de la evidencia y las decisiones que dan forma a una controversia contractual.',
     [('01 / El contexto de la controversia', 'Un espacio editorial para presentar el proyecto, sus hitos y las preguntas que motivan el análisis de una controversia contractual.'),
      ('02 / La información como punto de partida', 'Este bloque de muestra ilustra cómo se organizaría una reflexión sobre documentos, comunicaciones y antecedentes relevantes.'),
      ('03 / Una lectura estratégica del caso', 'El cierre de una publicación real podría conectar los antecedentes con las principales preguntas jurídicas. El texto definitivo se incorporará tras su revisión.')]),
    ('contratacion-publica-muestra.pdf', 'CONTRATACIÓN PÚBLICA', 'El contrato público durante la ejecución de obra',
     'Reflexiones sobre la gestión contractual, la trazabilidad de las decisiones y la prevención de desacuerdos en proyectos de infraestructura.',
     [('01 / Del contrato al proyecto', 'Un bloque introductorio para explorar los desafíos de la ejecución y la relación entre la documentación contractual y el desarrollo de una obra.'),
      ('02 / Decisiones y trazabilidad', 'Este espacio de muestra representa una sección dedicada al registro de hitos, comunicaciones y decisiones durante la vida del proyecto.'),
      ('03 / Aprendizajes de la ejecución', 'Una publicación definitiva podría cerrar con un análisis de experiencias y preguntas abiertas. Este contenido solo permite revisar la presentación visual.')]),
    ('dispute-boards-muestra.pdf', 'DISPUTE BOARDS', 'Resolver a tiempo para que el proyecto avance',
     'Una aproximación al diálogo temprano y al papel de los Dispute Boards en la gestión de controversias durante la ejecución de un proyecto.',
     [('01 / El diálogo durante el proyecto', 'Un espacio editorial para introducir las conversaciones y los desacuerdos que pueden surgir entre las partes durante la ejecución.'),
      ('02 / La perspectiva de un Dispute Board', 'Este bloque de muestra anticipa una futura reflexión sobre los mecanismos de prevención y resolución temprana de controversias.'),
      ('03 / Continuidad y colaboración', 'El texto definitivo podrá desarrollar la relación entre la gestión de desacuerdos y la continuidad del proyecto, con contenido revisado y validado.')]),
]

def decorate(canvas, doc):
    w, h = A4
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1)
    canvas.line(48, h-49, w-48, h-49)
    canvas.setFont('Helvetica', 11)
    canvas.setFillColor(BLACK)
    canvas.drawString(48, h-36, 'AARÓN ANDÍA')
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(GOLD)
    canvas.drawRightString(w-48, h-36, 'DOCUMENTO DE MUESTRA')
    canvas.setStrokeColor(colors.HexColor('#ded8c9'))
    canvas.line(48, 57, w-48, 57)
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(GRAY)
    canvas.drawString(48, 40, 'MAQUETACIÓN / OCTUBRE 2026')
    canvas.drawRightString(w-48, 40, f'{doc.page:02}')

for filename, category, title, description, sections in publications:
    doc = SimpleDocTemplate(str(OUTPUT / filename), pagesize=A4, rightMargin=48, leftMargin=48, topMargin=84, bottomMargin=80, title=f'{title} - Muestra de maquetación', author='Contenido de muestra')
    story = [Paragraph(category, styles['label']), Paragraph(title, styles['title']), Paragraph(description, styles['intro'])]
    for heading, body in sections:
        story.extend([Paragraph(heading, styles['heading']), Paragraph(body, styles['body'])])
    story.append(Paragraph('Contenido ficticio para validar el diseño y la descarga. No corresponde a una publicación real del profesional. Se reemplazará por el documento definitivo.', styles['note']))
    doc.build(story, onFirstPage=decorate, onLaterPages=decorate)
    print(OUTPUT / filename)
