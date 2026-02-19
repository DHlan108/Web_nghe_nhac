-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 19, 2026 at 10:34 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
  `release_year` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `albums`
--

INSERT INTO `albums` (`id`, `title`, `artist_id`, `release_year`) VALUES
(1, 'COUP D`ETAT', 1, 2013),
(2, 'Lover', 2, 2019),
(3, 'm-tp M-TP', 3, 2017),
(4, 'BẬT NÓ LÊN', 4, 2024),
(5, 'Bảo tàng của nuối tiếc', 5, 2024),
(6, '99%', 6, 2023),
(7, 'ái', 7, 2023);

-- --------------------------------------------------------

--
-- Table structure for table `artists`
--

CREATE TABLE `artists` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `country` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artists`
--

INSERT INTO `artists` (`id`, `name`, `country`) VALUES
(1, 'G-Dragon', 'Hàn Quốc'),
(2, 'Taylor Swift', 'Hoa Kỳ'),
(3, 'Sơn Tùng MTP', 'Việt Nam'),
(4, 'SOOBIN', 'Việt Nam'),
(5, 'VŨ', 'Việt Nam'),
(6, 'RPT MCK', 'Việt Nam'),
(7, 'tlinh', 'Việt Nam');

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
  `release_year` int(11) DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `songs`
--

INSERT INTO `songs` (`id`, `title`, `artist_id`, `album_id`, `duration`, `release_year`, `file_path`, `image_path`) VALUES
(1, 'người điên', 7, 7, 227, 2023, 'music/nguoi_dien.mp3', 'images/nguoi_dien.jpg'),
(2, 'nữ siêu anh  hùng', 7, 7, 331, 2023, 'music/nu_sieu_anh_hung.mp3', 'images/nu_sieu_anh_hung.jpg'),
(3, 'Anh đã ổn hơn', 6, 6, 314, 2023, 'music/anh_da_on_hon.mp3', 'images/anh_da_on_hon.jpg'),
(4, 'Cuốn Cho Anh Một Điếu Nữa Đi', 6, 6, 305, 2023, 'music/cuon_cho_anh_mot_dieu_nua_di.mp3', 'images/cuon_cho_anh_mot_dieu_nua_di.jpg'),
(5, 'Mây Khóc Vì Điều Gì', 5, 5, 334, 2024, 'music/may_khoc_vi_dieu_gi.mp3', 'images/may_khoc_vi_dieu_gi.jpg'),
(6, 'Nếu Những Tiếc Nuối', 5, 5, 420, 2024, 'music/neu_nhung_tiec_nuoi.mp3', 'images/neu_nhung_tiec_nuoi.jpg'),
(7, 'Sunset In The City - Deluxe Version', 4, 4, 345, 2024, 'music/sunset_in_the_city.mp3', 'images/sunset_in_the_city.jpg'),
(8, 'DANCING IN THE DARK', 4, 4, 347, 2024, 'music/dancing_in_the_dark.mp3', 'images/dancing_in_the_dark.jpg'),
(9, 'Buông Đôi Tay Nhau Ra', 3, 3, 347, 2017, 'music/buong_doi_tay_nhau_ra.mp3', 'images/buong_doi_tay_nhau_ra.jpg'),
(10, 'Âm Thầm Bên Em', 3, 3, 453, 2017, 'music/am_tham_ben_em.mp3', 'images/am_tham_ben_em.jpg'),
(11, 'Cornelia Street', 2, 2, 447, 2019, 'music/cornelia_street.mp3', 'images/cornelia_street.jpg'),
(12, 'Daylight', 2, 2, 453, 2019, 'music/daylight.mp3', 'images/daylight.jpg'),
(13, 'CROOKED', 1, 1, 344, 2013, 'music/crooked.mp3', 'images/crooked.jpg'),
(14, 'BLACK', 1, 1, 323, 2013, 'music/black.mp3', 'images/black.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'admin01', 'admin01@gmail.com', '$2a$10$abcxyzHashGia', 'admin'),
(2, 'user01', 'user01@gmail.com', '$2a$10$abcxyzHashGia', 'user');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
