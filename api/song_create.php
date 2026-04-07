<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

$title = $_POST['title'] ?? '';
$artist_id = $_POST['artist_id'] ?? 0;
$album_id = isset($_POST['album_id']) && $_POST['album_id'] !== ''
    ? (int)$_POST['album_id']
    : NULL;
$release_date = $_POST['release_date'] ?? date('Y-m-d');
$file_path = $_POST['file_path'] ?? '';
$image_path = $_POST['image_path'] ?? '';

if(!$title || !$artist_id || !$file_path){
    echo json_encode([
        "success" => false,
        "message" => "Vui lòng điền đầy đủ thông tin (tiêu đề, ca sĩ, file)"
    ]);
    exit;
}

$sql = "INSERT INTO songs (title, artist_id, album_id, release_date, file_path, image_path) 
        VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("siisss", $title, $artist_id, $album_id, $release_date, $file_path, $image_path);

if($stmt->execute()){
    echo json_encode([
        "success" => true,
        "message" => "Thêm bài hát thành công"
    ]);
}else{
    echo json_encode([
        "success" => false,
        "message" => "Thêm bài hát thất bại: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
