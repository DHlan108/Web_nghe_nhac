<?php
$servername = "localhost";
$username = "root";
$password = ""; // Mặc định XAMPP không có mật khẩu
$dbname = "web_music"; // Tên database 

// Khởi tạo kết nối 
$conn = new mysqli($servername, $username, $password, $dbname);

// Thêm dòng này để lấy dữ liệu tiếng Việt (tên bài hát, ca sĩ) không bị lỗi font
$conn->set_charset("utf8");

// Kiểm tra xem kết nối có thành công không
if ($conn->connect_error) {
    // Nếu lỗi, dừng chương trình và in ra lỗi
    die("Kết nối Database thất bại: " . $conn->connect_error);
} 

// Dòng dưới đây dùng để test. Khi nào test web báo thành công 
//echo "Kết nối database music_manager thành công rực rỡ!";
?>