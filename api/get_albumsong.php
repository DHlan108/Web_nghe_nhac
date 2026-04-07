<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

// Kiểm tra kết nối
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Lỗi kết nối CSDL: " . $conn->connect_error]);
    exit;
}

// Set charset utf8mb4 để hiển thị tiếng Việt có dấu không bị lỗi
$conn->set_charset("utf8mb4");

// Lấy album_id từ tham số URL (GET request)
if (!isset($_GET['album_id']) || empty($_GET['album_id'])) {
    echo json_encode(["success" => false, "message" => "Không tìm thấy mã Album!"]);
    exit;
}

$album_id = intval($_GET['album_id']);

// 3. Truy vấn lấy các bài hát thuộc album này
$sql = "SELECT id, title, file_path, duration, listens FROM songs WHERE album_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $album_id);
$stmt->execute();
$result = $stmt->get_result();

$songs = [];
while ($row = $result->fetch_assoc()) {
    $songs[] = $row;
}

// 4. Trả về kết quả cho JavaScript xử lý
if (count($songs) > 0) {
    echo json_encode(["success" => true, "songs" => $songs]);
} else {
    echo json_encode(["success" => false, "message" => "Album này chưa có bài hát nào."]);
}

$stmt->close();
$conn->close();
?>