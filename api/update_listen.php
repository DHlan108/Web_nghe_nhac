<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

// Kiểm tra xem có nhận được ID bài hát từ JS gửi lên không
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = intval($_POST['id']);

    if ($id > 0) {
        $sql = "UPDATE songs SET listens = listens + 1 WHERE id = ?";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Đã tăng 1 lượt nghe"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Lỗi database"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "ID bài hát không hợp lệ"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Thiếu dữ liệu ID"]);
}

$conn->close();
?>