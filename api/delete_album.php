<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$id = $_POST['id'] ?? '';

if (empty($id)) {
    echo json_encode(["success" => false, "message" => "No ID"]);
    exit;
}

$conn->query("DELETE FROM songs WHERE album_id = $id");
$sql = "DELETE FROM albums WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $conn->error]);
}
?>