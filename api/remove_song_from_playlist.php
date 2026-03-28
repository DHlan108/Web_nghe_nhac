<?php

require_once 'db_connect.php';

$playlist_id = $_POST['playlist_id'];
$song_id = $_POST['song_id'];

$sql = "DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id =?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $playlist_id, $song_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Bài hát đã được xóa khỏi danh sách phát"]);
} else {
    echo json_encode(["success" => false, "message" => "Có lỗi xảy ra khi xóa bài hát"]);
}