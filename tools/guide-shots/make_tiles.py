"""Sinh "ảnh vệ tinh" giả lập (khu Núi) để chụp ảnh hướng dẫn khi không truy cập được tile thật.
Chạy: python3 make_tiles.py  ->  tiles/{z}/{y}/{x}.jpg  (z 17..19, hệ Web Mercator như Esri).
Cảnh dựng theo mét (x đông, y bắc, gốc tại góc D của khu Núi) trong scene.json, dùng chung với shots.mjs.
"""
import json, math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SC = json.load(open(os.path.join(HERE, 'scene.json')))
ORG = SC['origin']  # lat, lng của góc D
M_LAT = 111320.0
M_LNG = 111320.0 * math.cos(math.radians(ORG[0]))
RES = 0.1  # m / px của ảnh gốc
X0, X1, Y0, Y1 = -220, 320, -200, 270
W, H = int((X1 - X0) / RES), int((Y1 - Y0) / RES)
rng = random.Random(7)
np_rng = np.random.default_rng(7)


def px(x, y):
    return ((x - X0) / RES, (Y1 - y) / RES)


def noise(h, w, scale, amp):
    small = np_rng.normal(0, 1, (max(2, h // scale), max(2, w // scale)))
    img = Image.fromarray(((small - small.min()) / (np.ptp(small) + 1e-9) * 255).astype('uint8')).resize((w, h), Image.BICUBIC)
    return (np.asarray(img, dtype='float32') / 255 - .5) * amp


def build():
    # nền rừng: xanh đậm có vân
    base = np.zeros((H, W, 3), dtype='float32')
    base[:] = (44, 74, 38)
    for scale, amp in ((900, 34), (260, 26), (70, 20), (18, 14)):
        n = noise(H, W, scale, amp)
        base += n[..., None] * np.array([.8, 1.0, .5])
    img = Image.fromarray(np.clip(base, 0, 255).astype('uint8'))
    d = ImageDraw.Draw(img, 'RGBA')

    # khoảng trống cỏ sáng
    for c in SC['clearings']:
        cx, cy = px(*c['c']); r = c['r'] / RES
        layer = Image.new('RGBA', img.size, (0, 0, 0, 0)); ld = ImageDraw.Draw(layer)
        for k in range(14):
            a = rng.random() * 6.28; rr = r * (.55 + rng.random() * .5)
            ld.ellipse((cx + math.cos(a) * r * .4 - rr, cy + math.sin(a) * r * .4 - rr, cx + math.cos(a) * r * .4 + rr, cy + math.sin(a) * r * .4 + rr), fill=(118, 142, 70, 140))
        img.paste(layer.filter(ImageFilter.GaussianBlur(r * .12)), (0, 0), layer.filter(ImageFilter.GaussianBlur(r * .12)))
    d = ImageDraw.Draw(img, 'RGBA')

    # đường mòn
    def road(pts, wd, col, edge):
        P = [px(*p) for p in pts]
        d.line(P, fill=edge, width=int((wd + 1.4) / RES), joint='curve')
        d.line(P, fill=col, width=int(wd / RES), joint='curve')
        for p in P:
            rr = (wd + 1.4) / 2 / RES; d.ellipse((p[0] - rr, p[1] - rr, p[0] + rr, p[1] + rr), fill=edge)
        for p in P:
            rr = wd / 2 / RES; d.ellipse((p[0] - rr, p[1] - rr, p[0] + rr, p[1] + rr), fill=col)
    for r in SC['roads']:
        road(r['pts'], r['w'], (150, 124, 88, 255), (104, 86, 58, 190))

    # cây: tán tròn có bóng
    inside_free = lambda x, y: all(not (abs(x - rd[0]) < rd[2] and abs(y - rd[1]) < rd[3]) for rd in SC['noTrees'])
    def near_road(x, y):
        for r in SC['roads']:
            for a, b in zip(r['pts'], r['pts'][1:]):
                ax, ay, bx, by = a[0], a[1], b[0], b[1]
                t = max(0, min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2 + 1e-9)))
                if math.hypot(x - (ax + t * (bx - ax)), y - (ay + t * (by - ay))) < r['w'] / 2 + 1.6: return True
        return False
    trees = []
    for _ in range(24000):
        x = rng.uniform(X0, X1); y = rng.uniform(Y0, Y1)
        if near_road(x, y) or not inside_free(x, y): continue
        dens = 1.0
        for c in SC['clearings']:
            if math.hypot(x - c['c'][0], y - c['c'][1]) < c['r']: dens = .12
        if rng.random() > dens: continue
        trees.append((x, y, rng.uniform(1.6, 3.6)))
    trees.sort(key=lambda t: -t[1])
    for x, y, r in trees:
        cx, cy = px(x, y); rr = r / RES
        d.ellipse((cx - rr + 0.5 / RES, cy - rr + 0.6 / RES, cx + rr + 0.5 / RES, cy + rr + 0.6 / RES), fill=(8, 22, 8, 120))
        g = rng.choice([(34, 84, 36), (42, 98, 44), (28, 70, 32), (56, 110, 52), (70, 104, 48)])
        d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=g + (255,))
        d.ellipse((cx - rr * .55 - rr * .15, cy - rr * .55 - rr * .15, cx + rr * .35, cy + rr * .35), fill=(min(g[0] + 28, 255), min(g[1] + 30, 255), min(g[2] + 16, 255), 150))

    # đá
    for rk in SC['rocks']:
        cx, cy = px(*rk['c'])
        for _ in range(rk['n']):
            a = rng.random() * 6.28; rr = rng.uniform(.6, 1.7) / RES; dist = rng.random() * rk['r'] / RES
            x = cx + math.cos(a) * dist; y = cy + math.sin(a) * dist
            d.ellipse((x - rr + 6, y - rr + 8, x + rr + 6, y + rr + 8), fill=(0, 0, 0, 90))
            d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=rng.choice([(138, 136, 128, 255), (156, 152, 142, 255), (118, 116, 108, 255)]))

    # công trình: bóng + mái + sống mái
    for b in SC['buildings']:
        cx, cy = px(*b['c']); w = b['w'] / RES / 2; hh = b['h'] / RES / 2
        d.rectangle((cx - w + 0.9 / RES, cy - hh + 1.1 / RES, cx + w + 0.9 / RES, cy + hh + 1.1 / RES), fill=(0, 0, 0, 120))
        d.rectangle((cx - w, cy - hh, cx + w, cy + hh), fill=tuple(b['roof']) + (255,), outline=(60, 40, 30, 255), width=4)
        d.line((cx - w, cy, cx + w, cy), fill=tuple(max(0, c - 40) for c in b['roof']) + (255,), width=5)
        d.rectangle((cx - w, cy - hh, cx + w, cy - hh * .55), fill=(255, 255, 255, 28))
    img = img.filter(ImageFilter.GaussianBlur(.8))
    # nhiễu hạt nhẹ cho giống ảnh chụp
    arr = np.asarray(img, dtype='float32') + np_rng.normal(0, 3.5, (H, W, 1))
    return Image.fromarray(np.clip(arr, 0, 255).astype('uint8'))


def tile_ll(z, x, y):
    n = 2 ** z
    lng = x / n * 360 - 180
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
    return lat, lng


def to_local(lat, lng):
    return ((lng - ORG[1]) * M_LNG, (lat - ORG[0]) * M_LAT)


def main():
    master = build()
    out = os.path.join(HERE, 'tiles'); os.makedirs(out, exist_ok=True)
    lat0, lng0 = ORG
    for z in (17, 18, 19):
        n = 2 ** z
        def tile_of(lat, lng):
            x = (lng + 180) / 360 * n
            y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
            return int(x), int(y)
        xa, ya = tile_of(lat0 + 260 / M_LAT, lng0 - 210 / M_LNG)
        xb, yb = tile_of(lat0 - 190 / M_LAT, lng0 + 310 / M_LNG)
        for ty in range(ya, yb + 1):
            for tx in range(xa, xb + 1):
                # affine từ pixel tile -> pixel ảnh gốc, nội suy từ 3 góc
                p00 = to_local(*tile_ll(z, tx, ty)); p10 = to_local(*tile_ll(z, tx + 1, ty)); p01 = to_local(*tile_ll(z, tx, ty + 1))
                a00 = px(*p00); a10 = px(*p10); a01 = px(*p01)
                coef = ((a10[0] - a00[0]) / 256, (a01[0] - a00[0]) / 256, a00[0], (a10[1] - a00[1]) / 256, (a01[1] - a00[1]) / 256, a00[1])
                tile = master.transform((256, 256), Image.AFFINE, coef, resample=Image.BICUBIC, fillcolor=(40, 66, 36))
                d = os.path.join(out, str(z), str(ty)); os.makedirs(d, exist_ok=True)
                tile.save(os.path.join(d, f'{tx}.jpg'), quality=82)
    print('ok')


if __name__ == '__main__':
    main()
