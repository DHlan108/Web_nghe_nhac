<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

$user = $_POST['username'] ?? '';
$pass = $_POST['password'] ?? '';
$role = $_POST['role'] ?? '';

// 1. Chỉ tìm tài khoản dựa trên username
$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user); 
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // 2. KIỂM TRA MẬT KHẨU
    // password_verify: Kiểm tra nếu pass là Bcrypt chuẩn
    // $pass === $row['password']: Cho phép test bằng chữ thường (VD: 123456)
    if (password_verify($pass, $row['password']) || $pass === $row['password']) {
        
        if ($row['role'] !== $role) {
        echo json_encode([
            'success' => false,
            'message' => 'Sai vai trò đăng nhập!'
        ]);
        exit;
    }
        echo json_encode([
            'success' => true, 
            'message' => 'Đăng nhập thành công',
            'role' => $row['role'] 
        ]);
        
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'Sai mật khẩu!'
        ]);
    }
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Không tìm thấy tài khoản!'
    ]);
}

$stmt->close();
$conn->close();
?>