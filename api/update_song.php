<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$id = $_POST['id'] ?? 0;
$title = $_POST['title'] ?? '';
$artist_id = $_POST['artist_id'] ?? 0;
$release_date = $_POST['release_date'] ?? '';

if($id == 0){
    echo json_encode(["success"=>false,"message"=>"Thiếu ID"]);
    exit;
}

$sql = "UPDATE songs SET title=?, artist_id=?, release_date=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sisi", $title, $artist_id, $release_date, $id);

if($stmt->execute()){
    echo json_encode(["success"=>true,"message"=>"Cập nhật thành công"]);
}else{
    echo json_encode(["success"=>false,"message"=>"Cập nhật thất bại"]);
}

$stmt->close();
$conn->close();
?>