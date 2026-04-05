-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 05, 2026 lúc 08:27 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `web_music`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `albums`
--

CREATE TABLE `albums` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `release_year` int(11) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `albums`
--

INSERT INTO `albums` (`id`, `title`, `artist_id`, `release_year`, `cover_image`) VALUES
(1, 'COUP D`ETAT', 1, 2013, 'coup d\'etat.jpg'),
(2, 'Loverr', 2, 2019, 'lover.png'),
(3, 'm-tp M-TP', 3, 2017, 'm-tp.jpg'),
(4, 'BẬT NÓ LÊN', 4, 2024, 'batnolen.jpg'),
(5, 'Bảo tàng của nuối tiếc', 5, 2024, 'baotang.jpg'),
(6, '99%', 6, 2023, '99.jpg'),
(7, 'ái', 7, 2023, 'ai.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `artists`
--

CREATE TABLE `artists` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `country` varchar(50) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `artists`
--

INSERT INTO `artists` (`id`, `name`, `country`, `avatar`) VALUES
(1, 'G-Dragon', 'Hàn Quốc', 'gd.jpg'),
(2, 'Taylor Swift', 'Hoa Kỳ', 'taylorswift.jpg'),
(3, 'Sơn Tùng MTP', 'Việt Nam', 'sontung.jpg'),
(4, 'SOOBIN', 'Việt Nam', 'soobin.jpg'),
(5, 'VŨ', 'Việt Nam', 'vu.jpg'),
(6, 'RPT MCK', 'Việt Nam', 'mck.jpg'),
(7, 'tlinh', 'Việt Nam', 'tlinh.jpg'),
(8, 'Obito', 'Việt Nam', 'obito.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
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
-- Cấu trúc bảng cho bảng `notification_users`
--

CREATE TABLE `notification_users` (
  `id` int(11) NOT NULL,
  `notification_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `is_read` tinyint(4) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notification_users`
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
-- Cấu trúc bảng cho bảng `playlists`
--

CREATE TABLE `playlists` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `playlist_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `playlists`
--

INSERT INTO `playlists` (`id`, `user_id`, `name`, `playlist_image`) VALUES
(3, 3, 'chill', 'playlist_1774585370.png'),
(21, 3, 'Nhạc rap', NULL),
(22, 1, 'nhạc đi ngủ', 'playlist_1774682177.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `playlist_songs`
--

CREATE TABLE `playlist_songs` (
  `playlist_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `playlist_songs`
--

INSERT INTO `playlist_songs` (`playlist_id`, `song_id`) VALUES
(3, 3),
(3, 4),
(3, 5),
(3, 13),
(21, 13),
(22, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `songs`
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
-- Đang đổ dữ liệu cho bảng `songs`
--

INSERT INTO `songs` (`id`, `title`, `artist_id`, `album_id`, `duration`, `release_date`, `file_path`, `image_path`, `listens`) VALUES
(1, 'người điên', 7, 7, 227, '2023-08-16', 'music/nguoi_dien.mp3', 'ai.jpg', 0),
(2, 'nữ siêu anh  hùng', 7, 7, 331, '2023-08-16', 'music/nu_sieu_anh_hung.mp3', 'ai.jpg', 0),
(3, 'Anh đã ổn hơn', 6, 6, 314, '2023-03-02', 'music/anh_da_on_hon.mp3', '99.jpg', 0),
(4, 'Cuốn Cho Anh Một Điếu Nữa Đi', 6, 6, 305, '2023-03-02', 'music/cuon_cho_anh_mot_dieu_nua_di.mp3', '99.jpg', 0),
(5, 'Mây Khóc Vì Điều Gì', 5, 5, 334, '2024-09-27', 'music/may_khoc_vi_dieu_gi.mp3', 'baotang.jpg', 0),
(6, 'Nếu Những Tiếc Nuối', 5, 5, 420, '2024-09-27', 'music/neu_nhung_tiec_nuoi.mp3', 'baotang.jpg', 0),
(7, 'Sunset In The City - Deluxe Version', 4, 4, 345, '2024-06-20', 'music/sunset_in_the_city.mp3', 'batnolen.jpg', 0),
(8, 'DANCING IN THE DARK', 4, 4, 347, '2024-06-20', 'music/dancing_in_the_dark.mp3', 'batnolen.jpg', 0),
(9, 'Buông Đôi Tay Nhau Ra', 3, 3, 347, '2017-04-01', 'music/buong_doi_tay_nhau_ra.mp3', 'm-tp.jpg', 0),
(10, 'Âm Thầm Bên Em', 3, 3, 453, '2023-04-01', 'music/am_tham_ben_em.mp3', 'm-tp.jpg', 0),
(11, 'Cornelia Street', 2, 2, 447, '2019-08-23', 'music/cornelia_street.mp3', 'lover.png', 0),
(12, 'Daylight', 2, 2, 453, '2019-08-23', 'music/daylight.mp3', 'lover.png', 0),
(13, 'CROOKED', 1, 1, 344, '2013-09-05', 'music/crooked.mp3', 'coup d\'etat.jpg', 0),
(14, 'BLACK', 1, 1, 323, '2013-09-05', 'music/black.mp3', 'coup d\'etat.jpg', 0),
(43, 'Badtrip', 6, 6, NULL, '2023-03-02', 'music/bad_trip.mp3', '99.jpg', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
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
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `ava_user`) VALUES
(1, 'admin01', 'admin01@gmail.com', '$2y$10$Az2SsYgJc3H.16XBB2jwzuGIIbQaAJEAiBsyJv1rqCzm4xNVTv0Ha', 'admin', NULL),
(2, 'user01', 'user01@gmail.com', '$2a$10$abcxyzHashGia', 'user', NULL),
(3, 'maichi', 'mchi17082005@gmail.com', '$2y$10$f8oBZ4ZrLW3Y7Kv52EYZM.ZuV.6Oq3pFhqyws1v27nC7dTSgeVVUq', 'user', 'avatar_1774424371.webp');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artist_id` (`artist_id`);

--
-- Chỉ mục cho bảng `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `notification_users`
--
ALTER TABLE `notification_users`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `playlist_songs`
--
ALTER TABLE `playlist_songs`
  ADD PRIMARY KEY (`playlist_id`,`song_id`),
  ADD KEY `song_id` (`song_id`);

--
-- Chỉ mục cho bảng `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artist_id` (`artist_id`),
  ADD KEY `album_id` (`album_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `artists`
--
ALTER TABLE `artists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `notification_users`
--
ALTER TABLE `notification_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `albums`
--
ALTER TABLE `albums`
  ADD CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`);

--
-- Các ràng buộc cho bảng `playlists`
--
ALTER TABLE `playlists`
  ADD CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `playlist_songs`
--
ALTER TABLE `playlist_songs`
  ADD CONSTRAINT `playlist_songs_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`),
  ADD CONSTRAINT `playlist_songs_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`);

--
-- Các ràng buộc cho bảng `songs`
--
ALTER TABLE `songs`
  ADD CONSTRAINT `songs_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`),
  ADD CONSTRAINT `songs_ibfk_2` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
