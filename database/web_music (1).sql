-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 08, 2026 at 09:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_music`
--

-- --------------------------------------------------------

--
-- Table structure for table `albums`
--

CREATE TABLE `albums` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `release_year` int(11) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `listens` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `albums`
--

INSERT INTO `albums` (`id`, `title`, `artist_id`, `release_year`, `cover_image`, `listens`) VALUES
(1, 'COUP D`ETAT', 1, 2013, 'coup d\'etat.jpg', 0),
(2, 'Loverr', 2, 2019, 'lover.png', 0),
(3, 'm-tp M-TP', 3, 2017, 'm-tp.jpg', 0),
(4, 'BẬT NÓ LÊN', 4, 2024, 'batnolen.jpg', 1),
(5, 'Bảo tàng của nuối tiếc', 5, 2024, 'baotang.jpg', 0),
(6, '99%', 6, 2023, '99.jpg', 0),
(7, 'ái', 7, 2023, 'ai.jpg', 2),
(9, 'L2K', 11, 2025, 'l2k.jpg', 0),
(10, 'Đánh Đổi', 8, 2023, 'danhdoi.jpg', 0),
(11, 'The Life of a Showgirl', 2, 2025, 'the_life_of_a_showgirl.jpg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `artists`
--

CREATE TABLE `artists` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `country` varchar(50) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artists`
--

INSERT INTO `artists` (`id`, `name`, `country`, `avatar`) VALUES
(1, 'G-Dragon', 'Hàn Quốc', 'gd.jpg'),
(2, 'Taylor Swift', 'Hoa Kỳ', 'taylorswift.jpg'),
(3, 'Sơn Tùng MTP', 'Việt Nam', 'sontung.jpg'),
(4, 'SOOBIN', 'Việt Nam', 'soobin.jpg'),
(5, 'VŨ.', 'Việt Nam', 'vu.jpg'),
(6, 'MCK', 'Việt Nam', 'mck.jpg'),
(7, 'tlinh', 'Việt Nam', 'tlinh.jpg'),
(8, 'Obito', 'Việt Nam', 'obito.jpg'),
(9, 'MIN', 'Việt Nam', 'min.jpg'),
(10, 'VSTRA', 'Việt Nam', 'vstra.jpg'),
(11, 'Low G', 'Việt Nam', 'lowg.jpg'),
(12, 'JustaTee', 'Việt Nam', 'justatee.jpg'),
(13, 'HIEUTHUHAI', 'Việt Nam', 'hieuthuhai.jpg'),
(14, 'GREY D', 'Việt Nam', 'greyd.jpg'),
(15, 'Ariana Grande', 'Hoa Kỳ', 'arianagrande.jpg'),
(16, 'Billie Eilish', 'Hoa Kỳ', 'billieelish.jpg'),
(17, 'Fujii Kaze', 'Nhật Bản', 'fujikaze.jpg'),
(18, 'Charlie Puth', 'Hoa Kỳ', 'charlieputh.jpg'),
(19, 'Chillies', 'Việt Nam', 'chillies.jpg'),
(20, 'Keshi', 'Hoa Kỳ', 'keshi.jpg'),
(21, 'Hoàng Dũng', 'Việt Nam', 'hoangdung.jpg'),
(22, 'Tùng', 'Việt Nam', 'tung.jpg'),
(23, 'Hà Anh Tuấn', 'Việt Nam', 'haanhtuan.jpg'),
(24, 'Wren Evans', 'Việt Nam', 'wrenevan.jpg'),
(25, 'Thắng', 'Việt Nam', 'thang.jpg'),
(26, 'Hào', 'Việt Nam', 'hao.jpg'),
(27, 'Ronboongz', 'Việt Nam', 'ronboongz.jpg'),
(28, 'Kha', 'Việt Nam', 'kha.jpg'),
(29, 'Madihu', 'Việt Nam', 'madihu.jpg'),
(30, 'Jvke', 'Anh Quốc', 'jvke.jpg'),
(31, 'MONO', 'Việt Nam', 'mono.jpg'),
(32, 'JISOO', 'Hàn Quốc', 'jisoo.jpg'),
(33, 'Quân AP', 'Việt Nam', 'quân ap.jpg'),
(34, 'Bùi Trường Linh', 'Việt Nam', 'buitruonglinh.jpg'),
(35, 'HayD', 'Hoa Kỳ', 'hayD.jpg'),
(36, 'Phùng Khánh Linh', 'Việt Nam', 'phungkhanhlinh.jpg'),
(37, 'Táo', 'Việt Nam', 'tao.jpg'),
(38, 'Hòa Minzy', 'Việt Nam', 'hoaminzy.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `content`, `created_at`, `is_active`) VALUES
(1, 'test', 'kiểm tra mục thông báo', '2026-03-30 03:46:05', 1),
(2, 'test', 'test thông báo', '2026-03-30 17:45:47', 1),
(3, 'test 3', 'test 3', '2026-03-30 17:58:41', 1),
(4, 'test 4', 'test 4\r\n', '2026-03-30 18:18:25', 1),
(5, 'test 5', 'test 5\r\n', '2026-03-30 18:19:00', 1),
(6, 'test 6', 'test 6\r\n', '2026-03-30 18:19:22', 1),
(7, 'test 7', '7', '2026-03-30 18:19:34', 1),
(8, 'test 8', '8', '2026-03-30 18:19:49', 1),
(9, 'test', 'mệt quáaaaaaaaa', '2026-04-05 15:28:22', 1),
(10, 'test', '123', '2026-04-05 17:34:19', 1),
(11, 't', 't', '2026-04-05 17:34:32', 1),
(12, 'getg', 'gẻgyhr', '2026-04-05 17:34:41', 1),
(13, 'fdg', 'dg', '2026-04-05 17:34:48', 1),
(14, 'gfdg', 'gdg', '2026-04-05 17:34:53', 1),
(15, 'gfdg', 'fgdg', '2026-04-05 17:35:00', 1),
(16, 'fdgfdbf', 'fhyty', '2026-04-05 17:35:10', 1),
(17, 'gfbb', 'hfbn', '2026-04-05 17:35:24', 1),
(18, 'fgb', 'bfg', '2026-04-05 17:35:32', 1),
(19, 'fgnb', 'vcyt', '2026-04-05 17:35:38', 1),
(20, 'gbv', 'mjkj', '2026-04-05 17:35:45', 1),
(21, 'f', 'f', '2026-04-05 17:43:55', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notification_users`
--

CREATE TABLE `notification_users` (
  `id` int(11) NOT NULL,
  `notification_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `is_read` tinyint(4) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_users`
--

INSERT INTO `notification_users` (`id`, `notification_id`, `user_id`, `is_read`, `created_at`) VALUES
(1, 10, 2, 0, '2026-04-05 17:34:19'),
(2, 10, 3, 1, '2026-04-05 17:34:20'),
(3, 11, 2, 0, '2026-04-05 17:34:32'),
(4, 11, 3, 1, '2026-04-05 17:34:32'),
(5, 12, 2, 0, '2026-04-05 17:34:41'),
(6, 12, 3, 1, '2026-04-05 17:34:41'),
(7, 13, 2, 0, '2026-04-05 17:34:48'),
(8, 13, 3, 1, '2026-04-05 17:34:48'),
(9, 14, 2, 0, '2026-04-05 17:34:53'),
(10, 14, 3, 1, '2026-04-05 17:34:53'),
(11, 15, 2, 0, '2026-04-05 17:35:01'),
(12, 15, 3, 1, '2026-04-05 17:35:01'),
(13, 16, 2, 0, '2026-04-05 17:35:10'),
(14, 16, 3, 1, '2026-04-05 17:35:10'),
(15, 17, 2, 0, '2026-04-05 17:35:24'),
(16, 17, 3, 1, '2026-04-05 17:35:24'),
(17, 18, 2, 0, '2026-04-05 17:35:32'),
(18, 18, 3, 1, '2026-04-05 17:35:32'),
(19, 19, 2, 0, '2026-04-05 17:35:38'),
(20, 19, 3, 1, '2026-04-05 17:35:38'),
(21, 20, 2, 0, '2026-04-05 17:35:45'),
(22, 20, 3, 1, '2026-04-05 17:35:45'),
(23, 21, 2, 0, '2026-04-05 17:43:55'),
(24, 21, 3, 1, '2026-04-05 17:43:55');

-- --------------------------------------------------------

--
-- Table structure for table `playlists`
--

CREATE TABLE `playlists` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `playlist_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `playlists`
--

INSERT INTO `playlists` (`id`, `user_id`, `name`, `playlist_image`) VALUES
(3, 3, 'chill', 'playlist_1775621599.webp'),
(21, 3, 'Nhạc rap', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `playlist_songs`
--

CREATE TABLE `playlist_songs` (
  `playlist_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `playlist_songs`
--

INSERT INTO `playlist_songs` (`playlist_id`, `song_id`) VALUES
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(3, 7),
(3, 8),
(3, 13),
(3, 43),
(3, 48),
(3, 55),
(3, 62),
(3, 63),
(3, 68),
(3, 70),
(21, 3),
(21, 13),
(21, 14),
(21, 43),
(21, 47),
(21, 54),
(21, 61),
(21, 72),
(21, 76);

-- --------------------------------------------------------

--
-- Table structure for table `songs`
--

CREATE TABLE `songs` (
  `id` int(11) NOT NULL,
  `title` varchar(300) NOT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `album_id` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `listens` bigint(20) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `songs`
--

INSERT INTO `songs` (`id`, `title`, `artist_id`, `album_id`, `duration`, `release_date`, `file_path`, `image_path`, `listens`) VALUES
(1, 'người điên', 7, 7, 227, '2023-08-16', 'music/nguoi_dien.mp3', 'ai.jpg', 12),
(2, 'nữ siêu anh  hùng', 7, 7, 331, '2023-08-16', 'music/nu_sieu_anh_hung.mp3', 'ai.jpg', 0),
(3, 'Anh đã ổn hơn', 6, 6, 314, '2023-03-02', 'music/anh_da_on_hon.mp3', '99.jpg', 0),
(4, 'Cuốn Cho Anh Một Điếu Nữa Đi', 6, 6, 305, '2023-03-02', 'music/cuon_cho_anh_mot_dieu_nua_di.mp3', '99.jpg', 1),
(5, 'Mây Khóc Vì Điều Gì', 5, 5, 334, '2024-09-27', 'music/may_khoc_vi_dieu_gi.mp3', 'baotang.jpg', 0),
(6, 'Nếu Những Tiếc Nuối', 5, 5, 420, '2024-09-27', 'music/neu_nhung_tiec_nuoi.mp3', 'baotang.jpg', 1),
(7, 'Sunset In The City - Deluxe Version', 4, 4, 345, '2024-06-20', 'music/sunset_in_the_city.mp3', 'batnolen.jpg', 1),
(8, 'DANCING IN THE DARK', 4, 4, 347, '2024-06-20', 'music/dancing_in_the_dark.mp3', 'batnolen.jpg', 1),
(9, 'Buông Đôi Tay Nhau Ra', 3, 3, 347, '2017-04-01', 'music/buong_doi_tay_nhau_ra.mp3', 'm-tp.jpg', 1),
(10, 'Âm Thầm Bên Em', 3, 3, 453, '2023-04-01', 'music/am_tham_ben_em.mp3', 'm-tp.jpg', 25),
(11, 'Cornelia Street', 2, 2, 447, '2019-08-23', 'music/cornelia_street.mp3', 'lover.png', 1),
(12, 'Daylight', 2, 2, 453, '2019-08-23', 'music/daylight.mp3', 'lover.png', 0),
(13, 'CROOKED', 1, 1, 344, '2013-09-05', 'music/crooked.mp3', 'coup d\'etat.jpg', 0),
(14, 'BLACK', 1, 1, 323, '2013-09-05', 'music/black.mp3', 'coup d\'etat.jpg', 0),
(43, 'Badtrip', 6, 6, NULL, '2023-03-02', 'music/bad_trip.mp3', '99.jpg', 3),
(45, 'Ai Ngoài Anh', 10, NULL, NULL, '2025-12-20', 'music/ai_ngoai_anh.mp3', 'ai_ngoai_anh.jpg', 0),
(46, '2AM', 12, NULL, NULL, '2015-08-12', 'music/2am.mp3', '2am.jpg', 0),
(47, 'Ai Mới Là Kẻ Xấu Xa', 6, 6, NULL, '2023-03-02', 'music/ai_moi_la_ke_xau_xa.mp3', '99.jpg', 1),
(48, 'Bật Nhạc Lên', 13, NULL, NULL, '2020-06-01', 'music/bat_nhac_len.mp3', 'bat_nhac_len.jpg', 0),
(49, 'CÀ PHÊ', 9, NULL, NULL, '2022-03-21', 'music/ca_phe.mp3', 'ca_phe.jpg', 0),
(50, 'chẳng phải tình đầu sao đau đến thế', 9, NULL, NULL, '2025-10-22', 'music/chang_phai_tinh_dau_sao_dau_den_the.mp3', 'dear_min.jpg', 0),
(51, 'Chỉ Một Đêm Nữa Thôi', 6, 6, NULL, '2023-03-02', 'music/chi_mot_dem_nua_thoi.mp3', '99.jpg', 0),
(52, 'Có Em Chờ', 9, NULL, NULL, '2017-04-27', 'music/co_em_cho.mp3', 'co_em_cho.jpg', 0),
(53, 'Cruel Summer', 2, 2, NULL, '2019-08-23', 'music/cruel_summer.mp3', 'lover.png', 0),
(54, 'Đánh Đổi', 8, 10, NULL, '2023-10-10', 'music/danh_doi.mp3', 'danhdoi.jpg', 0),
(55, 'dạo này', 8, NULL, NULL, '2025-12-24', 'music/dao_nay.mp3', 'dao_nay.jpg', 1),
(56, 'dự báo thời tiết hôm nay mưa', 14, NULL, NULL, '2022-11-22', 'music/du_bao_thoi_tiet_hom_nay_mua.mp3', 'du_bao_thoi_tiet.jpg', 0),
(57, 'Exit Sign', 13, NULL, NULL, '2023-10-16', 'music/exitsign.mp3', 'exit_sign.jpg', 0),
(58, 'Hà Nội', 8, 10, NULL, '2023-10-10', 'music/ha_noi.mp3', 'danhdoi.jpg', 0),
(60, 'HÃY TRAO CHO ANH', 3, NULL, NULL, '2019-07-01', 'music/hay_trao_cho_anh.mp3', 'hay_trao_cho_a.jpg', 0),
(61, 'In Love', 11, 9, NULL, '2025-10-21', 'music/in_love.mp3', 'l2k.jpg', 0),
(62, 'Internet Love', 10, NULL, NULL, '2021-02-14', 'music/internet_love.mp3', 'internet_love.jpg', 0),
(63, 'nếu lúc đó', 7, 7, NULL, '2023-03-02', 'music/neu_luc_do.mp3', 'ai.jpg', 1),
(65, 'ngủ một mình (tình rất tình)', 13, NULL, NULL, '2022-11-17', 'music/ngu_mot_minh.mp3', 'ngumotminh.jpg', 0),
(68, 'Opalite', 2, 11, NULL, '2025-10-03', 'music/opalite.mp3', 'the_life_of_a_showgirl.jpg', 0),
(69, 'Nhiều Hơn', 11, 9, NULL, '2025-10-21', 'music/nhieu_hon.mp3', 'l2k.jpg', 0),
(70, 'PHONG', 10, NULL, NULL, '2022-05-20', 'music/phong,mp3', 'phong.jpg', 0),
(71, 'She Neva Knows', 12, NULL, NULL, '2012-01-21', 'music/she_neva_knows.mp3', 'she_neva_knows.jpg', 0),
(72, 'Simp Gái 808', 11, NULL, NULL, '2023-10-17', 'music/simp_gai_808.mp3', 'simp_gai_808.jpg', 1),
(73, 'Tell The Kids I Love Them', 8, 10, NULL, '2023-10-10', 'music/tell_the_kids_i_love_them.mp3', 'danhdoi.jpg', 0),
(74, 'Thằng Điên', 12, NULL, NULL, '2018-10-12', 'music/thang_dien.mp3', 'thang_dien.jpg', 0),
(75, 'The Fate of Ophelia', 2, 11, NULL, '2025-10-03', 'music/the_fate_of_ophelia.mp3', 'the_life_of_a_showgirl.jpg', 0),
(76, 'Tối Nay Ta Đi Đâu Nhờ', 6, 6, NULL, '2023-03-02', 'music/toi_nay_ta_di_dau_nho.mp3', '99.jpg', 0),
(77, 'vaicaunoicokhiennguoithaydoi', 14, NULL, NULL, '2023-05-23', 'music/vaicaunoicokhiennguoithaydoi.mp3', 'vaicaunoi.jpg', 0),
(78, 'VÌ YÊU CỨ ĐÂM ĐẦU', 9, NULL, NULL, '2019-11-10', 'music/vi_yeu_cu_dam_dau.mp3', 'vi_yeu_cu_dam_dau.jpg', 0),
(79, 'Có Em Đời Bỗng Vui', 19, NULL, NULL, '2020-02-07', 'music/co_em_doi_bong_vui.mp3', 'co_em_doi_bong_vui.jpg', 0),
(80, 'Và Thế Là Hết', 19, NULL, NULL, '2018-12-24', 'music/va_the_la_het.mp3', 'va_the_la_het.jpg', 0),
(81, 'Vùng Ký Ức', 19, NULL, NULL, '2020-03-27', 'music/vung_ky_uc.mp3', 'vung_ky_uc.jpg', 0),
(82, 'We Don\'t Talk Anymore', 18, NULL, NULL, '2016-08-03', 'music/we_don_talk_anymore.mp3', 'we_dont_talk_anymore.jpg', 0),
(83, 'Lovely', 16, NULL, NULL, '2018-04-26', 'music/lovely.mp3', 'lovely.jpg', 0),
(84, 'Shinunoga E-Wa', 17, NULL, NULL, '2022-10-26', 'music/shinunoga_e_wa.mp3', 'fujikaze.jpg', 0),
(86, '7 rings', 15, NULL, NULL, '2008-03-04', 'music/7_ring.mp3', 'arianagrande.jpg', 1),
(87, 'Limbo', 20, NULL, NULL, '2023-08-06', 'music/limbo.mp3', 'keshi.jpg', 2),
(88, 'Nàng thơ', 21, NULL, NULL, '2022-02-09', 'music/nang_tho.mp3', 'hoangdung.jpg', 0),
(89, 'Xa', 22, NULL, NULL, '2023-08-06', 'music/xa.mp3', 'tung.jpg', 0),
(90, 'Rừng Thông', 22, NULL, NULL, '2024-05-06', 'music/rung_thong.mp3', 'tung.jpg', 0),
(91, 'Tháng tư là lời nói dối của em', 23, NULL, NULL, '2023-06-09', 'music/thang_tu_la_loi_noi_doi_cua_em.mp3', 'haanhtuan.jpg', 0),
(92, 'Cơn mưa tình yêu', 23, NULL, NULL, '2014-05-07', 'music/con_mua_tinh_yeu.mp3', 'haanhtuan.jpg', 0),
(93, 'Thu đợi', 24, NULL, NULL, '2026-02-03', 'music/thu_doi.mp3', 'wrenevan.jpg', 0),
(94, 'Tò te tí', 24, NULL, NULL, '2023-08-12', 'music/to_te_ti.mp3', 'wrenevan.jpg', 0),
(95, 'Từng quen', 24, NULL, NULL, '2023-05-09', 'music/tung_quen.mp3', 'wrenevan.jpg', 0),
(96, 'Trước khi em tồn tại', 25, NULL, NULL, '2023-07-06', 'music/truoc_khi_em_ton_tai.mp3', 'thang.jpg', 0),
(97, 'Gội đầu', 25, NULL, NULL, '2026-01-04', 'music/goi_dau.mp3', 'thang.jpg', 1),
(98, '23:40', 26, NULL, NULL, '2023-07-09', 'music/23:40.mp3', 'hao.jpg', 0),
(99, 'Ta đã từng quen nhau chưa', 26, NULL, NULL, '2023-04-06', 'music/ta_da_tung_yeu_nhau_chua.mp3', 'hao.jpg', 0),
(100, 'Nhắn nhủ', 27, NULL, NULL, NULL, 'music/nhan_nhu.mp3', 'ronboongz.jpg', 0),
(101, 'Lời yêu ngây dại', 28, NULL, NULL, NULL, 'music/loi_yeu_ngay_dai.mp3', 'kha.jpg', 0),
(102, 'Hư không', 28, NULL, NULL, NULL, 'music/hu_khong.mp3', 'kha.jpg', 0),
(103, 'Em có nghe', 28, NULL, NULL, NULL, 'music/em_co_nghe.mp3', 'kha.jpg', 0),
(104, 'Khi em lớn', 27, NULL, NULL, '2024-08-07', 'music/khi_em_lon.mp3', 'ronboongz.jpg', 0),
(105, 'Không còn em', 28, NULL, NULL, '2023-05-06', 'music/khong_con_em.mp3', 'madihu.jpg', 0),
(106, 'Her', 30, NULL, NULL, NULL, 'music/her.mp3', 'jvke.jpg', 0),
(107, 'This is what falling in love feel like', 30, NULL, NULL, '2023-02-05', 'music/this_is_what_falling_in_love_feel_like.mp3', 'jvke.jpg', 0),
(108, 'Waitting for you', 31, NULL, NULL, '2023-08-07', 'music/waitting_for_you.mp3', 'mono.jpg', 0),
(109, 'Chăm hoa', 31, NULL, NULL, '2023-03-07', 'music/cham_hoa.mp3', 'mono.jpg', 0),
(110, 'All eyes on me', 32, NULL, NULL, '2023-06-09', 'music/all_eye_on_me.mp3', 'jisoo.jpg', 0),
(111, 'FLower', 32, NULL, NULL, NULL, 'music/flower.mp3', 'jisoo.jpg', 0),
(112, 'Bông hoa đẹp nhất ', 33, NULL, NULL, '2024-02-06', 'music/bong_hoa_dep_nhat.mp3', 'quân ap.jpg', 0),
(113, 'Thịnh vượng Việt Nam sáng ngời', 34, NULL, NULL, '2025-02-04', 'music/thinh_vuong_viet_nam_sang_ngoi.mp3', 'buitruonglinh.jpg', 0),
(114, 'Đường tôi chở em về ', 34, NULL, NULL, '2025-03-06', 'music/duong_toi_cho_em_ve.mp3', 'buitruonglinh.jpg', 0),
(115, 'Nguyên vẹn', 22, NULL, NULL, '2023-06-05', 'music/nguyen_ven.mp3', 'tung.jpg', 0),
(116, 'Đặt trái tim lên bàn', 22, NULL, NULL, '2022-02-01', 'music/dat_trai_tim_len_ban.mp3', 'tung.jpg', 1),
(117, 'Có khóc cũng thế thôi ', 26, NULL, NULL, '2018-06-05', 'music/co_khoc_cung_the_thoi.mp3', 'hao.jpg', 0),
(118, 'Cỏ may', 26, NULL, NULL, '2019-02-06', 'music/co_may.mp3', 'hao.jpg', 0),
(119, 'Lan man', 27, NULL, NULL, '2023-06-05', 'music/lan_man.mp3', 'ronboongz.jpg', 0),
(120, 'Head in the cloud', 35, NULL, NULL, '2019-03-09', 'music/head_in_the_cloud.mp3', 'hayD.jpg', 0),
(121, 'Em là', 31, NULL, NULL, '2025-03-06', 'music/em_la.mp3', 'mono.jpg', 0),
(122, 'Hôm nay tôi buồn', 35, NULL, NULL, '2018-02-07', 'music/hom_nay_toi_buon.mp3', 'phungkhanhlinh.jpg', 0),
(123, 'Anh là thằng tồi', 36, NULL, NULL, '2025-02-12', 'music/anh_la_thang_toi.mp3', 'phungkhanhlinh.jpg', 0),
(124, 'Blue tequilla', 37, NULL, NULL, '2025-02-09', 'music/blue_tequilla.mp3', 'tao.jpg', 0),
(125, 'Bắc Bling', 38, NULL, NULL, '2024-06-08', 'music/bacbling.mp3', 'hoaminzy.jpg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `ava_user` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `ava_user`) VALUES
(1, 'admin01', 'admin01@gmail.com', '$2y$10$Az2SsYgJc3H.16XBB2jwzuGIIbQaAJEAiBsyJv1rqCzm4xNVTv0Ha', 'admin', NULL),
(2, 'user01', 'user01@gmail.com', '$2a$10$abcxyzHashGia', 'user', NULL),
(3, 'maichi', 'mchi17082005@gmail.com', '$2y$10$f8oBZ4ZrLW3Y7Kv52EYZM.ZuV.6Oq3pFhqyws1v27nC7dTSgeVVUq', 'user', 'avatar_1774424371.webp'),
(4, 'lan', 'lan@gmail.com', '$2y$10$03sqeQEaGYDyGT4Gwg5rhOuO6OZPN1kt7Iht7bj.UGZRMwD6mUjJa', 'user', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artist_id` (`artist_id`);

--
-- Indexes for table `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_users`
--
ALTER TABLE `notification_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `playlist_songs`
--
ALTER TABLE `playlist_songs`
  ADD PRIMARY KEY (`playlist_id`,`song_id`),
  ADD KEY `song_id` (`song_id`);

--
-- Indexes for table `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artist_id` (`artist_id`),
  ADD KEY `album_id` (`album_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `artists`
--
ALTER TABLE `artists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `notification_users`
--
ALTER TABLE `notification_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `albums`
--
ALTER TABLE `albums`
  ADD CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`);

--
-- Constraints for table `playlists`
--
ALTER TABLE `playlists`
  ADD CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `playlist_songs`
--
ALTER TABLE `playlist_songs`
  ADD CONSTRAINT `playlist_songs_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`),
  ADD CONSTRAINT `playlist_songs_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`);

--
-- Constraints for table `songs`
--
ALTER TABLE `songs`
  ADD CONSTRAINT `songs_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`),
  ADD CONSTRAINT `songs_ibfk_2` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
