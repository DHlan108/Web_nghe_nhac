<?php
session_start();
require_once 'db_connect.php';

$user_id = $_SESSION['user_id'];

$username = $_POST['username'];
$email = $_POST['email'];

$avatar_name = null;

//upload
if(isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0){
    $file = $_FILES['avatar'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);

    $avatar_name = "avatar_" . time() . "." . $ext;

    move_uploaded_file($file['tmp_name'], "../img/" . $avatar_name);
}

//update
if($avatar_name){
    $sql = "UPDATE users SET username=?, email=?, ava_user=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $username, $email, $avatar_name, $user_id);
} else {
    $sql = "UPDATE users SET username=?, email=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $username, $email, $user_id);
}


if($stmt->execute()) {
    echo json_encode(["success" => true, "avatar" => $avatar_name]);
} else{
    echo json_encode(["success"=>false]);
}

$stmt->close();
$conn->close();
?>