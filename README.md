# ASDN Team Picker

Web app để chọn thành viên và chia đội airsoft. Dữ liệu ban đầu gồm 30 thành viên và avatar trong `members.json` và `avatars/`.

## Chạy thử

Từ thư mục này, chạy `python3 -m http.server 8000` rồi mở `http://localhost:8000`. App dùng JavaScript module nên không mở trực tiếp bằng `file://`.

## Chức năng

- Tìm và chọn thành viên qua thẻ avatar, chọn tất cả hoặc bỏ chọn.
- Chọn CQB hoặc sân ngoài trời. Skill 1–5 và lối chơi của từng người được lưu riêng cho mỗi kiểu trận.
- Lối chơi gồm **Đẩy mục tiêu**, **Giữ vị trí**, **Cơ động**. Skill là trung bình 5 tiêu chí (Aim, Di chuyển, Quan sát, Phối hợp, Thể lực) trong `skills.json`, không sửa tay; người chưa có dữ liệu được tính tạm là 3; lối chơi chưa chọn không ảnh hưởng cách chia.
- Thêm khách mời, chọn 2–6 đội, chia quân số chênh tối đa 1 và giảm chênh lệch skill trung bình lẫn phân bố lối chơi bằng các lượt hoán đổi.
- Đổi đội thủ công cho từng người, chia lại, sao chép đội hình.
- Đồng bộ lựa chọn và đội hình qua Firestore để mọi người thấy cùng kết quả và đều có thể chia đội. Chỉ tài khoản tổ chức được chọn người, chia đội và chọn lối chơi.

## Firebase

1. Tạo Firebase project và web app, rồi chép web config vào `cloud-config.js`. Các giá trị này là mã định danh công khai, không phải khoá bí mật.
2. Bật **Authentication → Sign-in method → Google**. Thêm `hieplee.github.io` vào **Authentication → Settings → Authorised domains**; thêm `localhost` nếu thử đăng nhập trên máy.
3. Đăng nhập tài khoản tổ chức một lần để lấy Firebase UID trong **Authentication → Users**. Ghi UID đó vào danh sách `organizerUids` trong `cloud-config.js` và `firestore.rules` (có thể nhiều người).
4. Tạo **Cloud Firestore** và phát hành nội dung `firestore.rules` trong tab **Rules**. Mọi người được đọc `public/current` và `public/attributes`; chỉ UID của người tổ chức được ghi đội hình và lối chơi. Skill không sửa tay: tính tự động bằng trung bình 5 tiêu chí trong `skills.json`.
5. Mở web: ai cũng xem được. Người tổ chức đăng nhập Google để chọn người, chia đội và chọn lối chơi; các thiết bị khác nhận cập nhật theo thời gian thực.

Khi `cloud-config.js` chưa có thông số Firebase, app chạy bản demo và chỉ lưu trong `localStorage` của trình duyệt đó. Không phát hành bản demo này như một app dùng chung.

## Đưa lên GitHub Pages

Đưa toàn bộ thư mục lên nhánh mặc định của repo, sau đó vào **Settings → Pages → Build and deployment → Deploy from a branch**, chọn nhánh mặc định và thư mục `/ (root)`. Nếu repo có tên `asdn-team-picker`, URL thường là `https://<username>.github.io/asdn-team-picker/`.

> Nếu repo công khai, tên và avatar trong repo cũng công khai. Hãy bảo đảm đã được phép chia sẻ ảnh trước khi publish.
