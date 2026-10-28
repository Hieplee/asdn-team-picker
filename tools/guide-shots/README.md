# Ảnh hướng dẫn bản đồ

Chụp bằng Chromium headless, Firebase được thay bằng bản giả trong bộ nhớ (không chạm dữ liệu thật), dữ liệu đội/vị trí/lệnh ở `data.mjs`, khu chơi ở `scene.json`.

```
cd tools/guide-shots && npm i
python3 -m http.server 8123 --directory ../..    # terminal khác
python3 make_tiles.py        # nền vệ tinh GIẢ (bản vẽ). Muốn nền vệ tinh thật: chạy shots.mjs với REAL_TILES=1 (máy cần mạng; vị trí/lệnh trong data.mjs là toạ độ giả định nên cần chỉnh theo địa hình thật)
node shots.mjs [key ...]     # ra out/*.png + out/meta.json (khung đánh số lấy từ DOM)
python3 build_guide.py       # webp -> assets/guide-map/, viết lại phần "Bản đồ" của guide-data.js
```

## Trang demo

`node build_demo.mjs` dựng `demo.html` + `demo/` ở gốc repo (app thật, Firebase giả trong bộ nhớ, nền vệ tinh thật). Mở `demo.html?role=captain|member|org|join` (cần mạng cho tile/font/Leaflet).
