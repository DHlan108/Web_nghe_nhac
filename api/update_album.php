<?php
include 'db_connect.php';

// Kiểm tra dữ liệu đầu vào
$id = $_POST['id'] ?? '';
$title = $_POST['title'] ?? '';
$artist_id = $_POST['artist_id'] ?? '';
$release_year = $_POST['release_year'] ?? '';
$cover_image = $_POST['cover_image'] ?? '';

if (empty($id)) {
    echo json_encode(["success" => false, "message" => "Thiếu ID Album"]);
    exit;
}

$sql = "UPDATE `albums` SET 
        `title` = '$title', 
        `artist_id` = '$artist_id', 
        `release_year` = '$release_year', 
        `cover_image` = '$cover_image' 
        WHERE `id` = $id";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["success" => true, "message" => "Cập nhật album thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi SQL: " . mysqli_error($conn)]);
}
?>