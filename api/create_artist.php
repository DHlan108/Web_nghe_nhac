<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

$name = $_POST['name'] ?? '';
$country = $_POST['country'] ?? '';
$avatar = $_POST['avatar'] ?? '';

if (empty($name)) {
    echo json_encode(["success" => false, "message" => "Vui lòng nhập tên nghệ sĩ"]);
    exit;
}

$sql = "INSERT INTO artists (name, country, avatar) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $country, $avatar);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Thêm nghệ sĩ thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}
?>