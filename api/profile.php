<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once 'db_connect.php';

// kiểm tra đã đăng nhập chưa
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode([
        'success' => false,
        'message' => 'Bạn chưa đăng nhập'
    ]);
    exit;
}

$sql = "SELECT id, username, email, role, ava_user FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {

    $user = $result->fetch_assoc();

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'ava_user' => $user['ava_user']
        ]
    ]);


} else {

    echo json_encode([
        'success' => false,
        'message' => 'Không tìm thấy người dùng'
    ]);
}

$stmt->close();
$conn->close();
?>