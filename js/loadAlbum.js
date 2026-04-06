// Khai báo biến toàn cục
var globalAlbums = [];
var currentEditAlbumId = null;

// =========================================================
// 1. HÀM KHỞI TẠO TRANG ALBUM
// =========================================================
window.initAlbumPage = function () {
  console.log("🚀 Đang khởi tạo trang Album...");
  var role = localStorage.getItem("role") || "user";

  // Chỉ gán sự kiện đóng modal một lần duy nhất (Tránh lỗi SPA gán chồng sự kiện)
  if (!window._albumEventsBound) {
    window._albumEventsBound = true;
    window.addEventListener("click", function (e) {
      var modal = document.getElementById("album-modal");
      var adminModal = document.getElementById("album-admin-modal");
      if (e.target === modal) window.closeAlbumModal();
      if (e.target === adminModal) window.closeAlbumModalAdmin();
    });
  }

  // Load dữ liệu từ API
  fetch("/Web_nghe_nhac/api/get_album.php")
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) return;
      globalAlbums = data.albums;

      // Hiển thị dữ liệu ban đầu
      window.refreshAlbumDisplay(globalAlbums, false, role);

      // Kích hoạt thanh tìm kiếm
      if (typeof window.MusicSearchEngine !== "undefined") {
        window.MusicSearchEngine.initGlobalSearch((keyword) => {
          var isTyping = keyword.trim() !== "";
          var filtered = window.MusicSearchEngine.process(globalAlbums, {
            keyword: keyword,
          });
          window.refreshAlbumDisplay(filtered, isTyping, role);
        });
      }

      // Gắn nút Thêm cho Admin
      if (role === "admin") {
        var holder = document.getElementById("admin-btn-holder");
        if (holder && !document.querySelector(".admin-add-btn-main")) {
          holder.innerHTML = `<button class="admin-add-btn-main" onclick="openAlbumModalAdmin('add')"><i class="fa-solid fa-plus"></i> Thêm Album</button>`;
        }
      }
    })
    .catch((err) => console.error("Lỗi khi tải album:", err));
};

// ================= 2. HIỂN THỊ ALBUM & KHỞI TẠO SCROLL =================
window.refreshAlbumDisplay = function (data, isSearching = false, role) {
  var featuredSec = document.getElementById("featured-albums");
  var newSec = document.getElementById("new-albums");
  var allList = document.getElementById("all-album-list");

  if (isSearching) {
    if (featuredSec) featuredSec.style.display = "none";
    if (newSec) newSec.style.display = "none";
  } else {
    if (featuredSec) featuredSec.style.display = "block";
    if (newSec) newSec.style.display = "block";

    var hotData = [],
      newData = [];
    if (typeof window.MusicSearchEngine !== "undefined") {
      hotData = window.MusicSearchEngine.process(data, {
        sortBy: "hot",
        limit: 6,
      });
      newData = window.MusicSearchEngine.process(data, {
        sortBy: "new",
        limit: 6,
      });
    } else {
      hotData = data.slice(0, 6);
      newData = data.slice(0, 6);
    }

    var featuredList = document.getElementById("featured-album-list");
    var newList = document.getElementById("new-album-list");

    if (featuredList)
      featuredList.innerHTML = hotData
        .map((a) => window.createAlbumHTML(a, role))
        .join("");
    if (newList)
      newList.innerHTML = newData
        .map((a) => window.createAlbumHTML(a, role))
        .join("");
  }

  if (allList)
    allList.innerHTML = data
      .map((a) => window.createAlbumHTML(a, role))
      .join("");

  // Đợi trình duyệt render xong HTML rồi mới gọi Scroll
  requestAnimationFrame(() => {
    if (typeof window.initHorizontalScroll === "function") {
      window.initHorizontalScroll(".album-wrapper");
    }
  });
};

// ================= 3. MODAL CHI TIẾT ALBUM =================
window.openAlbumModal = function (albumId, title, artist, year, cover) {
  var modal = document.getElementById("album-modal");
  if (!modal) return;

  document.getElementById("modal-album-img").src = `../img/${cover}`;
  document.getElementById("modal-album-title").innerText = title;
  document.getElementById("modal-album-artist").innerText =
    `${artist} • ${year}`;

  var songListContainer = document.getElementById("modal-song-list");
  songListContainer.innerHTML =
    "<p style='color:#a7a7a7;'>Đang tải bài hát...</p>";
  modal.classList.add("show");

  fetch(`/Web_nghe_nhac/api/get_albumsong.php?album_id=${albumId}`)
    .then((res) => res.json())
    .then((data) => {
      songListContainer.innerHTML = "";
      if (!data.success || data.songs.length === 0) {
        songListContainer.innerHTML =
          "<p style='color:#a7a7a7;'>Album trống.</p>";
        return;
      }
      data.songs.forEach((song) => {
        var div = document.createElement("div");
        div.className = "modal-song-item";
        div.innerHTML = `<i class="fa-solid fa-music"></i><div class="song-info"><h4>${song.title}</h4></div>`;
        div.onclick = () => {
          if (typeof window.playSongDirectly === "function") {
            window.playSongDirectly(
              song.title,
              artist,
              "../" + song.file_path,
              "../img/" + cover,
            );
          }
        };
        songListContainer.appendChild(div);
      });
    });
};

window.closeAlbumModal = function () {
  var modal = document.getElementById("album-modal");
  if (modal) modal.classList.remove("show");
};

// ================= 4. GIAO DIỆN ADMIN =================
window.createAlbumHTML = function (album, role) {
  return `
    <div class="album-card" onclick="openAlbumModal(${album.id}, '${album.title.replace(/'/g, "\\'")}', '${album.artist_name.replace(/'/g, "\\'")}', '${album.release_year}', '${album.cover_image}')">
        <div class="album-img">
            <img src="../img/${album.cover_image}" alt="${album.title}">
            <div class="album-play"><i class="fa-solid fa-play"></i></div>
            ${
              role === "admin"
                ? `
            <div class="admin-controls">
                <button class="btn-edit" onclick="event.stopPropagation(); prepareEditAlbum(${album.id}, '${album.title.replace(/'/g, "\\'")}', ${album.artist_id}, '${album.release_year}', '${album.cover_image}')">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn-delete" onclick="event.stopPropagation(); deleteAlbum(${album.id})">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>`
                : ""
            }
        </div>
        <div class="album-info">
            <h5 title="${album.title}">${album.title}</h5>
            <span class="description">${album.artist_name} • ${album.release_year}</span>
        </div>
    </div>`;
};

// --- CÁC HÀM CRUD ADMIN ---
window.submitAlbum = function () {
  var id = currentEditAlbumId;
  var title = document.getElementById("adm-album-title").value.trim();
  var artist_id = document.getElementById("adm-album-artist").value.trim();
  var release_year = document.getElementById("adm-album-year").value.trim();
  var cover_image = document.getElementById("adm-album-image").value.trim();

  if (!title || !artist_id) return alert("Vui lòng nhập đầy đủ thông tin!");

  var params = new URLSearchParams();
  if (id) params.append("id", id);
  params.append("title", title);
  params.append("artist_id", artist_id);
  params.append("release_year", release_year);
  params.append("cover_image", cover_image);

  fetch(id ? "../api/update_album.php" : "../api/create_album.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        window.closeAlbumModalAdmin();
        window.initAlbumPage(); // Cập nhật lại danh sách ngay lập tức
      } else {
        alert("Lỗi: " + result.message);
      }
    });
};

window.deleteAlbum = function (id) {
  if (confirm("Bạn có chắc muốn xóa album này?")) {
    fetch("../api/delete_album.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id=${id}`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) window.initAlbumPage();
        else alert("Lỗi khi xóa!");
      });
  }
};

window.openAlbumModalAdmin = function (mode) {
  if (mode === "add") {
    currentEditAlbumId = null;
    document.getElementById("admin-modal-title").innerText = "Thêm Album";
    document
      .querySelectorAll("#album-admin-modal input")
      .forEach((i) => (i.value = ""));
    document.getElementById("album-admin-modal").style.display = "flex";
  }
};

window.closeAlbumModalAdmin = function () {
  document.getElementById("album-admin-modal").style.display = "none";
};

window.prepareEditAlbum = function (id, title, artistId, year, image) {
  currentEditAlbumId = id;
  document.getElementById("admin-modal-title").innerText = "Chỉnh sửa Album";
  document.getElementById("adm-album-title").value = title;
  document.getElementById("adm-album-artist").value = artistId;
  document.getElementById("adm-album-year").value = year;
  document.getElementById("adm-album-image").value = image;
  document.getElementById("album-admin-modal").style.display = "flex";
};
