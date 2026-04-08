<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

// Kiểm tra kết nối CSDL
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kết nối CSDL thất bại"]);
    exit;
}

// Lấy dữ liệu từ POST
$title = $_POST['title'] ?? '';
$artist_id = $_POST['artist_id'] ?? '';
$release_year = $_POST['release_year'] ?? '';
$cover_image = $_POST['cover_image'] ?? '';

// Kiểm tra dữ liệu đầu vào cơ bản
if (empty($title) || empty($artist_id)) {
    echo json_encode(["success" => false, "message" => "Vui lòng nhập đầy đủ Tên Album và ID Nghệ sĩ"]);
    exit;
}

// Câu lệnh SQL tránh SQL Injection
$sql = "INSERT INTO albums (title, artist_id, release_year, cover_image) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("siis", $title, $artist_id, $release_year, $cover_image);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Thêm album thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>