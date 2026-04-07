<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

$sql = "SELECT 
            songs.id,
            songs.title,
            songs.file_path,
            songs.image_path,
            songs.release_date,
            artists.name AS artist_name
        FROM songs
        JOIN artists ON songs.artist_id = artists.id
        ORDER BY songs.release_date DESC
        LIMIT 6";

$result = $conn->query($sql);

$songs = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $songs[] = $row;
    }
}

echo json_encode($songs);
$conn->close();
?>