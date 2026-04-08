<?php
$servername = "localhost";
$username = "root";
$password = ""; // 
$dbname = "web_music"; 

// Khởi tạo kết nối 
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8");

// Kiểm tra 
if ($conn->connect_error) {
    
    die("Kết nối Database thất bại: " . $conn->connect_error);
} 

?>