window.GUIDE={
 "parts": [
  {
   "id": "start",
   "title": "Bắt đầu",
   "lead": "ASDN Team Picker giúp điểm danh người có mặt, chia đội cân bằng và (khi chơi ngoài trời) xem vị trí đồng đội trên bản đồ. Ai cũng xem được; chỉ người tổ chức mới chỉnh sửa.",
   "blocks": [
    {
     "t": "cards",
     "items": [
      [
       "Người chơi",
       "Không cần đăng nhập.<ul><li>Xem danh sách thành viên, thẻ kỹ năng, đội hình</li><li>Sao chép đội hình để gửi nhóm chat</li><li>Vào đội bằng mã/QR, chia sẻ vị trí, đặt mục tiêu trên bản đồ</li></ul>"
      ],
      [
       "Người tổ chức",
       "Đăng nhập Google bằng tài khoản được cấp quyền.<ul><li>Chọn người, thêm khách mời, chọn kiểu trận</li><li>Chia đội, đổi đội, khóa, cân lại</li><li>Sửa chỉ số, lối chơi; điều khiển trận trên bản đồ</li></ul>"
      ]
     ]
    },
    {
     "t": "h",
     "text": "Màn hình chính và thanh tab dưới"
    },
    {
     "t": "p",
     "html": "Trên điện thoại, app có thanh tab ở đáy màn hình. Mọi thứ đều đồng bộ thời gian thực: người tổ chức chia đội xong, máy của mọi người tự cập nhật."
    },
    {
     "t": "fig",
     "shot": "01-roster",
     "caption": "Màn hình Chọn người",
     "marks": [
      {
       "title": "Tab Chọn người",
       "desc": "Danh sách thành viên dạng thẻ. Con số xanh là số người đã được chọn hôm nay.",
       "role": null,
       "x": 0,
       "y": 93.01,
       "w": 25,
       "h": 6.99
      },
      {
       "title": "Tab Đội hình",
       "desc": "Kết quả chia đội và biểu đồ so sánh. App tự nhảy sang tab này ngay sau khi chia.",
       "role": null,
       "x": 25,
       "y": 93.01,
       "w": 25,
       "h": 6.99
      },
      {
       "title": "Tab Bản đồ",
       "desc": "Vào đội, xem vị trí đồng đội, đặt mục tiêu.",
       "role": null,
       "x": 50,
       "y": 93.01,
       "w": 25,
       "h": 6.99
      },
      {
       "title": "Tab Hướng dẫn",
       "desc": "Chính là trang này. Nội dung đổi theo vai trò của bạn.",
       "role": null,
       "x": 75,
       "y": 93.01,
       "w": 25,
       "h": 6.99
      },
      {
       "title": "Ô thống kê",
       "desc": "Tổng số thành viên · số người đã chọn · số đội.",
       "role": null,
       "x": 3.59,
       "y": 7.58,
       "w": 92.82,
       "h": 7.7
      },
      {
       "title": "Trạng thái đồng bộ",
       "desc": "Cho biết kết nối dữ liệu chung. Hiện \"Bản demo trên thiết bị này\" nghĩa là chưa nối cloud, dữ liệu chỉ nằm trong máy bạn.",
       "role": null,
       "x": 58.71,
       "y": 2.21,
       "w": 37.7,
       "h": 1.63
      },
      {
       "title": "Người đã chọn",
       "desc": "Đếm số người được điểm danh.",
       "role": null,
       "x": 7.44,
       "y": 23.22,
       "w": 45.13,
       "h": 5.21
      },
      {
       "title": "Thu gọn danh sách",
       "desc": "Ẩn/hiện toàn bộ thẻ để đỡ phải cuộn.",
       "role": null,
       "x": 54.62,
       "y": 23.22,
       "w": 37.94,
       "h": 5.21
      }
     ],
     "alt": "Màn hình Chọn người"
    },
    {
     "t": "steps",
     "items": [
      "Bấm nút <b>Đăng nhập</b> ở góc trên phải, chọn tài khoản Google đã được cấp quyền.",
      "Khi nút đổi thành <b>Đăng xuất</b> và các nút CHIA ĐỘI, CHỌN TẤT CẢ… sáng lên là bạn đã ở chế độ tổ chức.",
      "Nếu báo \"Đổi tài khoản\", tài khoản đó chưa nằm trong danh sách tổ chức. Hỏi admin để được thêm."
     ],
     "role": "org"
    },
    {
     "t": "steps",
     "items": [
      "Mở link app trên điện thoại. Không cần đăng nhập.",
      "Tab <b>Đội hình</b> hiện đội của hôm nay (nếu người tổ chức chưa chia sẽ hiện \"Chưa có đội hình\").",
      "Khi đến sân, vào tab <b>Bản đồ</b> và nhập mã đội."
     ],
     "role": "player"
    },
    {
     "t": "tip",
     "html": "<b>Cài như một app:</b> iPhone: Safari → nút Chia sẻ → <i>Thêm vào Màn hình chính</i>. Android: menu ⋮ của Chrome → <i>Cài đặt ứng dụng</i>. App sẽ chạy toàn màn hình, không có thanh địa chỉ."
    }
   ]
  },
  {
   "id": "roster",
   "title": "Chọn người",
   "lead": "Xem thẻ thành viên, kỹ năng và lối chơi của từng người.",
   "leadOrg": "Điểm danh người có mặt hôm nay, chọn kiểu trận, thêm khách mời và chỉnh chỉ số kỹ năng.",
   "blocks": [
    {
     "t": "h",
     "text": "Kiểu trận và tìm kiếm",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "02-mode-search",
     "caption": "Kiểu trận, tìm kiếm, chọn nhanh",
     "marks": [
      {
       "title": "CQB",
       "desc": "Trận trong nhà/cự ly gần. Lối chơi của mỗi người được lưu riêng cho kiểu này.",
       "role": "org",
       "x": 10.77,
       "y": 11.97,
       "w": 38.59,
       "h": 5.21
      },
      {
       "title": "Sân ngoài trời",
       "desc": "Trận ngoài trời. Có bộ lối chơi riêng, tách khỏi CQB.",
       "role": "org",
       "x": 50.64,
       "y": 11.97,
       "w": 38.59,
       "h": 5.21
      },
      {
       "title": "Ô tìm thành viên",
       "desc": "Gõ một phần tên để lọc thẻ.",
       "role": null,
       "x": 18.07,
       "y": 22.1,
       "w": 70.65,
       "h": 2.73
      },
      {
       "title": "Chọn tất cả",
       "desc": "Chọn cả danh sách đang hiện (kể cả khách mời).",
       "role": "org",
       "x": 7.44,
       "y": 28.44,
       "w": 20.44,
       "h": 5.21
      },
      {
       "title": "Bỏ chọn",
       "desc": "Bỏ chọn tất cả, đồng thời xóa đội hình và mọi khóa.",
       "role": "org",
       "x": 77.37,
       "y": 28.44,
       "w": 15.2,
       "h": 5.21
      }
     ],
     "alt": "Kiểu trận, tìm kiếm, chọn nhanh",
     "role": "org"
    },
    {
     "t": "warn",
     "html": "Đổi kiểu trận hoặc bấm <b>Bỏ chọn</b> sẽ <b>xóa đội hình đã chia</b> và các khóa. Hãy đổi trước khi chia.",
     "role": "org"
    },
    {
     "t": "h",
     "text": "Thẻ thành viên"
    },
    {
     "t": "fig",
     "shot": "03-selected",
     "caption": "Chọn người bằng cách chạm vào thẻ",
     "marks": [
      {
       "title": "Thẻ người chơi",
       "desc": "Chạm vào ảnh/tên để chọn hoặc bỏ chọn. Thẻ được chọn có viền xanh lá.",
       "role": "org",
       "x": 51.28,
       "y": 14.34,
       "w": 41.03,
       "h": 19.58
      },
      {
       "title": "Dấu + / ✓",
       "desc": "+ là chưa chọn, ✓ là đã chọn.",
       "role": "org",
       "x": 83.59,
       "y": 15.4,
       "w": 6.15,
       "h": 2.84
      },
      {
       "title": "XEM BIỂU ĐỒ ▾",
       "desc": "Mở biểu đồ 6 tiêu chí của người đó. Số bên trái là skill trung bình (— nghĩa là chưa chấm).",
       "role": null,
       "x": 51.28,
       "y": 33.91,
       "w": 41.03,
       "h": 4.74
      },
      {
       "title": "LỐI CHƠI",
       "desc": "Đẩy mục tiêu / Giữ vị trí / Cơ động. Chỉ để hiển thị, không ảnh hưởng cách chia.",
       "role": null,
       "x": 53.08,
       "y": 41.38,
       "w": 37.44,
       "h": 4.74
      },
      {
       "title": "Số người đã chọn",
       "desc": "Huy hiệu trên tab Chọn người luôn cho biết đã chọn bao nhiêu người.",
       "role": null,
       "x": 14.55,
       "y": 93.72,
       "w": 5.37,
       "h": 2.13
      },
      {
       "title": "Thanh CHIA ĐỘI",
       "desc": "Hiện khi đã chọn người. Bấm để chia ngay với cài đặt hiện tại.",
       "role": "org",
       "x": 61.27,
       "y": 86.26,
       "w": 35.14,
       "h": 5.69
      }
     ],
     "alt": "Chọn người bằng cách chạm vào thẻ"
    },
    {
     "t": "p",
     "html": "Người chơi bình thường vẫn thấy thẻ và biểu đồ, nhưng không chọn hay sửa được.",
     "role": "player"
    },
    {
     "t": "h",
     "text": "Biểu đồ kỹ năng"
    },
    {
     "t": "fig",
     "shot": "04-radar",
     "caption": "Biểu đồ lục giác 6 tiêu chí",
     "marks": [
      {
       "title": "Biểu đồ",
       "desc": "6 trục: Tấn công, Phối hợp, Kinh nghiệm, Phòng thủ, Solo, Thể lực (thang 1–5). Bấm ẨN BIỂU ĐỒ ▴ ở thẻ để thu lại. Vòng tròn chữ cái là hạng từng tiêu chí: S ≥ 4.8, A ≥ 4.2, B ≥ 3.5, C ≥ 2.5, còn lại D.",
       "role": null,
       "x": 9.74,
       "y": 34.98,
       "w": 80.51,
       "h": 30.09
      },
      {
       "title": "✎ SỬA CHỈ SỐ",
       "desc": "Mở form nhập điểm cho người này.",
       "role": "org",
       "x": 35.58,
       "y": 66.02,
       "w": 28.84,
       "h": 4.27
      },
      {
       "title": "LỐI CHƠI",
       "desc": "Chọn lối chơi của người này cho kiểu trận hiện tại.",
       "role": "org",
       "x": 24.15,
       "y": 72.18,
       "w": 66.36,
       "h": 4.74
      }
     ],
     "alt": "Biểu đồ lục giác 6 tiêu chí"
    },
    {
     "t": "tip",
     "html": "<b>Skill</b> của một người là trung bình 6 tiêu chí. Người chưa được chấm điểm được tính tạm <b>3</b> khi chia đội."
    },
    {
     "t": "fig",
     "shot": "05-stats-edit",
     "caption": "Sửa chỉ số",
     "marks": [
      {
       "title": "Ô chọn điểm",
       "desc": "Mỗi tiêu chí một ô: — (bỏ trống) hoặc 1 đến 5.",
       "role": "org",
       "x": 10.77,
       "y": 39.36,
       "w": 38.21,
       "h": 4.03
      },
      {
       "title": "LƯU",
       "desc": "Lưu chỉ số, đồng bộ cho mọi người ngay.",
       "role": "org",
       "x": 10.77,
       "y": 58.32,
       "w": 38.21,
       "h": 4.27
      },
      {
       "title": "HỦY",
       "desc": "Đóng form, không lưu.",
       "role": "org",
       "x": 51.03,
       "y": 58.32,
       "w": 38.21,
       "h": 4.27
      }
     ],
     "alt": "Sửa chỉ số",
     "role": "org"
    },
    {
     "t": "h",
     "text": "Thêm khách mời",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "06-guest",
     "caption": "Ô thêm khách mời",
     "marks": [
      {
       "title": "Ô tên",
       "desc": "Nhập tên người mới (tối đa 50 ký tự).",
       "role": "org",
       "x": 7.44,
       "y": 75.19,
       "w": 63.29,
       "h": 5.69
      },
      {
       "title": "+ THÊM",
       "desc": "Thêm khách và tự chọn luôn. Có thể bấm Enter.",
       "role": "org",
       "x": 70.73,
       "y": 75.19,
       "w": 21.83,
       "h": 5.69
      }
     ],
     "alt": "Ô thêm khách mời",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "07-guest-card",
     "caption": "Thẻ khách mời",
     "marks": [
      {
       "title": "✕ Xóa khách",
       "desc": "Bấm 1 lần hiện \"XÓA?\", bấm lần nữa trong 3 giây để xóa hẳn.",
       "role": "org",
       "x": 9.23,
       "y": 47.35,
       "w": 11.28,
       "h": 5.21
      },
      {
       "title": "Thẻ GUEST",
       "desc": "Khách chưa có chỉ số nên tính skill 3. Vẫn chia đội bình thường và sửa được chỉ số.",
       "role": "org",
       "x": 7.69,
       "y": 42.84,
       "w": 41.03,
       "h": 17.77
      }
     ],
     "alt": "Thẻ khách mời",
     "role": "org"
    }
   ]
  },
  {
   "id": "split",
   "title": "Chia đội",
   "lead": "",
   "leadOrg": "Chọn số đội, kiểu chia rồi bấm CHIA ĐỘI. Chỉ người tổ chức chia được.",
   "blocks": [
    {
     "t": "steps",
     "items": [
      "Ở tab <b>Chọn người</b>: chọn ít nhất bằng số đội muốn chia (ví dụ 2 đội cần ≥ 2 người).",
      "Bấm nút lớn <b>CHIA ĐỘI</b> ở thanh nổi phía dưới.",
      "App tự chuyển sang tab <b>Đội hình</b> để xem kết quả."
     ],
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "08-split-bar",
     "caption": "Thanh CHIA ĐỘI",
     "marks": [
      {
       "title": "CHIA ĐỘI",
       "desc": "Chia theo kiểu và số đội đang cài. Nếu mờ nghĩa là chưa đủ người.",
       "role": "org",
       "x": 61.27,
       "y": 86.26,
       "w": 35.14,
       "h": 5.69
      },
      {
       "title": "Số người · số đội",
       "desc": "Ví dụ \"13 người · 2 đội\".",
       "role": "org",
       "x": 3.59,
       "y": 87.56,
       "w": 26.4,
       "h": 3.08
      },
      {
       "title": "Huy hiệu tab",
       "desc": "Số người đã chọn.",
       "role": "org",
       "x": 14.55,
       "y": 93.72,
       "w": 5.45,
       "h": 2.13
      }
     ],
     "alt": "Thanh CHIA ĐỘI",
     "role": "org"
    },
    {
     "t": "h",
     "text": "Chỉnh số đội và kiểu chia",
     "role": "org"
    },
    {
     "t": "p",
     "html": "Mở tab <b>Đội hình</b>. Khi đã có đội hình, phần Thiết lập thu gọn thành một thanh <b>⚙ N đội · kiểu chia</b>, bấm <b>Chỉnh ▾</b> để mở.",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "10-setup",
     "caption": "Thiết lập trận đấu",
     "marks": [
      {
       "title": "02",
       "desc": "Số đội nhỏ nhất. Có thể 2 đến 6 đội; mỗi đội chênh nhau tối đa 1 người.",
       "role": "org",
       "x": 8.46,
       "y": 24.64,
       "w": 16.61,
       "h": 5.69
      },
      {
       "title": "06",
       "desc": "Số đội lớn nhất. Đổi số đội sẽ xóa đội hình và khóa hiện tại.",
       "role": "org",
       "x": 74.92,
       "y": 24.64,
       "w": 16.61,
       "h": 5.69
      },
      {
       "title": "Kiểu chia",
       "desc": "Bấm để chọn Cân bằng hoặc Ngẫu nhiên. Lựa chọn được nhớ trên trình duyệt.",
       "role": "org",
       "x": 7.44,
       "y": 34.83,
       "w": 37.69,
       "h": 6.16
      },
      {
       "title": "CHIA ĐỘI",
       "desc": "Chia ngay trong tab này. Biểu tượng ⚖ hoặc ⚄ cho biết kiểu đang chọn.",
       "role": "org",
       "x": 47.69,
       "y": 34.83,
       "w": 44.87,
       "h": 6.16
      }
     ],
     "alt": "Thiết lập trận đấu",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "11-sheet-mode",
     "caption": "Chọn kiểu chia (bảng kéo từ dưới lên)",
     "marks": [
      {
       "title": "⚖ Cân bằng",
       "desc": "Cân quân số, skill trung bình, thể lực, kinh nghiệm. Đội ít người được ưu tiên TB cao hơn đội đông ít nhất 0.2.",
       "role": "org",
       "x": 3.59,
       "y": 85.07,
       "w": 92.82,
       "h": 6.16
      },
      {
       "title": "⚄ Ngẫu nhiên",
       "desc": "Xáo trộn rồi chia vòng tròn, chênh tối đa 1 người, không xét kỹ năng.",
       "role": "org",
       "x": 3.59,
       "y": 91.94,
       "w": 92.82,
       "h": 6.16
      },
      {
       "title": "Thanh kéo",
       "desc": "Chạm vùng tối ngoài bảng hoặc thanh này để đóng.",
       "role": "org",
       "x": 44.36,
       "y": 79.03,
       "w": 11.28,
       "h": 0.59
      }
     ],
     "alt": "Chọn kiểu chia (bảng kéo từ dưới lên)",
     "role": "org"
    },
    {
     "t": "tip",
     "html": "Dùng <b>Cân bằng</b> cho trận nghiêm túc, <b>Ngẫu nhiên</b> khi muốn vui hoặc xáo trộn nhóm. Người chưa có điểm bị bỏ qua khi cân thể lực và kinh nghiệm.",
     "role": "org"
    }
   ]
  },
  {
   "id": "teams",
   "title": "Đội hình",
   "lead": "Xem ai ở đội nào, so sánh sức mạnh các đội và sao chép gửi nhóm chat.",
   "leadOrg": "Đổi đội, khóa người/đội, cân lại tối thiểu, chia lại và sao chép đội hình.",
   "blocks": [
    {
     "t": "fig",
     "shot": "09-teams",
     "caption": "Màn hình Đội hình",
     "marks": [
      {
       "title": "⚙ 2 đội · Cân bằng",
       "desc": "Thanh thiết lập. Bấm Chỉnh để mở số đội và kiểu chia.",
       "role": "org",
       "x": 3.59,
       "y": 7.58,
       "w": 92.82,
       "h": 5.69
      },
      {
       "title": "Chia kiểu",
       "desc": "Cho biết đội hình này chia theo kiểu nào.",
       "role": null,
       "x": 3.59,
       "y": 20.14,
       "w": 42.98,
       "h": 3.55
      },
      {
       "title": "CHIA LẠI",
       "desc": "Chia lại từ đầu bằng kiểu đang chọn; người và đội đã khóa được giữ nguyên.",
       "role": "org",
       "x": 2.56,
       "y": 86.26,
       "w": 30.6,
       "h": 5.69
      },
      {
       "title": "CÂN LẠI",
       "desc": "Tìm cách cân lại bằng ít lượt chuyển nhất. Hiện dấu ! cam khi các đội đang lệch.",
       "role": "org",
       "x": 34.7,
       "y": 86.26,
       "w": 30.6,
       "h": 5.69
      },
      {
       "title": "SAO CHÉP",
       "desc": "Chép đội hình thành chữ để dán vào Zalo, Messenger…",
       "role": null,
       "x": 66.83,
       "y": 86.26,
       "w": 30.6,
       "h": 5.69
      }
     ],
     "alt": "Màn hình Đội hình"
    },
    {
     "t": "p",
     "html": "Biểu đồ so sánh dùng mỗi đội một màu. Dưới biểu đồ là số người, skill TB, tổng skill và dòng <b>Chênh TB thực tế</b> kèm ✓ đạt / ✗ chưa đạt so với mục tiêu 0.2."
    },
    {
     "t": "h",
     "text": "Từng người trong đội"
    },
    {
     "t": "fig",
     "shot": "12-person-row",
     "caption": "Hàng của một người trong đội",
     "marks": [
      {
       "title": "Ảnh và tên",
       "desc": "Kèm biệt danh và biểu tượng vai trò (Ban Quản Trị, Người Già, NewBie).",
       "role": null,
       "x": 9.49,
       "y": 47.49,
       "w": 10.77,
       "h": 4.98
      },
      {
       "title": "★ Skill",
       "desc": "Điểm trung bình. \"—\" nghĩa là chưa chấm, tính tạm 3.",
       "role": null,
       "x": 48.06,
       "y": 48.32,
       "w": 10.66,
       "h": 3.32
      },
      {
       "title": "🔒 Khóa người",
       "desc": "Giữ người này đứng yên khi Chia lại / thêm người.",
       "role": "org",
       "x": 61.28,
       "y": 47.37,
       "w": 10.26,
       "h": 5.21
      },
      {
       "title": "Đổi đội",
       "desc": "Mở bảng chọn đội cho người này.",
       "role": "org",
       "x": 74.1,
       "y": 47.37,
       "w": 16.41,
       "h": 5.21
      }
     ],
     "alt": "Hàng của một người trong đội"
    },
    {
     "t": "fig",
     "shot": "13-sheet-team",
     "caption": "Đổi đội thủ công",
     "marks": [
      {
       "title": "Đội 1",
       "desc": "Chạm đội muốn chuyển đến. Đội đang khóa có biểu tượng 🔒 và không chọn được.",
       "role": "org",
       "x": 3.59,
       "y": 85.07,
       "w": 92.82,
       "h": 6.16
      },
      {
       "title": "Đội 2",
       "desc": "Thay đổi áp dụng ngay và đồng bộ cho mọi người.",
       "role": "org",
       "x": 3.59,
       "y": 91.94,
       "w": 92.82,
       "h": 6.16
      },
      {
       "title": "Thanh kéo",
       "desc": "Đóng bảng mà không đổi.",
       "role": "org",
       "x": 44.36,
       "y": 79.03,
       "w": 11.28,
       "h": 0.59
      }
     ],
     "alt": "Đổi đội thủ công",
     "role": "org"
    },
    {
     "t": "h",
     "text": "Cử chỉ vuốt",
     "role": "org"
    },
    {
     "t": "gest",
     "items": [
      [
       "← Vuốt trái",
       "Khóa / mở khóa người đó (kéo quá ~70px rồi thả)."
      ],
      [
       "Vuốt phải →",
       "Mở bảng đổi đội của người đó."
      ]
     ],
     "role": "org"
    },
    {
     "t": "h",
     "text": "Khóa người và khóa đội",
     "role": "org"
    },
    {
     "t": "p",
     "html": "Người bị khóa (hoặc thuộc đội đã khóa) <b>không bao giờ bị di chuyển</b> bởi Chia đội, Chia lại hay thêm người mới, nhưng vẫn tính vào quân số và skill TB. Mọi người đều nhìn thấy khóa.",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "15-locked",
     "caption": "Đội đã khóa",
     "marks": [
      {
       "title": "ĐÃ KHÓA",
       "desc": "Bấm lại để mở khóa đội. Đội 🔒 là đội đã chốt, cần khóa mới tạo được QR vào đội.",
       "role": "org",
       "x": 74.17,
       "y": 7.35,
       "w": 18.91,
       "h": 4.74
      },
      {
       "title": "🔒 nhỏ",
       "desc": "Cho biết người này cố định vì cả đội đã khóa.",
       "role": "org",
       "x": 64.62,
       "y": 14.66,
       "w": 4.62,
       "h": 2.73
      }
     ],
     "alt": "Đội đã khóa",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "16-lock-bar",
     "caption": "Thanh nút khi có khóa",
     "marks": [
      {
       "title": "MỞ KHÓA TẤT CẢ",
       "desc": "Chỉ hiện khi đang có khóa; gỡ mọi khóa một lần.",
       "role": "org",
       "x": 43.16,
       "y": 86.26,
       "w": 32.41,
       "h": 5.69
      },
      {
       "title": "CHIA LẠI",
       "desc": "Giữ phần khóa, chia lại phần còn lại.",
       "role": "org",
       "x": 2.56,
       "y": 86.26,
       "w": 18.76,
       "h": 5.69
      }
     ],
     "alt": "Thanh nút khi có khóa",
     "role": "org"
    },
    {
     "t": "warn",
     "html": "Đổi số đội, đổi kiểu trận, bấm Bỏ chọn hoặc bỏ chọn/xóa khách sẽ <b>gỡ khóa liên quan</b>.",
     "role": "org"
    },
    {
     "t": "h",
     "text": "Cân lại tối thiểu",
     "role": "org"
    },
    {
     "t": "p",
     "html": "Khi có người rời, thêm người hoặc bạn đổi tay làm các đội lệch, nút <b>CÂN LẠI</b> hiện dấu ! và dòng cảnh báo cam. Nó chỉ gợi ý, không tự áp dụng.",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "17-unbalanced",
     "caption": "Đội đang lệch",
     "marks": [
      {
       "title": "CÂN LẠI có dấu !",
       "desc": "Các đội đang lệch quân số hoặc skill. Bấm để xem gợi ý.",
       "role": "org",
       "x": 34.7,
       "y": 86.26,
       "w": 30.6,
       "h": 5.69
      }
     ],
     "alt": "Đội đang lệch",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "18-rebalance",
     "caption": "Xem trước trước khi áp dụng",
     "marks": [
      {
       "title": "Danh sách chuyển",
       "desc": "Ai chuyển từ đội nào sang đội nào (tối đa 3 lượt).",
       "role": "org",
       "x": 3.59,
       "y": 51.78,
       "w": 92.82,
       "h": 23.93
      },
      {
       "title": "Trước / Sau",
       "desc": "So sánh quân số và điểm lệch trước và sau khi cân.",
       "role": "org",
       "x": 3.59,
       "y": 77.61,
       "w": 92.82,
       "h": 4.62
      },
      {
       "title": "ÁP DỤNG",
       "desc": "Thực hiện các lượt chuyển.",
       "role": "org",
       "x": 3.59,
       "y": 92.42,
       "w": 55.03,
       "h": 6.16
      },
      {
       "title": "HỦY",
       "desc": "Bỏ qua, giữ nguyên.",
       "role": "org",
       "x": 60.67,
       "y": 92.42,
       "w": 35.74,
       "h": 6.16
      }
     ],
     "alt": "Xem trước trước khi áp dụng",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "19-after-rebalance",
     "caption": "Sau khi áp dụng",
     "marks": [
      {
       "title": "SAO CHÉP",
       "desc": "Chép đội hình mới.",
       "role": "org",
       "x": 66.83,
       "y": 86.26,
       "w": 30.6,
       "h": 5.69
      }
     ],
     "alt": "Sau khi áp dụng",
     "role": "org"
    },
    {
     "t": "h",
     "text": "Sao chép đội hình"
    },
    {
     "t": "fig",
     "shot": "20-copy",
     "caption": "Bấm SAO CHÉP",
     "marks": [
      {
       "title": "Thông báo",
       "desc": "Hiện \"Đã sao chép đội hình.\" Dán vào nhóm chat để mọi người biết ai ở đội nào.",
       "role": null,
       "x": 4.36,
       "y": 78.79,
       "w": 91.28,
       "h": 5.09
      }
     ],
     "alt": "Bấm SAO CHÉP"
    },
    {
     "t": "p",
     "html": "Thêm người sau khi đã chia: người mới tự được xếp vào đội cho điểm cân bằng tốt nhất mà không đổi chỗ người cũ.",
     "role": "org"
    }
   ]
  },
  {
   "id": "map",
   "title": "Bản đồ",
   "lead": "Vào đội bằng mã, chia sẻ vị trí với đồng đội và đánh dấu mục tiêu ngoài trời.",
   "leadOrg": "Chốt đội, phát mã/QR vào đội, chọn khu vực chơi, đặt đội trưởng và kết thúc trận.",
   "blocks": [
    {
     "t": "h",
     "text": "Vào đội của bạn"
    },
    {
     "t": "steps",
     "items": [
      "Mở tab <b>Bản đồ</b>. Quét QR của người tổ chức bằng camera (mở bằng Safari/Chrome, <b>không</b> dùng trình duyệt trong Zalo/Messenger) hoặc nhập mã đội gồm <b>6 ký tự</b>, rồi bấm <b>TIẾP TỤC</b>.",
      "Màn <b>Bạn là ai?</b>: chọn đúng tên của mình. Tên đã có người nhận sẽ ghi \"Đã có người nhận\". Bấm <b>TÔI LÀ …</b>.",
      "Hộp <b>Chia sẻ vị trí?</b>: chọn <b>CHIA SẺ VỊ TRÍ</b> rồi cho phép GPS, hoặc <b>CHỈ XEM BẢN ĐỒ</b>.",
      "Máy nhớ phiên, lần sau mở lại không phải chọn tên."
     ]
    },
    {
     "t": "warn",
     "html": "Mã chỉ hoạt động khi đội của bạn đã được <b>khóa</b>. Nếu báo \"Đội N chưa được chốt\", hỏi người tổ chức."
    },
    {
     "t": "h",
     "text": "Chuẩn bị trận (người tổ chức)",
     "role": "org"
    },
    {
     "t": "steps",
     "items": [
      "Chia đội xong, bấm <b>KHÓA ĐỘI</b> ở từng đội. Đội đã khóa hiện nút <b>QR VÀO ĐỘI</b> ở tiêu đề.",
      "Chạm <b>⚙</b> trên bản đồ để mở <b>Điều khiển trận</b>.",
      "Chọn <b>Khu vực chơi</b> (ví dụ Núi hoặc Phố). Cả trận dùng chung, đổi là mọi máy đổi theo.",
      "Mỗi đội có thẻ riêng: mã 6 ký tự, <b>HIỆN QR</b>/<b>ẨN QR</b>, <b>CHIA SẺ LINK</b>/<b>SAO CHÉP LINK</b>, <b>↻ Đổi mã</b> (mã cũ vô hiệu, người đã vào vẫn giữ quyền).",
      "Bấm <b>★</b> cạnh tên để đặt <b>đội trưởng</b> (mỗi đội 1 người). Trạng thái ✓ Đã vào / Chưa vào cho biết ai đã vào đội.",
      "Cuối buổi: <b>KẾT THÚC TRẬN · XÓA DỮ LIỆU</b>, rồi <b>XÁC NHẬN</b>. Vị trí, lệnh, danh sách vào đội và mã đội bị xóa, không hoàn tác."
     ],
     "role": "org"
    },
    {
     "t": "tip",
     "html": "Người tổ chức cũng là người chơi: vào đội bằng mã như mọi người và chỉ thấy đội của mình.",
     "role": "org"
    },
    {
     "t": "h",
     "text": "Các nút trên bản đồ"
    },
    {
     "t": "chips",
     "items": [
      [
       "⌖",
       "Căn bản đồ",
       "Đưa bản đồ về vừa khu chơi.",
       null
      ],
      [
       "#",
       "Lưới",
       "Bật/tắt lưới kiểu Squad: ô lớn A1, B2…, chia nhỏ theo bàn phím số 7-8-9 / 4-5-6 / 1-2-3.",
       null
      ],
      [
       "◐",
       "Nền vệ tinh",
       "Đổi giữa Esri chuẩn và Clarity.",
       null
      ],
      [
       "⛶",
       "Toàn màn hình",
       "Phóng to và xoay ngang. Chỉ hiện khi máy hỗ trợ.",
       null
      ],
      [
       "⚙",
       "Điều khiển trận",
       "Chỉ người tổ chức: khu vực, mã/QR đội, đội trưởng, kết thúc trận.",
       "org"
      ],
      [
       "ĐỘI 1",
       "Chip đội",
       "Bấm để xem danh sách đội: ai đang hiện, mất tín hiệu hay chưa vào; bấm \"Đi tới ›\" để bay đến người đó.",
       null
      ],
      [
       "GPS",
       "BẬT CHIA SẺ VỊ TRÍ",
       "Nút lớn dưới bản đồ. Khi bật hiển thị \"ĐANG CHIA SẺ · BẤM ĐỂ TẮT\" kèm sai số GPS và trong/ngoài khu.",
       null
      ]
     ]
    },
    {
     "t": "h",
     "text": "Thanh lệnh phía dưới"
    },
    {
     "t": "chips",
     "items": [
      [
       "⌖",
       "Mục tiêu",
       "Mọi thành viên: chạm nút rồi chạm lên bản đồ để đánh dấu, một chạm là xong.",
       null
      ],
      [
       "➚",
       "Mũi tên",
       "Chỉ đội trưởng: chạm ít nhất 2 điểm rồi bấm ✓ Xong.",
       null
      ],
      [
       "⬠",
       "Vùng",
       "Chỉ đội trưởng: chạm ít nhất 3 điểm rồi bấm ✓ Xong.",
       null
      ],
      [
       "☰",
       "Lệnh",
       "Danh sách lệnh của đội; ĐI TỚI hoặc XÓA từng lệnh, hoặc XÓA TẤT CẢ LỆNH.",
       null
      ],
      [
       "✕",
       "Hủy",
       "Khi đang vẽ: bỏ lệnh đang vẽ.",
       null
      ],
      [
       "↶",
       "Lùi 1 điểm",
       "Khi vẽ mũi tên/vùng: xóa điểm vừa chạm.",
       null
      ],
      [
       "✓",
       "Xong",
       "Lưu lệnh khi đã đủ số điểm.",
       null
      ]
     ]
    },
    {
     "t": "p",
     "html": "Mỗi người đặt lệnh có một màu riêng để nhìn là biết ai đặt. Lệnh chỉ đội mình thấy."
    },
    {
     "t": "h",
     "text": "Chia sẻ vị trí và quyền riêng tư"
    },
    {
     "t": "steps",
     "items": [
      "Chỉ đồng đội trong đội bạn thấy vị trí của bạn, và chỉ khi trận đang diễn ra.",
      "Tắt chia sẻ bất cứ lúc nào bằng nút dưới bản đồ. Dữ liệu vị trí bị xóa khi trận kết thúc.",
      "Marker mờ khi quá 60 giây không cập nhật, ẩn sau 5 phút.",
      "Ghi vị trí tối đa 5 giây một lần hoặc khi bạn di chuyển hơn 5 m."
     ]
    },
    {
     "t": "warn",
     "html": "<b>iPhone:</b> vị trí chỉ cập nhật khi app đang mở. Hãy giữ màn hình sáng. Khóa màn hình là dừng chia sẻ. Nếu bị từ chối quyền vị trí, bật lại trong cài đặt trình duyệt."
    }
   ]
  },
  {
   "id": "faq",
   "title": "Mẹo & Hỏi đáp",
   "lead": "Các câu hỏi thường gặp và cách xử lý nhanh.",
   "blocks": [
    {
     "t": "faq",
     "items": [
      [
       "Sao tôi bấm không chọn được người?",
       "Bạn đang ở chế độ xem. Chỉ người tổ chức (đăng nhập Google, đã được cấp quyền) mới chọn người, chia đội và đổi đội.",
       null
      ],
      [
       "Chưa thấy đội hình?",
       "Người tổ chức chưa chia. Khi họ chia, máy bạn tự cập nhật, không cần tải lại.",
       "player"
      ],
      [
       "\"Chưa chấm\" và skill 3 là gì?",
       "Người chưa có chỉ số được tính tạm 3 để thuật toán vẫn chia được. Nhập chỉ số thật bằng ✎ SỬA CHỈ SỐ.",
       null
      ],
      [
       "Vì sao hai đội lệch 1 người?",
       "Khi số người lẻ, đội đông hơn 1 người là bình thường. Chế độ Cân bằng sẽ cố để TB mỗi người của đội ít người cao hơn đội đông ít nhất 0.2.",
       null
      ],
      [
       "Đăng nhập rồi vẫn báo \"Đổi tài khoản\"?",
       "Tài khoản đó chưa được cấp quyền tổ chức. Hỏi admin thêm UID vào danh sách.",
       "org"
      ],
      [
       "Thấy \"Lưu thất bại\"?",
       "Quyền ghi bị từ chối: thường do tài khoản chưa có trong cấu hình tổ chức hoặc mất mạng. Đăng nhập lại rồi thử.",
       "org"
      ],
      [
       "Người vào nhầm tên trên bản đồ?",
       "Người tổ chức gỡ người đó trong Điều khiển trận, sau đó họ vào lại và chọn đúng tên.",
       "org"
      ],
      [
       "Lộ mã/QR của đội?",
       "Mở Điều khiển trận → ↻ Đổi mã. Mã cũ không dùng được, người đã vào đội vẫn giữ quyền.",
       "org"
      ],
      [
       "Vị trí của tôi không cập nhật?",
       "Giữ màn hình sáng và app đang mở. Ra chỗ thoáng. Kiểm tra đã cho phép vị trí trong cài đặt trình duyệt.",
       "player"
      ],
      [
       "Mở link vào đội trong Zalo bị lỗi?",
       "Dùng Safari/Chrome mặc định: bấm ⋯ rồi \"Mở bằng trình duyệt\".",
       "player"
      ],
      [
       "Nút Lịch sử là gì?",
       "Chỉ system admin thấy: ghi lại việc khóa/mở khóa, chia đội… (200 bản ghi gần nhất).",
       "org"
      ],
      [
       "Có dùng được offline không?",
       "Không. App cần mạng để đồng bộ. Đã cài vào Màn hình chính nhưng chưa có chế độ offline.",
       null
      ]
     ]
    },
    {
     "t": "tip",
     "html": "Còn thắc mắc? Hỏi người tổ chức của buổi chơi hôm nay."
    }
   ]
  }
 ]
};
