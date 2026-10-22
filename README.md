# ASDN Team Picker

Web app tĩnh để chọn thành viên và chia đội airsoft. Dữ liệu ban đầu gồm 30 thành viên và avatar trong `members.json` và `avatars/`.

## Chạy thử

Từ thư mục này, chạy `python3 -m http.server 8000` rồi mở `http://localhost:8000`. App dùng JavaScript module nên không mở trực tiếp bằng `file://`.

## Chức năng

- Tìm và chọn thành viên qua thẻ avatar, chọn tất cả hoặc bỏ chọn.
- Chọn CQB hoặc sân ngoài trời. Skill 1–5 và lối chơi của từng người được lưu riêng cho mỗi kiểu trận.
- Lối chơi gồm **Đẩy mục tiêu**, **Giữ vị trí**, **Cơ động**. Người chưa được đánh giá skill được tính tạm là 3; lối chơi chưa chọn không ảnh hưởng cách chia.
- Thêm khách mời, chọn 2–6 đội, chia quân số chênh tối đa 1 và giảm chênh lệch skill trung bình lẫn phân bố lối chơi bằng các lượt hoán đổi.
- Đổi đội thủ công cho từng người, chia lại, sao chép đội hình.
- Lưu lựa chọn và đội hình trong `localStorage` của trình duyệt hiện tại.

## Đưa lên GitHub Pages

Đưa toàn bộ thư mục lên nhánh mặc định của repo, sau đó vào **Settings → Pages → Build and deployment → Deploy from a branch**, chọn nhánh mặc định và thư mục `/ (root)`. Nếu repo có tên `asdn-team-picker`, URL thường là `https://<username>.github.io/asdn-team-picker/`.

> Nếu repo công khai, tên và avatar trong repo cũng công khai. Hãy bảo đảm đã được phép chia sẻ ảnh trước khi publish.
