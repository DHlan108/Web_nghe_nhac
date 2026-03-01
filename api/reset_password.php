<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

$email = $_POST['email'] ?? '';
$new_pass = $_POST['new_password'] ?? '';

if (empty($email) || empty($new_pass)) {
    echo json_encode(['success' => false, 'message' => 'Vui lòng nhập đủ thông tin!']);
    exit;
}

// 1. Kiểm tra xem Email có tồn tại trong hệ thống không
$check_sql = "SELECT id FROM users WHERE email = ?";
$stmt_check = $conn->prepare($check_sql);
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Email này chưa được đăng ký!']);
    $stmt_check->close();
    $conn->close();
    exit;
}
$stmt_check->close();

// 2. Băm mật khẩu mới (Giống hệt lúc đăng ký)
$hashed_password = password_hash($new_pass, PASSWORD_BCRYPT);

// 3. Cập nhật mật khẩu mới vào cơ sở dữ liệu
$update_sql = "UPDATE users SET password = ? WHERE email = ?";
$stmt = $conn->prepare($update_sql);
$stmt->bind_param("ss", $hashed_password, $email);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cập nhật mật khẩu thành công!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi hệ thống, vui lòng thử lại!']);
}

$stmt->close();
$conn->close();
?>