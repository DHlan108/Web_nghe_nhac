<?php
$servername = "localhost";
$username = "root";
$password = ""; // 
$dbname = "web_music"; 

// Khởi tạo kết nối 
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8");

// Kiểm tra xem kết nối có thành công không
if ($conn->connect_error) {
    // Nếu lỗi, dừng chương trình và in ra lỗi
    die("Kết nối Database thất bại: " . $conn->connect_error);
} 

?>