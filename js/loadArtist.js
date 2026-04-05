// Sử dụng var để tránh lỗi "Identifier has already been declared" khi chuyển trang qua lại
var globalArtists = []; 
var currentEditArtistId = null;

// =========================================================
// 1. HÀM KHỞI TẠO TRANG NGHỆ SĨ (Router sẽ gọi hàm này)
// =========================================================
window.initArtistPage = function() {
    console.log("🚀 Đang khởi tạo trang Nghệ Sĩ...");
    var userRole = localStorage.getItem("role") || "user";
    var container = document.getElementById("artist-container");
    var arrowsBox = document.querySelector(".arrows-box");

    // Đóng Modal khi click ra ngoài vùng xám
    window.onclick = function(e) {
        var adminModal = document.getElementById("artist-admin-modal");
        if (e.target === adminModal) {
            adminModal.style.display = "none";
        }
    };

    // Lấy dữ liệu nghệ sĩ từ API
    fetch("../api/get_artist.php")
        .then(res => res.json())
        .then(data => {
            if (!data.success) return;
            globalArtists = data.artists; 
            window.renderArtistList(globalArtists, false, userRole);

            setTimeout(() => {
            window.initHorizontalScroll(".artist-wrapper");
        }, 100);

            // Tích hợp thanh tìm kiếm
            if (typeof window.MusicSearchEngine !== 'undefined') {
                window.MusicSearchEngine.initGlobalSearch((keyword) => {
                    var isTyping = keyword.trim() !== "";
                    var filtered = window.MusicSearchEngine.process(globalArtists, { keyword: keyword });
                    window.renderArtistList(filtered, isTyping, userRole);
                    setTimeout(() => {
                    window.initHorizontalScroll(".artist-wrapper");
                }, 100);
                });
            }
        })
        .catch(err => console.error("Lỗi fetch:", err));

    // Render nút Admin và CSS lưới nghệ sĩ
    if(userRole === "admin" && container) {
        var section = document.getElementById("product1");
        if (section && !document.querySelector(".admin-add-btn-artist")) {
            var addBtn = document.createElement("button");
            addBtn.className = "admin-add-btn-artist";
            addBtn.innerHTML = "+ Thêm Nghệ Sĩ";
            addBtn.onclick = window.openArtistModal; 
            section.appendChild(addBtn);
        }

        if (arrowsBox) {
            arrowsBox.style.display = "flex";
            arrowsBox.style.justifyContent = "flex-end"; 
            arrowsBox.style.marginTop = "-40px";         
            arrowsBox.style.paddingRight = "20px";       
        }
    }
};
if (typeof window.initHorizontalScroll === "function") {
    window.initHorizontalScroll(".artist-wrapper");
}
// =========================================================
// 2. CÁC HÀM RENDER GIAO DIỆN VÀ LOGIC
// =========================================================
window.renderArtistList = function(artists, isSearching = false, role) {
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

    artists.forEach(artist => {
        var div = document.createElement("div");
        div.className = "artist-card";
        div.dataset.id = artist.id;

        div.innerHTML = `
            <div class="artist-img">
                <img src="../img/${artist.avatar}">
            </div>
            <div class="artist-info">
                <h5>${artist.name}</h5>
                <span>${artist.country}</span>
                ${role === "admin" ? `
                <div class="artist-admin-controls">
                    <button class="btn-edit">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
                ` : ""}
            </div>
        `;

        // ===== CLICK CARD =====
        div.onclick = function() {
            loadArtistSongs(artist.id, artist.name);
        };

        // ===== EDIT =====
        var editBtn = div.querySelector(".btn-edit");
        if (editBtn) {
            editBtn.onclick = function(e) {
                e.stopPropagation();
                prepareEditArtist(
                    artist.id,
                    artist.name,
                    artist.country,
                    artist.avatar
                );
            };
        }

        // ===== DELETE =====
        var deleteBtn = div.querySelector(".btn-delete");
        if (deleteBtn) {
            deleteBtn.onclick = function(e) {
                e.stopPropagation();
                deleteArtist(artist.id);
            };
        }

        container.appendChild(div);
    });
};
requestAnimationFrame(() => {
    window.initHorizontalScroll(".artist-wrapper");
});
// Khai báo một biến tạm để chứa danh sách nhạc của nghệ sĩ
window.currentArtistSongs = [];

window.loadArtistSongs = function(id, name) {
    document.getElementById("artist-name").innerText = "Bài hát của " + name;

    fetch("../api/get_artistsong.php?id=" + id)
        .then(res => res.json())
        .then(data => {
            var container = document.getElementById("song-container");
            container.innerHTML = ""; 

            if (!data.songs || data.songs.length === 0) {
                container.innerHTML = "<p style='color: white;'>Nghệ sĩ này chưa có bài hát.</p>";
                return;
            }

            // Lưu dữ liệu vào biến tạm
            window.currentArtistSongs = data.songs;

            data.songs.forEach(song => {
                var year = song.release_date ? song.release_date.split('-')[0] : "";
                var html = `
                    <div class="pro">
                        <div class="img-box">
                            <img src="../img/${song.image_path}" alt="${song.title}">
                            <div class="play" onclick="window.playArtistSong(${song.id}, '${name.replace(/'/g, "\\'")}')">
                                <i class="fa-solid fa-play"></i>
                            </div>
                        </div>
                        <div class="des">
                            <h5>${song.title}</h5>
                            <small>${year}</small>
                        </div>
                    </div>
                `;
                container.innerHTML += html;
            });
            
            var songSec = document.querySelector('.song-section');
            if(songSec) {
                window.scrollTo({ top: songSec.offsetTop - 100, behavior: 'smooth' });
            }
        })
        .catch(err => console.error("Lỗi fetch bài hát:", err));
};

// HÀM: Phát nhạc từ danh sách của nghệ sĩ
window.playArtistSong = function(id, artistName) {
    var song = window.currentArtistSongs.find(s => s.id == id);
    if (song) {
        window.playSongDirectly(song.title, artistName, '../' + song.file_path, '../img/' + song.image_path);
    }
};

// =========================================================
// 3. QUẢN LÝ ADMIN (THÊM, SỬA, XÓA)
// =========================================================
window.openArtistModal = function() {
    currentEditArtistId = null; 
    document.getElementById("admin-artist-modal-title").innerText = "Thêm Nghệ Sĩ";
    document.getElementById("adm-artist-name").value = "";
    document.getElementById("adm-artist-country").value = "";
    document.getElementById("adm-artist-avatar").value = "";
    document.getElementById("artist-admin-modal").style.display = "flex";
};

window.prepareEditArtist = function(id, name, country, avatar) {
    currentEditArtistId = id; 
    document.getElementById("admin-artist-modal-title").innerText = "Sửa Thông Tin Nghệ Sĩ";
    document.getElementById("adm-artist-name").value = name;
    document.getElementById("adm-artist-country").value = country;
    document.getElementById("adm-artist-avatar").value = avatar;
    document.getElementById("artist-admin-modal").style.display = "flex";
};

window.submitArtist = function() {
    var name = document.getElementById("adm-artist-name").value;
    var country = document.getElementById("adm-artist-country").value;
    var avatar = document.getElementById("adm-artist-avatar").value;

    if (!name) {
        alert("Vui lòng nhập tên nghệ sĩ!");
        return;
    }

    var formData = new URLSearchParams();
    if (currentEditArtistId) formData.append("id", currentEditArtistId); 
    formData.append("name", name);
    formData.append("country", country);
    formData.append("avatar", avatar);

    var url = currentEditArtistId ? "../api/update_artist.php" : "../api/create_artist.php";

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert(data.message || "Thành công!");
            document.getElementById('artist-admin-modal').style.display='none'; 
            
            // THAY ĐỔI: Không reload trang, chỉ reset lại khối giao diện
            window.initArtistPage(); 
        } else {
            alert("Lỗi từ server: " + data.message);
        }
    })
    .catch(err => {
        console.error("Lỗi:", err);
        alert("Không thể kết nối tới server. Hãy kiểm tra lại file PHP!");
    });
};

window.deleteArtist = function(id) {
    if(confirm("Bạn có chắc chắn muốn xóa nghệ sĩ này không?")) {
        fetch("../api/delete_artist.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id=${id}`
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                // THAY ĐỔI: Không reload trang
                window.initArtistPage(); 
            } else {
                alert("Lỗi khi xóa: " + data.message);
            }
        });
    }
};
