-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 17, 2026 at 04:13 PM
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
  `cover_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `albums`
--

INSERT INTO `albums` (`id`, `title`, `artist_id`, `release_year`, `cover_image`) VALUES
(1, 'COUP D`ETAT', 1, 2013, 'coup d\'etat.jpg'),
(2, 'Lover', 2, 2019, 'lover.png'),
(3, 'm-tp M-TP', 3, 2017, 'm-tp.jpg'),
(4, 'BẬT NÓ LÊN', 4, 2024, 'batnolen.jpg'),
(5, 'Bảo tàng của nuối tiếc', 5, 2024, 'baotang.jpg'),
(6, '99%', 6, 2023, '99.jpg'),
(7, 'ái', 7, 2023, 'ai.jpg');

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
(5, 'VŨ', 'Việt Nam', 'vu.jpg'),
(6, 'RPT MCK', 'Việt Nam', 'mck.jpg'),
(7, 'tlinh', 'Việt Nam', 'tlinh.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `playlists`
--

CREATE TABLE `playlists` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `playlist_songs`
--

CREATE TABLE `playlist_songs` (
  `playlist_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(14, 'BLACK', 1, 1, 323, '2013-09-05', 'music/black.mp3', 'coup d\'etat.jpg', 0);

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
(1, 'admin01', 'admin01@gmail.com', '$2a$10$abcxyzHashGia', 'admin', NULL),
(2, 'user01', 'user01@gmail.com', '$2a$10$abcxyzHashGia', 'user', NULL),
(3, 'maichi', 'mchi17082005@gmail.com', '$2y$10$f8oBZ4ZrLW3Y7Kv52EYZM.ZuV.6Oq3pFhqyws1v27nC7dTSgeVVUq', 'user', NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `artists`
--
ALTER TABLE `artists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
