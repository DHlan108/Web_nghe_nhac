// Thay vì let/const, dùng var để tránh xung đột bộ nhớ trong mô hình SPA
var currentEditId = null;
var globalSongs = [];
// =========================================================
// HÀM CUỘN TRANG MƯỢT MÀ 
// =========================================================
window.scrollToSection = function (sectionId) {
  var element = document.getElementById(sectionId);
  if (element) {
    // Cuộn mượt mà đến vị trí của thẻ có ID tương ứng
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    console.warn("Không tìm thấy khu vực nào có ID là: " + sectionId);
  }
};
// =========================================================
// HÀM KHỞI TẠO TRANG 
// =========================================================
window.initSongPage = function () {
  console.log("🚀 Đang khởi tạo trang Bài Hát...");
  var role = localStorage.getItem("role") || "user";

  // Hiển thị nút Admin
  var adminTools = document.getElementById("admin-tools");
  if (role === "admin" && adminTools) {
    adminTools.innerHTML = `
        <button onclick="openModal('add')" class="admin-add-btn" style="padding:25px 80px; font-size:26px; font-weight:900; margin-bottom:40px; margin-top:20px; background: linear-gradient(135deg, #40c9ff, #e81cff); color:white; border-radius:15px; box-shadow:0 10px 40px rgba(91, 111, 216, 0.6); cursor:pointer; width:100%; max-width:1000px; text-transform:uppercase; letter-spacing:1.5px; transition:all 0.3s ease; display:block; margin-left:auto; margin-right:auto;">
            <span style="color: #FF9500; font-weight: bold; margin-right: 8px;">+</span> Thêm bài hát mới
        </button>`;
  }

  // Fetch dữ liệu bài hát
  fetch("../api/get_song.php")
    .then((res) => {
      if (!res.ok) throw new Error("Sai đường dẫn API hoặc lỗi Server!");
      return res.json();
    })
    .then((data) => {
      globalSongs = data;
      refreshSongDisplay(globalSongs, role); // Truyền role vào để render

      // Kích hoạt tìm kiếm
      if (typeof window.MusicSearchEngine !== "undefined") {
        window.MusicSearchEngine.initGlobalSearch((keyword) => {
          var featuredSection = document.getElementById("featured-songs");
          var newSection = document.getElementById("new-songs");
          var allList = document.getElementById("all-list");

          if (keyword.trim() !== "") {
            // Tự động cuộn xuống
            if (typeof scrollToSection === "function")
              scrollToSection("all-songs");
            // Ẩn các phần không liên quan
            if (featuredSection) featuredSection.style.display = "none";
            if (newSection) newSection.style.display = "none";
          } else {
            if (featuredSection) featuredSection.style.display = "block";
            if (newSection) newSection.style.display = "block";
          }

          // Lọc và render lại
          var filtered = window.MusicSearchEngine.process(globalSongs, {
            keyword: keyword,
          });
          if (allList)
            allList.innerHTML = filtered
              .map((s) => createSong(s, role))
              .join("");
        });
      }
    })
    .catch((err) => console.error("❌ Lỗi Fetch dữ liệu:", err));
};

// =========================================================
// 2. CÁC HÀM RENDER & LOGIC 
// =========================================================

window.createSong = function (song, role) {
  return `
    <div class="pro" data-id="${song.id}">
        <div class="img-box">
            <img src="../img/${song.image_path}">
            <div class="play">
                <i class="fa-solid fa-play"></i>
            </div>
        </div>
        <div class="des">
            <h5>${song.title}</h5>
            <span class="artist">${song.artist_name}</span>
            <div class="bottom-row">
                <small class="year">
                    ${song.release_date ? song.release_date.split("-")[0] : ""}
                </small>
                ${
                  role === "admin"
                    ? `
                <div class="admin-btn-row">
                    <button class="btn-edit">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
                `
                    : ""
                }
            </div>
        </div>
    </div>
    `;
};

// Dùng ID để tìm dữ liệu và phát nhạc
window.playSongFromList = function (id) {
  // globalSongs đã được fetch ở đầu file
  var song = globalSongs.find((s) => s.id == id);
  if (song) {
    console.log("Đang phát nhạc:", song.title);
    window.playSongDirectly(
      song.title,
      song.artist_name,
      "../" + song.file_path,
      "../img/" + song.image_path,
    );
    fetch("../api/update_listen.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "id=" + id,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          console.log(`✅ Đã cộng 1 lượt nghe cho bài: ${song.title}`);
          // Tự động cập nhật số liệu trên RAM để nếu ấn filter/search nó không bị tuột lại số cũ
          song.listens = (parseInt(song.listens) || 0) + 1;
        }
      })
      .catch((err) => console.error("Lỗi khi cộng lượt nghe:", err));
  }
};

window.refreshSongDisplay = function (data, role) {
  var featured = document.getElementById("featured-list");
  var newsong = document.getElementById("new-list");
  var allsong = document.getElementById("all-list");

  if (!featured || !newsong || !allsong) {
    console.warn("⏳ Giao diện chưa sẵn sàng, đang đợi 50ms...");
    setTimeout(function () {
      window.refreshSongDisplay(data, role);
    }, 50);
    return;
  }

  // SẮP XẾP BÀI HÁT NỔI BẬT (Theo listens giảm dần)
  var hotData = [...data]
    .sort(function (a, b) {
      var listenA = parseInt(a.listens) || 0;
      var listenB = parseInt(b.listens) || 0;
      return listenB - listenA;
    })
    .slice(0, 6);

  // SẮP XẾP BÀI HÁT MỚI RA (Theo release_date mới nhất)
  var newData = [...data]
    .sort(function (a, b) {
      var dateA = new Date(a.release_date || 0).getTime();
      var dateB = new Date(b.release_date || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 6);

  // Render ra HTML
  featured.innerHTML = hotData.map((s) => createSong(s, role)).join("");
  newsong.innerHTML = newData.map((s) => createSong(s, role)).join("");
  allsong.innerHTML = data.map((s) => createSong(s, role)).join("");

  // ===== EVENT DELEGATION =====
  [featured, newsong, allsong].forEach((container) => {
    container.onclick = function (e) {
      var card = e.target.closest(".pro");
      if (!card) return;

      var id = card.dataset.id;

      // PLAY
      if (e.target.closest(".play")) {
        window.playSongFromList(id);
        return;
      }

      // EDIT
      if (e.target.closest(".btn-edit")) {
        e.stopPropagation();
        var song = globalSongs.find((s) => s.id == id);
        openModal("edit", song);
        return;
      }

      // DELETE
      if (e.target.closest(".btn-delete")) {
        e.stopPropagation();
        deleteSong(id);
        return;
      }
    };
  });
};

window.deleteSong = function (id) {
  if (confirm("Bạn có chắc muốn xóa không?")) {
    fetch("../api/delete_song.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "id=" + id,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        window.initSongPage();
      });
  }
};

window.openModal = function (mode, song = null) {
  document.getElementById("song-modal").style.display = "flex";

  if (mode === "add") {
    currentEditId = null;
    document.getElementById("modal-title").innerText = "Thêm bài hát";
    document.getElementById("song-title").value = "";
    document.getElementById("song-artist").value = "";
    document.getElementById("song-file").value = "";
    document.getElementById("song-album").value = "";
    document.getElementById("song-image").value = "";
    document.getElementById("song-date").value = "";
  }

  if (mode === "edit") {
    currentEditId = song.id;
    document.getElementById("modal-title").innerText = "Sửa bài hát";
    document.getElementById("song-title").value = song.title;
    document.getElementById("song-artist").value = song.artist_id || "";
    document.getElementById("song-album").value = song.album_id;
    document.getElementById("song-file").value = song.file_path;
    document.getElementById("song-image").value = song.image_path;
    document.getElementById("song-date").value = song.release_date;
  }
};

window.closeModal = function () {
  document.getElementById("song-modal").style.display = "none";
};

window.submitSong = function () {
  var title = document.getElementById("song-title").value;
  var artist_id = document.getElementById("song-artist").value;
  var album_id = document.getElementById("song-album").value.trim();
  var file_path = document.getElementById("song-file").value;
  var image_path = document.getElementById("song-image").value;
  var release_date = document.getElementById("song-date").value;

  var url = "";
  var body = "";

  if (currentEditId) {
    url = "../api/update_song.php";
    body = `id=${currentEditId}&title=${encodeURIComponent(title)}&artist_id=${artist_id}&album_id=${album_id !== "" ? album_id : ""}&release_date=${release_date}`;
  } else {
    url = "../api/song_create.php";
    body = `title=${encodeURIComponent(title)}&artist_id=${artist_id}&album_id=${album_id !== "" ? album_id : ""}&file_path=${encodeURIComponent(file_path)}&image_path=${encodeURIComponent(image_path)}&release_date=${release_date}`;
  }

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      if (data.success) {
        closeModal();
        window.initSongPage();
      }
    });
};
