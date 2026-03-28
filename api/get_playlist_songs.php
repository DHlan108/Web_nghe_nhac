<?php
require_once 'db_connect.php';

$playlist_id = $_GET['playlist_id'];

$sql = "SELECT songs.*, artists.name AS artist_name FROM playlist_songs JOIN songs ON playlist_songs.song_id = songs.id JOIN artists ON songs.artist_id = artists.id WHERE playlist_songs.playlist_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $playlist_id);
$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
