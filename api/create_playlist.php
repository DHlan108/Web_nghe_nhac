<?php

session_start();
require_once 'db_connect.php';

$user_id = $_SESSION['user_id'];
$name = $_POST['name'];
$image_name = null;

if (isset($_FILES['image'])) {
    $file = $_FILES['image'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);

    $image_name = "playlist_" .time() . "." . $ext;
    move_uploaded_file($file['tmp_name'], "../img/" . $image_name);
}

$sql = "INSERT INTO playlists (name, user_id, playlist_image) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sis", $name, $user_id, $image_name);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Tạo danh sách phát thành công!"]);


$stmt->close();
$conn->close();
?>