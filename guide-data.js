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
   "lead": "Vào đội bằng mã, chia sẻ vị trí với đồng đội, đặt mục tiêu, vẽ kế hoạch và báo chết ngay trên bản đồ khu chơi.",
   "leadOrg": "Chốt đội, phát mã/QR vào đội, chọn khu vực chơi, đặt đội trưởng và kết thúc trận. Bạn cũng là người chơi nên vào đội như mọi người.",
   "blocks": [
    {
     "t": "p",
     "html": "Bản đồ vệ tinh chỉ hiện <b>đội của bạn</b>: vị trí GPS đồng đội và các lệnh trong đội. Người đội khác không thấy bạn, bạn cũng không thấy họ."
    },
    {
     "t": "tip",
     "html": "Mỗi hình có hai kiểu máy: <b>Dọc</b> và <b>Ngang</b>. Bấm nút ở góc hình để đổi, chạm vào ảnh để phóng to. Tên người, vị trí và nền bản đồ trong ảnh là <b>dữ liệu minh họa</b>; mọi dấu đều nằm trong khung vàng A-B-C-D (khu chơi)."
    },
    {
     "t": "h",
     "text": "1 · Vào đội của bạn"
    },
    {
     "t": "mfig",
     "shot": "join-code",
     "caption": "Nhập mã đội",
     "alt": "Nhập mã đội",
     "marks": [
      {
       "k": "code",
       "title": "Ô mã đội",
       "desc": "6 ký tự, ví dụ <b>1K7QMA</b>. Ký tự đầu là số đội. Hoặc quét QR để vào thẳng bước chọn tên.",
       "role": null
      },
      {
       "k": "next",
       "title": "TIẾP TỤC",
       "desc": "Kiểm tra mã. Báo \"chưa được chốt\" nghĩa là đội chưa được khóa.",
       "role": null
      },
      {
       "k": "note",
       "title": "Riêng tư",
       "desc": "Chỉ đồng đội thấy vị trí của bạn; tắt chia sẻ được bất cứ lúc nào.",
       "role": null
      }
     ],
     "p": {
      "code": [
       3.33,
       24.69,
       93.33,
       8.77
      ],
      "next": [
       3.33,
       34.4,
       93.33,
       7.35
      ],
      "note": [
       3.33,
       43.17,
       93.33,
       5.12
      ]
     },
     "l": {
      "code": [
       20.73,
       37.79,
       58.53,
       18.97
      ],
      "next": [
       20.73,
       58.81,
       58.53,
       15.9
      ],
      "note": [
       20.73,
       77.79,
       58.53,
       6.31
      ]
     }
    },
    {
     "t": "mfig",
     "shot": "pick-name",
     "caption": "Chọn tên của bạn",
     "alt": "Chọn tên của bạn",
     "marks": [
      {
       "k": "back",
       "title": "← Đổi mã",
       "desc": "Quay lại nhập mã khác.",
       "role": null
      },
      {
       "k": "team",
       "title": "Nhãn đội",
       "desc": "Cho biết bạn đang vào Đội nào.",
       "role": null
      },
      {
       "k": "taken",
       "title": "Tên mờ",
       "desc": "\"Đã có người nhận\": tên đã có người dùng, không chọn được.",
       "role": null
      },
      {
       "k": "mine",
       "title": "Tên của bạn",
       "desc": "Chạm đúng tên mình trong danh sách.",
       "role": null
      }
     ],
     "p": {
      "back": [
       3.33,
       8.29,
       18.78,
       5.92
      ],
      "team": [
       79.53,
       9.3,
       17.14,
       3.91
      ],
      "taken": [
       3.33,
       26.7,
       93.33,
       7.82
      ],
      "mine": [
       3.33,
       34.52,
       93.33,
       7.82
      ]
     },
     "l": {
      "back": [
       20.73,
       2.31,
       8.68,
       12.82
      ],
      "team": [
       71.35,
       4.49,
       7.92,
       8.46
      ],
      "taken": [
       20.73,
       36.59,
       58.53,
       16.92
      ],
      "mine": [
       20.73,
       53.51,
       58.53,
       16.92
      ]
     }
    },
    {
     "t": "mfig",
     "shot": "pick-chosen",
     "caption": "Xác nhận",
     "alt": "Xác nhận",
     "marks": [
      {
       "k": "chosen",
       "title": "Tên đã chọn",
       "desc": "Có dấu ✓ và viền sáng.",
       "role": null
      },
      {
       "k": "confirm",
       "title": "TÔI LÀ …",
       "desc": "Bấm để vào đội. Máy nhớ phiên nên lần sau mở lại không phải chọn tên.",
       "role": null
      }
     ],
     "p": {
      "chosen": [
       3.33,
       34.52,
       93.33,
       7.82
      ],
      "confirm": [
       4.36,
       78.6,
       91.28,
       7.35
      ]
     },
     "l": {
      "chosen": [
       20.73,
       53.51,
       58.53,
       16.92
      ],
      "confirm": [
       21.21,
       70,
       57.58,
       15.9
      ]
     }
    },
    {
     "t": "warn",
     "html": "Chọn nhầm tên? Người tổ chức gỡ bạn trong Điều khiển trận, rồi bạn vào lại."
    },
    {
     "t": "mfig",
     "shot": "share-ask",
     "caption": "Hỏi bật chia sẻ vị trí",
     "alt": "Hỏi bật chia sẻ vị trí",
     "marks": [
      {
       "k": "why",
       "title": "Giải thích",
       "desc": "Vị trí chỉ hiện cho đồng đội, tắt được bất cứ lúc nào, xóa khi kết thúc trận. iPhone chỉ cập nhật khi app đang mở.",
       "role": null
      },
      {
       "k": "share",
       "title": "CHIA SẺ VỊ TRÍ",
       "desc": "Bật GPS và cho đồng đội thấy bạn. Trình duyệt sẽ hỏi quyền vị trí, hãy chọn Cho phép.",
       "role": null
      },
      {
       "k": "view",
       "title": "CHỈ XEM BẢN ĐỒ",
       "desc": "Vẫn xem bản đồ và lệnh của đội nhưng không chia sẻ vị trí. Bật lại sau bằng nút ở dưới bản đồ.",
       "role": null
      }
     ],
     "p": {
      "why": [
       3.33,
       63.91,
       93.33,
       9.52
      ],
      "share": [
       3.33,
       84.72,
       93.33,
       6.87
      ],
      "view": [
       3.33,
       91.82,
       93.33,
       6.87
      ]
     },
     "l": {
      "why": [
       18.36,
       28.26,
       63.27,
       14.25
      ],
      "share": [
       18.36,
       66.92,
       63.27,
       14.87
      ],
      "view": [
       18.36,
       82.31,
       63.27,
       14.87
      ]
     }
    },
    {
     "t": "h",
     "text": "2 · Màn hình bản đồ"
    },
    {
     "t": "mfig",
     "shot": "map",
     "caption": "Bản đồ khi đang chia sẻ",
     "alt": "Bản đồ khi đang chia sẻ",
     "marks": [
      {
       "k": "chip",
       "title": "Chip đội",
       "desc": "Hiện Đội, số người còn sống, số người đang hiện, tên bạn, khu chơi và trạng thái ĐANG CHIA SẺ / ĐANG XEM. Bấm để mở danh sách đội.",
       "role": null
      },
      {
       "k": "area",
       "title": "Khung vàng A-B-C-D",
       "desc": "Khu chơi. Mục tiêu, mũi tên, vùng đều đặt trong khung này.",
       "role": null
      },
      {
       "k": "me",
       "title": "Bạn",
       "desc": "Chấm viền màu của bạn; vòng tròn mờ quanh chấm là sai số GPS.",
       "role": null
      },
      {
       "k": "mate",
       "title": "Đồng đội",
       "desc": "Chấm màu kèm chữ viết tắt tên; ★ đứng trước tên đội trưởng. Mỗi người một màu, ai đặt lệnh thì lệnh mang màu người đó.",
       "role": null
      },
      {
       "k": "stale",
       "title": "Chấm mờ",
       "desc": "Quá 60 giây chưa cập nhật thì mờ đi (khóa màn hình, mất sóng); quá 5 phút thì ẩn hẳn.",
       "role": null
      },
      {
       "k": "target",
       "title": "Mục tiêu",
       "desc": "Dấu ⌖ đánh số, màu theo người đặt.",
       "role": null
      },
      {
       "k": "fit",
       "title": "⌖ Căn bản đồ",
       "desc": "Đưa bản đồ về vừa khu chơi, không bị nút che.",
       "role": null
      },
      {
       "k": "grid",
       "title": "# Lưới",
       "desc": "Bật/tắt lưới ô vuông (xem phần 3).",
       "role": null
      },
      {
       "k": "sat",
       "title": "◐ Nền vệ tinh",
       "desc": "Đổi giữa Esri chuẩn và Clarity.",
       "role": null
      },
      {
       "k": "full",
       "title": "⛶ Toàn màn hình",
       "desc": "Điện thoại tự vào toàn màn hình khi mở tab Bản đồ. Bấm để thoát hoặc vào lại.",
       "role": null
      },
      {
       "k": "tools",
       "title": "Thanh lệnh",
       "desc": "Mục tiêu, Chết, Lệnh. Đội trưởng có thêm Tấn công, Phòng thủ, Mũi tên, Vùng.",
       "role": null
      },
      {
       "k": "share",
       "title": "Nút chia sẻ",
       "desc": "Bấm để tắt/bật chia sẻ vị trí. Dòng nhỏ cho biết sai số GPS và bạn đang trong hay ngoài khu.",
       "role": null
      }
     ],
     "p": {
      "chip": [
       1.79,
       0.83,
       81.54,
       6.4
      ],
      "fit": [
       84.36,
       0.83,
       13.85,
       6.4
      ],
      "grid": [
       84.36,
       7.46,
       13.85,
       6.4
      ],
      "sat": [
       84.36,
       14.1,
       13.85,
       6.4
      ],
      "full": [
       84.36,
       20.73,
       13.85,
       6.4
      ],
      "me": [
       26.15,
       46.8,
       17.64,
       4.27
      ],
      "mate": [
       11.79,
       43.48,
       17.92,
       4.27
      ],
      "stale": [
       34.1,
       43.48,
       17.87,
       4.27
      ],
      "captain": [
       10.77,
       49.29,
       20.95,
       4.27
      ],
      "target": [
       47.44,
       44.31,
       12.31,
       5.69
      ],
      "tools": [
       2.05,
       85.53,
       95.9,
       7.35
      ],
      "share": [
       1.79,
       93.24,
       96.41,
       5.94
      ],
      "area": [
       2.82,
       31.75,
       95.9,
       36.37
      ]
     },
     "l": {
      "chip": [
       0.83,
       1.79,
       41,
       13.85
      ],
      "fit": [
       93.25,
       1.79,
       5.92,
       12.82
      ],
      "grid": [
       93.25,
       14.62,
       5.92,
       12.82
      ],
      "sat": [
       93.25,
       27.44,
       5.92,
       12.82
      ],
      "full": [
       93.25,
       40.26,
       5.92,
       12.82
      ],
      "me": [
       55.21,
       43.08,
       8.15,
       9.23
      ],
      "mate": [
       48.58,
       35.9,
       8.28,
       9.23
      ],
      "stale": [
       58.89,
       35.9,
       8.26,
       9.23
      ],
      "captain": [
       48.1,
       48.46,
       9.68,
       9.23
      ],
      "target": [
       65.05,
       37.69,
       5.69,
       12.31
      ],
      "tools": [
       0.95,
       60,
       11.61,
       25.13
      ],
      "share": [
       0.83,
       85.38,
       13.96,
       12.82
      ],
      "area": [
       44.43,
       10.51,
       44.31,
       78.72
      ]
     },
     "note": "Xoay ngang: nút công cụ dồn vào hai cột gọn ở bên trái, nút Căn / Lưới / Nền / Toàn màn hình nằm cột bên phải, bản đồ rộng hơn."
    },
    {
     "t": "h",
     "text": "3 · Lưới và cách báo ô"
    },
    {
     "t": "p",
     "html": "Bấm <b>#</b> để hiện lưới. Ô lớn (60 m) gọi theo <b>cột rồi hàng</b>: A1, B2… Mỗi ô lớn chia thành 9 ô con theo <b>bàn phím số</b> (7-8-9 / 4-5-6 / 1-2-3). Phóng to thêm sẽ hiện cấp nhỏ hơn nữa."
    },
    {
     "t": "mfig",
     "shot": "grid",
     "caption": "Lưới tọa độ",
     "alt": "Lưới tọa độ",
     "marks": [
      {
       "k": "grid",
       "title": "# đang bật",
       "desc": "Nút sáng lên khi lưới đang hiện.",
       "role": null
      },
      {
       "k": "top",
       "title": "Chữ cột",
       "desc": "A, B… ở mép trên bản đồ.",
       "role": null
      },
      {
       "k": "left",
       "title": "Số hàng",
       "desc": "1, 2… ở mép trái bản đồ.",
       "role": null
      },
      {
       "k": "cell",
       "title": "Ô con số 4",
       "desc": "Ô con giữa-trái của ô lớn A1. Báo qua bộ đàm: <b>\"A1 4\"</b>.",
       "role": null
      }
     ],
     "p": {
      "grid": [
       84.36,
       7.46,
       13.85,
       6.4
      ],
      "top": [
       24.49,
       15.05,
       10.26,
       3.79
      ],
      "left": [
       0,
       29.09,
       9.23,
       3.79
      ],
      "cell": [
       2.56,
       26.84,
       17.95,
       8.18
      ]
     },
     "l": {
      "grid": [
       93.25,
       14.62,
       5.92,
       12.82
      ],
      "top": [
       54.44,
       0,
       4.74,
       7.18
      ],
      "left": [
       40.17,
       13.72,
       4.74,
       8.21
      ],
      "cell": [
       44.31,
       -9.23,
       8.29,
       35.9
      ]
     }
    },
    {
     "t": "cards",
     "items": [
      [
       "Cách báo vị trí",
       "<ul><li><b>\"A1 4\"</b>: ô lớn A1, ô con số 4</li><li><b>\"B2 9\"</b>: ô lớn B2, góc trên bên phải</li><li>Phóng to thấy cấp nhỏ hơn thì nói thêm số: <b>\"A1 4 8\"</b></li></ul>"
      ],
      [
       "Bàn phím số",
       "<b>7 8 9</b><br><b>4 5 6</b><br><b>1 2 3</b><br>Trên là bắc, trái là tây, giống bàn phím điện thoại."
      ]
     ]
    },
    {
     "t": "h",
     "text": "4 · Danh sách đội"
    },
    {
     "t": "mfig",
     "shot": "team-sheet",
     "caption": "Bấm chip đội ở góc trên trái",
     "alt": "Bấm chip đội ở góc trên trái",
     "marks": [
      {
       "k": "on",
       "title": "Đang hiện",
       "desc": "Đồng đội có tín hiệu. Bấm \"Đi tới ›\" để bản đồ bay tới người đó.",
       "role": null
      },
      {
       "k": "me",
       "title": "Bạn",
       "desc": "Dòng của chính bạn.",
       "role": null
      },
      {
       "k": "nopos",
       "title": "Chưa chia sẻ",
       "desc": "Đã vào đội nhưng chưa bật chia sẻ vị trí.",
       "role": null
      },
      {
       "k": "lost",
       "title": "Mất tín hiệu",
       "desc": "Quá 60 giây chưa cập nhật, kèm thời gian. Có thể họ khóa màn hình hoặc mất sóng.",
       "role": null
      },
      {
       "k": "out",
       "title": "Chưa vào đội",
       "desc": "Người này chưa nhập mã vào đội.",
       "role": null
      },
      {
       "k": "handle",
       "title": "Thanh kéo",
       "desc": "Chạm hoặc vuốt xuống để đóng.",
       "role": null
      }
     ],
     "p": {
      "on": [
       3.33,
       51.78,
       93.33,
       7.82
      ],
      "me": [
       3.33,
       59.6,
       93.33,
       7.82
      ],
      "nopos": [
       3.33,
       67.42,
       93.33,
       7.82
      ],
      "lost": [
       3.33,
       75.24,
       93.33,
       7.82
      ],
      "out": [
       3.33,
       90.88,
       93.33,
       7.82
      ],
      "handle": [
       43.59,
       45.26,
       12.82,
       1.3
      ]
     },
     "l": {
      "on": [
       18.36,
       22.67,
       63.27,
       16.92
      ],
      "me": [
       18.36,
       39.59,
       63.27,
       16.92
      ],
      "nopos": [
       18.36,
       56.51,
       63.27,
       16.92
      ],
      "lost": [
       18.36,
       73.44,
       63.27,
       16.92
      ],
      "handle": [
       47.04,
       8.57,
       5.92,
       2.82
      ]
     }
    },
    {
     "t": "h",
     "text": "5 · Đặt mục tiêu (mọi thành viên)"
    },
    {
     "t": "p",
     "html": "Bấm <b>⌖ Mục tiêu</b>, rồi chạm một lần lên bản đồ là đặt xong. Mỗi người có tối đa 3 mục tiêu; hết chỗ thì mục tiêu cũ nhất bị thay."
    },
    {
     "t": "mfig",
     "shot": "target-hint",
     "caption": "Bấm Mục tiêu rồi chạm lên bản đồ",
     "alt": "Bấm Mục tiêu rồi chạm lên bản đồ",
     "marks": [
      {
       "k": "hint",
       "title": "Dòng hướng dẫn",
       "desc": "Hiện trên bản đồ: \"Chạm lên bản đồ để đánh dấu mục tiêu\".",
       "role": null
      },
      {
       "k": "cancel",
       "title": "✕ Hủy",
       "desc": "Bỏ thao tác, không đặt gì.",
       "role": null
      }
     ],
     "p": {
      "hint": [
       1.79,
       7.7,
       81.54,
       4.92
      ],
      "cancel": [
       1.79,
       91.59,
       96.41,
       7.58
      ]
     },
     "l": {
      "hint": [
       0.83,
       15.64,
       41,
       10.65
      ],
      "cancel": [
       0.83,
       85.38,
       9.19,
       12.82
      ]
     }
    },
    {
     "t": "mfig",
     "shot": "target-placed",
     "caption": "Đã đặt mục tiêu",
     "alt": "Đã đặt mục tiêu",
     "marks": [
      {
       "k": "pin",
       "title": "Mục tiêu mới",
       "desc": "Màu theo người đặt, cả đội cùng thấy ngay.",
       "role": null
      },
      {
       "k": "orders",
       "title": "☰ Lệnh (n)",
       "desc": "Số lệnh của đội tăng lên. Bấm để xem danh sách.",
       "role": null
      }
     ],
     "p": {
      "pin": [
       46.92,
       44.08,
       13.33,
       6.16
      ],
      "orders": [
       66.41,
       85.42,
       31.79,
       7.58
      ]
     },
     "l": {
      "pin": [
       64.81,
       37.18,
       6.16,
       13.33
      ],
      "orders": [
       0.83,
       72.56,
       5.92,
       12.82
      ]
     }
    },
    {
     "t": "mfig",
     "shot": "orders",
     "caption": "Danh sách lệnh của đội",
     "alt": "Danh sách lệnh của đội",
     "marks": [
      {
       "k": "row",
       "title": "Dòng lệnh",
       "desc": "Chạm để bản đồ bay tới lệnh đó. Ghi rõ ai đặt và cách đây bao lâu.",
       "role": null
      },
      {
       "k": "own",
       "title": "Lệnh của bạn",
       "desc": "Bạn xóa được lệnh do chính mình đặt.",
       "role": null
      },
      {
       "k": "del",
       "title": "✕ Xóa",
       "desc": "Chỉ hiện với lệnh bạn có quyền xóa (đội trưởng xóa được mọi lệnh).",
       "role": null
      },
      {
       "k": "icon",
       "title": "Biểu tượng loại",
       "desc": "⌖ mục tiêu, ➚ mũi tên, ⬠ vùng, khiên là Phòng thủ, mũi nhọn là Tấn công.",
       "role": null
      },
      {
       "k": "sheet",
       "title": "Thanh kéo",
       "desc": "Chạm hoặc vuốt xuống để đóng.",
       "role": null
      }
     ],
     "p": {
      "row": [
       3.33,
       39.93,
       93.33,
       7.35
      ],
      "own": [
       3.33,
       84,
       80,
       7.35
      ],
      "del": [
       83.85,
       84.72,
       12.82,
       5.92
      ],
      "icon": [
       6.67,
       48.58,
       10.26,
       4.74
      ],
      "sheet": [
       43.59,
       33.41,
       12.82,
       1.3
      ]
     },
     "l": {
      "row": [
       18.36,
       22.67,
       63.27,
       15.9
      ],
      "icon": [
       19.91,
       41.39,
       4.74,
       10.26
      ],
      "sheet": [
       47.04,
       8.57,
       5.92,
       2.82
      ]
     }
    },
    {
     "t": "h",
     "text": "6 · Đội trưởng: tấn công, phòng thủ, mũi tên, vùng"
    },
    {
     "t": "p",
     "html": "Mỗi đội có 1 đội trưởng do người tổ chức đặt (dấu ★). Chỉ đội trưởng có thêm bốn nút dưới. Tấn công và Phòng thủ chạm 1 điểm là xong, mỗi loại tối đa 5 dấu, tự đánh số 1–5; hết chỗ thì thay dấu cũ nhất. Mũi tên (tối đa 10) cần ít nhất 2 điểm, vùng (tối đa 10) cần ít nhất 3 điểm."
    },
    {
     "t": "mfig",
     "shot": "captain-bar",
     "caption": "Thanh lệnh của đội trưởng",
     "alt": "Thanh lệnh của đội trưởng",
     "marks": [
      {
       "k": "target",
       "title": "⌖ Mục tiêu",
       "desc": "Như thành viên thường.",
       "role": null
      },
      {
       "k": "dead",
       "title": "☠ Chết",
       "desc": "Chạm bản đồ rồi chọn ai chết ở đó (chọn được nhiều người).",
       "role": null
      },
      {
       "k": "atk",
       "title": "Tấn công",
       "desc": "Dấu đỏ, đánh dấu điểm tấn công.",
       "role": null
      },
      {
       "k": "def",
       "title": "Phòng thủ",
       "desc": "Dấu xanh, đánh dấu vị trí phòng thủ.",
       "role": null
      },
      {
       "k": "arrow",
       "title": "➚ Mũi tên",
       "desc": "Vẽ hướng di chuyển, chạm từng điểm dọc đường đi.",
       "role": null
      },
      {
       "k": "zone",
       "title": "⬠ Vùng",
       "desc": "Khoanh một khu (nhà, bãi trống) bằng đa giác.",
       "role": null
      },
      {
       "k": "orders",
       "title": "☰ Lệnh (n)",
       "desc": "Danh sách lệnh, đội trưởng có thêm nút xóa tất cả.",
       "role": null
      }
     ],
     "p": {
      "target": [
       1.79,
       84.47,
       13.33,
       8.53
      ],
      "dead": [
       15.64,
       84.47,
       13.33,
       8.53
      ],
      "atk": [
       29.49,
       84.47,
       13.33,
       8.53
      ],
      "def": [
       43.33,
       84.47,
       13.33,
       8.53
      ],
      "arrow": [
       57.18,
       84.47,
       13.33,
       8.53
      ],
      "zone": [
       71.03,
       84.47,
       13.33,
       8.53
      ],
      "orders": [
       84.87,
       84.47,
       13.33,
       8.53
      ]
     },
     "l": {
      "target": [
       0.83,
       34.1,
       5.92,
       12.82
      ],
      "dead": [
       6.75,
       34.1,
       5.92,
       12.82
      ],
      "atk": [
       0.83,
       46.92,
       5.92,
       12.82
      ],
      "def": [
       6.75,
       46.92,
       5.92,
       12.82
      ],
      "arrow": [
       0.83,
       59.74,
       5.92,
       12.82
      ],
      "zone": [
       6.75,
       59.74,
       5.92,
       12.82
      ],
      "orders": [
       0.83,
       72.56,
       5.92,
       12.82
      ]
     }
    },
    {
     "t": "mfig",
     "shot": "attack-defend",
     "caption": "Dấu Tấn công và Phòng thủ",
     "alt": "Dấu Tấn công và Phòng thủ",
     "marks": [
      {
       "k": "atk1",
       "title": "Tấn công 1",
       "desc": "Dấu đỏ, số theo thứ tự đặt. Cả đội thấy.",
       "role": null
      },
      {
       "k": "atk2",
       "title": "Tấn công 2",
       "desc": "Điểm tấn công kế tiếp.",
       "role": null
      },
      {
       "k": "def1",
       "title": "Phòng thủ 1",
       "desc": "Dấu xanh hình khiên, giữ cửa nhà gỗ.",
       "role": null
      },
      {
       "k": "def2",
       "title": "Phòng thủ 2",
       "desc": "Điểm phòng thủ kế tiếp, che đường mòn phía nam.",
       "role": null
      }
     ],
     "p": {
      "atk1": [
       67.44,
       42.42,
       13.33,
       6.16
      ],
      "atk2": [
       74.62,
       37.91,
       13.33,
       6.16
      ],
      "def1": [
       35.38,
       38.27,
       13.33,
       6.16
      ],
      "def2": [
       43.33,
       48.58,
       13.33,
       6.16
      ]
     },
     "l": {
      "atk1": [
       74.29,
       33.59,
       6.16,
       13.33
      ],
      "atk2": [
       77.61,
       23.85,
       6.16,
       13.33
      ],
      "def1": [
       59.48,
       24.62,
       6.16,
       13.33
      ],
      "def2": [
       63.15,
       46.92,
       6.16,
       13.33
      ]
     }
    },
    {
     "t": "mfig",
     "shot": "draw-arrow",
     "caption": "Đang vẽ mũi tên",
     "alt": "Đang vẽ mũi tên",
     "marks": [
      {
       "k": "hint",
       "title": "Dòng gợi ý",
       "desc": "Cho biết đã chạm mấy điểm và cần thêm bao nhiêu.",
       "role": null
      },
      {
       "k": "cancel",
       "title": "✕ Hủy",
       "desc": "Bỏ lệnh đang vẽ.",
       "role": null
      },
      {
       "k": "undo",
       "title": "↶ Lùi 1 điểm",
       "desc": "Xóa điểm vừa chạm để chạm lại.",
       "role": null
      },
      {
       "k": "done",
       "title": "✓ Xong (n)",
       "desc": "Lưu lệnh khi đã đủ điểm; nút sáng lên khi có thể bấm.",
       "role": null
      }
     ],
     "p": {
      "hint": [
       1.79,
       7.7,
       81.54,
       7
      ],
      "cancel": [
       1.79,
       91.59,
       31.79,
       7.58
      ],
      "undo": [
       34.1,
       91.59,
       31.79,
       7.58
      ],
      "done": [
       66.41,
       91.59,
       31.79,
       7.58
      ]
     },
     "l": {
      "hint": [
       0.83,
       15.64,
       41,
       10.65
      ],
      "cancel": [
       0.83,
       85.38,
       9.19,
       12.82
      ],
      "undo": [
       10.02,
       85.38,
       13.58,
       12.82
      ],
      "done": [
       23.6,
       85.38,
       12.47,
       12.82
      ]
     },
     "note": "Mẹo: chạm nhiều điểm bám theo đường mòn thì mũi tên uốn theo đường, đồng đội dễ theo."
    },
    {
     "t": "mfig",
     "shot": "draw-zone",
     "caption": "Đang vẽ vùng",
     "alt": "Đang vẽ vùng",
     "marks": [
      {
       "k": "hint",
       "title": "Dòng gợi ý",
       "desc": "Vùng cần ít nhất 3 điểm, nối thành đa giác.",
       "role": null
      },
      {
       "k": "undo",
       "title": "↶ Lùi 1 điểm",
       "desc": "Chạm sai thì lùi lại.",
       "role": null
      },
      {
       "k": "done",
       "title": "✓ Xong (n)",
       "desc": "Lưu vùng cho cả đội.",
       "role": null
      }
     ],
     "p": {
      "hint": [
       1.79,
       7.7,
       81.54,
       4.92
      ],
      "undo": [
       34.1,
       91.59,
       31.79,
       7.58
      ],
      "done": [
       66.41,
       91.59,
       31.79,
       7.58
      ]
     },
     "l": {
      "hint": [
       0.83,
       15.64,
       41,
       10.65
      ],
      "undo": [
       10.02,
       85.38,
       13.58,
       12.82
      ],
      "done": [
       23.6,
       85.38,
       12.49,
       12.82
      ]
     }
    },
    {
     "t": "mfig",
     "shot": "plan",
     "caption": "Kế hoạch hoàn chỉnh trên bản đồ",
     "alt": "Kế hoạch hoàn chỉnh trên bản đồ",
     "marks": [
      {
       "k": "arrow",
       "title": "Mũi tên",
       "desc": "Chạm vào mũi tên để xem người đặt, đi tới hoặc xóa.",
       "role": null
      },
      {
       "k": "head",
       "title": "Đầu mũi tên",
       "desc": "Chỉ hướng đi: từ cửa phía tây dọc đường mòn ra ngã tư.",
       "role": null
      }
     ],
     "p": {
      "arrow": [
       6.67,
       46.45,
       63.85,
       5.57
      ],
      "head": [
       64.82,
       45.42,
       8.32,
       3.36
      ]
     },
     "l": {
      "arrow": [
       46.21,
       42.31,
       29.5,
       12.05
      ],
      "head": [
       73.08,
       40.09,
       3.84,
       7.26
      ]
     }
    },
    {
     "t": "h",
     "text": "7 · Báo chết"
    },
    {
     "t": "p",
     "html": "Để cả đội biết còn bao nhiêu người và ai chết ở đâu. Mọi thành viên đều có nút <b>☠ Chết</b> (đầu lâu) cạnh Mục tiêu."
    },
    {
     "t": "steps",
     "items": [
      "Bấm <b>☠ Chết</b>, rồi chạm lên bản đồ <b>nơi bạn chết</b>. Ghi luôn, không hỏi tên. Không cần bật GPS vì bạn tự chấm vị trí.",
      "Ghim đầu lâu xám (viền theo màu của bạn, kèm chữ viết tắt) hiện cho cả đội, chấm GPS của bạn ẩn đi. Ô Đội ở góc trái hiện <b>số người sống</b> và huy hiệu <b>☠</b> đỏ.",
      "Báo nhầm hoặc sai chỗ: chạm ô Đội ở góc trái, bấm <b>Hồi sinh</b> cạnh tên mình rồi báo lại."
     ]
    },
    {
     "t": "mfig",
     "shot": "death-hint",
     "caption": "Chạm nơi bạn chết",
     "alt": "Chạm nơi bạn chết",
     "marks": [
      {
       "k": "hint",
       "title": "Dòng gợi ý",
       "desc": "Chạm lên bản đồ đúng nơi bạn chết. Ghi luôn, không hỏi lại.",
       "role": null
      },
      {
       "k": "cancel",
       "title": "✕ Hủy",
       "desc": "Bấm nếu không muốn báo chết nữa.",
       "role": null
      }
     ],
     "p": {
      "hint": [
       1.79,
       7.7,
       81.54,
       4.92
      ],
      "cancel": [
       1.79,
       91.59,
       96.41,
       7.58
      ]
     },
     "l": {
      "hint": [
       0.83,
       15.64,
       41,
       10.65
      ],
      "cancel": [
       0.83,
       85.38,
       9.19,
       12.82
      ]
     }
    },
    {
     "t": "mfig",
     "shot": "death-pin",
     "caption": "Ghim ☠ và số người còn sống",
     "alt": "Ghim ☠ và số người còn sống",
     "marks": [
      {
       "k": "chip",
       "title": "Số người sống",
       "desc": "Ô Đội hiện số người còn sống, ví dụ 5/6.",
       "role": null
      },
      {
       "k": "badge",
       "title": "Huy hiệu ☠",
       "desc": "Số người đã chết trong đội.",
       "role": null
      },
      {
       "k": "pin",
       "title": "Ghim ☠",
       "desc": "Nơi người đó chết, viền theo màu và chữ viết tắt của họ. Chạm để xem giờ chết hoặc hồi sinh.",
       "role": null
      },
      {
       "k": "btn",
       "title": "☠ Chết",
       "desc": "Thành viên tự báo chết cho mình; đội trưởng chọn người chết.",
       "role": null
      }
     ],
     "p": {
      "chip": [
       1.79,
       0.83,
       81.54,
       6.4
      ],
      "badge": [
       45.04,
       2.49,
       8.1,
       3.08
      ],
      "pin": [
       17.95,
       38.39,
       8.72,
       4.86
      ],
      "btn": [
       34.1,
       85.42,
       31.79,
       7.58
      ]
     },
     "l": {
      "chip": [
       0.83,
       1.79,
       41,
       13.85
      ],
      "badge": [
       24.13,
       5.38,
       3.74,
       6.67
      ],
      "pin": [
       51.42,
       24.87,
       4.03,
       10.51
      ],
      "btn": [
       6.75,
       59.74,
       5.92,
       12.82
      ]
     }
    },
    {
     "t": "p",
     "html": "<b>Đội trưởng</b> báo chết cho người khác: bấm <b>☠ Chết</b>, chạm nơi người đó chết, rồi chọn <b>ai chết ở đây</b> (chọn được nhiều người cùng chết một chỗ) và bấm <b>BÁO CHẾT</b>. Dùng khi đồng đội quên bấm hoặc không cầm điện thoại."
    },
    {
     "t": "mfig",
     "shot": "death-pick",
     "caption": "Đội trưởng: chọn ai chết ở đây",
     "alt": "Đội trưởng: chọn ai chết ở đây",
     "marks": [
      {
       "k": "list",
       "title": "Danh sách đội",
       "desc": "Chọn một hoặc nhiều người cùng chết ở chỗ vừa chạm.",
       "role": null
      },
      {
       "k": "chosen",
       "title": "Đã chọn",
       "desc": "Chạm lần nữa để bỏ chọn.",
       "role": null
      },
      {
       "k": "confirm",
       "title": "BÁO CHẾT",
       "desc": "Ghi những người đã chọn là chết tại điểm đã chạm.",
       "role": null
      }
     ],
     "p": {
      "list": [
       3.33,
       36.14,
       93.33,
       46.92
      ],
      "chosen": [
       3.33,
       67.42,
       93.33,
       7.82
      ],
      "confirm": [
       3.33,
       84.72,
       93.33,
       6.87
      ]
     },
     "l": {
      "list": [
       18.36,
       0,
       63.27,
       63.44
      ],
      "chosen": [
       18.36,
       29.59,
       63.27,
       16.92
      ],
      "confirm": [
       18.36,
       67.03,
       63.27,
       14.87
      ]
     }
    },
    {
     "t": "mfig",
     "shot": "death-team",
     "caption": "Danh sách đội khi có người chết",
     "alt": "Danh sách đội khi có người chết",
     "marks": [
      {
       "k": "dead",
       "title": "Hàng người chết",
       "desc": "Gạch tên, ghi giờ chết; bấm để bay tới chỗ chết.",
       "role": null
      },
      {
       "k": "revive",
       "title": "Hồi sinh",
       "desc": "Người chết tự hồi sinh cho mình; đội trưởng hồi sinh được bất kỳ ai. Ghim ☠ biến mất.",
       "role": null
      }
     ],
     "p": {
      "dead": [
       3.33,
       83.06,
       69.74,
       7.82
      ],
      "revive": [
       73.59,
       83.06,
       23.08,
       5.92
      ]
     },
     "l": {
      "dead": [
       18.36,
       90.36,
       52.37,
       9.64
      ],
      "revive": [
       70.97,
       90.36,
       10.66,
       9.64
      ]
     }
    },
    {
     "t": "h",
     "text": "Chuẩn bị trận (người tổ chức)",
     "role": "org"
    },
    {
     "t": "steps",
     "role": "org",
     "items": [
      "Chia đội xong, bấm <b>KHÓA ĐỘI</b> ở từng đội. Chỉ đội đã khóa mới có mã và nút <b>QR VÀO ĐỘI</b>.",
      "Trong tab <b>Đội hình</b>, bấm <b>Chỉnh ▾</b> rồi ở mục <b>Khu vực chơi</b> chọn Núi hoặc Phố (cả trận dùng chung). Cũng đổi được trong <b>⚙ Điều khiển trận</b>.",
      "Mở <b>⚙ Điều khiển trận</b> trên bản đồ, đưa mã/QR cho từng đội, đặt đội trưởng (★).",
      "Giữa các ván: <b>VÁN MỚI</b> xóa báo chết và lệnh nhưng giữ nguyên người đã vào đội, đội trưởng và khu vực. Chỉ một đội chơi lại thì bấm <b>☠ Hồi sinh cả đội</b> ở đội đó.",
      "Cuối buổi: <b>KẾT THÚC TRẬN</b> để xóa dữ liệu."
     ]
    },
    {
     "t": "mfig",
     "shot": "org-map",
     "caption": "Nút ⚙ trên bản đồ",
     "alt": "Nút ⚙ trên bản đồ",
     "marks": [
      {
       "k": "gear",
       "title": "⚙ Điều khiển trận",
       "desc": "Chỉ người tổ chức thấy nút này (nằm cùng cột nút công cụ).",
       "role": "org"
      },
      {
       "k": "chip",
       "title": "Chip đội",
       "desc": "Bạn cũng là người chơi nên chỉ thấy đội của mình.",
       "role": "org"
      }
     ],
     "p": {
      "gear": [
       84.36,
       27.37,
       13.85,
       6.4
      ],
      "chip": [
       1.79,
       0.83,
       81.54,
       6.4
      ]
     },
     "l": {
      "gear": [
       93.25,
       53.08,
       5.92,
       12.82
      ],
      "chip": [
       0.83,
       1.79,
       41,
       13.85
      ]
     },
     "role": "org"
    },
    {
     "t": "mfig",
     "shot": "org-sheet",
     "caption": "Điều khiển trận",
     "alt": "Điều khiển trận",
     "marks": [
      {
       "k": "area",
       "title": "Khu vực chơi",
       "desc": "Núi / Phố. Đổi là bản đồ mọi máy đổi theo.",
       "role": "org"
      },
      {
       "k": "code",
       "title": "Mã đội",
       "desc": "Mã 6 ký tự để đội viên nhập.",
       "role": "org"
      },
      {
       "k": "joined",
       "title": "Đã vào",
       "desc": "Ví dụ \"5/6 đã vào\": có bao nhiêu người đã vào đội.",
       "role": "org"
      },
      {
       "k": "qr",
       "title": "HIỆN QR",
       "desc": "Hiện mã QR để đội viên quét bằng camera.",
       "role": "org"
      },
      {
       "k": "link",
       "title": "CHIA SẺ LINK",
       "desc": "Gửi link vào đội qua Zalo/Messenger (hoặc SAO CHÉP LINK trên máy không có chia sẻ).",
       "role": "org"
      },
      {
       "k": "star",
       "title": "★ Đội trưởng",
       "desc": "Bấm để đặt hoặc bỏ đội trưởng của đội.",
       "role": "org"
      },
      {
       "k": "remove",
       "title": "✕ Gỡ",
       "desc": "Gỡ người vào nhầm tên; họ vào lại được.",
       "role": "org"
      }
     ],
     "p": {
      "area": [
       3.33,
       21.7,
       93.33,
       15.28
      ],
      "code": [
       7.44,
       43.15,
       85.9,
       8.18
      ],
      "qr": [
       7.44,
       51.56,
       42.69,
       6.4
      ],
      "link": [
       50.64,
       51.56,
       42.69,
       6.4
      ],
      "joined": [
       76.9,
       40.19,
       16.44,
       2.61
      ],
      "star": [
       66.67,
       58.79,
       12.82,
       5.92
      ],
      "remove": [
       80.51,
       58.79,
       12.82,
       5.92
      ]
     },
     "l": {
      "area": [
       18.36,
       22.67,
       63.27,
       33.08
      ],
      "code": [
       20.26,
       69.08,
       59.83,
       17.69
      ],
      "qr": [
       20.26,
       87.28,
       29.8,
       12.72
      ],
      "link": [
       50.3,
       87.28,
       29.8,
       12.72
      ],
      "joined": [
       72.5,
       62.67,
       7.6,
       5.64
      ]
     },
     "role": "org"
    },
    {
     "t": "mfig",
     "shot": "org-qr",
     "caption": "Mã QR của đội",
     "alt": "Mã QR của đội",
     "marks": [
      {
       "k": "qr",
       "title": "QR",
       "desc": "Đội viên quét bằng camera điện thoại.",
       "role": "org"
      },
      {
       "k": "hide",
       "title": "ẨN QR",
       "desc": "Thu QR lại.",
       "role": "org"
      },
      {
       "k": "link",
       "title": "CHIA SẺ LINK",
       "desc": "Gửi link thay vì QR.",
       "role": "org"
      },
      {
       "k": "newcode",
       "title": "↻ Đổi mã",
       "desc": "Tạo mã mới khi bị lộ. Mã cũ vô hiệu, người đã vào đội vẫn giữ quyền.",
       "role": "org"
      }
     ],
     "p": {
      "qr": [
       13.72,
       58.2,
       73.33,
       33.89
      ],
      "hide": [
       7.44,
       51.56,
       42.69,
       6.4
      ],
      "link": [
       50.64,
       51.56,
       42.69,
       6.4
      ],
      "newcode": [
       7.44,
       92.08,
       41.3,
       5.92
      ]
     },
     "l": {
      "qr": [
       33.23,
       97.8,
       33.89,
       2.2
      ],
      "hide": [
       20.26,
       83.44,
       29.8,
       13.85
      ],
      "link": [
       50.3,
       83.44,
       29.8,
       13.85
      ]
     },
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "m15-team-qr",
     "caption": "Nút QR VÀO ĐỘI (tab Đội hình)",
     "marks": [
      {
       "title": "QR VÀO ĐỘI",
       "desc": "Hiện ở tiêu đề đội đã khóa. Bấm để mở thẳng thẻ mã/QR của đội đó.",
       "role": "org",
       "x": 8.97,
       "y": 47.6,
       "w": 23.33,
       "h": 4.74
      }
     ],
     "alt": "Nút QR VÀO ĐỘI",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "m20-map-pick",
     "caption": "Chọn khu vực chơi (tab Đội hình)",
     "marks": [
      {
       "title": "Chỉnh ▾",
       "desc": "Ở tab Đội hình, bấm để mở phần thiết lập; mục Khu vực chơi nằm ở cuối (chỉ người tổ chức thấy).",
       "role": "org",
       "x": 3.59,
       "y": 7.7,
       "w": 92.82,
       "h": 5.69
      },
      {
       "title": "Núi",
       "desc": "Chọn khu Núi.",
       "role": "org",
       "x": 8.46,
       "y": 47.16,
       "w": 40,
       "h": 5.69
      },
      {
       "title": "Phố",
       "desc": "Chọn khu Phố. Bản đồ của mọi người đổi theo ngay.",
       "role": "org",
       "x": 48.46,
       "y": 47.16,
       "w": 40,
       "h": 5.69
      }
     ],
     "alt": "Chọn khu vực chơi",
     "role": "org"
    },
    {
     "t": "mfig",
     "shot": "org-round",
     "caption": "Giữa các ván và cuối trận",
     "alt": "Giữa các ván và cuối trận",
     "marks": [
      {
       "k": "revive",
       "title": "☠ Hồi sinh cả đội",
       "desc": "Xóa báo chết của đội đó. Dùng khi chỉ một đội chơi lại.",
       "role": "org"
      },
      {
       "k": "round",
       "title": "VÁN MỚI",
       "desc": "Xóa báo chết và mọi lệnh, giữ nguyên người đã vào đội, đội trưởng, khu vực. Bấm 2 lần để xác nhận.",
       "role": "org"
      },
      {
       "k": "end",
       "title": "KẾT THÚC TRẬN",
       "desc": "Xóa toàn bộ dữ liệu của trận, kể cả danh sách vào đội. Bấm rồi XÁC NHẬN, không hoàn tác.",
       "role": "org"
      }
     ],
     "p": {
      "revive": [
       7.44,
       7.13,
       28.74,
       5.92
      ],
      "round": [
       6.67,
       80.59,
       86.67,
       5.92
      ],
      "end": [
       6.67,
       90.3,
       86.67,
       6.87
      ]
     },
     "l": {
      "round": [
       19.91,
       58.57,
       60.19,
       12.31
      ],
      "end": [
       19.91,
       79.08,
       60.19,
       14.87
      ]
     },
     "role": "org"
    },
    {
     "t": "h",
     "text": "Quyền riêng tư và lưu ý"
    },
    {
     "t": "steps",
     "items": [
      "Chỉ đồng đội trong đội bạn thấy vị trí của bạn, và chỉ khi bạn bật chia sẻ.",
      "Ghi vị trí tối đa 5 giây một lần hoặc khi bạn di chuyển hơn 5 m.",
      "Tắt chia sẻ bất cứ lúc nào; dữ liệu bị xóa khi trận kết thúc."
     ]
    },
    {
     "t": "warn",
     "html": "<b>iPhone:</b> vị trí chỉ cập nhật khi app đang mở. Hãy giữ màn hình sáng; khóa màn hình là dừng chia sẻ. Nếu bị từ chối quyền vị trí, bật lại trong cài đặt trình duyệt. Mở link vào đội bằng Safari/Chrome, không dùng trình duyệt trong Zalo/Messenger."
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
