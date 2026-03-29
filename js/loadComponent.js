// Biến lưu trữ ID thông báo cuối cùng
let lastNotificationId = 0;

// --- 1. LOAD NAVBAR ---
fetch("../component/navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;

    // Sau khi Navbar đã lên hình, bắt đầu xử lý Thông báo & Logout
    initNotificationLogic();
    initLogoutLogic();
  })
  .catch(err => console.error("Lỗi tải Navbar:", err));

// --- 2. LOGIC THÔNG BÁO ---
function initNotificationLogic() {
    // Lấy Role từ server
    fetch('get_notification.php?action=get_role')
        .then(res => res.json())
        .then(data => {
            const userRole = data.role;
            const bell = document.getElementById('bell-icon');
            const popup = document.getElementById('notification-popup');

            if (userRole === 'admin' && bell && popup) {
                // Hiện chuông và gán sự kiện click
                bell.style.display = 'block';
                bell.onclick = (e) => {
                    e.stopPropagation(); // Ngăn sự kiện nổi bọt
                    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
                };

                // Xử lý gửi Form (Admin)
                const form = document.getElementById('form');
                if (form) {
                    form.onsubmit = function(e) {
                        e.preventDefault();
                        const formData = new FormData(this);
                        fetch('get_notification.php', {
                            method: 'POST',
                            body: formData
                        })
                        .then(res => res.json())
                        .then(data => {
                            alert(data.message);
                            form.reset();
                            popup.style.display = 'none';
                        });
                    };
                }
            } else if (bell) {
                // Nếu không phải admin, ẩn chuông (hoặc để chuông chỉ để nhận thông báo)
                bell.style.display = 'none';
            }
        });

    // Bắt đầu vòng lặp kiểm tra thông báo mới mỗi 5 giây
    setInterval(checkNotification, 5000);
}

function checkNotification() {
    fetch(`get_notification.php?last_id=${lastNotificationId}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.id) {
                lastNotificationId = data.id;
                showNotification(data.title, data.content);
            }
        });
}

function showNotification(title, content) {
    const notifyDiv = document.createElement('div');
    notifyDiv.className = 'admin-alert';
    notifyDiv.style = "position: fixed; bottom: 20px; right: 20px; background: #333; color: #fff; padding: 15px; border-radius: 8px; z-index: 9999;";
    notifyDiv.innerHTML = `<strong>${title}</strong>: ${content}`;
    document.body.appendChild(notifyDiv);
    setTimeout(() => notifyDiv.remove(), 5000);
}

// --- 3. LOGIC LOGOUT ---
function initLogoutLogic() {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.onclick = function () {
            if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
                fetch("../api/logout.php", { method: "POST" })
                .then((response) => {
                    if (response.ok) {
                        localStorage.removeItem("user");
                        window.location.href = "../pages/login.html";
                    }
                });
            }
        };
    }
}

// --- 4. LOAD SIDEBAR & PLAYER ---
fetch("../component/sidebar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("sidebar-container").innerHTML = data;
    // Xử lý active link...
  });

fetch("../component/player.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("player-container").innerHTML = data;
    if (!document.querySelector('script[src="../js/player.js"]')) {
      const script = document.createElement("script");
      script.src = "../js/player.js";
      document.body.appendChild(script);
    }
  });