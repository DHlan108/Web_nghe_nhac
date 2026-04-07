<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$id = $_POST['id'] ?? '';
$title = $_POST['title'] ?? '';
$artist_id = $_POST['artist_id'] ?? '';
$release_year = $_POST['release_year'] ?? '';
$cover_image = $_POST['cover_image'] ?? '';


if($id == 0){
    echo json_encode(["success"=>false,"message"=>"Thiếu ID"]);
    exit;
}

$sql = "UPDATE songs SET title=?, artist_id=?, album_id=?, release_date=? WHERE id=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("siisi", $title, $artist_id, $album_id, $release_date, $id);

if($stmt->execute()){
    echo json_encode(["success"=>true,"message"=>"Cập nhật thành công"]);
}else{
    echo json_encode(["success"=>false,"message"=>"Cập nhật thất bại"]);
}

$stmt->close();
$conn->close();
?>