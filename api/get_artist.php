<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

$sql = "SELECT * FROM artists";
$result = $conn->query($sql);
$artists = [];
while($row = $result->fetch_assoc()){
    $artists[] = $row;
}
echo json_encode([
    "success" => true,
    "artists" => $artists
]);

$conn->close();

?>