<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

// =======================
// 1. TRẢ ROLE USER
// =======================
if (isset($_GET['action']) && $_GET['action'] === 'get_role') {
    echo json_encode([
        "role" => $_SESSION['role'] ?? 'guest'
    ]);
    exit;
}

// =======================
// 2. ADMIN GỬI THÔNG BÁO
// =======================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        echo json_encode([
            "status" => "error",
            "message" => "Không có quyền"
        ]);
        exit;
    }

    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';

    if ($title && $content) {
        $stmt = $conn->prepare("INSERT INTO notifications (title, content, is_active) VALUES (?, ?, 1)");
        $stmt->bind_param("ss", $title, $content);
        $stmt->execute();

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
// 3. USER LẤY THÔNG BÁO
// =======================
$last_id = isset($_GET['last_id']) ? (int)$_GET['last_id'] : 0;

$sql = "SELECT * FROM notifications 
        WHERE is_active = 1 AND id > ? 
        ORDER BY id DESC LIMIT 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $last_id);
$stmt->execute();

$result = $stmt->get_result();
$data = $result->fetch_assoc();

echo json_encode($data);