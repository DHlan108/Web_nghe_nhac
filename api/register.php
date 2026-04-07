<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

$user = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$pass = $_POST['password'] ?? '';

if (empty($user) || empty($email) || empty($pass)) {
    echo json_encode(['success' => false, 'message' => 'Vui lòng nhập đủ thông tin!']);
    exit;
}

// 1. Kiểm tra xem username hoặc email đã bị người khác đăng ký chưa
$check_sql = "SELECT id FROM users WHERE username = ? OR email = ?";
$stmt_check = $conn->prepare($check_sql);
$stmt_check->bind_param("ss", $user, $email);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Tên đăng nhập hoặc Email đã tồn tại!']);
    $stmt_check->close();
    $conn->close();
    exit;
}
$stmt_check->close();

// 2. Băm mật khẩu 
$hashed_password = password_hash($pass, PASSWORD_BCRYPT);
$role = 'user'; // Mặc định người mới đăng ký sẽ có quyền user

// 3. Lưu vào Database
$sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $user, $email, $hashed_password, $role);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Đăng ký thành công!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi hệ thống, vui lòng thử lại!']);
}

$stmt->close();
$conn->close();
?>