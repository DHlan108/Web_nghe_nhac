// =========================================================
// BIẾN TOÀN CỤC
// =========================================================
var editPlaylistId = null;
var currentPlaylistId = null;

// =========================================================
// 1. HÀM KHỞI TẠO TRANG PLAYLIST
// =========================================================
window.initPlaylistPage = function () {
  console.log("🚀 Đang khởi tạo trang Danh sách phát...");
// html xong mới đến js
  setTimeout(() => {
    const role = localStorage.getItem("role") || "user";

    // --- LẤY CÁC PHẦN TỬ DOM ---
    const addPlaylistBtn = document.getElementById("add-playlist-btn");
    const savePlaylistBtn = document.getElementById("save-playlist-btn");
    const closePlaylistBtn = document.getElementById("close-playlist-modal");
    const addSongBtn = document.getElementById("add-song-btn");
    const closeSongModalBtn = document.getElementById("close-song-modal");

    // --- PHÂN QUYỀN VÀ XỬ LÝ NÚT TẠO MỚI ---
    if (addPlaylistBtn) {
      addPlaylistBtn.style.display = role === "user" ? "flex" : "none";

      addPlaylistBtn.onclick = () => {
        editPlaylistId = null;

        // Lấy lại phần tử mỗi khi click để đảm bảo không bị mất reference trong SPA
        const modalTitle = document.getElementById("playlist-modal-title");
        const nameInput = document.getElementById("playlist-name");
        const modal = document.getElementById("playlist-modal");

        if (modalTitle) {
          modalTitle.innerText = "Tạo mới danh sách";
        } else {
          console.error(
            "Lỗi: Không tìm thấy ID 'playlist-modal-title' lúc nhấn nút",
          );
        }

        if (nameInput) nameInput.value = "";
        if (modal) modal.classList.remove("hidden");
      };
    }

    // Đóng Playlist Modal
    if (closePlaylistBtn) {
      closePlaylistBtn.onclick = () => {
        const modal = document.getElementById("playlist-modal");
        if (modal) modal.classList.add("hidden");
      };
    }

    // Lưu Playlist
    if (savePlaylistBtn) savePlaylistBtn.onclick = window.submitPlaylist;

    // Mở Modal thêm bài hát
    if (addSongBtn) addSongBtn.onclick = window.openSongModal;

    // Đóng Modal bài hát
    if (closeSongModalBtn) {
      closeSongModalBtn.onclick = () => {
        const songModal = document.getElementById("song-modal");
        if (songModal) songModal.classList.add("hidden");
      };
    }
    window.loadPlaylists();
  }, 50); 
};

// =========================================================
// 2. LOGIC XỬ LÝ PLAYLIST
// =========================================================

window.loadPlaylists = function () {
  const playlistList = document.getElementById("playlist-list");
  if (!playlistList) return;

  fetch("../api/get_playlists.php")
    .then((res) => res.json())
    .then((data) => {
      playlistList.innerHTML = "";
      const role = localStorage.getItem("role") || "user";

      data.forEach((pl) => {
        const div = document.createElement("div");
        div.className = "playlist-item";
        div.innerHTML = `
                    <div class="pl-cover">
                        <img src="../img/${pl.playlist_image || "default_playlist.jpg"}">
                    </div>
                    <div class="pl-info"> 
                        <span class="pl-name">${pl.name}</span>
                        ${
                          role === "user"
                            ? `
                        <span class="pl-actions">
                            <button class="edit-btn" onclick="event.stopPropagation(); window.prepareEditPlaylist(${pl.id}, '${pl.name}')">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="delete-btn" onclick="event.stopPropagation(); window.deletePlaylist(${pl.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </span>`
                            : ""
                        }
                    </div>
                `;
        div.onclick = () => window.selectPlaylist(pl, div);
        playlistList.appendChild(div);
      });
    });
};

window.selectPlaylist = function (pl, element) {
  currentPlaylistId = pl.id;
  document
    .querySelectorAll(".playlist-item")
    .forEach((item) => item.classList.remove("active"));
  element.classList.add("active");

  const view = document.getElementById("playlist-view");
  const title = document.getElementById("playlist-title");
  const cover = document.getElementById("playlist-cover");

  if (view) view.classList.remove("hidden");
  if (title) title.innerText = pl.name;
  if (cover)
    cover.src = `../img/${pl.playlist_image || "default_playlist.jpg"}`;

  window.loadSongsInPlaylist(pl.id);
};

window.submitPlaylist = function () {
  const nameInput = document.getElementById("playlist-name");
  const fileInput = document.getElementById("playlist-image");
  if (!nameInput || !nameInput.value.trim()) return alert("Vui lòng nhập tên!");

  const formData = new FormData();
  formData.append("name", nameInput.value.trim());
  if (fileInput && fileInput.files[0])
    formData.append("image", fileInput.files[0]);
  if (editPlaylistId) formData.append("id", editPlaylistId);

  const url = editPlaylistId
    ? "../api/update_playlist.php"
    : "../api/create_playlist.php";

  fetch(url, { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Thành công!");
        const modal = document.getElementById("playlist-modal");
        if (modal) modal.classList.add("hidden");
        window.loadPlaylists();
      }
    });
};

window.prepareEditPlaylist = function (id, name) {
  editPlaylistId = id;
  const modalTitle = document.getElementById("playlist-modal-title");
  const nameInput = document.getElementById("playlist-name");
  const modal = document.getElementById("playlist-modal");

  if (modalTitle) modalTitle.innerText = "Sửa danh sách phát";
  if (nameInput) nameInput.value = name;
  if (modal) modal.classList.remove("hidden");
};

window.deletePlaylist = function (id) {
  if (!confirm("Bạn có chắc muốn xóa danh sách này?")) return;

  fetch("../api/delete_playlist.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id=${id}`,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Đã xóa playlist thành công!");

        // Tải lại danh sách bên trái
        window.loadPlaylists();

        // Nếu playlist đang xóa chính là cái đang mở bên phải
        if (currentPlaylistId == id) {
          currentPlaylistId = null; // Reset ID hiện tại

          const view = document.getElementById("playlist-view");
          if (view) {
            view.classList.add("hidden"); // Ẩn khung bên phải đi
          }

          // Xóa trắng tiêu đề và danh sách bài hát cũ
          const title = document.getElementById("playlist-title");
          const songList = document.getElementById("song-list");
          if (title) title.innerText = "";
          if (songList) songList.innerHTML = "";
        }
      } else {
        alert("Lỗi xóa: " + data.message);
      }
    })
    .catch((err) => console.error("Lỗi khi xóa playlist:", err));
};

// =========================================================
// 3. LOGIC XỬ LÝ BÀI HÁT
// =========================================================

window.loadSongsInPlaylist = function (playlistId) {
  const songListContainer = document.getElementById("song-list");
  if (!songListContainer) return;

  fetch(`../api/get_playlist_songs.php?playlist_id=${playlistId}`)
    .then((res) => res.json())
    .then((songs) => {
      window.currentPlaylistSongs = songs;
      songListContainer.innerHTML =
        songs.length === 0 ? "<p>Chưa có bài hát nào.</p>" : "";
      songs.forEach((song, index) => {
        const div = document.createElement("div");
        div.className = "song-row";
        div.innerHTML = `
                    <div class="song-left">
                        <span class="song-index">${index + 1}</span>
                        <div class="song-cover">
                            <img src="../img/${song.image_path}">
                            <div class="play-overlay"><i class="fa-solid fa-play"></i></div>
                        </div>
                        <div class="song-text">
                            <h5>${song.title}</h5>
                            <span>${song.artist_name || "Nghệ sĩ"}</span>
                        </div>
                    </div>
                    <div class="song-right">
                        <button class="delete-song-btn" onclick="window.removeSongFromPlaylist(${song.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
        div.querySelector(".play-overlay").onclick = () => {
          if (window.playPlaylistQueue) {
            // Truyền toàn bộ mảng bài hát và vị trí bài vừa click
            window.playPlaylistQueue(songs, index);
          } else if (window.playSongDirectly) {
            console.warn("Chưa có hàm playPlaylistQueue, đang phát bài lẻ.");
            window.playSongDirectly(
              song.title,
              song.artist_name,
              "../" + song.file_path,
              "../img/" + song.image_path,
            );
          }
        };
        songListContainer.appendChild(div);
      });
      const playAllBtn = document.getElementById("play-all-btn");
      if (playAllBtn) {
        playAllBtn.onclick = () => {
          if (songs.length > 0 && window.playPlaylistQueue) {
            window.playPlaylistQueue(songs, 0); 
          } else if (songs.length === 0) {
            alert("Danh sách phát hiện chưa có bài hát nào!");
          }
        };
      }
    });
};

window.openSongModal = function () {
  const songModal = document.getElementById("song-modal");
  if (!currentPlaylistId) return alert("Chọn playlist trước!");
  if (songModal) songModal.classList.remove("hidden");

  fetch("../api/get_song.php")
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("song-select-list");
      if (list) {
        list.innerHTML = "";
        data.forEach((song) => {
          const item = document.createElement("div");
          item.className = "song-select-item";
          item.innerHTML = `<span>${song.title} - ${song.artist_name}</span><button><i class="fa-solid fa-plus"></i></button>`;
          item.querySelector("button").onclick = () =>
            window.addSongToPlaylist(song.id);
          list.appendChild(item);
        });
      }
    });
};

window.addSongToPlaylist = function (songId) {
  fetch("../api/add_song_to_playlist.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `playlist_id=${currentPlaylistId}&song_id=${songId}`,
  }).then(() => window.loadSongsInPlaylist(currentPlaylistId));
};

window.removeSongFromPlaylist = function (songId) {
  if (!confirm("Xóa bài hát?")) return;
  fetch("../api/remove_song_from_playlist.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `playlist_id=${currentPlaylistId}&song_id=${songId}`,
  }).then(() => window.loadSongsInPlaylist(currentPlaylistId));
};
