<?php

header('Content-Type: application/json');
require_once 'db_connect.php';

$artist_id = $_GET['id'];

$sql = "SELECT title, release_year
        FROM songs
        WHERE artist_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $artist_id);
$stmt->execute();

$result = $stmt->get_result();

$songs = [];

while($row = $result->fetch_assoc()){
    $songs[] = $row;
}

echo json_encode([
    "success" => true,
    "songs" => $songs
]);