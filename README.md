# ASDN Team Picker

Web app để chọn thành viên và chia đội airsoft. Dữ liệu ban đầu gồm 30 thành viên và avatar trong `members.json` và `avatars/`.

## Chạy thử

Từ thư mục này, chạy `python3 -m http.server 8000` rồi mở `http://localhost:8000`. App dùng JavaScript module nên không mở trực tiếp bằng `file://`.

## Chức năng

- Tìm và chọn thành viên qua thẻ avatar, chọn tất cả hoặc bỏ chọn.
- Chọn CQB hoặc sân ngoài trời. Skill 1–5 và lối chơi của từng người được lưu riêng cho mỗi kiểu trận.
- Lối chơi gồm **Đẩy mục tiêu**, **Giữ vị trí**, **Cơ động**. Skill là trung bình 6 tiêu chí hình lục giác (Tấn công, Phòng thủ, Phối hợp, Solo, Kinh nghiệm, Thể lực, thang 1–5) hiển thị bằng biểu đồ trên thẻ người chơi; người tổ chức bấm **✎ SỬA CHỈ SỐ** trên thẻ để nhập, dữ liệu lưu ở Firestore `public/attributes.stats` (`skills.json` chỉ là dữ liệu gốc, hiện để trống); người chưa có chỉ số được tính tạm là 3; lối chơi chỉ để hiển thị, không ảnh hưởng cách chia đội.
- Thêm khách mời, chọn 2–6 đội, chia quân số chênh tối đa 1 và giảm chênh lệch skill trung bình bằng các lượt hoán đổi. Cũng rải đều người yếu Thể lực (≤3), người yếu Kinh nghiệm (≤2) và người Kinh nghiệm cao (≥4) giữa các đội (hằng số `LOW_STAMINA_MAX`, `LOW_EXP_MAX`, `HIGH_EXP_MIN` và các `*_WEIGHT` trong `app.js`); người chưa chấm điểm bị bỏ qua.
- Khi các đội lệch quân số 1 người, chế độ Cân bằng so sánh **skill trung bình mỗi người** (không phải tổng): bắt buộc (ưu tiên rất mạnh) **TB mỗi người của đội ít người cao hơn đội đông ít nhất 0.2** (`SIZE_GAP_MIN_AVG`); cao hơn mức đó chỉ bị kéo nhẹ nên chênh 0.2–0.4 được ưu tiên hơn chênh lớn. Nhiều đội: áp dụng cho từng cặp (đội ít người, đội đông). Nếu pool không thể đạt (vd. mọi người cùng điểm) thì lấy phương án gần nhất. Phần hiển thị dưới biểu đồ có "Chênh TB thực tế" kèm ✓ đạt / ✗ chưa đạt.
- Các cặp không được chung đội khai báo trong `SEPARATE_PAIRS` ở `app.js` (hiện đang để trống, không có cặp nào bị ràng buộc; thêm theo id trong `members.json`); khi có cặp, thuật toán chia sẽ tách cặp và đổi đội thủ công sẽ hiện cảnh báo nếu vi phạm.
- Một nút **CHIA ĐỘI** kèm danh sách chọn kiểu chia: **Cân bằng** (thuật toán cân skill/thể lực/kinh nghiệm, icon ⚖) hoặc **Ngẫu nhiên** (xáo trộn rồi chia vòng tròn, chênh tối đa 1 người, icon ⚄). Kiểu chia được nhớ trên trình duyệt và dùng cho cả nút "Chia lại". Lịch sử ghi rõ kiểu chia ("Kiểu chia: ngẫu nhiên hoàn toàn / cân bằng").
- Thêm người sau khi đã chia: người mới được tự xếp vào đội cho điểm cân bằng tốt nhất (quân số chênh tối đa 1, đội ít người cao hơn đội đông ít nhất 0.2 TB skill nếu có thể, rồi thể lực/kinh nghiệm), không đổi chỗ người cũ; đội hình chia kiểu ngẫu nhiên thì xếp vào đội ít người nhất. Nút **CÂN LẠI TỐI THIỂU** (chỉ người tổ chức) tìm cách cân lại với ít lượt chuyển/đổi nhất (tối đa `REBALANCE_MAX_MOVES` = 3), xem trước rồi mới áp dụng; khi đội lệch (ví dụ có người rời) sẽ hiện gợi ý, không tự áp dụng. Người vừa chuyển có nhãn "↔ từ Đội a" (tạm thời, mất khi chia lại hoặc tải lại). Lịch sử ghi nhãn `auto-place` / `rebalance-min` / `manual`, không cần đổi `firestore.rules`.
- Đổi đội thủ công cho từng người, chia lại, sao chép đội hình.
- **Khóa người / khóa đội** (chỉ organizer bấm, mọi người đều thấy): nút 🔒/🔓 cạnh dropdown của từng người và ở header mỗi đội. Người bị khóa (hoặc thuộc đội khóa) không bao giờ bị di chuyển bởi Chia đội / Chia lại / thêm người mới, nhưng vẫn tính vào quân số và skill TB; những người còn lại được cân bằng vào các đội chưa khóa (chênh tối đa 1 người nếu có thể). Người bị khóa không đổi đội thủ công được cho tới khi mở khóa. Bỏ chọn/xóa khách sẽ gỡ khóa; đổi số đội, đổi kiểu trận hoặc "Bỏ chọn" xóa mọi khóa; có nút "Mở khóa tất cả". Lưu ở `public/current` (`lockedPlayers`, `lockedTeams`) và ghi lịch sử "Khóa/Mở khóa". **Cần deploy lại rules:** `firebase deploy --only firestore:rules --project asdn-team-picker`.
- Đồng bộ lựa chọn và đội hình qua Firestore để mọi người thấy cùng kết quả và đều có thể chia đội. Chỉ tài khoản tổ chức được chọn người, chia đội và chọn lối chơi.

## Giao diện mobile (kiểu app)

Trên màn hình ≤768px, app dùng giao diện riêng nằm trong `mobile.css` (chỉ được nạp bằng `media="(max-width:768px)"`) và `mobile.js`; PC giữ nguyên layout cũ.

- **Tab bar dưới**: Chọn người · Đội hình · Lịch sử (chỉ admin). Sau khi chia, app tự chuyển sang tab Đội hình; thanh **CHIA ĐỘI** nổi ở tab Chọn người, thanh **CHIA LẠI / CÂN LẠI / SAO CHÉP** (và Mở khóa khi có khóa) nổi ở tab Đội hình.
- **Bottom sheet** thay mọi `<select>` (đổi đội, kiểu chia, lối chơi) vì picker gốc hẹp khó bấm.
- **Vuốt hàng người chơi** trong đội: vuốt trái = khóa/mở khóa, vuốt phải = đổi đội. Nút 🔒 và nút đổi đội vẫn bấm được như bình thường.
- **Cân lại tối thiểu** trên mobile: bấm nút CÂN LẠI ở thanh dưới là hiện ngay bottom sheet xem trước (ai đổi đội, điểm trước/sau) với nút ÁP DỤNG/HỦY cố định, không phải cuộn.
- Header đội dính khi cuộn, phần "Thiết lập" tự thu gọn khi đã có đội hình, hero thu thành 3 ô thống kê, safe-area cho iPhone.
- **PWA**: `manifest.webmanifest` + `icons/icon-*.png`; mở trên điện thoại rồi "Thêm vào Màn hình chính" để chạy toàn màn hình. Chưa có service worker (không dùng offline).
- Không đổi logic chia đội, dữ liệu hay `firestore.rules`.

## Firebase

1. Tạo Firebase project và web app, rồi chép web config vào `cloud-config.js`. Các giá trị này là mã định danh công khai, không phải khoá bí mật.
2. Bật **Authentication → Sign-in method → Google**. Thêm `hieplee.github.io` vào **Authentication → Settings → Authorised domains**; thêm `localhost` nếu thử đăng nhập trên máy.
3. Đăng nhập tài khoản tổ chức một lần để lấy Firebase UID trong **Authentication → Users**. Ghi UID đó vào danh sách `organizerUids` trong `cloud-config.js` và `firestore.rules` (có thể nhiều người).
4. Tạo **Cloud Firestore** và phát hành nội dung `firestore.rules` trong tab **Rules**. Mọi người được đọc `public/current` và `public/attributes`; chỉ UID của người tổ chức được ghi đội hình và lối chơi. Chỉ số 6 tiêu chí cũng ghi vào `public/attributes` (trường `stats`), nên **phải phát hành lại `firestore.rules`** để cho phép trường này.
5. Mở web: ai cũng xem được. Người tổ chức đăng nhập Google để chọn người, chia đội và chọn lối chơi; các thiết bị khác nhận cập nhật theo thời gian thực.

Khi `cloud-config.js` chưa có thông số Firebase, app chạy bản demo và chỉ lưu trong `localStorage` của trình duyệt đó. Không phát hành bản demo này như một app dùng chung.

## Đưa lên GitHub Pages

Đưa toàn bộ thư mục lên nhánh mặc định của repo, sau đó vào **Settings → Pages → Build and deployment → Deploy from a branch**, chọn nhánh mặc định và thư mục `/ (root)`. Nếu repo có tên `asdn-team-picker`, URL thường là `https://<username>.github.io/asdn-team-picker/`.

> Nếu repo công khai, tên và avatar trong repo cũng công khai. Hãy bảo đảm đã được phép chia sẻ ảnh trước khi publish.
