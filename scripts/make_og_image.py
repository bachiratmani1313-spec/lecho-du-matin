"""Génère l'image de partage Open Graph (1200x630) pour L'Écho du Matin."""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
img = Image.new("RGB", (W, H), "#ffffff")
d = ImageDraw.Draw(img)

SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

f_top = ImageFont.truetype(SANS, 26)
f_title = ImageFont.truetype(SERIF, 96)
f_tag = ImageFont.truetype(SANS, 30)
f_dir = ImageFont.truetype(SANS, 26)

# Cadre noir épais (style journal)
d.rectangle([20, 20, W - 20, H - 20], outline="#000000", width=6)

# Bandeau supérieur
d.rectangle([20, 20, W - 20, 90], fill="#000000")
top_txt = "ÉDITION DU JOUR  ·  AUBE DE LA MECQUE  ·  ● DIRECT"
tb = d.textbbox((0, 0), top_txt, font=f_top)
d.text(((W - (tb[2] - tb[0])) / 2, 42), top_txt, font=f_top, fill="#ffffff")

# Titre principal : L'ÉCHO (noir) DU MATIN (rouge)
part1 = "L'ÉCHO "
part2 = "DU MATIN"
b1 = d.textbbox((0, 0), part1, font=f_title)
b2 = d.textbbox((0, 0), part2, font=f_title)
total_w = (b1[2] - b1[0]) + (b2[2] - b2[0])
x = (W - total_w) / 2
y = 220
d.text((x, y), part1, font=f_title, fill="#0a0a0a")
d.text((x + (b1[2] - b1[0]), y), part2, font=f_title, fill="#dc2626")

# Slogan
tag = "6 HEURES, VU PAR L'INTELLIGENCE ARTIFICIELLE"
tgb = d.textbbox((0, 0), tag, font=f_tag)
d.text(((W - (tgb[2] - tgb[0])) / 2, 360), tag, font=f_tag, fill="#52525b")

# Ligne rouge séparatrice
d.rectangle([(W - 200) / 2, 420, (W + 200) / 2, 426], fill="#dc2626")

# Directeur
diru = "DIRECTEUR : ATMANI BACHIR"
db = d.textbbox((0, 0), diru, font=f_dir)
d.text(((W - (db[2] - db[0])) / 2, 470), diru, font=f_dir, fill="#0a0a0a")

# Bas
site = "lechodumatin.com  ·  5 langues : FR · EN · ES · DE · AR"
sb = d.textbbox((0, 0), site, font=f_dir)
d.text(((W - (sb[2] - sb[0])) / 2, 540), site, font=f_dir, fill="#71717a")

out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "og-image.png")
os.makedirs(os.path.dirname(out), exist_ok=True)
img.save(out, "PNG")
print(f"✅ Image générée : {out} ({os.path.getsize(out)} octets)")
