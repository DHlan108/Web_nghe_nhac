<?php
include "db_connect.php";

$playlist_id = $_POST['playlist_id'];
$song_id = $_POST['song_id'];

// tránh thêm trùng
$check = mysqli_query($conn, "SELECT * FROM playlist_songs 
WHERE playlist_id=$playlist_id AND song_id=$song_id");

if (mysqli_num_rows($check) == 0) {
    mysqli_query($conn, "INSERT INTO playlist_songs (playlist_id, song_id)
    VALUES ($playlist_id, $song_id)");
}

echo json_encode(["status" => "success"]);
?>