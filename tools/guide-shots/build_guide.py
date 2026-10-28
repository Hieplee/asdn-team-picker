"""Đổi ảnh chụp (out/*.png) thành webp nhẹ trong assets/guide-map/ và viết lại phần "Bản đồ" của guide-data.js.
Chạy sau shots.mjs:  python3 build_guide.py
"""
import json, os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(HERE, 'out'); DEST = os.path.join(ROOT, 'assets', 'guide-map')
os.makedirs(DEST, exist_ok=True)
meta = json.load(open(os.path.join(OUT, 'meta.json')))

for k in meta:
    for o in ('p', 'l'):
        src = os.path.join(OUT, f'{k}-{o}.png')
        if not os.path.exists(src): continue
        im = Image.open(src).convert('RGB')
        im = im.resize((390, 844) if o == 'p' else (844, 390), Image.LANCZOS) if False else im
        w, h = im.size
        im = im.resize((round(w * .78), round(h * .78)), Image.LANCZOS)
        im.save(os.path.join(DEST, f'{k}-{o}.webp'), 'WEBP', quality=72, method=6)

def M(k, title, desc, role=None): return {'k': k, 'title': title, 'desc': desc, 'role': role}
def F(shot, caption, marks, alt=None, role=None, note=None):
    b = {'t': 'mfig', 'shot': shot, 'caption': caption, 'alt': alt or caption, 'marks': marks, 'p': meta[shot].get('p', {}), 'l': meta[shot].get('l', {})}
    if role: b['role'] = role
    if note: b['note'] = note
    return b
def P(html): return {'t': 'p', 'html': html}
def H(text, role=None):
    b = {'t': 'h', 'text': text}
    if role: b['role'] = role
    return b

blocks = [
 P('Bản đồ vệ tinh chỉ hiện <b>đội của bạn</b>: vị trí GPS đồng đội và các lệnh trong đội. Người đội khác không thấy bạn, bạn cũng không thấy họ.'),
 {'t': 'tip', 'html': 'Mỗi hình có hai kiểu máy: <b>Dọc</b> và <b>Ngang</b>. Bấm nút ở góc hình để đổi, chạm vào ảnh để phóng to. Tên người, vị trí và nền bản đồ trong ảnh là <b>dữ liệu minh họa</b>; mọi dấu đều nằm trong khung vàng A-B-C-D (khu chơi).'},

 H('1 · Vào đội của bạn'),
 F('join-code', 'Nhập mã đội', [
   M('code', 'Ô mã đội', '6 ký tự, ví dụ <b>1K7QMA</b>. Ký tự đầu là số đội. Hoặc quét QR để vào thẳng bước chọn tên.'),
   M('next', 'TIẾP TỤC', 'Kiểm tra mã. Báo "chưa được chốt" nghĩa là đội chưa được khóa.'),
   M('note', 'Riêng tư', 'Chỉ đồng đội thấy vị trí của bạn; tắt chia sẻ được bất cứ lúc nào.')]),
 F('pick-name', 'Chọn tên của bạn', [
   M('back', '← Đổi mã', 'Quay lại nhập mã khác.'),
   M('team', 'Nhãn đội', 'Cho biết bạn đang vào Đội nào.'),
   M('taken', 'Tên mờ', '"Đã có người nhận": tên đã có người dùng, không chọn được.'),
   M('mine', 'Tên của bạn', 'Chạm đúng tên mình trong danh sách.')]),
 F('pick-chosen', 'Xác nhận', [
   M('chosen', 'Tên đã chọn', 'Có dấu ✓ và viền sáng.'),
   M('confirm', 'TÔI LÀ …', 'Bấm để vào đội. Máy nhớ phiên nên lần sau mở lại không phải chọn tên.')]),
 {'t': 'warn', 'html': 'Chọn nhầm tên? Người tổ chức gỡ bạn trong Điều khiển trận, rồi bạn vào lại.'},
 F('share-ask', 'Hỏi bật chia sẻ vị trí', [
   M('why', 'Giải thích', 'Vị trí chỉ hiện cho đồng đội, tắt được bất cứ lúc nào, xóa khi kết thúc trận. iPhone chỉ cập nhật khi app đang mở.'),
   M('share', 'CHIA SẺ VỊ TRÍ', 'Bật GPS và cho đồng đội thấy bạn. Trình duyệt sẽ hỏi quyền vị trí, hãy chọn Cho phép.'),
   M('view', 'CHỈ XEM BẢN ĐỒ', 'Vẫn xem bản đồ và lệnh của đội nhưng không chia sẻ vị trí. Bật lại sau bằng nút ở dưới bản đồ.')]),

 H('2 · Màn hình bản đồ'),
 F('map', 'Bản đồ khi đang chia sẻ', [
   M('chip', 'Chip đội', 'Hiện Đội, số người còn sống, số người đang hiện, tên bạn, khu chơi và trạng thái ĐANG CHIA SẺ / ĐANG XEM. Bấm để mở danh sách đội.'),
   M('area', 'Khung vàng A-B-C-D', 'Khu chơi. Mục tiêu, mũi tên, vùng đều đặt trong khung này.'),
   M('me', 'Bạn', 'Chấm viền màu của bạn; vòng tròn mờ quanh chấm là sai số GPS.'),
   M('mate', 'Đồng đội', 'Chấm màu kèm chữ viết tắt tên; ★ đứng trước tên đội trưởng. Mỗi người một màu, ai đặt lệnh thì lệnh mang màu người đó.'),
   M('stale', 'Chấm mờ', 'Quá 60 giây chưa cập nhật thì mờ đi (khóa màn hình, mất sóng); quá 5 phút thì ẩn hẳn.'),
   M('target', 'Mục tiêu', 'Dấu ⌖ đánh số, màu theo người đặt.'),
   M('fit', '⌖ Căn bản đồ', 'Đưa bản đồ về vừa khu chơi, không bị nút che.'),
   M('grid', '# Lưới', 'Bật/tắt lưới ô vuông (xem phần 3).'),
   M('sat', '◐ Nền vệ tinh', 'Đổi giữa Esri chuẩn và Clarity.'),
   M('full', '⛶ Toàn màn hình', 'Điện thoại tự vào toàn màn hình khi mở tab Bản đồ. Bấm để thoát hoặc vào lại.'),
   M('tools', 'Thanh lệnh', 'Mục tiêu, Chết, Lệnh. Đội trưởng có thêm Tấn công, Phòng thủ, Mũi tên, Vùng.'),
   M('share', 'Nút chia sẻ', 'Bấm để tắt/bật chia sẻ vị trí. Dòng nhỏ cho biết sai số GPS và bạn đang trong hay ngoài khu.')],
   note='Xoay ngang: nút công cụ dồn vào hai cột gọn ở bên trái, nút Căn / Lưới / Nền / Toàn màn hình nằm cột bên phải, bản đồ rộng hơn.'),

 H('3 · Lưới và cách báo ô'),
 P('Bấm <b>#</b> để hiện lưới. Ô lớn (60 m) gọi theo <b>cột rồi hàng</b>: A1, B2… Mỗi ô lớn chia thành 9 ô con theo <b>bàn phím số</b> (7-8-9 / 4-5-6 / 1-2-3). Phóng to thêm sẽ hiện cấp nhỏ hơn nữa.'),
 F('grid', 'Lưới tọa độ', [
   M('grid', '# đang bật', 'Nút sáng lên khi lưới đang hiện.'),
   M('top', 'Chữ cột', 'A, B… ở mép trên bản đồ.'),
   M('left', 'Số hàng', '1, 2… ở mép trái bản đồ.'),
   M('cell', 'Ô con số 4', 'Ô con giữa-trái của ô lớn A1. Báo qua bộ đàm: <b>"A1 4"</b>.')]),
 {'t': 'cards', 'items': [['Cách báo vị trí', '<ul><li><b>"A1 4"</b>: ô lớn A1, ô con số 4</li><li><b>"B2 9"</b>: ô lớn B2, góc trên bên phải</li><li>Phóng to thấy cấp nhỏ hơn thì nói thêm số: <b>"A1 4 8"</b></li></ul>'],
                         ['Bàn phím số', '<b>7 8 9</b><br><b>4 5 6</b><br><b>1 2 3</b><br>Trên là bắc, trái là tây, giống bàn phím điện thoại.']]},

 H('4 · Danh sách đội'),
 F('team-sheet', 'Bấm chip đội ở góc trên trái', [
   M('on', 'Đang hiện', 'Đồng đội có tín hiệu. Bấm "Đi tới ›" để bản đồ bay tới người đó.'),
   M('me', 'Bạn', 'Dòng của chính bạn.'),
   M('nopos', 'Chưa chia sẻ', 'Đã vào đội nhưng chưa bật chia sẻ vị trí.'),
   M('lost', 'Mất tín hiệu', 'Quá 60 giây chưa cập nhật, kèm thời gian. Có thể họ khóa màn hình hoặc mất sóng.'),
   M('out', 'Chưa vào đội', 'Người này chưa nhập mã vào đội.'),
   M('handle', 'Thanh kéo', 'Chạm hoặc vuốt xuống để đóng.')]),

 H('5 · Đặt mục tiêu (mọi thành viên)'),
 P('Bấm <b>⌖ Mục tiêu</b>, rồi chạm một lần lên bản đồ là đặt xong. Mỗi người có tối đa 3 mục tiêu; hết chỗ thì mục tiêu cũ nhất bị thay.'),
 F('target-hint', 'Bấm Mục tiêu rồi chạm lên bản đồ', [
   M('hint', 'Dòng hướng dẫn', 'Hiện trên bản đồ: "Chạm lên bản đồ để đánh dấu mục tiêu".'),
   M('cancel', '✕ Hủy', 'Bỏ thao tác, không đặt gì.')]),
 F('target-placed', 'Đã đặt mục tiêu', [
   M('pin', 'Mục tiêu mới', 'Màu theo người đặt, cả đội cùng thấy ngay.'),
   M('orders', '☰ Lệnh (n)', 'Số lệnh của đội tăng lên. Bấm để xem danh sách.')]),
 F('orders', 'Danh sách lệnh của đội', [
   M('row', 'Dòng lệnh', 'Chạm để bản đồ bay tới lệnh đó. Ghi rõ ai đặt và cách đây bao lâu.'),
   M('own', 'Lệnh của bạn', 'Bạn xóa được lệnh do chính mình đặt.'),
   M('del', '✕ Xóa', 'Chỉ hiện với lệnh bạn có quyền xóa (đội trưởng xóa được mọi lệnh).'),
   M('icon', 'Biểu tượng loại', '⌖ mục tiêu, ➚ mũi tên, ⬠ vùng, khiên là Phòng thủ, mũi nhọn là Tấn công.'),
   M('sheet', 'Thanh kéo', 'Chạm hoặc vuốt xuống để đóng.')]),

 H('6 · Đội trưởng: tấn công, phòng thủ, mũi tên, vùng'),
 P('Mỗi đội có 1 đội trưởng do người tổ chức đặt (dấu ★). Chỉ đội trưởng có thêm bốn nút dưới. Tấn công và Phòng thủ chạm 1 điểm là xong, mỗi loại tối đa 5 dấu, tự đánh số 1–5; hết chỗ thì thay dấu cũ nhất. Mũi tên (tối đa 10) cần ít nhất 2 điểm, vùng (tối đa 10) cần ít nhất 3 điểm.'),
 F('captain-bar', 'Thanh lệnh của đội trưởng', [
   M('target', '⌖ Mục tiêu', 'Như thành viên thường.'),
   M('dead', '☠ Chết', 'Chạm bản đồ rồi chọn ai chết ở đó (chọn được nhiều người).'),
   M('atk', 'Tấn công', 'Dấu đỏ, đánh dấu điểm tấn công.'),
   M('def', 'Phòng thủ', 'Dấu xanh, đánh dấu vị trí phòng thủ.'),
   M('arrow', '➚ Mũi tên', 'Vẽ hướng di chuyển, chạm từng điểm dọc đường đi.'),
   M('zone', '⬠ Vùng', 'Khoanh một khu (nhà, bãi trống) bằng đa giác.'),
   M('orders', '☰ Lệnh (n)', 'Danh sách lệnh, đội trưởng có thêm nút xóa tất cả.')]),
 F('attack-defend', 'Dấu Tấn công và Phòng thủ', [
   M('atk1', 'Tấn công 1', 'Dấu đỏ, số theo thứ tự đặt. Cả đội thấy.'),
   M('atk2', 'Tấn công 2', 'Điểm tấn công kế tiếp.'),
   M('def1', 'Phòng thủ 1', 'Dấu xanh hình khiên, giữ cửa nhà gỗ.'),
   M('def2', 'Phòng thủ 2', 'Điểm phòng thủ kế tiếp, che đường mòn phía nam.')]),
 F('draw-arrow', 'Đang vẽ mũi tên', [
   M('hint', 'Dòng gợi ý', 'Cho biết đã chạm mấy điểm và cần thêm bao nhiêu.'),
   M('cancel', '✕ Hủy', 'Bỏ lệnh đang vẽ.'),
   M('undo', '↶ Lùi 1 điểm', 'Xóa điểm vừa chạm để chạm lại.'),
   M('done', '✓ Xong (n)', 'Lưu lệnh khi đã đủ điểm; nút sáng lên khi có thể bấm.')],
   note='Mẹo: chạm nhiều điểm bám theo đường mòn thì mũi tên uốn theo đường, đồng đội dễ theo.'),
 F('draw-zone', 'Đang vẽ vùng', [
   M('hint', 'Dòng gợi ý', 'Vùng cần ít nhất 3 điểm, nối thành đa giác.'),
   M('undo', '↶ Lùi 1 điểm', 'Chạm sai thì lùi lại.'),
   M('done', '✓ Xong (n)', 'Lưu vùng cho cả đội.')]),
 F('plan', 'Kế hoạch hoàn chỉnh trên bản đồ', [
   M('arrow', 'Mũi tên', 'Chạm vào mũi tên để xem người đặt, đi tới hoặc xóa.'),
   M('head', 'Đầu mũi tên', 'Chỉ hướng đi: từ cửa phía tây dọc đường mòn ra ngã tư.')]),

 H('7 · Báo chết'),
 P('Để cả đội biết còn bao nhiêu người và ai chết ở đâu. Mọi thành viên đều có nút <b>☠ Chết</b> (đầu lâu) cạnh Mục tiêu.'),
 {'t': 'steps', 'items': ['Bấm <b>☠ Chết</b>, rồi chạm lên bản đồ <b>nơi bạn chết</b>. Ghi luôn, không hỏi tên. Không cần bật GPS vì bạn tự chấm vị trí.', 'Ghim đầu lâu xám (viền theo màu của bạn, kèm chữ viết tắt) hiện cho cả đội, chấm GPS của bạn ẩn đi. Ô Đội ở góc trái hiện <b>số người sống</b> và huy hiệu <b>☠</b> đỏ.', 'Báo nhầm hoặc sai chỗ: chạm ô Đội ở góc trái, bấm <b>Hồi sinh</b> cạnh tên mình rồi báo lại.']},
 F('death-hint', 'Chạm nơi bạn chết', [
   M('hint', 'Dòng gợi ý', 'Chạm lên bản đồ đúng nơi bạn chết. Ghi luôn, không hỏi lại.'),
   M('cancel', '✕ Hủy', 'Bấm nếu không muốn báo chết nữa.')]),
 F('death-pin', 'Ghim ☠ và số người còn sống', [
   M('chip', 'Số người sống', 'Ô Đội hiện số người còn sống, ví dụ 5/6.'),
   M('badge', 'Huy hiệu ☠', 'Số người đã chết trong đội.'),
   M('pin', 'Ghim ☠', 'Nơi người đó chết, viền theo màu và chữ viết tắt của họ. Chạm để xem giờ chết hoặc hồi sinh.'),
   M('btn', '☠ Chết', 'Thành viên tự báo chết cho mình; đội trưởng chọn người chết.')]),
 P('<b>Đội trưởng</b> báo chết cho người khác: bấm <b>☠ Chết</b>, chạm nơi người đó chết, rồi chọn <b>ai chết ở đây</b> (chọn được nhiều người cùng chết một chỗ) và bấm <b>BÁO CHẾT</b>. Dùng khi đồng đội quên bấm hoặc không cầm điện thoại.'),
 F('death-pick', 'Đội trưởng: chọn ai chết ở đây', [
   M('list', 'Danh sách đội', 'Chọn một hoặc nhiều người cùng chết ở chỗ vừa chạm.'),
   M('chosen', 'Đã chọn', 'Chạm lần nữa để bỏ chọn.'),
   M('confirm', 'BÁO CHẾT', 'Ghi những người đã chọn là chết tại điểm đã chạm.')]),
 F('death-team', 'Danh sách đội khi có người chết', [
   M('dead', 'Hàng người chết', 'Gạch tên, ghi giờ chết; bấm để bay tới chỗ chết.'),
   M('revive', 'Hồi sinh', 'Người chết tự hồi sinh cho mình; đội trưởng hồi sinh được bất kỳ ai. Ghim ☠ biến mất.')]),

 H('Chuẩn bị trận (người tổ chức)', 'org'),
 {'t': 'steps', 'role': 'org', 'items': ['Chia đội xong, bấm <b>KHÓA ĐỘI</b> ở từng đội. Chỉ đội đã khóa mới có mã và nút <b>QR VÀO ĐỘI</b>.', 'Trong tab <b>Đội hình</b>, bấm <b>Chỉnh ▾</b> rồi ở mục <b>Khu vực chơi</b> chọn Núi hoặc Phố (cả trận dùng chung). Cũng đổi được trong <b>⚙ Điều khiển trận</b>.', 'Mở <b>⚙ Điều khiển trận</b> trên bản đồ, đưa mã/QR cho từng đội, đặt đội trưởng (★).', 'Giữa các ván: <b>VÁN MỚI</b> xóa báo chết và lệnh nhưng giữ nguyên người đã vào đội, đội trưởng và khu vực. Chỉ một đội chơi lại thì bấm <b>☠ Hồi sinh cả đội</b> ở đội đó.', 'Cuối buổi: <b>KẾT THÚC TRẬN</b> để xóa dữ liệu.']},
 F('org-map', 'Nút ⚙ trên bản đồ', [
   M('gear', '⚙ Điều khiển trận', 'Chỉ người tổ chức thấy nút này (nằm cùng cột nút công cụ).', 'org'),
   M('chip', 'Chip đội', 'Bạn cũng là người chơi nên chỉ thấy đội của mình.', 'org')], role='org'),
 F('org-sheet', 'Điều khiển trận', [
   M('area', 'Khu vực chơi', 'Núi / Phố. Đổi là bản đồ mọi máy đổi theo.', 'org'),
   M('code', 'Mã đội', 'Mã 6 ký tự để đội viên nhập.', 'org'),
   M('joined', 'Đã vào', 'Ví dụ "5/6 đã vào": có bao nhiêu người đã vào đội.', 'org'),
   M('qr', 'HIỆN QR', 'Hiện mã QR để đội viên quét bằng camera.', 'org'),
   M('link', 'CHIA SẺ LINK', 'Gửi link vào đội qua Zalo/Messenger (hoặc SAO CHÉP LINK trên máy không có chia sẻ).', 'org'),
   M('star', '★ Đội trưởng', 'Bấm để đặt hoặc bỏ đội trưởng của đội.', 'org'),
   M('remove', '✕ Gỡ', 'Gỡ người vào nhầm tên; họ vào lại được.', 'org')], role='org'),
 F('org-qr', 'Mã QR của đội', [
   M('qr', 'QR', 'Đội viên quét bằng camera điện thoại.', 'org'),
   M('hide', 'ẨN QR', 'Thu QR lại.', 'org'),
   M('link', 'CHIA SẺ LINK', 'Gửi link thay vì QR.', 'org'),
   M('newcode', '↻ Đổi mã', 'Tạo mã mới khi bị lộ. Mã cũ vô hiệu, người đã vào đội vẫn giữ quyền.', 'org')], role='org'),
 {'t': 'fig', 'shot': 'm15-team-qr', 'caption': 'Nút QR VÀO ĐỘI (tab Đội hình)', 'marks': [{'title': 'QR VÀO ĐỘI', 'desc': 'Hiện ở tiêu đề đội đã khóa. Bấm để mở thẳng thẻ mã/QR của đội đó.', 'role': 'org', 'x': 8.97, 'y': 47.6, 'w': 23.33, 'h': 4.74}], 'alt': 'Nút QR VÀO ĐỘI', 'role': 'org'},
 {'t': 'fig', 'shot': 'm20-map-pick', 'caption': 'Chọn khu vực chơi (tab Đội hình)', 'marks': [{'title': 'Chỉnh ▾', 'desc': 'Ở tab Đội hình, bấm để mở phần thiết lập; mục Khu vực chơi nằm ở cuối (chỉ người tổ chức thấy).', 'role': 'org', 'x': 3.59, 'y': 7.7, 'w': 92.82, 'h': 5.69}, {'title': 'Núi', 'desc': 'Chọn khu Núi.', 'role': 'org', 'x': 8.46, 'y': 47.16, 'w': 40, 'h': 5.69}, {'title': 'Phố', 'desc': 'Chọn khu Phố. Bản đồ của mọi người đổi theo ngay.', 'role': 'org', 'x': 48.46, 'y': 47.16, 'w': 40, 'h': 5.69}], 'alt': 'Chọn khu vực chơi', 'role': 'org'},
 F('org-round', 'Giữa các ván và cuối trận', [
   M('revive', '☠ Hồi sinh cả đội', 'Xóa báo chết của đội đó. Dùng khi chỉ một đội chơi lại.', 'org'),
   M('round', 'VÁN MỚI', 'Xóa báo chết và mọi lệnh, giữ nguyên người đã vào đội, đội trưởng, khu vực. Bấm 2 lần để xác nhận.', 'org'),
   M('end', 'KẾT THÚC TRẬN', 'Xóa toàn bộ dữ liệu của trận, kể cả danh sách vào đội. Bấm rồi XÁC NHẬN, không hoàn tác.', 'org')], role='org'),

 H('Quyền riêng tư và lưu ý'),
 {'t': 'steps', 'items': ['Chỉ đồng đội trong đội bạn thấy vị trí của bạn, và chỉ khi bạn bật chia sẻ.', 'Ghi vị trí tối đa 5 giây một lần hoặc khi bạn di chuyển hơn 5 m.', 'Tắt chia sẻ bất cứ lúc nào; dữ liệu bị xóa khi trận kết thúc.']},
 {'t': 'warn', 'html': '<b>iPhone:</b> vị trí chỉ cập nhật khi app đang mở. Hãy giữ màn hình sáng; khóa màn hình là dừng chia sẻ. Nếu bị từ chối quyền vị trí, bật lại trong cài đặt trình duyệt. Mở link vào đội bằng Safari/Chrome, không dùng trình duyệt trong Zalo/Messenger.'},
]
# bỏ role trên mfig nếu là org, giữ cho bộ lọc
path = os.path.join(ROOT, 'guide-data.js')
s = open(path, encoding='utf8').read()
data = json.loads(s[s.index('{'):s.rindex('}') + 1])
for p in data['parts']:
    if p['id'] == 'map':
        p['lead'] = 'Vào đội bằng mã, chia sẻ vị trí với đồng đội, đặt mục tiêu, vẽ kế hoạch và báo chết ngay trên bản đồ khu chơi.'
        p['blocks'] = blocks
open(path, 'w', encoding='utf8').write('window.GUIDE=' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
print('ok', len(blocks), 'blocks;', sum(os.path.getsize(os.path.join(DEST, f)) for f in os.listdir(DEST)) // 1024, 'KB images')
