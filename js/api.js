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

window.onload = async function() {
    await loadComponent('navbar-container', 'component/navbar.html');
    await loadComponent('sidebar-container', 'component/sidebar.html');
    await loadComponent('player-container', 'component/player.html');

};