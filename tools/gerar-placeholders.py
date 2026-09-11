# -*- coding: utf-8 -*-
"""Gera as imagens provisórias do portfólio (substitua por fotos reais das peças)."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1000, 750
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

PECAS = [
    ("organizador-modular", "Organizador modular", "Utilidades domésticas"),
    ("suporte-ferramentas", "Suporte de ferramentas", "Utilidades domésticas"),
    ("peca-reposicao", "Peça de reposição", "Reposição"),
    ("engrenagem-petg", "Engrenagem técnica", "Industrial"),
    ("gabarito-montagem", "Gabarito de montagem", "Industrial"),
    ("prototipo-carcaca", "Protótipo de carcaça", "Prototipagem"),
    ("bucha-nylon", "Buchas e espaçadores", "Industrial"),
    ("luminaria", "Luminária decorativa", "Utilidades domésticas"),
    ("brinde-personalizado", "Brinde personalizado", "Personalizados"),
]

def base(seed):
    img = Image.new("RGB", (W, H), (18, 21, 26))
    d = ImageDraw.Draw(img)
    # gradiente diagonal suave
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=(int(18 + 16 * t), int(21 + 18 * t), int(26 + 24 * t)))
    # "linhas de camada" na diagonal
    step = 14
    for i in range(-H, W + H, step):
        tone = 255 if (i // step + seed) % 7 else 235
        d.line([(i, 0), (i - H, H)], fill=(tone, tone, tone), width=1)
    img = img.filter(ImageFilter.GaussianBlur(0.6))
    over = Image.new("RGB", (W, H), (18, 21, 26))
    return Image.blend(img, over, 0.82)

def render(nome, titulo, categoria, seed):
    img = base(seed)
    d = ImageDraw.Draw(img, "RGBA")
    # brilho laranja no canto
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([W * 0.45, -H * 0.35, W * 1.35, H * 0.75], fill=(255, 106, 19, 60))
    img = Image.alpha_composite(img.convert("RGBA"), glow.filter(ImageFilter.GaussianBlur(90))).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")
    d.rectangle([28, 28, W - 28, H - 28], outline=(255, 255, 255, 28), width=2)
    # motivo tecnico em linhas (preenche o centro da imagem)
    cx, cy = W * 0.62, H * 0.42
    for k in range(4):
        rr = 70 + k * 46
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=(255, 255, 255, 22 if k else 40), width=2)
    for k in range(6):
        ang = k * 3.14159 / 6 + seed * 0.2
        import math
        dx, dy = math.cos(ang) * 250, math.sin(ang) * 250
        d.line([(cx - dx, cy - dy), (cx + dx, cy + dy)], fill=(255, 255, 255, 14), width=1)
    f_tag = ImageFont.truetype(BOLD, 24)
    f_tit = ImageFont.truetype(BOLD, 52)
    f_sub = ImageFont.truetype(REG, 26)
    # etiqueta da categoria
    tag = categoria.upper()
    tw = d.textlength(tag, font=f_tag)
    d.rounded_rectangle([60, 60, 60 + tw + 44, 118], 29, fill=(255, 106, 19, 235))
    d.text((82, 76), tag, font=f_tag, fill=(20, 14, 8))
    d.text((60, H - 250), titulo, font=f_tit, fill=(242, 244, 248))
    d.text((60, H - 176), "Foto ilustrativa — substitua por uma imagem real da peça", font=f_sub, fill=(150, 158, 170))
    d.line([(60, H - 120), (200, H - 120)], fill=(43, 178, 76), width=6)
    img.save(f"assets/img/portfolio/{nome}.jpg", quality=82, optimize=True, progressive=True)

for i, (n, t, c) in enumerate(PECAS):
    render(n, t, c, i)
print("ok")
