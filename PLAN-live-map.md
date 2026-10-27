# Plan cuối: Bản đồ GPS trực tiếp khi chơi

Trạng thái: chỉ là plan. Chưa code, chưa push, chưa mở PR.

## 1. Mục tiêu

Thêm tab **Bản đồ**. Khi trận bắt đầu, mỗi người chơi chia sẻ vị trí GPS và chỉ thấy đồng đội của đội mình (đội đã khóa). Organizer cũng là người chơi nên bị giới hạn y hệt.

## 2. Các quyết định đã chốt

| Mục | Quyết định |
|---|---|
| Địa điểm | Ngoài trời. Không làm sơ đồ sân trong nhà |
| Cách vào đội | QR/mã đội rồi chọn tên. Đăng nhập ẩn danh, không cần Gmail |
| Ai thấy ai | Cả đội thấy nhau |
| iPhone | Chấp nhận chỉ cập nhật khi mở app. Dùng Wake Lock |
| Cơ sở dữ liệu | Firestore trước, đo chi phí rồi mới cân nhắc Realtime Database |
| Thư viện bản đồ | Leaflet (như `map-demo.html`), không dùng MapLibre |
| Nền bản đồ | Esri World Imagery và Clarity, có nút đổi |
| Khu chơi và lưới | Cố định trong code: 4 góc, lưới A1 và keypad 7-8-9 chia 3 cấp |
| Đội trưởng | Organizer đặt khi chốt đội, mỗi đội 1 người |
| Quyền vẽ | Đội trưởng: mũi tên, mục tiêu, vùng polygon. Thành viên: chỉ mục tiêu |
| Custom | Marker màu đội, theme tối, avatar tròn kèm hướng di chuyển, vùng polygon |
| Bỏ ra | Vệt đường đi, sơ đồ sân trong nhà |

Hai điểm em tự đặt mặc định, anh sửa nếu muốn khác:
- Công cụ đo (khoảng cách, phương vị, diện tích) chỉ hiện trên máy người dùng, không đồng bộ.
- Vùng polygon do đội trưởng vẽ và đồng bộ cả đội.

## 3. Hiện trạng liên quan

- Site tĩnh trên GitHub Pages, logic client trong `app.js`, dữ liệu ở Firestore.
- Chỉ 5 organizer có đăng nhập, rules khóa theo UID cứng. Người chơi chưa có tài khoản.
- Đã có khóa đội: `lockedTeams`, `lockedPlayers`, `assignments` trong `public/current`.
- Audit log chỉ admin đọc được.
- `map-demo.html` đã có sẵn: ảnh vệ tinh, polygon 4 góc, lưới Squad, công cụ đo, lệnh mũi tên/mục tiêu, marker đồng đội giả lập. Phần này tái dùng gần như nguyên.

## 4. Giới hạn kỹ thuật chấp nhận

- `watchPosition` cần HTTPS (đã có) và người chơi tự cho phép.
- iOS chỉ cập nhật khi app mở ở foreground. Khóa màn hình là dừng. Dùng Wake Lock và nhắc "giữ màn hình sáng" lúc vào.
- Pin: ghi mỗi 5–10 giây hoặc khi di chuyển hơn 5 m. Chế độ tiết kiệm pin giãn 15–30 giây.
- Zoom quá mức phủ của ảnh vệ tinh sẽ bị mờ. Giữ nút đổi Esri/Clarity như demo.

## 5. Vai trò và quyền

| Vai trò | Quyền |
|---|---|
| Thành viên (Anonymous Auth) | Vào đội bằng mã, ghi vị trí của mình, đọc vị trí đội mình, đặt mục tiêu |
| Đội trưởng | Như thành viên, thêm vẽ mũi tên và vùng polygon cho đội |
| Organizer (5 UID) | Như người chơi khi chơi. Ngoài ra: khóa đội, đặt đội trưởng, xem/đổi mã đội, gỡ người, bật/tắt chia sẻ, kết thúc trận |
| Chế độ quan sát | Organizer bật riêng, tắt mặc định, xem mọi đội. Mọi người thấy banner. Organizer đó ngừng chia sẻ vị trí cho đội lúc quan sát |

## 6. Luồng vào đội

1. Organizer chia đội, bấm khóa đội, bấm ★ chọn đội trưởng mỗi đội. Mỗi đội khóa sinh mã đội (4–6 ký tự, có QR) và thẻ QR lớn, có nút "Copy link đội".
2. Người chơi quét QR bằng camera máy, link mở ở trình duyệt mặc định (tránh webview Zalo/Messenger).
3. Màn hình **"Bạn là ai?"** chỉ hiện tên trong đội đó. Tên đã có người nhận thì mờ, ghi "đã vào".
4. Màn hình giải thích ngắn về quyền riêng tư, rồi mới bật hộp xin GPS của hệ điều hành.
5. Vào tab Bản đồ. Máy nhớ phiên, mở lại không phải chọn tên.
6. Tạo `members/{memberId}` chỉ khi: đội đã khóa, tên thuộc đúng đội trong `assignments`, doc chưa tồn tại (ai vào trước giữ tên), mã khớp.

Lỗi thường gặp:
- Chọn nhầm tên: nút "Không phải tôi", organizer gỡ.
- Đổi máy hoặc xóa dữ liệu trình duyệt: organizer gỡ rồi vào lại.
- Từ chối GPS: vẫn xem bản đồ, không chia sẻ, kèm hướng dẫn bật lại.
- Lộ QR: organizer bấm "Đổi mã đội". Mã cũ vô hiệu, người đã vào vẫn giữ quyền.

Bảng trạng thái cho organizer: ⚪ chưa vào, 🟢 đang chia sẻ, 🟡 mất tín hiệu (hơn 60 giây), kèm nút Gỡ.

## 7. Dữ liệu và rules

| Đường dẫn | Nội dung | Ai ghi | Ai đọc |
|---|---|---|---|
| `match/current/teamKeys/{teamId}` | mã đội | organizer | organizer (rules dùng `get()` để so mã) |
| `match/current/members/{memberId}` | `{uid, teamId, role}` | người vào đội (theo điều kiện mục 6); organizer đặt `role` đội trưởng và gỡ | đội mình |
| `match/current/positions/{teamId}/{uid}` | `{lat, lng, acc, heading, ts}`, ghi đè 1 doc mỗi người, không lưu lịch sử | chính người đó, đúng đội | đội mình (trừ khi observer bật cho organizer đó) |
| `match/current/orders/{teamId}/{orderId}` | `{type: target\|arrow\|zone, geometry, by, ts}` | thành viên chỉ `target`; đội trưởng cả 3 loại | đội mình |
| `match/current/observer` | `{on, uid, since}` | organizer | mọi người (để hiện banner) |

- Chặn ở tầng rules, không chỉ ẩn ở giao diện.
- Marker quá 60 giây không cập nhật thì mờ hoặc ẩn.
- Kết thúc trận: xóa `positions`, `orders`, `members`, `teamKeys`.
- Rules mới phải được deploy bằng `firebase deploy --only firestore:rules`. Bản rules trước đó vẫn còn chờ deploy.

Chi phí ước tính: 20 người ghi mỗi 15 giây khoảng 5k ghi/giờ, mỗi máy chỉ nghe đội mình (5–10 người). Nằm trong gói free nếu giãn tần suất. Đo thực tế, đổi sang Realtime Database nếu vượt.

## 8. Bản đồ

- Leaflet, bê từ `map-demo.html`: nền vệ tinh, polygon 4 góc, khóa kéo ra ngoài khu, lưới Squad, nhãn góc.
- Marker đồng đội: avatar tròn viền màu đội, tên, mũi tên hướng di chuyển, vòng sai số. Theme tối.
- Đội trưởng vẽ mũi tên và polygon. Mục tiêu hiện biểu tượng cho cả đội.
- Công cụ đo: khoảng cách, phương vị, diện tích. Cục bộ.
- Tọa độ 4 góc và `CELL` (60 m) giữ cứng trong code.

## 9. Quyền riêng tư

Opt-in từng người, nút tắt chia sẻ bất cứ lúc nào, chỉ gửi khi trận đang live, tự dừng khi kết thúc hoặc đóng tab, xóa dữ liệu cuối trận, banner khi organizer ở chế độ quan sát.

## 10. Giai đoạn

**Giai đoạn 1 – Nền tảng**
- Anonymous Auth, mã đội/QR, màn hình chọn tên, `members`, đặt đội trưởng.
- Rules mới cho `teamKeys`, `members`, `positions`.
- Tab Bản đồ: nền vệ tinh + nút đổi, khu chơi, lưới, marker màu đội, ghi/đọc vị trí đội, Wake Lock.
- Bảng trạng thái cho organizer, nút gỡ người, kết thúc trận xóa dữ liệu.

**Giai đoạn 2 – Điều phối**
- `orders`: mục tiêu (thành viên), mũi tên và polygon (đội trưởng), rules theo vai trò.
- Avatar tròn, hướng di chuyển, vòng sai số, theme tối, ẩn khi mất tín hiệu.
- Công cụ đo cục bộ.

**Giai đoạn 3 – Hoàn thiện**
- Chế độ quan sát có banner.
- Chế độ tiết kiệm pin.
- Đổi mã đội.
- Đo chi phí Firestore, quyết định giữ hay đổi sang Realtime Database.

## 11. Cách kiểm chứng

- Rules: kiểm tra bằng Firebase emulator. Người ngoài đội không đọc/ghi được `positions` và `orders` của đội khác. Thành viên không ghi được `arrow` và `zone`. Tên đã nhận không bị nhận lại.
- Giao diện: thử trên iPhone Safari và Android Chrome, gồm cả luồng từ chối GPS, khóa màn hình, đổi mã đội.
- Thực địa: 1 buổi chơi thử với ít nhất 2 đội để đo độ trễ và pin.

## 12. Tiến độ

- Giai đoạn 1: đã làm xong và đã lên production.
- Giai đoạn 2 (lệnh): đã làm trên nhánh `feature/live-map-orders`. Mục tiêu (mọi thành viên), mũi tên và vùng (đội trưởng).
  - Thao tác chạm: chọn công cụ, chạm lên bản đồ đặt điểm, mũi tên/vùng bấm Xong. Không dùng kéo vì kéo là di chuyển bản đồ.
  - Id lệnh cố định để rules giới hạn số lượng: `t_{uid}_{0..2}`, `a_{0..9}`, `z_{0..9}`. Hết chỗ thì thay lệnh cũ nhất.
  - Organizer dọn lệnh khi kết thúc trận bằng id, không cần đọc.
- Giai đoạn 3: chưa làm.
