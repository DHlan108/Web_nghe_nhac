<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

$sql = "SELECT * FROM albums ORDER BY release_year DESC";
$result = $conn->query($sql);

$albums = [];
while($row = $result->fetch_assoc()){
    $albums[] = $row;
}
echo json_encode([
    "success" => true,
    "albums" => $albums
]);

$conn->close();
?>