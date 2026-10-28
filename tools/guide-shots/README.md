# Ảnh hướng dẫn bản đồ

Chụp bằng Chromium headless, Firebase được thay bằng bản giả trong bộ nhớ (không chạm dữ liệu thật), dữ liệu đội/vị trí/lệnh ở `data.mjs`, khu chơi ở `scene.json`.

```
cd tools/guide-shots && npm i
python3 -m http.server 8123 --directory ../..    # terminal khác
python3 make_tiles.py        # nền vệ tinh GIẢ (bản vẽ). Muốn ảnh thật: bỏ route tile trong lib.mjs để tải tile Esri thật
node shots.mjs [key ...]     # ra out/*.png + out/meta.json (khung đánh số lấy từ DOM)
python3 build_guide.py       # webp -> assets/guide-map/, viết lại phần "Bản đồ" của guide-data.js
```
