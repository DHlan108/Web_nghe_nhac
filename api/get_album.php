<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connect failed"]);
    exit;
}

$sql = "SELECT al.*, ar.name as artist_name FROM albums al, artists ar where al.artist_id = ar.id ORDER BY release_year DESC";
$result = $conn->query($sql);

if ($result) {
    $albums = [];
    while($row = $result->fetch_assoc()){
        $albums[] = $row;
    }
    echo json_encode([
        "success" => true,
        "albums" => $albums
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Query error"]);
}

$conn->close();
?>