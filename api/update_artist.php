<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$country = $_POST['country'] ?? '';
$avatar = $_POST['avatar'] ?? '';

if (empty($id) || empty($name)) {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin cập nhật"]);
    exit;
}

$sql = "UPDATE artists SET name = ?, country = ?, avatar = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssi", $name, $country, $avatar, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}
?>