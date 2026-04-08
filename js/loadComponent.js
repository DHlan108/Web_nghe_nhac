// =======================
// GLOBAL
// =======================
let lastNotificationId = 0;
let isFirstLoad = true;

// =======================
// SPA CONFIG
// =======================
const pageConfig = {
  "home.html": { initFn: "initHomePage", jsFile: "../js/home.js" },
  "song.html": { initFn: "initSongPage", jsFile: "../js/song.js" },
  "album.html": { initFn: "initAlbumPage", jsFile: "../js/loadAlbum.js" },
  "artist.html": { initFn: "initArtistPage", jsFile: "../js/loadArtist.js" },
  "playlist.html": { initFn: "initPlaylistPage", jsFile: "../js/playlist.js" },
  "profile.html": { initFn: "initProfilePage", jsFile: "../js/loadProfile.js" },
};

// =======================
// LOAD JS THEO TRANG
// =======================
function triggerPageLogic(url) {
  const pageName = url.split("/").pop().split("?")[0] || "home.html";
  const config = pageConfig[pageName];

  if (!config) return;

  if (typeof window[config.initFn] === "function") {
    window[config.initFn]();
  } else {
    const script = document.createElement("script");
    script.src = config.jsFile;
    script.onload = () => {
      if (typeof window[config.initFn] === "function") {
        window[config.initFn]();
      }
    };
    document.body.appendChild(script);
  }
}
// =========================================================
// HÀM LOAD NỘI DUNG SPA (KHÔNG RELOAD TRANG)
// =========================================================
function loadMainContentSPA(url) {
  fetch(url)
    .then((res) => res.text())
    .then(async (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const newContent = doc.getElementById("main-content");
      const target = document.getElementById("main-content");

      if (newContent && target) {
        target.innerHTML = newContent.innerHTML;
        window.scrollTo({ top: 0, behavior: "instant" }); 
      }
      const styles = doc.querySelectorAll('link[rel="stylesheet"]');
      const stylePromises = [];

      styles.forEach((style) => {
        const href = style.getAttribute("href");

        if (href && !document.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          const p = new Promise((resolve) => {
            link.onload = () => {
              console.log(`✅ Loaded CSS: ${href}`);
              resolve();
            };
            link.onerror = () => {
              console.error(`❌ Failed to load CSS: ${href}`);
              resolve(); 
            };
          });
          stylePromises.push(p);
          document.head.appendChild(link);
        }
      });

      // ĐỢI TẤT CẢ FILE CSS MỚI TẢI XONG HOÀN TOÀN
      if (stylePromises.length > 0) {
        await Promise.all(stylePromises);
      }

      requestAnimationFrame(() => {
        console.log("🚀 CSS ready, triggering Page Logic...");
        triggerPageLogic(url);
      });
    })
    .catch((err) => console.error("SPA ERROR:", err));
}

// =========================================================
// SỰ KIỆN BACK/FORWARD (POPSTATE)
// =========================================================
window.addEventListener("popstate", () => {
  loadMainContentSPA(window.location.pathname);
});

// =========================================================
// KHỞI TẠO LẦN ĐẦU
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  triggerPageLogic(window.location.pathname);
});

// =======================
// LOAD NAVBAR & TÍCH HỢP SEARCH
// =======================
let cachedSearchData = null; 
let cachedSongs = null;
fetch("../component/navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;

    initNotificationLogic();
    initLogoutLogic();

    // KÍCH HOẠT THANH TÌM KIẾM
function initSearchWhenReady() {
  if (typeof MusicSearchEngine !== "undefined") {
    MusicSearchEngine.initGlobalSearch(async (keyword) => {
      const searchBox = document.querySelector(".search-box");
      let searchDropdown = document.getElementById("search-dropdown");

      if (!searchDropdown) {
        searchDropdown = document.createElement("div");
        searchDropdown.id = "search-dropdown";
        searchBox.appendChild(searchDropdown);

        document.addEventListener("click", (e) => {
          if (!searchBox.contains(e.target)) {
            searchDropdown.style.display = "none";
          }
        });

        const searchInput = searchBox.querySelector("input");
        if (searchInput) {
          searchInput.addEventListener("click", () => {
            if (searchInput.value.trim() !== "") {
              searchDropdown.style.display = "flex";
            }
          });
        }
      }

      if (!keyword.trim()) {
        searchDropdown.style.display = "none";
        return;
      }

      searchDropdown.style.display = "flex";
      searchDropdown.innerHTML = `<div style="color: #aaa; padding: 15px; text-align: center;">Đang tìm kiếm...</div>`;

      if (!cachedSearchData) {
        try {
          // Lấy dữ liệu bài hát
          const resSong = await fetch("../api/get_song.php");
          const songs = await resSong.json();
          const mappedSongs = songs.map(s => ({ ...s, type: 'song' }));

          // Lấy dữ liệu album 
          const resAlbum = await fetch("../api/get_album.php"); 
          const albumData = await resAlbum.json();
          // Gắn thêm nhãn type = 'album'
          const mappedAlbums = (albumData.albums || []).map(a => ({ ...a, type: 'album' }));

          // Gộp chung cả 2 mảng lại
          cachedSearchData = [...mappedSongs, ...mappedAlbums];
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu tìm kiếm:", error);
          searchDropdown.innerHTML = `<div style="color: #ff4d4d; padding: 15px; text-align: center;">Lỗi tải dữ liệu!</div>`;
          return;
        }
      }

      // XỬ LÝ TÌM KIẾM DỰA TRÊN TỪ KHÓA
      const results = MusicSearchEngine.process(cachedSearchData, {
        keyword: keyword,
        sortBy: "hot",
        limit: 8,
      });

      if (results.length === 0) {
        searchDropdown.innerHTML = `<div style="color: #aaa; padding: 15px; text-align: center;">Không tìm thấy bài hát hoặc album: "${keyword}"</div>`;
        return;
      }

      // HIỂN THỊ KẾT QUẢ THEO TYPE (SONG VÀ ALBUM)
      let htmlContent = "";
      results.forEach((item) => {
        let imgPath = "../img/default-song.jpg"; 
        let path = item.image_path || item.cover_image; 
        
        if (path) {
          imgPath = path.includes("/") ? path : "../img/" + path;
        }

        if (item.type === 'song') {
          htmlContent += `
            <div class="dropdown-item" onclick="triggerSearchPlay('${item.id}')">
              <img src="${imgPath}" alt="${item.title}">
              <div class="dropdown-info">
                <h4>${item.title}</h4>
                <p>Bài hát • ${item.artist_name} • ${item.listens || 0} lượt nghe</p>
              </div>
            </div>
          `;
        } else if (item.type === 'album') {
          // Thêm sự kiện click riêng cho Album
          htmlContent += `
            <div class="dropdown-item" onclick="triggerSearchAlbum(${item.id}, '${item.title.replace(/'/g, "\\'")}', '${item.artist_name.replace(/'/g, "\\'")}', '${item.release_year}', '${item.cover_image}')">
              <img src="${imgPath}" alt="${item.title}">
              <div class="dropdown-info">
                <h4>${item.title}</h4>
                <p>Album • ${item.artist_name} • ${item.release_year}</p>
              </div>
            </div>
          `;
        }
      });

      searchDropdown.innerHTML = htmlContent;
    });
  } else {
    setTimeout(initSearchWhenReady, 50);
  }
}
initSearchWhenReady();
    // =========================================================
    // HÀM XỬ LÝ KHI CLICK VÀO BÀI HÁT TRÊN THANH TÌM KIẾM
    // =========================================================
    window.triggerSearchPlay = function (songId) {
      // Kiểm tra xem dữ liệu tìm kiếm đã được tải chưa
      if (!cachedSearchData) return;

      // Lọc ra danh sách chỉ chứa BÀI HÁT 
      const onlySongs = cachedSearchData.filter(item => item.type === 'song');

      // Tìm vị trí của bài hát được click trong mảng onlySongs
      const songIndex = onlySongs.findIndex((s) => s.id == songId);
      
      if (songIndex === -1) {
          console.error("Không tìm thấy bài hát trong danh sách!");
          return;
      }

      const song = onlySongs[songIndex];

      // Ẩn khung dropdown tìm kiếm đi
      const searchDropdown = document.getElementById("search-dropdown");
      if (searchDropdown) {
        searchDropdown.style.display = "none";
      }
      
      // Xóa chữ trong thanh search đi cho gọn gàng 
      const searchInput = document.querySelector(".search-box input");
      if (searchInput) searchInput.value = "";

      // Đẩy vào Player
      if (typeof window.playPlaylistQueue === "function") {
        window.playPlaylistQueue(onlySongs, songIndex);
        console.log("Đã phát bài và cập nhật Queue:", song.title);
      } else {
        console.error("Không tìm thấy hàm playPlaylistQueue trong player.js");
      }
    };
    window.triggerSearchAlbum = function (albumId, title, artist, year, cover) {
      // Ẩn dropdown và xóa chữ tìm kiếm
      const searchDropdown = document.getElementById("search-dropdown");
      if (searchDropdown) searchDropdown.style.display = "none";
      const searchInput = document.querySelector(".search-box input");
      if (searchInput) searchInput.value = "";

      // Kiểm tra xem người dùng có đang ở trang Album không
      if (window.location.pathname.includes("album.html") && typeof window.openAlbumModal === "function") {
        // Nếu đang ở trang Album -> Mở luôn Modal chi tiết
        window.openAlbumModal(albumId, title, artist, year, cover);
      } else {
        // Nếu đang ở trang khác (Home, Bài hát...) -> Chuyển hướng sang trang Album
        const url = "album.html";
        document.querySelectorAll("#sidebar a").forEach((a) => a.classList.remove("active"));
        const albumLink = document.querySelector(`#sidebar a[href="${url}"]`);
        if(albumLink) albumLink.classList.add("active");

        window.history.pushState({}, "", url);
        loadMainContentSPA(url);
      }
    };
  });
// =======================
// LOAD SIDEBAR
// =======================
fetch("../component/sidebar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("sidebar-container").innerHTML = data;

    const currentPage =
      window.location.pathname.split("/").pop() || "home.html";
    const links = document.querySelectorAll("#sidebar a");

    links.forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }

      link.addEventListener("click", function (e) {
        e.preventDefault();

        const url = this.getAttribute("href");

        document
          .querySelectorAll("#sidebar a")
          .forEach((a) => a.classList.remove("active"));
        this.classList.add("active");

        window.history.pushState({}, "", url);
        loadMainContentSPA(url);
      });
    });
  });

// =======================
// LOAD PLAYER
// =======================
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

// =======================
// NOTIFICATION LOGIC
// =======================
function initNotificationLogic() {
  // CLICK OUTSIDE → ĐÓNG
  document.addEventListener("click", function (e) {
    const bell = document.getElementById("bell-icon");
    const userList = document.getElementById("user-notification-list");
    const adminPopup = document.getElementById("notification-popup");

    if (!bell) return;

    if (
      !bell.contains(e.target) &&
      (!userList || !userList.contains(e.target)) &&
      (!adminPopup || !adminPopup.contains(e.target))
    ) {
      if (userList) userList.style.display = "none";
      if (adminPopup) adminPopup.style.display = "none";
    }
  });

  // LẤY ID MỚI NHẤT
  fetch("../api/get_notification.php?action=get_all")
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) lastNotificationId = data[0].id;
      isFirstLoad = false;
    });

  // LOAD BADGE
  loadUnreadCount();

  // CHECK ROLE
  fetch("../api/get_notification.php?action=get_role")
    .then((res) => res.json())
    .then((data) => {
      const role = data.role;

      const bell = document.getElementById("bell-icon");
      const popup = document.getElementById("notification-popup");
      const list = document.getElementById("user-notification-list");

      if (!bell) return;

      bell.onclick = (e) => {
        e.stopPropagation();

        if (role === "admin") {
          popup.style.display =
            popup.style.display === "block" ? "none" : "block";

          const form = document.getElementById("form");
          if (form) {
            form.onsubmit = function (e) {
              e.preventDefault();

              const formData = new FormData(this);

              fetch("../api/get_notification.php", {
                method: "POST",
                body: formData,
              })
                .then((res) => res.json())
                .then((data) => {
                  alert(data.message);
                  if (data.status === "success") {
                    form.reset();
                    popup.style.display = "none";
                  }
                });
            };
          }
        } else {
          const isVisible = list.style.display === "block";
          list.style.display = isVisible ? "none" : "block";

          if (!isVisible) {
            loadOldNotifications();

            fetch("../api/get_notification.php?action=mark_read").then(() =>
              loadUnreadCount(),
            );
          }
        }
      };

      if (role !== "admin") {
        setInterval(checkNotification, 5000);
      }
    });
}

// =======================
// LOAD LIST
// =======================
function loadOldNotifications() {
  fetch("../api/get_notification.php?action=get_all")
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("list-items");
      if (!container) return;

      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = '<p style="padding:10px;">Không có thông báo</p>';
        return;
      }

      data.forEach((item) => {
        const div = document.createElement("div");
        div.className = "noti-item";

        if (item.is_read == 0) {
          div.style.background = "#eef6ff";
        }

        div.innerHTML = `
                <strong>${item.title}</strong>
                <br>
                <small>${item.created_at}</small>
                <p>${item.content}</p>
            `;

        container.appendChild(div);
      });
    });
}

// =======================
// CHECK NEW NOTI
// =======================
function checkNotification() {
  if (isFirstLoad) return;

  fetch(`../api/get_notification.php?last_id=${lastNotificationId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.id) {
        lastNotificationId = data.id;

        showNotification(data.title, data.content);
        loadUnreadCount();
      }
    });
}

// =======================
// TOAST
// =======================
function showNotification(title, content) {
  const div = document.createElement("div");

  div.style = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: #333;
        color: #fff;
        padding: 15px;
        border-radius: 8px;
        z-index: 10002;
    `;

  div.innerHTML = `
        <div style="font-weight:bold;">🔔 ${title}</div>
        <div>${content}</div>
    `;

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 5000);
}

// =======================
// BADGE
// =======================
function loadUnreadCount() {
  fetch("../api/get_notification.php?action=count_unread")
    .then((res) => res.json())
    .then((data) => {
      const badge = document.getElementById("notification-badge");

      if (!badge) return;

      if (data.unread > 0) {
        badge.innerText = data.unread > 9 ? "9+" : data.unread;
        badge.style.display = "block";
      } else {
        badge.style.display = "none";
      }
    });
}

// =======================
// LOGOUT
// =======================
function initLogoutLogic() {
  const btn = document.getElementById("logout-btn");

  if (!btn) return;

  btn.onclick = function () {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      fetch("../api/logout.php", { method: "POST" }).then((res) => {
        if (res.ok) {
          localStorage.clear();
          window.location.href = "../pages/login.html";
        }
      });
    }
  };
}
