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
   "leadOrg": "Chốt đội, phát mã/QR vào đội, chọn khu vực chơi, đặt đội trưởng và kết thúc trận. Bạn cũng là người chơi nên vào đội như mọi người.",
   "blocks": [
    {
     "t": "p",
     "html": "Bản đồ vệ tinh chỉ hiện <b>đội của bạn</b>: vị trí GPS đồng đội và các lệnh trong đội. Người đội khác không thấy bạn."
    },
    {
     "t": "h",
     "text": "1 · Vào đội của bạn"
    },
    {
     "t": "fig",
     "shot": "m01-join-code",
     "caption": "Nhập mã đội",
     "marks": [
      {
       "title": "Ô mã đội",
       "desc": "6 ký tự, ví dụ <b>1K7QMA</b>. Ký tự đầu là số đội. Hoặc quét QR để vào thẳng bước chọn tên.",
       "role": null,
       "x": 4.1,
       "y": 25.04,
       "w": 91.79,
       "h": 8.06
      },
      {
       "title": "TIẾP TỤC",
       "desc": "Kiểm tra mã. Báo \"chưa được chốt\" nghĩa là đội chưa được khóa.",
       "role": null,
       "x": 4.1,
       "y": 34.76,
       "w": 91.79,
       "h": 6.64
      },
      {
       "title": "Lưu ý riêng tư",
       "desc": "Chỉ đồng đội thấy vị trí của bạn; có thể tắt chia sẻ bất cứ lúc nào.",
       "role": null,
       "x": 4.1,
       "y": 43.53,
       "w": 91.79,
       "h": 4.41
      }
     ],
     "alt": "Nhập mã đội"
    },
    {
     "t": "fig",
     "shot": "m02-pick-name",
     "caption": "Chọn tên của bạn",
     "marks": [
      {
       "title": "← Đổi mã",
       "desc": "Quay lại nhập mã khác.",
       "role": null,
       "x": 4.1,
       "y": 8.65,
       "w": 17.24,
       "h": 5.21
      },
      {
       "title": "Nhãn đội",
       "desc": "Cho biết bạn đang vào Đội nào.",
       "role": null,
       "x": 80.3,
       "y": 9.66,
       "w": 15.59,
       "h": 3.2
      },
      {
       "title": "Tên mờ",
       "desc": "\"Đã có người nhận\": tên đã có người dùng rồi, không chọn được.",
       "role": null,
       "x": 4.1,
       "y": 27.06,
       "w": 91.79,
       "h": 7.11
      },
      {
       "title": "Tên của bạn",
       "desc": "Chạm đúng tên mình trong danh sách.",
       "role": null,
       "x": 4.1,
       "y": 50.52,
       "w": 91.79,
       "h": 7.11
      }
     ],
     "alt": "Chọn tên của bạn"
    },
    {
     "t": "fig",
     "shot": "m03-pick-chosen",
     "caption": "Xác nhận",
     "marks": [
      {
       "title": "Tên đã chọn",
       "desc": "Có dấu ✓ và viền sáng.",
       "role": null,
       "x": 4.1,
       "y": 50.52,
       "w": 91.79,
       "h": 7.11
      },
      {
       "title": "TÔI LÀ …",
       "desc": "Bấm để vào đội. Máy nhớ phiên nên lần sau mở lại không phải chọn tên.",
       "role": null,
       "x": 5.13,
       "y": 78.95,
       "w": 89.74,
       "h": 6.64
      }
     ],
     "alt": "Xác nhận"
    },
    {
     "t": "warn",
     "html": "Chọn nhầm tên? Người tổ chức gỡ bạn trong Điều khiển trận, rồi bạn vào lại."
    },
    {
     "t": "fig",
     "shot": "m04-share-ask",
     "caption": "Hỏi bật chia sẻ vị trí",
     "marks": [
      {
       "title": "Giải thích",
       "desc": "Vị trí chỉ hiện cho đồng đội, tắt được bất cứ lúc nào, xóa khi kết thúc trận. iPhone chỉ cập nhật khi app đang mở.",
       "role": null,
       "x": 4.1,
       "y": 74.27,
       "w": 91.79,
       "h": 9.86
      },
      {
       "title": "CHIA SẺ VỊ TRÍ",
       "desc": "Bật GPS và cho đồng đội thấy bạn. Trình duyệt sẽ hỏi quyền vị trí, hãy chọn Cho phép.",
       "role": null,
       "x": 4.1,
       "y": 85.07,
       "w": 91.79,
       "h": 6.16
      },
      {
       "title": "CHỈ XEM BẢN ĐỒ",
       "desc": "Vẫn xem bản đồ và lệnh của đội nhưng không chia sẻ vị trí. Bật lại sau bằng nút dưới bản đồ.",
       "role": null,
       "x": 4.1,
       "y": 92.18,
       "w": 91.79,
       "h": 6.16
      }
     ],
     "alt": "Hỏi bật chia sẻ vị trí"
    },
    {
     "t": "h",
     "text": "2 · Màn hình bản đồ"
    },
    {
     "t": "fig",
     "shot": "m05-map",
     "caption": "Bản đồ khi đang chia sẻ",
     "marks": [
      {
       "title": "Chip đội",
       "desc": "Hiện Đội, số người đang hiện (ví dụ 3/6), tên bạn và trạng thái ĐANG CHIA SẺ / ĐANG XEM. Bấm để xem danh sách đội.",
       "role": null,
       "x": 2.56,
       "y": 7.46,
       "w": 80,
       "h": 5.69
      },
      {
       "title": "⌖ Căn bản đồ",
       "desc": "Đưa bản đồ về vừa khu chơi (khung vàng 4 góc).",
       "role": null,
       "x": 85.13,
       "y": 7.46,
       "w": 12.31,
       "h": 5.69
      },
      {
       "title": "# Lưới",
       "desc": "Bật/tắt lưới ô vuông.",
       "role": null,
       "x": 85.13,
       "y": 14.1,
       "w": 12.31,
       "h": 5.69
      },
      {
       "title": "◐ Nền vệ tinh",
       "desc": "Đổi giữa Esri chuẩn và Clarity.",
       "role": null,
       "x": 85.13,
       "y": 20.73,
       "w": 12.31,
       "h": 5.69
      },
      {
       "title": "⛶ Toàn màn hình",
       "desc": "Xoay ngang để xem rộng hơn. Chỉ hiện khi máy hỗ trợ.",
       "role": null,
       "x": 85.13,
       "y": 27.37,
       "w": 12.31,
       "h": 5.69
      },
      {
       "title": "GPS đồng đội",
       "desc": "Chấm màu có tên là vị trí GPS từng đồng đội, mỗi người một màu. Mờ đi khi quá 60 giây chưa cập nhật, ẩn sau 5 phút.",
       "role": null,
       "x": 22.56,
       "y": 41.47,
       "w": 0,
       "h": 2.37
      },
      {
       "title": "Chấm xanh là bạn",
       "desc": "Vị trí của bạn, kèm vòng sai số GPS.",
       "role": null,
       "x": 40,
       "y": 45.02,
       "w": 4.62,
       "h": 2.13
      },
      {
       "title": "Nút chia sẻ",
       "desc": "Bấm để bật hoặc tắt chia sẻ vị trí. Dưới nút ghi sai số GPS và \"trong khu\" hay \"ngoài khu\".",
       "role": null,
       "x": 2.56,
       "y": 85.18,
       "w": 94.87,
       "h": 5.22
      },
      {
       "title": "⌖ Mục tiêu",
       "desc": "Đánh dấu mục tiêu cho cả đội (xem bên dưới).",
       "role": null,
       "x": 2.56,
       "y": 77.36,
       "w": 46.41,
       "h": 6.87
      },
      {
       "title": "☰ Lệnh",
       "desc": "Danh sách lệnh của đội, số trong ngoặc là số lệnh đang có.",
       "role": null,
       "x": 51.03,
       "y": 77.36,
       "w": 46.41,
       "h": 6.87
      }
     ],
     "alt": "Bản đồ khi đang chia sẻ"
    },
    {
     "t": "fig",
     "shot": "m06-grid",
     "caption": "Lưới tọa độ",
     "marks": [
      {
       "title": "# đang bật",
       "desc": "Nút sáng lên khi lưới đang hiện.",
       "role": null,
       "x": 85.13,
       "y": 14.1,
       "w": 12.31,
       "h": 5.69
      },
      {
       "title": "Nhãn ô",
       "desc": "Ô lớn gọi A1, B2… Chia nhỏ bằng bàn phím số: 7-8-9 / 4-5-6 / 1-2-3. Phóng to để thấy cấp nhỏ hơn. Dùng để báo vị trí qua bộ đàm, ví dụ \"B3 phím 5\".",
       "role": null,
       "x": 16.41,
       "y": 28.2,
       "w": 0,
       "h": 0
      }
     ],
     "alt": "Lưới tọa độ"
    },
    {
     "t": "fig",
     "shot": "m07-team-sheet",
     "caption": "Danh sách đội (bấm chip đội)",
     "marks": [
      {
       "title": "Đang hiện",
       "desc": "Đồng đội có tín hiệu. Nếu là bạn sẽ ghi \"Bạn\"; còn lại có nút \"Đi tới ›\" để bản đồ bay tới người đó.",
       "role": null,
       "x": 0,
       "y": 0,
       "w": 0,
       "h": 0
      },
      {
       "title": "Mất tín hiệu",
       "desc": "Quá 60 giây chưa cập nhật, kèm thời gian. Có thể họ khóa màn hình hoặc mất sóng.",
       "role": null,
       "x": 0,
       "y": 0,
       "w": 0,
       "h": 0
      },
      {
       "title": "Chưa vào / chưa chia sẻ",
       "desc": "Người này chưa vào đội, hoặc đã vào nhưng chưa bật chia sẻ.",
       "role": null,
       "x": 0,
       "y": 0,
       "w": 0,
       "h": 0
      },
      {
       "title": "Thanh kéo",
       "desc": "Chạm hoặc vuốt xuống để đóng.",
       "role": null,
       "x": 0,
       "y": 0,
       "w": 0,
       "h": 0
      }
     ],
     "alt": "Danh sách đội (bấm chip đội)"
    },
    {
     "t": "h",
     "text": "3 · Đặt mục tiêu (mọi thành viên)"
    },
    {
     "t": "fig",
     "shot": "m08-target-hint",
     "caption": "Bấm Mục tiêu rồi chạm lên bản đồ",
     "marks": [
      {
       "title": "Dòng hướng dẫn",
       "desc": "Hiện trên bản đồ: \"Chạm lên bản đồ để đánh dấu mục tiêu\". Chạm một lần là đặt xong.",
       "role": null,
       "x": 2.56,
       "y": 14.34,
       "w": 80,
       "h": 4.21
      },
      {
       "title": "✕ Hủy",
       "desc": "Bỏ thao tác, không đặt gì.",
       "role": null,
       "x": 2.56,
       "y": 83.53,
       "w": 94.87,
       "h": 6.87
      }
     ],
     "alt": "Bấm Mục tiêu rồi chạm lên bản đồ"
    },
    {
     "t": "fig",
     "shot": "m09-target-placed",
     "caption": "Đã đặt mục tiêu",
     "marks": [
      {
       "title": "☰ Lệnh (n)",
       "desc": "Số lệnh tăng lên. Mỗi người có tối đa 3 mục tiêu; hết chỗ thì mục tiêu cũ nhất bị thay.",
       "role": null,
       "x": 51.03,
       "y": 77.36,
       "w": 46.41,
       "h": 6.87
      }
     ],
     "alt": "Đã đặt mục tiêu"
    },
    {
     "t": "fig",
     "shot": "m10-orders-list",
     "caption": "Danh sách lệnh của đội",
     "marks": [
      {
       "title": "Dòng lệnh",
       "desc": "Chạm để bản đồ bay tới lệnh đó. Ghi rõ ai đặt và cách đây bao lâu.",
       "role": null,
       "x": 4.1,
       "y": 69.67,
       "w": 78.46,
       "h": 6.64
      },
      {
       "title": "✕ Xóa",
       "desc": "Chỉ hiện với lệnh bạn có quyền xóa (lệnh của chính bạn; đội trưởng xóa được mọi lệnh).",
       "role": null,
       "x": 84.62,
       "y": 70.38,
       "w": 11.28,
       "h": 5.21
      },
      {
       "title": "Biểu tượng loại",
       "desc": "⌖ mục tiêu (màu theo người đặt), ➚ mũi tên, ⬠ vùng.",
       "role": null,
       "x": 7.44,
       "y": 85.66,
       "w": 8.72,
       "h": 4.03
      }
     ],
     "alt": "Danh sách lệnh của đội"
    },
    {
     "t": "h",
     "text": "4 · Đội trưởng: tấn công, phòng thủ, mũi tên, vùng"
    },
    {
     "t": "p",
     "html": "Mỗi đội có 1 đội trưởng do người tổ chức đặt. Chỉ đội trưởng có thêm nút <b>Tấn công</b> (đỏ), <b>Phòng thủ</b> (xanh), <b>➚ Mũi tên</b> và <b>⬠ Vùng</b>. Tấn công và Phòng thủ chạm 1 điểm là xong, mỗi loại tối đa 5 dấu; hết chỗ thì thay dấu cũ nhất."
    },
    {
     "t": "fig",
     "shot": "m12-captain-bar",
     "caption": "Thanh lệnh của đội trưởng",
     "marks": [
      {
       "title": "⌖ Mục tiêu",
       "desc": "Như thành viên thường.",
       "role": null,
       "x": 2.56,
       "y": 84.83,
       "w": 14.1,
       "h": 7.82
      },
      {
       "title": "Tấn công",
       "desc": "Đánh dấu hướng/điểm tấn công: chạm 1 điểm trên bản đồ (đỏ, tối đa 5).",
       "role": null,
       "x": 18.72,
       "y": 84.83,
       "w": 14.1,
       "h": 7.82
      },
      {
       "title": "Phòng thủ",
       "desc": "Đánh dấu vị trí phòng thủ: chạm 1 điểm (xanh, tối đa 5).",
       "role": null,
       "x": 34.87,
       "y": 84.83,
       "w": 14.1,
       "h": 7.82
      },
      {
       "title": "➚ Mũi tên",
       "desc": "Chỉ hướng đẩy/di chuyển: chạm ít nhất 2 điểm.",
       "role": null,
       "x": 51.03,
       "y": 84.83,
       "w": 14.1,
       "h": 7.82
      },
      {
       "title": "⬠ Vùng",
       "desc": "Khoanh một khu vực: chạm ít nhất 3 điểm.",
       "role": null,
       "x": 67.18,
       "y": 84.83,
       "w": 14.1,
       "h": 7.82
      },
      {
       "title": "☰ Lệnh",
       "desc": "Danh sách lệnh, và nút XÓA TẤT CẢ LỆNH (bấm 2 lần để xác nhận).",
       "role": null,
       "x": 83.33,
       "y": 84.83,
       "w": 14.1,
       "h": 7.82
      }
     ],
     "alt": "Thanh lệnh của đội trưởng"
    },
    {
     "t": "fig",
     "shot": "m21-attack-defend",
     "caption": "Dấu Tấn công và Phòng thủ trên bản đồ",
     "marks": [
      {
       "title": "Tấn công",
       "desc": "Dấu đỏ: cả đội thấy trên bản đồ.",
       "role": null,
       "x": 25.13,
       "y": 63.74,
       "w": 11.28,
       "h": 5.21
      },
      {
       "title": "Phòng thủ",
       "desc": "Dấu xanh: cả đội thấy trên bản đồ.",
       "role": null,
       "x": 66.15,
       "y": 54.27,
       "w": 11.28,
       "h": 5.21
      }
     ],
     "alt": "Dấu Tấn công và Phòng thủ",
     "role": null
    },
    {
     "t": "fig",
     "shot": "m13-drawing-arrow",
     "caption": "Đang vẽ mũi tên",
     "marks": [
      {
       "title": "Dòng gợi ý",
       "desc": "Cho biết đã chạm mấy điểm và cần thêm bao nhiêu.",
       "role": null,
       "x": 2.56,
       "y": 8.06,
       "w": 80,
       "h": 6.29
      },
      {
       "title": "✕ Hủy",
       "desc": "Bỏ lệnh đang vẽ.",
       "role": null,
       "x": 2.56,
       "y": 91.94,
       "w": 30.26,
       "h": 6.87
      },
      {
       "title": "↶ Lùi 1 điểm",
       "desc": "Xóa điểm vừa chạm để chạm lại.",
       "role": null,
       "x": 34.87,
       "y": 91.94,
       "w": 30.26,
       "h": 6.87
      },
      {
       "title": "✓ Xong (n)",
       "desc": "Lưu lệnh khi đã đủ điểm; nút sáng lên khi có thể bấm.",
       "role": null,
       "x": 67.18,
       "y": 91.94,
       "w": 30.26,
       "h": 6.87
      }
     ],
     "alt": "Đang vẽ mũi tên"
    },
    {
     "t": "fig",
     "shot": "m14-drawing-zone",
     "caption": "Đang vẽ vùng",
     "marks": [
      {
       "title": "Dòng gợi ý",
       "desc": "Vùng cần ít nhất 3 điểm, nối thành đa giác.",
       "role": null,
       "x": 2.56,
       "y": 8.06,
       "w": 80,
       "h": 4.21
      },
      {
       "title": "✓ Xong (n)",
       "desc": "Lưu vùng cho cả đội.",
       "role": null,
       "x": 67.18,
       "y": 91.94,
       "w": 30.26,
       "h": 6.87
      }
     ],
     "alt": "Đang vẽ vùng"
    },
    {
     "t": "h",
     "text": "Chuẩn bị trận (người tổ chức)",
     "role": "org"
    },
    {
     "t": "steps",
     "items": [
      "Chia đội xong, bấm <b>KHÓA ĐỘI</b> ở từng đội. Chỉ đội đã khóa mới có mã và nút <b>QR VÀO ĐỘI</b>.",
      "Trong tab <b>Đội hình</b>, bấm <b>Chỉnh ▾</b> để mở phần thiết lập, rồi ở mục <b>Khu vực chơi</b> chọn Núi hoặc Phố (cả trận dùng chung). Cũng đổi được trong <b>⚙ Điều khiển trận</b> ở bước sau.",
      "Mở <b>⚙ Điều khiển trận</b> trên bản đồ, đưa mã/QR cho từng đội, đặt đội trưởng.",
      "Cuối buổi: <b>KẾT THÚC TRẬN</b> để xóa dữ liệu."
     ],
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "m15-team-qr",
     "caption": "Nút QR VÀO ĐỘI",
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
     "caption": "Chọn khu vực chơi",
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
     "t": "fig",
     "shot": "m16-org-map",
     "caption": "Nút ⚙ trên bản đồ",
     "marks": [
      {
       "title": "⚙ Điều khiển trận",
       "desc": "Chỉ người tổ chức thấy nút này (nằm cạnh các nút công cụ).",
       "role": "org",
       "x": 85.13,
       "y": 27.73,
       "w": 12.31,
       "h": 5.69
      },
      {
       "title": "Chip đội",
       "desc": "Bạn cũng là người chơi nên chỉ thấy đội của mình.",
       "role": "org",
       "x": 2.56,
       "y": 1.18,
       "w": 80,
       "h": 5.69
      }
     ],
     "alt": "Nút ⚙ trên bản đồ",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "m17-org-sheet",
     "caption": "Điều khiển trận",
     "marks": [
      {
       "title": "Khu vực chơi",
       "desc": "Núi / Phố. Đổi là bản đồ mọi máy đổi theo.",
       "role": "org",
       "x": 7.44,
       "y": 29.29,
       "w": 85.13,
       "h": 5.69
      },
      {
       "title": "Mã đội",
       "desc": "Mã 6 ký tự để đội viên nhập. Dòng \"4/6 đã vào\" cho biết có bao nhiêu người đã vào đội.",
       "role": "org",
       "x": 8.21,
       "y": 43.27,
       "w": 84.36,
       "h": 7.46
      },
      {
       "title": "HIỆN QR",
       "desc": "Hiện mã QR để đội viên quét bằng camera.",
       "role": "org",
       "x": 8.21,
       "y": 51.68,
       "w": 41.15,
       "h": 5.69
      },
      {
       "title": "CHIA SẺ LINK",
       "desc": "Gửi link vào đội qua Zalo/Messenger (hoặc SAO CHÉP LINK trên máy không có chia sẻ).",
       "role": "org",
       "x": 51.41,
       "y": 51.68,
       "w": 41.15,
       "h": 5.69
      },
      {
       "title": "Thành viên",
       "desc": "✓ Đã vào / Chưa vào. Nút ★ đặt đội trưởng (bấm lại để bỏ), nút ✕ gỡ người đó ra khỏi đội.",
       "role": "org",
       "x": 8.21,
       "y": 58.31,
       "w": 84.36,
       "h": 6.4
      }
     ],
     "alt": "Điều khiển trận",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "m18-org-qr",
     "caption": "Mã QR của đội",
     "marks": [
      {
       "title": "QR",
       "desc": "Đội viên quét bằng camera điện thoại.",
       "role": "org",
       "x": 14.49,
       "y": 42.32,
       "w": 71.79,
       "h": 33.18
      },
      {
       "title": "ẨN QR",
       "desc": "Thu QR lại.",
       "role": "org",
       "x": 8.21,
       "y": 35.68,
       "w": 41.15,
       "h": 5.69
      },
      {
       "title": "CHIA SẺ LINK",
       "desc": "Gửi link thay vì QR.",
       "role": "org",
       "x": 51.41,
       "y": 35.68,
       "w": 41.15,
       "h": 5.69
      },
      {
       "title": "↻ Đổi mã",
       "desc": "Tạo mã mới khi bị lộ. Mã cũ vô hiệu, người đã vào đội vẫn giữ quyền.",
       "role": "org",
       "x": 8.21,
       "y": 76.21,
       "w": 39.77,
       "h": 5.21
      }
     ],
     "alt": "Mã QR của đội",
     "role": "org"
    },
    {
     "t": "fig",
     "shot": "m19-org-end",
     "caption": "Kết thúc trận",
     "marks": [
      {
       "title": "KẾT THÚC TRẬN · XÓA DỮ LIỆU",
       "desc": "Bấm rồi XÁC NHẬN: xóa toàn bộ vị trí, lệnh, danh sách vào đội và mã đội. Không hoàn tác.",
       "role": "org",
       "x": 7.44,
       "y": 90.66,
       "w": 85.13,
       "h": 6.16
      }
     ],
     "alt": "Kết thúc trận",
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
