<?php
require_once 'db_connect.php';

$id = $_POST['id'];
$name = $_POST['name'];

$image_name = null;

if (isset($_FILES['image'])) {
    $file = $_FILES['image'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);

    $image_name = "playlist_" . time() . "." . $ext;
    move_uploaded_file($file['tmp_name'], "../img/" . $image_name);
}

if ($image_name) {
    $sql = "UPDATE playlists SET name = ?, playlist_image = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $name, $image_name, $id);
} else {
    $sql = "UPDATE playlists SET name = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $name, $id);
}

$stmt->execute();

echo json_encode(["success"=>true, "message"=>"Cập nhật danh sách phát thành công!"]);

$stmt->close();
$conn->close();
?>

