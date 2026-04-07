// Hàm dùng để tải một file HTML và nhét vào một thẻ div
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Không tìm thấy ${filePath}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error("Lỗi khi tải component:", error);
    }
}

// Lệnh này sẽ chạy ngay khi bạn mở trang web lên
window.onload = async function() {
    // Gọi hàm loadComponent để lắp ráp giao diện
    await loadComponent('navbar-container', 'component/navbar.html');
    await loadComponent('sidebar-container', 'component/sidebar.html');
    await loadComponent('player-container', 'component/player.html');
    
    // Sau khi lắp khung xong, bạn có thể gọi API lấy nhạc đổ vào dynamic-content
    // taiDanhSachNhac(); (Mình sẽ ghép hàm này vào sau)
};