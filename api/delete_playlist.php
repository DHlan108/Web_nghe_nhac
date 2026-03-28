<?php

require_once 'db_connect.php';

header("Content-Type: application/json");

$id = $_POST['id'];

//xóa bài hát
$conn->query("DELETE FROM playlist_songs WHERE playlist_id = $id");

//xóa playlist
$conn->query("DELETE FROM playlists WHERE id = $id");

echo json_encode(["success"=>true, "message"=>"Đã xóa danh sách phát"]);

$conn->close();
?>