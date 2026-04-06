// Sử dụng var để lưu trạng thái toàn cục an toàn trong SPA
var editPlaylistId = null;
var currentPlaylistId = null;

// =========================================================
// 1. HÀM KHỞI TẠO TRANG PLAYLIST (Router sẽ gọi hàm này)
// =========================================================
window.initPlaylistPage = function() {
    console.log("🚀 Đang khởi tạo trang Danh sách phát...");

    // Lấy các phần tử DOM (Phải lấy bên trong hàm để luôn lấy phần tử mới nhất)
    var modal = document.getElementById("playlist-modal");
    var closeModal = document.getElementById("close-playlist-modal");
    var saveBtn = document.getElementById("save-playlist-btn");
    var addBtn = document.getElementById("add-playlist-btn");

    var addSongBtn = document.getElementById("add-song-btn");
    var songModal = document.getElementById("song-modal");
    var closeSongModal = document.getElementById("close-song-modal");
    var songSelectList = document.getElementById("song-select-list");

    // Reset trạng thái
    currentPlaylistId = null;

    // Các sự kiện cho Playlist Modal// Sử dụng var để lưu trạng thái toàn cục an toàn trong SPA
var editPlaylistId = null;
var currentPlaylistId = null;

// =========================================================
// 1. HÀM KHỞI TẠO TRANG PLAYLIST (Router sẽ gọi hàm này)
// =========================================================
window.initPlaylistPage = function() {
    console.log("🚀 Đang khởi tạo trang Danh sách phát...");

    // Lấy các phần tử DOM
    var modal = document.getElementById("playlist-modal");
    var saveBtn = document.getElementById("save-playlist-btn");
    var addBtn = document.getElementById("add-playlist-btn");

    var addSongBtn = document.getElementById("add-song-btn");
    var songModal = document.getElementById("song-modal");
    var songSelectList = document.getElementById("song-select-list");

    // Reset trạng thái
    currentPlaylistId = null;

    // Các sự kiện cho Playlist Modal
    if (addBtn) addBtn.onclick = () => {
        editPlaylistId = null;
        
        var modalTitle = document.getElementById("playlist-modal-title");
        if (modalTitle) {
            modalTitle.innerText = "Tạo danh sách phát";
        }

        if (modal) modal.classList.remove("hidden");
    };

    if (saveBtn) saveBtn.onclick = () => {
        var name = document.getElementById("playlist-name").value;
        var file = document.getElementById("playlist-image").files[0];
        var formData = new FormData();
        formData.append("name", name);

        if (file) {
            formData.append("image", file);
        }

        var url = editPlaylistId ? "../api/update_playlist.php" : "../api/create_playlist.php";
        if (editPlaylistId) {
            formData.append("id", editPlaylistId);
        }

        fetch(url, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                if (modal) modal.classList.add("hidden");
                window.loadPlaylists(); 
            }
        });
    };

    // Các sự kiện cho Bài Hát Modal
    if (addSongBtn) addSongBtn.onclick = () => {
        if (!currentPlaylistId) {
            alert("Chưa chọn danh sách phát");
            return;
        }
        if (songModal) songModal.classList.remove("hidden");

        fetch("../api/get_song.php")
        .then(res => res.json())
        .then(data => {
            if (songSelectList) {
                songSelectList.innerHTML = "";
                data.forEach(song => {
                    var item = document.createElement("div");
                    item.className = "song-select-item";

                    item.innerHTML = `
                        <div class="song-select-text">
                            <h5>${song.title}</h5>
                            <span>${song.artist_name}</span>
                        </div>
                        <button class="add-song-small-btn">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    `;

                    var btn = item.querySelector(".add-song-small-btn");
                    if (btn) {
                        btn.onclick = function() {
                            addSongToPlaylist(song.id);
                        };
                    }

                    songSelectList.appendChild(item);
                });
            } else {
                console.warn("Không tìm thấy thẻ có id 'song-select-list' trên giao diện");
            }
        });
    };

    // Tải danh sách phát khi vừa vào trang
    window.loadPlaylists();
};

// =========================================================
// 2. CÁC HÀM RENDER & LOGIC (Gắn vào window)
// =========================================================
window.loadPlaylists = function() {
    var playlistList = document.getElementById("playlist-list");
    if (!playlistList) return;

    fetch("../api/get_playlists.php")
    .then(res => res.json())
    .then(data => {
        playlistList.replaceChildren();

        data.forEach(pl => {
            var div = document.createElement("div");
            div.className = "playlist-item";
            div.dataset.id = pl.id;

            div.innerHTML = `
                <div class="pl-cover">
                    <img src="../img/${pl.playlist_image || "default_playlist.jpg"}">
                </div>
                <div class="pl-info"> 
                    <span class="pl-name">${pl.name}</span>
                    <span class="pl-actions">
                        <button class="edit-btn">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="delete-btn">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </span>
                </div>
            `;

            var editBtn = div.querySelector(".edit-btn");
            var deleteBtn = div.querySelector(".delete-btn");

            if (editBtn) {
                editBtn.onclick = function(e) {
                    e.stopPropagation();
                    editPlaylist(pl.id, pl.name);
                };
            }

            if (deleteBtn) {
                deleteBtn.onclick = function(e) {
                    deletePlaylist(e, pl.id);
                };
            }

            div.onclick = function() {
                currentPlaylistId = pl.id;

                document.querySelectorAll(".playlist-item")
                    .forEach(e => e.classList.remove("active"));

                div.classList.add("active");

                var view = document.getElementById("playlist-view");
                if (view) view.classList.remove("hidden");

                var title = document.getElementById("playlist-title");
                if (title) title.innerText = pl.name;

                var cover = document.getElementById("playlist-cover");
                if (cover) {
                    cover.src = "../img/" + (pl.playlist_image || "default_playlist.jpg");
                }

                window.loadSongs(pl.id);
            };

            playlistList.appendChild(div);
        });
    })
    .catch(err => console.error(err));
};

window.loadSongs = function(playlistId) {
    var songList = document.getElementById("song-list");
    if (!songList) return;

    fetch(`../api/get_playlist_songs.php?playlist_id=${playlistId}`)
    .then(res => res.json())
    .then(songs => {
        songList.innerHTML = "";

        songs.forEach((song, index) => {
            var div = document.createElement("div");
            div.className = "song-row";
            div.dataset.id = song.id;

            div.innerHTML = `
                <div class="song-left">
                    <span class="song-index">${index + 1}</span>
                    <div class="song-cover">
                        <img src="../img/${song.image_path}">
                        <div class="play-overlay">
                            <i class="fa-solid fa-play"></i>
                        </div>
                    </div>
                    <div class="song-text">
                        <h5>${song.title}</h5>
                        <span>${song.artist_name}</span>
                    </div>
                </div>
                <div class="song-right">
                    <button class="delete-song-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;

            var playBtn = div.querySelector(".play-overlay");
            if (playBtn) {
                playBtn.onclick = function() {
                    // Kiểm tra xem player.js đã có hàm nhận mảng playlist chưa
                    if (typeof window.playPlaylistQueue === "function") {
                        // Truyền toàn bộ danh sách 'songs' và vị trí 'index' của bài hát đang click
                        window.playPlaylistQueue(songs, index);
                    } else {
                        // Nếu chưa có thì vẫn dùng hàm cũ (để không bị lỗi)
                        window.playSongDirectly(
                            song.title,
                            song.artist_name,
                            '../' + song.file_path,
                            '../img/' + song.image_path
                        );
                    }
                };
            }

            var deleteBtn = div.querySelector(".delete-song-btn");
            if (deleteBtn) {
                deleteBtn.onclick = function(e) {
                    removeSongFromPlaylist(e, song.id);
                };
            }

            songList.appendChild(div);
        });
    })
    .catch(err => console.error(err));
};

window.editPlaylist = function(id, name) {
    editPlaylistId = id;
    
    var nameInput = document.getElementById("playlist-name");
    if (nameInput) nameInput.value = name;
    
    var modalTitle = document.getElementById("playlist-modal-title");
    if (modalTitle) modalTitle.innerText = "Sửa danh sách phát";
    
    var modal = document.getElementById("playlist-modal");
    if (modal) modal.classList.remove("hidden");
};

window.deletePlaylist = function(e, id) {
    e.stopPropagation();

    if (!confirm("Xóa danh sách phát này?")) return;

    fetch("../api/delete_playlist.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "id=" + id
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message);

            var item = document.querySelector(`.playlist-item[data-id='${id}']`);
            if (item) item.remove();

            if (currentPlaylistId == id) {
                currentPlaylistId = null;
                var plView = document.getElementById("playlist-view");
                if(plView) plView.classList.add("hidden");
                
                var songList = document.getElementById("song-list");
                if(songList) songList.innerHTML = "";
                
                var title = document.getElementById("playlist-title");
                if(title) title.innerText = "";
            }

            window.loadPlaylists();
        }
    })
    .catch(err => console.error(err));
};

window.addSongToPlaylist = function(songId) {
    fetch("../api/add_song_to_playlist.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },    
        body: `playlist_id=${currentPlaylistId}&song_id=${songId}`
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            var songModal = document.getElementById("song-modal");
            if(songModal) songModal.classList.add("hidden");
            window.loadSongs(currentPlaylistId);
        }
    });
};

window.removeSongFromPlaylist = function(e, songId) {
    e.stopPropagation();

    if (!confirm("Xóa bài hát này khỏi danh sách phát?")) return;

    fetch("../api/remove_song_from_playlist.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `playlist_id=${currentPlaylistId}&song_id=${songId}`
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            window.loadSongs(currentPlaylistId);
        }
    });
};

// =========================================================
// 3. XỬ LÝ ĐÓNG CỬA SỔ (MODAL) TRÊN TOÀN TRANG
// =========================================================
document.body.addEventListener('click', function(e) {
    // Đóng cửa sổ "Tạo/Sửa danh sách phát"
    if (e.target.closest('#close-playlist-modal')) {
        var playlistModal = document.getElementById('playlist-modal');
        if (playlistModal) {
            playlistModal.classList.add('hidden');
        }
    }

    // Đóng cửa sổ "Thêm bài hát"
    if (e.target.closest('#close-song-modal')) {
        var songModal = document.getElementById('song-modal');
        if (songModal) {
            songModal.classList.add('hidden');
        }
    }
});
    if (addBtn) addBtn.onclick = () => {
        editPlaylistId = null;
        
        // SỬA Ở ĐÂY: Kiểm tra trước khi gán innerText
        var modalTitle = document.getElementById("playlist-modal-title");
        if (modalTitle) {
            modalTitle.innerText = "Tạo danh sách phát";
        }

        if (modal) modal.classList.remove("hidden");
    };

    if (saveBtn) saveBtn.onclick = () => {
        var name = document.getElementById("playlist-name").value;
        var file = document.getElementById("playlist-image").files[0];
        var formData = new FormData();
        formData.append("name", name);

        if (file) {
            formData.append("image", file);
        }

        var url = editPlaylistId ? "../api/update_playlist.php" : "../api/create_playlist.php";
        if (editPlaylistId) {
            formData.append("id", editPlaylistId);
        }

        fetch(url, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                if (modal) modal.classList.add("hidden");
                // THAY ĐỔI: Gọi loadPlaylists() thay vì location.reload()
                window.loadPlaylists(); 
            }
        });
    };

    // Các sự kiện cho Bài Hát Modal
    if (addSongBtn) addSongBtn.onclick = () => {
        if (!currentPlaylistId) {
            alert("Chưa chọn danh sách phát");
            return;
        }
        if (songModal) songModal.classList.remove("hidden");

        fetch("../api/get_song.php")
        .then(res => res.json())
        .then(data => {
            // SỬA Ở ĐÂY: Chỉ thực thi nếu songSelectList tồn tại
            if (songSelectList) {
                songSelectList.innerHTML = "";
                data.forEach(song => {
                    var item = document.createElement("div");
                    item.className = "song-select-item";

                    item.innerHTML = `
                        <div class="song-select-text">
                            <h5>${song.title}</h5>
                            <span>${song.artist_name}</span>
                        </div>
                        <button class="add-song-small-btn">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    `;

                    var btn = item.querySelector(".add-song-small-btn");
                    if (btn) {
                        btn.onclick = function() {
                            addSongToPlaylist(song.id);
                        };
                    }

                    songSelectList.appendChild(item); // Lúc này appendChild sẽ không bị lỗi null
                });
            } else {
                console.warn("Không tìm thấy thẻ có id 'song-select-list' trên giao diện");
            }
        });
    };

    if (closeSongModal) closeSongModal.onclick = () => {
        if (songModal) songModal.classList.add("hidden");
    };

    // Tải danh sách phát khi vừa vào trang
    window.loadPlaylists();
};

// =========================================================
// 2. CÁC HÀM RENDER & LOGIC (Gắn vào window)
// =========================================================
window.loadPlaylists = function() {
    var playlistList = document.getElementById("playlist-list");
    if (!playlistList) return;

    fetch("../api/get_playlists.php")
    .then(res => res.json())
    .then(data => {
        playlistList.replaceChildren();

        data.forEach(pl => {
            var div = document.createElement("div");
            div.className = "playlist-item";
            div.dataset.id = pl.id;

            // Render HTML KHÔNG dùng onclick inline
            div.innerHTML = `
                <div class="pl-cover">
                    <img src="../img/${pl.playlist_image || "default_playlist.jpg"}">
                </div>
                <div class="pl-info"> 
                    <span class="pl-name">${pl.name}</span>
                    <span class="pl-actions">
                        <button class="edit-btn">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="delete-btn">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </span>
                </div>
            `;

            // ===== GÁN EVENT AN TOÀN =====
            var editBtn = div.querySelector(".edit-btn");
            var deleteBtn = div.querySelector(".delete-btn");

            if (editBtn) {
                editBtn.onclick = function(e) {
                    e.stopPropagation();
                    editPlaylist(pl.id, pl.name);
                };
            }

            if (deleteBtn) {
                deleteBtn.onclick = function(e) {
                    deletePlaylist(e, pl.id);
                };
            }

            // Click playlist
            div.onclick = function() {
                currentPlaylistId = pl.id;

                document.querySelectorAll(".playlist-item")
                    .forEach(e => e.classList.remove("active"));

                div.classList.add("active");

                var view = document.getElementById("playlist-view");
                if (view) view.classList.remove("hidden");

                var title = document.getElementById("playlist-title");
                if (title) title.innerText = pl.name;

                var cover = document.getElementById("playlist-cover");
                if (cover) {
                    cover.src = "../img/" + (pl.playlist_image || "default_playlist.jpg");
                }

                window.loadSongs(pl.id);
            };

            playlistList.appendChild(div);
        });
    })
    .catch(err => console.error(err));
};

window.loadSongs = function(playlistId) {
    var songList = document.getElementById("song-list");
    if (!songList) return;

    fetch(`../api/get_playlist_songs.php?playlist_id=${playlistId}`)
    .then(res => res.json())
    .then(songs => {
        songList.innerHTML = "";

        songs.forEach((song, index) => {
            var div = document.createElement("div");
            div.className = "song-row";
            div.dataset.id = song.id;

            div.innerHTML = `
                <div class="song-left">
                    <span class="song-index">${index + 1}</span>
                    <div class="song-cover">
                        <img src="../img/${song.image_path}">
                        <div class="play-overlay">
                            <i class="fa-solid fa-play"></i>
                        </div>
                    </div>
                    <div class="song-text">
                        <h5>${song.title}</h5>
                        <span>${song.artist_name}</span>
                    </div>
                </div>
                <div class="song-right">
                    <button class="delete-song-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;

            // ===== GÁN EVENT =====
            var playBtn = div.querySelector(".play-overlay");
            if (playBtn) {
                playBtn.onclick = function() {
                    window.playSongDirectly(
                        song.title,
                        song.artist_name,
                        '../' + song.file_path,
                        '../img/' + song.image_path
                    );
                };
            }

            var deleteBtn = div.querySelector(".delete-song-btn");
            if (deleteBtn) {
                deleteBtn.onclick = function(e) {
                    removeSongFromPlaylist(e, song.id);
                };
            }

            songList.appendChild(div);
        });
    })
    .catch(err => console.error(err));
};

window.editPlaylist = function(id, name) {
    editPlaylistId = id;
    
    // SỬA Ở ĐÂY: Thêm các bước kiểm tra (null check) để code an toàn hơn
    var nameInput = document.getElementById("playlist-name");
    if (nameInput) nameInput.value = name;
    
    var modalTitle = document.getElementById("playlist-modal-title");
    if (modalTitle) modalTitle.innerText = "Sửa danh sách phát";
    
    var modal = document.getElementById("playlist-modal");
    if (modal) modal.classList.remove("hidden");
};

window.deletePlaylist = function(e, id) {
    e.stopPropagation();

    if (!confirm("Xóa danh sách phát này?")) return;

    fetch("../api/delete_playlist.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "id=" + id
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message);

            // 1. Xóa giao diện
            var item = document.querySelector(`.playlist-item[data-id='${id}']`);
            if (item) item.remove();

            // 2. Reset nếu đang chọn playlist đó
            if (currentPlaylistId == id) {
                currentPlaylistId = null;
                var plView = document.getElementById("playlist-view");
                if(plView) plView.classList.add("hidden");
                
                var songList = document.getElementById("song-list");
                if(songList) songList.innerHTML = "";
                
                var title = document.getElementById("playlist-title");
                if(title) title.innerText = "";
            }

            // 3. Không reload trang, chỉ gọi lại loadPlaylists
            window.loadPlaylists();
        }
    })
    .catch(err => console.error(err));
};

window.addSongToPlaylist = function(songId) {
    fetch("../api/add_song_to_playlist.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },    
        body: `playlist_id=${currentPlaylistId}&song_id=${songId}`
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            var songModal = document.getElementById("song-modal");
            if(songModal) songModal.classList.add("hidden");
            // Render lại danh sách bài hát
            window.loadSongs(currentPlaylistId);
        }
    });
};

window.removeSongFromPlaylist = function(e, songId) {
    e.stopPropagation();

    if (!confirm("Xóa bài hát này khỏi danh sách phát?")) return;

    fetch("../api/remove_song_from_playlist.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `playlist_id=${currentPlaylistId}&song_id=${songId}`
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            window.loadSongs(currentPlaylistId);
        }
    });
};