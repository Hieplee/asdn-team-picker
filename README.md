# ASDN Team Picker

Web app để chọn thành viên và chia đội airsoft. Dữ liệu ban đầu gồm 30 thành viên và avatar trong `members.json` và `avatars/`.

## Chạy thử

Từ thư mục này, chạy `python3 -m http.server 8000` rồi mở `http://localhost:8000`. App dùng JavaScript module nên không mở trực tiếp bằng `file://`.

## Chức năng

- Tìm và chọn thành viên qua thẻ avatar, chọn tất cả hoặc bỏ chọn.
- Chọn CQB hoặc sân ngoài trời. Skill 1–5 và lối chơi của từng người được lưu riêng cho mỗi kiểu trận.
- Lối chơi gồm **Đẩy mục tiêu**, **Giữ vị trí**, **Cơ động**. Người chưa được đánh giá skill được tính tạm là 3; lối chơi chưa chọn không ảnh hưởng cách chia.
- Thêm khách mời, chọn 2–6 đội, chia quân số chênh tối đa 1 và giảm chênh lệch skill trung bình lẫn phân bố lối chơi bằng các lượt hoán đổi.
- Đổi đội thủ công cho từng người, chia lại, sao chép đội hình.
- Đồng bộ lựa chọn, thuộc tính và đội hình qua Firestore để mọi người thấy cùng dữ liệu. Chỉ tài khoản tổ chức được ghi; khách xem được và sao chép đội hình.

## Firebase

1. Tạo Firebase project và web app, rồi chép web config vào `cloud-config.js`. Các giá trị này là mã định danh công khai, không phải khoá bí mật.
2. Bật **Authentication → Sign-in method → Google**. Thêm `hieplee.github.io` vào **Authentication → Settings → Authorised domains**; thêm `localhost` nếu thử đăng nhập trên máy.
3. Đăng nhập tài khoản tổ chức một lần để lấy Firebase UID trong **Authentication → Users**. Ghi UID vào `cloud-config.js` và thay `REPLACE_WITH_ORGANIZER_UID` trong `firestore.rules`.
4. Tạo **Cloud Firestore** và phát hành nội dung `firestore.rules` trong tab **Rules**. Quy tắc cho phép mọi người đọc duy nhất `public/current`; chỉ UID của người tổ chức được ghi.
5. Mở web và đăng nhập tài khoản tổ chức. Lần chỉnh sửa đầu tiên sẽ tạo tài liệu `public/current`; các thiết bị khác nhận cập nhật theo thời gian thực.

Khi `cloud-config.js` chưa có thông số Firebase, app chạy bản demo và chỉ lưu trong `localStorage` của trình duyệt đó. Không phát hành bản demo này như một app dùng chung.

## Đưa lên GitHub Pages

Đưa toàn bộ thư mục lên nhánh mặc định của repo, sau đó vào **Settings → Pages → Build and deployment → Deploy from a branch**, chọn nhánh mặc định và thư mục `/ (root)`. Nếu repo có tên `asdn-team-picker`, URL thường là `https://<username>.github.io/asdn-team-picker/`.

> Nếu repo công khai, tên và avatar trong repo cũng công khai. Hãy bảo đảm đã được phép chia sẻ ảnh trước khi publish.
