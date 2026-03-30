// Biến lưu trữ ID thông báo cuối cùng
let lastNotificationId = 0;
let isFirstLoad = true;
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
    fetch('../api/get_notification.php?action=get_all')
    .then(res => res.json())
    .then(data => {
        if (data && data.length > 0) {
            // Gán ID lớn nhất vào biến để làm mốc "đã xem"
            lastNotificationId = data[0].id; 
        }
        isFirstLoad = false; // Đã load xong lần đầu
    });
    fetch('../api/get_notification.php?action=get_role')
    .then(res => res.json())
    .then(data => {
        const userRole = data.role;
        const bell = document.getElementById('bell-icon');
        const adminPopup = document.getElementById('notification-popup');
        const userList = document.getElementById('user-notification-list');
        
        if (bell) {
            bell.onclick = (e) => {
                e.stopPropagation();
                if (userRole === 'admin') {
                    // Admin: Đóng/Mở form soạn tin
                    adminPopup.style.display = adminPopup.style.display === 'block' ? 'none' : 'block';
                    const form = document.getElementById('form');
                    if (form) {
                        form.onsubmit = function(e) {
                            e.preventDefault();
                            const formData = new FormData(this);
                            fetch('../api/get_notification.php', {
                                method: 'POST',
                                body: formData
                            })
                            .then(res => res.json())
                            .then(data => {
                                alert(data.message);
                                if (data.status === 'success') {
                                    form.reset();
                                    adminPopup.style.display = 'none';
                                }
                            })
                            .catch(err => console.error("Lỗi gửi tin:", err));
                        };
                    }
                } else {
                    // User: Đóng/Mở danh sách tin cũ
                    const isVisible = userList.style.display === 'block';
                    userList.style.display = isVisible ? 'none' : 'block';
                    if (!isVisible) loadOldNotifications(); // Chỉ load khi mở ra
                }
                notificationCount = 0; // Reset số đếm
                updateBadge(0);
            };
        }
    });

    // Vòng lặp kiểm tra thông báo mới (5 giây/lần) cho mọi đối tượng
    setInterval(checkNotification, 5000);
}

function loadOldNotifications() {
    fetch('../api/get_notification.php?action=get_all')
    .then(res => res.json())
    .then(data => {
        if (data.length > 0 && lastNotificationId === 0) {
            lastNotificationId = data[0].id; 
        }
        const container = document.getElementById('list-items');
        container.innerHTML = ''; // Xóa cũ load mới
        
        if (data.length === 0) {
            container.innerHTML = '<p style="padding:10px;">Không có thông báo nào.</p>';
            return;
        }

        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'noti-item';
            div.innerHTML = `<strong>${item.title}</strong><br><small>${item.created_at}</small><p>${item.content}</p>`;
            container.appendChild(div);
        });
    });
}

function checkNotification() {
    if (isFirstLoad) return;
    fetch(`../api/get_notification.php?last_id=${lastNotificationId}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.id) {
                lastNotificationId = data.id;
                showNotification(data.title, data.content);
                updateBadge(1);
            }
        });
}

function showNotification(title, content) {
    new Audio('https://www.soundjay.com/buttons/beep-07a.mp3').play();
    const notifyDiv = document.createElement('div');
    notifyDiv.className = 'admin-alert';
    notifyDiv.style = "position: fixed; bottom: 80px; right: 20px; background: #333; color: #fff; padding: 15px; border-radius: 8px; z-index: 10002;";
    notifyDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">🔔 ${title}</div>
        <div style="font-size: 14px;">${content}</div>`;
    document.body.appendChild(notifyDiv);
    setTimeout(() => {
        notifyDiv.style.opacity = '0';
        notifyDiv.style.transition = '0.5s';
        setTimeout(() => notifyDiv.remove(), 5000);
    }, 5000);
}

function updateBadge(count) {
    const badge = document.getElementById('notification-badge');
    if (badge) {
        notificationCount += count;
        if (notificationCount > 0) {
            // Nếu lớn hơn 9 thì hiện 9+, ngược lại hiện số thật
            badge.innerText = notificationCount > 9 ? '9+' : notificationCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
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
    const currentPage = window.location.pathname.split("/").pop() || "home.html";
    const links = document.querySelectorAll("#sidebar a");
    links.forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });
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