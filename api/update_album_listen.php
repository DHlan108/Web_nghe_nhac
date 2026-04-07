<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = intval($_POST['id']);

    if ($id > 0) {
        $sql = "UPDATE albums SET listens = listens + 1 WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Đã tăng 1 lượt xem album"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Lỗi database"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "ID album không hợp lệ"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Thiếu dữ liệu ID"]);
}
$conn->close();
?>