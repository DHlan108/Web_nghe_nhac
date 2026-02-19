<?php
// 1. Khai báo cho trình duyệt biết dữ liệu trả về là JSON
header('Content-Type: application/json; charset=utf-8');

// 2. Gọi file kết nối database (Giống lệnh import trong Java)
require_once 'db_connect.php'; 

// 3. Viết câu lệnh SQL lấy toàn bộ bài hát

$sql = "SELECT * FROM songs"; 
$result = $conn->query($sql);

// 4. Tạo một mảng rỗng (Giống như tạo ArrayList<Song> trong Java)
$danh_sach_nhac = array();

if ($result->num_rows > 0) {
    // Vòng lặp lấy từng dòng dữ liệu (Giống ResultSet trong JDBC)
    while($row = $result->fetch_assoc()) {
        $danh_sach_nhac[] = $row; // Thêm từng bài hát vào mảng
    }
}

// 5. Biến mảng thành chuỗi JSON và xuất ra màn hình
echo json_encode($danh_sach_nhac);

// Đóng kết nối
$conn->close();
?>