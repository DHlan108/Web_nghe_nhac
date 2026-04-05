let lastNotificationId = 0;
let isFirstLoad = true;
let notificationCount = 0;

// =========================================================
// MẢNH GHÉP 1: BỘ ĐỊNH TUYẾN & LAZY LOAD JS/CSS
// =========================================================
// Khai báo bản đồ (Map) kết nối Trang -> Hàm khởi tạo -> File JS tương ứng
const pageConfig = {
    'home.html': { initFn: 'initHomePage', jsFile: '../js/main.js' },
    'song.html': { initFn: 'initSongPage', jsFile: '../js/song.js' },
    'album.html': { initFn: 'initAlbumPage', jsFile: '../js/loadAlbum.js' },
    'artist.html': { initFn: 'initArtistPage', jsFile: '../js/loadArtist.js' },
    'playlist.html': { initFn: 'initPlaylistPage', jsFile: '../js/playlist.js' },
    'profile.html': { initFn: 'initProfilePage', jsFile: '../js/loadProfile.js' }
};

function triggerPageLogic(url) {
    const pageName = url.split("/").pop().split("?")[0] || "home.html";
    const config = pageConfig[pageName];

    if (config) {
        // Nếu hàm đã được nạp vào hệ thống rồi -> Gọi luôn
        if (typeof window[config.initFn] === 'function') {
            window[config.initFn]();
        } else {
            // Nếu chưa có -> Tự động tạo thẻ <script> để nạp file JS tương ứng
            const script = document.createElement('script');
            script.src = config.jsFile;
            script.onload = () => {
                // Đợi JS load xong thì gọi hàm
                if (typeof window[config.initFn] === 'function') {
                    window[config.initFn]();
                }
            };
            document.body.appendChild(script);
        }
    }
}

// =========================================================
// MẢNH GHÉP 2: HÀM CHUYỂN TRANG KHÔNG RELOAD (CÓ NẠP CSS)
// =========================================================
function loadMainContentSPA(url) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 1. Cập nhật HTML phần ruột
            const newContent = doc.getElementById('main-content');
            const targetContainer = document.getElementById('main-content');
            
            if (newContent && targetContainer) {
                targetContainer.innerHTML = newContent.innerHTML;
            }

            // 2. TỰ ĐỘNG NẠP CSS CỦA TRANG MỚI (Khắc phục lỗi vỡ layout)
            const newStyles = doc.querySelectorAll('link[rel="stylesheet"]');
            newStyles.forEach(style => {
                const href = style.getAttribute('href');
                // Nếu CSS này chưa có trong trang hiện tại thì thêm vào
                if (href && !document.querySelector(`link[href="${href}"]`)) {
                    const newStyle = document.createElement('link');
                    newStyle.rel = 'stylesheet';
                    newStyle.href = href;
                    document.head.appendChild(newStyle);
                }
            });

            // 3. Gọi hàm kích hoạt JS
            triggerPageLogic(url); 
        })
        .catch(err => console.error("Lỗi khi chuyển trang SPA:", err));
}

// =========================================================
// MẢNH GHÉP 3: XỬ LÝ F5 VÀ NÚT BACK CỦA TRÌNH DUYỆT
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    // Khi F5, chạy script của trang hiện tại
    triggerPageLogic(window.location.pathname);
});

window.addEventListener("popstate", () => {
    // Khi bấm nút Back/Forward, tự động chuyển trang
    loadMainContentSPA(window.location.pathname);
});

// =========================================================
// CÁC LOGIC CŨ GIỮ NGUYÊN (Navbar, Sidebar, Player, Thông báo)
// =========================================================

// --- LOAD NAVBAR ---
fetch("../component/navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;
    initNotificationLogic();
    initLogoutLogic();
  });

// --- LOAD SIDEBAR (Gắn sự kiện click chuyển trang SPA) ---
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

      // SỰ KIỆN CLICK MENU
      link.addEventListener("click", function (e) {
        e.preventDefault(); 
        const targetUrl = this.getAttribute("href");
        
        document.querySelectorAll("#sidebar a").forEach(a => a.classList.remove("active"));
        this.classList.add("active");

        window.history.pushState({ path: targetUrl }, '', targetUrl);
        loadMainContentSPA(targetUrl);
      });
    });
  });

// --- LOAD PLAYER ---
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

// --- LOGIC THÔNG BÁO ---
function initNotificationLogic() {
    fetch('../api/get_notification.php?action=get_all')
    .then(res => res.json())
    .then(data => {
        if (data && data.length > 0) lastNotificationId = data[0].id; 
        isFirstLoad = false;
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
                    adminPopup.style.display = adminPopup.style.display === 'block' ? 'none' : 'block';
                    const form = document.getElementById('form');
                    if (form) {
                        form.onsubmit = function(e) {
                            e.preventDefault();
                            const formData = new FormData(this);
                            fetch('../api/get_notification.php', { method: 'POST', body: formData })
                            .then(res => res.json())
                            .then(data => {
                                alert(data.message);
                                if (data.status === 'success') {
                                    form.reset();
                                    adminPopup.style.display = 'none';
                                }
                            });
                        };
                    }
                } else {
                    const isVisible = userList.style.display === 'block';
                    userList.style.display = isVisible ? 'none' : 'block';
                    if (!isVisible) loadOldNotifications(); 
                }
                notificationCount = 0; 
                updateBadge(0);
            };
        }
    });
    setInterval(checkNotification, 5000);
}

function loadOldNotifications() {
    fetch('../api/get_notification.php?action=get_all')
    .then(res => res.json())
    .then(data => {
        if (data.length > 0 && lastNotificationId === 0) lastNotificationId = data[0].id; 
        const container = document.getElementById('list-items');
        if(!container) return;
        container.innerHTML = ''; 
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
    const notifyDiv = document.createElement('div');
    notifyDiv.style = "position: fixed; bottom: 80px; right: 20px; background: #333; color: #fff; padding: 15px; border-radius: 8px; z-index: 10002;";
    notifyDiv.innerHTML = `<div style="font-weight: bold; margin-bottom: 5px;">🔔 ${title}</div><div style="font-size: 14px;">${content}</div>`;
    document.body.appendChild(notifyDiv);
    setTimeout(() => { notifyDiv.remove(); }, 5000);
}

function updateBadge(count) {
    const badge = document.getElementById('notification-badge');
    if (badge) {
        notificationCount += count;
        if (notificationCount > 0) {
            badge.innerText = notificationCount > 9 ? '9+' : notificationCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// --- LOGOUT ---
function initLogoutLogic() {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.onclick = function () {
            if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
                fetch("../api/logout.php", { method: "POST" })
                .then((response) => {
                    if (response.ok) {
                        localStorage.clear();
                        window.location.href = "../pages/login.html";
                    }
                });
            }
        };
    }
}