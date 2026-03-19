<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$id = $_POST['id'] ?? 0;

if($id == 0){
    echo json_encode([
        "success" => false,
        "message" => "Thiếu ID"
    ]);
    exit;
}

$sql = "DELETE FROM songs WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if($stmt->execute()){
    echo json_encode([
        "success" => true,
        "message" => "Xóa thành công"
    ]);
}else{
    echo json_encode([
        "success" => false,
        "message" => "Xóa thất bại"
    ]);
}

$stmt->close();
$conn->close();
?>