// Biến toàn cục
var globalArtists = [];
var currentEditArtistId = null;

// =========================================================
// 1. HÀM KHỞI TẠO TRANG NGHỆ SĨ
// =========================================================
window.initArtistPage = function () {
  console.log("🚀 Đang khởi tạo trang Nghệ Sĩ...");

  var userRole = localStorage.getItem("role") || "user";
  var container = document.getElementById("artist-container");

  // Xử lý đóng Modal Admin khi click ra ngoài (Chỉ gán 1 lần)
  if (!window._artistClickBound) {
    window._artistClickBound = true;
    window.addEventListener("click", function (e) {
      var adminModal = document.getElementById("artist-admin-modal");
      if (adminModal && e.target === adminModal) {
        adminModal.style.display = "none";
      }
    });
  }

  // Lấy dữ liệu từ API
  fetch("../api/get_artist.php")
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) return;
      globalArtists = data.artists;

      window.renderArtistList(globalArtists, false, userRole);

      // Kích hoạt Scroll
      requestAnimationFrame(() => {
        if (typeof window.initHorizontalScroll === "function") {
          window.initHorizontalScroll(".artist-wrapper");
        }
      });

      // Tích hợp tìm kiếm
      if (typeof window.MusicSearchEngine !== "undefined") {
        window.MusicSearchEngine.initGlobalSearch((keyword) => {
          var isTyping = keyword.trim() !== "";
          var filtered = window.MusicSearchEngine.process(globalArtists, {
            keyword: keyword,
          });
          window.renderArtistList(filtered, isTyping, userRole);

          requestAnimationFrame(() => {
            if (typeof window.initHorizontalScroll === "function") {
              window.initHorizontalScroll(".artist-wrapper");
            }
          });
        });
      }
    })
    .catch((err) => console.error("Lỗi fetch Artist:", err));

  // --- XỬ LÝ NÚT THÊM CHO ADMIN ---
  if (userRole === "admin") {
    var section = document.getElementById("product1");
    if (section) {
      // Xóa nút cũ để tránh bị lặp nút khi chuyển trang qua lại trong SPA
      const oldBtn = section.querySelector(".admin-add-btn-artist");
      if (oldBtn) oldBtn.remove();

      var addBtn = document.createElement("button");
      addBtn.className = "admin-add-btn-artist";
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Thêm Nghệ Sĩ';

      // Gán trực tiếp qua addEventListener để đảm bảo không bị chặn
      addBtn.addEventListener("click", function () {
        window.openArtistModal();
      });

      section.appendChild(addBtn);
    }
  }
};

// =========================================================
// 2. RENDER GIAO DIỆN
// =========================================================
window.renderArtistList = function (artists, isSearching = false, role) {
  var container = document.getElementById("artist-container");
  var songSection = document.querySelector(".song-section");
  var artistHeader = document.querySelector("#product1 h2");

  if (!container) return;
  container.innerHTML = "";

  if (isSearching) {
    if (songSection) songSection.style.display = "none";
    if (artistHeader) artistHeader.innerText = "Kết quả tìm kiếm nghệ sĩ";
  } else {
    if (songSection) songSection.style.display = "block";
    if (artistHeader) artistHeader.innerText = "Nghệ Sĩ";
  }

  if (artists.length === 0) {
    container.innerHTML =
      "<p style='color:gray; padding:20px;'>Không tìm thấy nghệ sĩ nào.</p>";
    return;
  }

  artists.forEach((artist) => {
    var div = document.createElement("div");
    div.className = "artist-card";
    div.innerHTML = `
            <div class="artist-img">
                <img src="../img/${artist.avatar}" alt="${artist.name}">
            </div>
            <div class="artist-info">
                <h5>${artist.name}</h5>
                <span>${artist.country}</span>
                ${
                  role === "admin"
                    ? `
                <div class="artist-admin-controls">
                    <button class="btn-edit" title="Sửa"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="btn-delete" title="Xóa"><i class="fa-regular fa-trash-can"></i></button>
                </div>`
                    : ""
                }
            </div>
        `;

    div.onclick = () => window.loadArtistSongs(artist.id, artist.name);

    if (role === "admin") {
      div.querySelector(".btn-edit").onclick = (e) => {
        e.stopPropagation();
        window.prepareEditArtist(
          artist.id,
          artist.name,
          artist.country,
          artist.avatar,
        );
      };
      div.querySelector(".btn-delete").onclick = (e) => {
        e.stopPropagation();
        window.deleteArtist(artist.id);
      };
    }
    container.appendChild(div);
  });
};

// =========================================================
// 3. QUẢN LÝ MODAL & ADMIN LOGIC (LỖI THƯỜNG Ở ĐÂY)
// =========================================================

window.openArtistModal = function () {
  const modal = document.getElementById("artist-admin-modal");

  // Kiểm tra an toàn: Nếu không có HTML Modal thì báo lỗi ngay
  if (!modal) {
    console.error("❌ LỖI: Không tìm thấy ID 'artist-admin-modal' trong HTML!");
    alert("Thiếu giao diện Modal Admin trong file HTML của bạn.");
    return;
  }

  currentEditArtistId = null;
  document.getElementById("admin-artist-modal-title").innerText =
    "Thêm Nghệ Sĩ";
  document.getElementById("adm-artist-name").value = "";
  document.getElementById("adm-artist-country").value = "";
  document.getElementById("adm-artist-avatar").value = "";
  modal.style.display = "flex";
};

window.prepareEditArtist = function (id, name, country, avatar) {
  const modal = document.getElementById("artist-admin-modal");
  if (!modal) return alert("Không tìm thấy giao diện Modal!");

  currentEditArtistId = id;
  document.getElementById("admin-artist-modal-title").innerText =
    "Sửa Thông Tin";
  document.getElementById("adm-artist-name").value = name;
  document.getElementById("adm-artist-country").value = country;
  document.getElementById("adm-artist-avatar").value = avatar;
  modal.style.display = "flex";
};

window.submitArtist = function () {
  var name = document.getElementById("adm-artist-name").value.trim();
  var country = document.getElementById("adm-artist-country").value.trim();
  var avatar = document.getElementById("adm-artist-avatar").value.trim();

  if (!name) return alert("Vui lòng nhập tên nghệ sĩ!");

  var formData = new URLSearchParams();
  if (currentEditArtistId) formData.append("id", currentEditArtistId);
  formData.append("name", name);
  formData.append("country", country);
  formData.append("avatar", avatar);

  var url = currentEditArtistId
    ? "../api/update_artist.php"
    : "../api/create_artist.php";

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("artist-admin-modal").style.display = "none";
        window.initArtistPage();
      } else {
        alert("Lỗi: " + data.message);
      }
    })
    .catch((err) => console.error("Lỗi submit:", err));
};

// ... Các hàm loadArtistSongs và deleteArtist giữ nguyên logic cũ ...
window.deleteArtist = function (id) {
  if (confirm("Bạn có chắc chắn muốn xóa nghệ sĩ này không?")) {
    fetch("../api/delete_artist.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id=${id}`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) window.initArtistPage();
        else alert("Lỗi khi xóa!");
      });
  }
};

window.loadArtistSongs = function (id, name) {
  var titleElem = document.getElementById("artist-name");
  if (titleElem) titleElem.innerText = "Bài hát của " + name;

  fetch("../api/get_artistsong.php?id=" + id)
    .then((res) => res.json())
    .then((data) => {
      var container = document.getElementById("song-container");
      if (!container) return;
      container.innerHTML = "";
      if (!data.songs || data.songs.length === 0) {
        container.innerHTML =
          "<p style='color: white;'>Nghệ sĩ này chưa có bài hát.</p>";
        return;
      }
      window.currentArtistSongs = data.songs;
      data.songs.forEach((song) => {
        var year = song.release_date ? song.release_date.split("-")[0] : "";
        var div = document.createElement("div");
        div.className = "pro";
        div.innerHTML = `
                    <div class="img-box">
                        <img src="../img/${song.image_path}" alt="${song.title}">
                        <div class="play"><i class="fa-solid fa-play"></i></div>
                    </div>
                    <div class="des">
                        <h5>${song.title}</h5>
                        <small>${year}</small>
                    </div>
                `;
        div.onclick = () => window.playArtistSong(song.id, name);
        container.appendChild(div);
      });
      var songSec = document.querySelector(".song-section");
      if (songSec)
        window.scrollTo({ top: songSec.offsetTop - 80, behavior: "smooth" });
    });
};
