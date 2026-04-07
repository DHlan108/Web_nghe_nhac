<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

// =======================
// CHECK LOGIN
// =======================
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'] ?? 'guest';

// =======================
// 1. TRẢ ROLE USER
// =======================
if (isset($_GET['action']) && $_GET['action'] === 'get_role') {
    echo json_encode([
        "role" => $role
    ]);
    exit;
}

// =======================
// 2. ADMIN GỬI THÔNG BÁO
// =======================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if ($role !== 'admin') {
        echo json_encode([
            "status" => "error",
            "message" => "Không có quyền"
        ]);
        exit;
    }

    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';

    if ($title && $content) {

        // Tạo thông báo
        $stmt = $conn->prepare("INSERT INTO notifications (title, content, is_active) VALUES (?, ?, 1)");
        $stmt->bind_param("ss", $title, $content);
        $stmt->execute();

        $notification_id = $stmt->insert_id;

        // Gửi cho tất cả USER 
        $users = $conn->query("SELECT id FROM users WHERE role = 'user'");

        while ($u = $users->fetch_assoc()) {
            $stmt2 = $conn->prepare("INSERT INTO notification_users (notification_id, user_id, is_read) VALUES (?, ?, 0)");
            $stmt2->bind_param("ii", $notification_id, $u['id']);
            $stmt2->execute();
        }

        echo json_encode([
            "status" => "success",
            "message" => "Đã gửi thông báo"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Thiếu dữ liệu"
        ]);
    }

    exit;
}

// =======================
// 3. LẤY DANH SÁCH THÔNG BÁO (USER)
// =======================
if (isset($_GET['action']) && $_GET['action'] === 'get_all') {

    $sql = "
    SELECT n.*, nu.is_read 
    FROM notifications n
    JOIN notification_users nu ON n.id = nu.notification_id
    WHERE nu.user_id = ?
    ORDER BY n.id DESC
    LIMIT 5
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $list = [];
    while ($row = $result->fetch_assoc()) {
        $list[] = $row;
    }

    echo json_encode($list);
    exit;
}

// =======================
// 4. ĐÁNH DẤU ĐÃ ĐỌC
// =======================
if (isset($_GET['action']) && $_GET['action'] === 'mark_read') {

    $stmt = $conn->prepare("UPDATE notification_users SET is_read = 1 WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    echo json_encode(["status" => "success"]);
    exit;
}

// =======================
// 5. ĐẾM CHƯA ĐỌC (BADGE)
// =======================
if (isset($_GET['action']) && $_GET['action'] === 'count_unread') {

    $stmt = $conn->prepare("
        SELECT COUNT(*) as unread 
        FROM notification_users 
        WHERE user_id = ? AND is_read = 0
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    echo json_encode($result);
    exit;
}

// =======================
// 6. LẤY THÔNG BÁO MỚI NHẤT 
// =======================
$last_id = isset($_GET['last_id']) ? (int)$_GET['last_id'] : 0;

$sql = "
SELECT n.*, nu.is_read
FROM notifications n
JOIN notification_users nu ON n.id = nu.notification_id
WHERE nu.user_id = ? AND n.id > ?
ORDER BY n.id DESC
LIMIT 1
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $user_id, $last_id);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode($result->fetch_assoc());