<?php

require_once 'db_connect.php';

$playlist_id = $_POST['playlist_id'];
$song_id = $_POST['song_id'];

$sql = "INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $playlist_id, $song_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Bài hát đã được thêm vào danh sách phát"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi"]);
}

