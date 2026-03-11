<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

//lấy dữ liệu từ form
$user = $_POST['username'] ?? '';
$pass = $_POST['password'] ?? '';
$role = $_POST['role'] ?? '';

// kiểm tra input
if (empty($user) || empty($pass) || empty($role)) {
    echo json_encode([
        'success' => false,
        'message' => 'Vui lòng nhập đầy đủ thông tin!'
    ]);
    exit;
}

// tìm tài khoản dựa trên username
$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user); 
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // kiểm tra mật khẩu
    // password_verify: Kiểm tra nếu pass là Bcrypt chuẩn
    // $pass === $row['password']: Cho phép test bằng chữ thường (VD: 123456)
    if (password_verify($pass, $row['password']) || $pass === $row['password']) {
        
        //kiểm tra role
        if ($row['role'] !== $role) {
        echo json_encode([
            'success' => false,
            'message' => 'Sai vai trò đăng nhập!'
        ]);
        exit;
    }
        // lưu session
        $_SESSION['user_id']  = $row['id'];
        $_SESSION['username'] = $row['username'];
        $_SESSION['role']     = $row['role'];

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