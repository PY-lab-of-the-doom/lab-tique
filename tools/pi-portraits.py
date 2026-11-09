"""Génère les 4 portraits de π (assets/pi/pi-1.jpg, pi-2.jpg, pi-3.png, pi-4.jpg) à partir d'une photo source.
Usage : python3 tools/pi-portraits.py chemin/photo.jpg"""
import sys, numpy as np
from PIL import Image, ImageOps, ImageEnhance, ImageDraw, ImageFilter

W, H = 720, 960
src = Image.open(sys.argv[1]).convert("RGB")
src = ImageOps.fit(src, (W, H), Image.LANCZOS, centering=(0.5, 0.4))
g = ImageEnhance.Contrast(ImageOps.autocontrast(ImageOps.grayscale(src), cutoff=1)).enhance(1.25)

def hexc(h): return np.array([int(h[i:i+2], 16) for i in (1, 3, 5)], float)
def duotone(dark, light):
    t = np.asarray(g, float)[..., None] / 255
    return Image.fromarray((hexc(dark) * (1 - t) + hexc(light) * t).astype("uint8"))

rose = duotone("#0b0b0b", "#ff3fa4")
acide = duotone("#1a1aa8", "#d7ff1e")

cell = 11
trame = Image.new("RGB", (W, H), "#f1ede2"); d = ImageDraw.Draw(trame)
ga = np.asarray(g.filter(ImageFilter.GaussianBlur(1)), float)
for y in range(0, H, cell):
    for x in range(0, W, cell):
        r = (1 - ga[y:y+cell, x:x+cell].mean() / 255) * cell * 0.72
        if r > .4:
            cx, cy = x + cell / 2, y + cell / 2
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#0b0b0b")

pal = np.array([hexc(c) for c in ("#0b0b0b", "#2d2dff", "#ff3fa4", "#d7ff1e")])
pop = Image.fromarray(pal[np.digitize(np.asarray(g, float), [70, 125, 185])].astype("uint8"))

for i, im in enumerate([rose, acide, pop], 1):
    im.save(f"assets/pi/pi-{ {1: 1, 2: 2, 3: 4}[i] }.jpg", quality=80, optimize=True, progressive=True)
# La trame n'a que deux couleurs : PNG à palette, bien plus léger.
trame.quantize(colors=2).save("assets/pi/pi-3.png", optimize=True)
