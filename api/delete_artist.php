<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

$id = $_POST['id'] ?? '';

if (empty($id)) {
    echo json_encode(["success" => false, "message" => "Thiếu ID"]);
    exit;
}

$sql = "DELETE FROM artists WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}
?>