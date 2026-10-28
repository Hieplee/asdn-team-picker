# ASDN Team Picker — Tài liệu bàn giao

Cập nhật: 2026-10-24 · Repo: https://github.com/Hieplee/asdn-team-picker · Nhánh: `main`

## 1. Tổng quan

Web app tĩnh (không build, không backend riêng) để chọn người có mặt và chia đội airsoft cân bằng cho câu lạc bộ ASDN.

- **Ai cũng xem được** danh sách + đội hình (read-only).
- **Chỉ organizer** (đăng nhập Google, UID nằm trong whitelist) mới được chọn người, chia đội, đổi đội, chọn lối chơi.
- Dữ liệu dùng chung đồng bộ realtime qua **Firebase Firestore**.
- Hosting: **GitHub Pages** (deploy từ nhánh `main`, thư mục `/`). Mỗi lần push `main` là live.

## 2. Tech stack

| Thành phần | Chi tiết |
|---|---|
| Frontend | HTML + CSS + JavaScript ES module thuần, không framework, không bundler, không `package.json` |
| Firebase SDK | Load từ CDN `gstatic.com/firebasejs/13.0.0` (app, auth, firestore) bằng dynamic `import()` |
| Auth | Firebase Authentication — Google sign-in popup |
| DB | Cloud Firestore, project `asdn-team-picker` |
| Hosting | GitHub Pages |

Chạy local: `python3 -m http.server 8000` rồi mở `http://localhost:8000` (phải qua HTTP vì dùng ES module + `import ... with { type: 'json' }`, không mở `file://` được). Muốn thử đăng nhập local cần thêm `localhost` vào Authorised domains của Firebase.

## 3. Cấu trúc file

| File | Vai trò |
|---|---|
| `index.html` | Toàn bộ khung giao diện (tiếng Việt). Có cache-bust `?v=...` ở `styles.css` và `app.js` |
| `app.js` (~540 dòng) | Toàn bộ logic: state, Firebase sync, render, thuật toán chia đội, radar chart |
| `styles.css` | Giao diện, có responsive mobile (≤700px) |
| `members.json` | 30 thành viên: `id`, `name`, `avatar`, tuỳ chọn `tag` (biệt danh ngắn), `roles` (`admin` / `elder` / `newbie`) |
| `skills.json` | Điểm 5 tiêu chí (1–5) theo `id` thành viên: `aim`, `move`, `aware`, `team`, `stamina`. Nguồn: Google Form đánh giá kỹ năng (1 phiếu, lượt đầu) |
| `avatars/` | Ảnh thành viên, đặt tên `NNN_slug.jpg` |
| `icons/` | Icon role: `role-admin.png`, `role-elder.png`, `role-newbie.png` |
| `cloud-config.js` | Firebase web config (public, không phải secret) + `organizerUids` |
| `firestore.rules` | Security rules — **phải publish thủ công trên Firebase Console**, không tự deploy từ repo |
| `README.md` | Hướng dẫn setup Firebase / GitHub Pages |

## 4. Mô hình dữ liệu

**Firestore** (chỉ 2 document, cả hai đọc công khai, ghi chỉ organizer):

- `public/current` — `{ selected: [id], guests: [{id,name}], teamCount: 2..6, mode: 'cqb'|'outdoor', assignments: {id: teamIndex} }`. Rules validate đúng các key và kiểu này.
- `public/attributes` — `{ ratings, styles }`. `styles[mode][id]` ∈ `push | hold | mobile` (Đẩy mục tiêu / Giữ vị trí / Cơ động), lưu riêng cho từng kiểu trận. `ratings` hiện app không còn cho sửa tay nhưng rules vẫn cho phép key này.

**Không có `.env`/secret nào**; mọi thứ trong `cloud-config.js` là public. Bảo mật nằm hoàn toàn ở `firestore.rules`.

**Chế độ demo:** nếu `firebaseConfig` rỗng, app chạy `localStorage` (key `asdn-team-picker-v1`) — không dùng làm bản chia sẻ.

## 5. Logic chính (`app.js`)

- **Skill của một người** = trung bình 5 tiêu chí trong `skills.json` (`detailTotal` → `skill`). Người chưa có dữ liệu (kể cả khách mời) tính tạm **3**. Không có UI sửa skill; muốn đổi thì sửa `skills.json`.
- **Chia đội** (`balancedAssignments`, `scoreLayout`): 32 lần thử ngẫu nhiên (dùng `crypto.getRandomValues`), mỗi lần chia round-robin rồi hoán đổi cặp cho đến khi hết cải thiện (tối đa 12 pass). Chấm điểm = chênh lệch skill trung bình mỗi đội so với trung bình chung + 0.65 × chênh lệch phân bố lối chơi. Quân số các đội chênh tối đa 1.
- **Sync** (`save`, `initCloud`): ghi qua hàng đợi riêng cho `session` và `attributes`; `onSnapshot` cập nhật state, bỏ qua snapshot khi còn write đang chờ. Quyền sửa = `organizerUids.includes(user.uid)` (UI), còn quyền thật do rules chặn.
- Đổi `teamCount` hoặc `mode` sẽ **xoá `assignments`** (phải chia lại).
- **Viewer** (không phải organizer): chỉ thấy đội hình; mobile ưu tiên lineup lên đầu, roster thu gọn, thẻ 2 cột bấm để mở radar.
- Role icon + tooltip trên thẻ và trong lineup (`ROLE_LABELS`: Ban Quản Trị / Người Già / NewBie).

## 6. Việc vận hành thường gặp

### Thêm/sửa thành viên
1. Thêm ảnh vào `avatars/` (`NNN_slug.jpg`).
2. Thêm entry vào `members.json` (id 3 chữ số kế tiếp; `tag`, `roles` tuỳ chọn). Hiện có `030` là "Hiệp Phò Mã" (role newbie).
3. Thêm điểm vào `skills.json` theo cùng `id` nếu có.
4. **Tăng chuỗi `?v=...` trong `index.html`** (cả `styles.css` và `app.js`) — nếu không, trình duyệt cache bản cũ. Với ảnh avatar đổi cùng tên file cũng cần cache-bust (xem các commit "Update … avatar").
5. Commit + push `main`.

### Thêm/bớt organizer
1. Người đó đăng nhập Google trên web một lần → lấy UID ở Firebase Console → Authentication → Users.
2. Thêm UID vào **cả hai chỗ**: `organizerUids` trong `cloud-config.js` **và** 2 chỗ `request.auth.uid in [...]` trong `firestore.rules`.
3. Copy nội dung `firestore.rules` dán vào Firebase Console → Firestore → Rules → Publish. (Chỉ push git là **chưa** đủ.)

Organizer hiện tại (xem comment trong `cloud-config.js`): hiepbrse@gmail.com, khanhtrandhp@gmail.com, highlandart89@gmail.com, writewin@gmail.com, nguyenkhoi0708@gmail.com, trungkien7111@gmail.com.

### Deploy
Push `main` → GitHub Pages tự cập nhật (Settings → Pages: Deploy from branch, `main`, `/ (root)`). Chờ ~1 phút, hard refresh nếu chưa thấy đổi.

### Chuyển sang Firebase project khác
Tạo project + web app, bật Google sign-in, thêm domain `hieplee.github.io` (và `localhost`) vào Authorised domains, tạo Firestore, sửa `firebaseConfig` + `organizerUids`, publish rules. Chi tiết trong `README.md`.

## 7. Lưu ý / rủi ro

- **Repo public ⇒ tên + avatar thành viên công khai.** Cần đảm bảo đã được phép.
- `organizerUids` phải **đồng bộ thủ công** giữa `cloud-config.js` và `firestore.rules` (và rules phải publish trên Console). Lệch nhau ⇒ UI cho sửa nhưng ghi bị từ chối ("Lưu thất bại").
- Firebase SDK ghim phiên bản `13.0.0` từ CDN; nâng version cần test lại.
- Rules cho `public/attributes` chỉ kiểm tra tên key, không validate nội dung; `public/current` có validate kiểu dữ liệu.
- Không có test tự động, không CI; kiểm tra bằng tay (chọn người → chia đội → reload/mở máy khác xem đồng bộ).
- `README.md` còn nhắc "Skill 1–5 … được lưu riêng cho mỗi kiểu trận" — đã lỗi thời: skill giờ chỉ tính tự động từ `skills.json`, chỉ **lối chơi** là lưu theo kiểu trận.
- Ý tưởng chưa làm: gộp thêm phiếu đánh giá (hiện chỉ 1 phiếu/người), chuẩn hoá nhập `skills.json` từ Google Form, test thuật toán chia đội, tách `app.js` thành module.

## 8. Lịch sử phát triển (tóm tắt)

1. Dựng app chọn người + chia đội, thêm Firebase/Firestore sync và phân quyền organizer.
2. Tối ưu mobile (card gọn, touch target 44px, thanh chia đội dính đáy), viewer chỉ thấy lineup.
3. Bảng skill → radar chart ngũ giác gắn vào card; bỏ sửa tay, skill = trung bình 5 tiêu chí.
4. Thêm tag biệt danh, nhiều organizer, favicon súng nước.
5. Gần nhất: role icon (admin/elder/newbie) kèm tooltip, bỏ text placeholder trên card, cập nhật avatar.

Xem đầy đủ bằng `git log --oneline` (36 commit).
