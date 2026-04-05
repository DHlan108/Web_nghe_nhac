// Khai báo biến toàn cục bằng var để tránh xung đột
var globalAlbums = [];
var currentEditAlbumId = null;

// =========================================================
// 1. HÀM KHỞI TẠO TRANG ALBUM (Được gọi từ Router)
// =========================================================
window.initAlbumPage = function() {
    console.log("🚀 Đang khởi tạo trang Album...");
    var role = localStorage.getItem("role") || "user";

    // Xử lý đóng modal khi click nút X
    var closeBtn = document.querySelector(".close-album-modal");
    if (closeBtn) {
        closeBtn.onclick = window.closeAlbumModal;
    }

    // Xử lý đóng modal khi click ra ngoài (Dùng onclick để không bị chồng chéo event trong SPA)
    window.onclick = function(e) {
        var modal = document.getElementById("album-modal");
        var adminModal = document.getElementById("album-admin-modal");
        if (e.target === modal) window.closeAlbumModal();
        if (e.target === adminModal) window.closeAlbumModalAdmin();
    };

    fetch("/Web_nghe_nhac/api/get_album.php")
        .then(res => res.json())
        .then(data => {
            if (!data.success) return;
            globalAlbums = data.albums; 

            // Kích hoạt thanh tìm kiếm
            if (typeof window.MusicSearchEngine !== 'undefined') {
                window.MusicSearchEngine.initGlobalSearch((keyword) => {
                    var isTyping = keyword.trim() !== ""; 
                    var filtered = window.MusicSearchEngine.process(globalAlbums, { keyword: keyword });
                    window.refreshAlbumDisplay(filtered, isTyping, role);
                });
            }

            // Hiển thị dữ liệu ban đầu
            window.refreshAlbumDisplay(globalAlbums, false, role);

            // Gắn nút Thêm Album cho Admin
            if (role === "admin") {
                var holder = document.getElementById('admin-btn-holder');
                if (holder && !document.querySelector('.admin-add-btn-main')) {
                    var btnAdd = `<button class="admin-add-btn-main" onclick="openAlbumModalAdmin('add')"><i class="fa-solid fa-plus"></i> Thêm Album</button>`;
                    holder.innerHTML = btnAdd;
                }
            }
            
            setTimeout(() => { window.initScroll(); }, 100);
        })
        .catch(err => console.error("Lỗi khi tải album:", err));
};

// ================= LOGIC CUỘN & DRAG =================
window.initScroll = function() {
    document.querySelectorAll(".album-wrapper").forEach((wrapper) => {
        var container = wrapper.querySelector(".pro-container");
        var btnLeft = wrapper.querySelector(".scroll-btn.left");
        var btnRight = wrapper.querySelector(".scroll-btn.right");

        if (!container) return;

        function checkScrollStatus() {
            if (btnLeft && btnRight) {
                btnLeft.style.visibility = container.scrollLeft <= 0 ? "hidden" : "visible";
                var maxScrollLeft = container.scrollWidth - container.clientWidth;
                btnRight.style.visibility = container.scrollLeft >= maxScrollLeft - 2 ? "hidden" : "visible";
            }
        }

        // Xóa event listener cũ nếu có (bằng cách clone node hoặc ghi đè onclick)
        if(btnRight) btnRight.onclick = () => {
            container.scrollBy({ left: 400, behavior: "smooth" });
            setTimeout(checkScrollStatus, 350);
        };

        if(btnLeft) btnLeft.onclick = () => {
            container.scrollBy({ left: -400, behavior: "smooth" });
            setTimeout(checkScrollStatus, 350);
        };

        container.onscroll = checkScrollStatus;
        checkScrollStatus();

        var isDown = false; var startX; var scrollLeft;
        container.onmousedown = (e) => {
            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        };
        container.onmouseleave = () => (isDown = false);
        container.onmouseup = () => {
            isDown = false;
            setTimeout(checkScrollStatus, 50);
        };
        container.onmousemove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            var x = e.pageX - container.offsetLeft;
            var walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        };
    });
};

// ================= OPEN MODAL CHI TIẾT ALBUM =================
window.openAlbumModal = function(albumId, title, artist, year, cover) {
    var modal = document.getElementById("album-modal");
    if (!modal) return;

    document.getElementById("modal-album-img").src = `../img/${cover}`;
    document.getElementById("modal-album-title").innerText = title;
    document.getElementById("modal-album-artist").innerText = `${artist} • ${year}`;

    var songListContainer = document.getElementById("modal-song-list");
    songListContainer.innerHTML = "<p style='color:#a7a7a7;'>Đang tải bài hát...</p>";

    modal.classList.add("show");

    fetch(`/Web_nghe_nhac/api/get_albumsong.php?album_id=${albumId}`)
        .then(res => res.json())
        .then(data => {
            songListContainer.innerHTML = "";
            if (!data.success || data.songs.length === 0) {
                songListContainer.innerHTML = "<p style='color:#a7a7a7;'>Album trống.</p>";
                return;
            }
            data.songs.forEach((song) => {
                songListContainer.innerHTML += `
                    <div class="modal-song-item" onclick="playSongDirectly('${song.title.replace(/'/g, "\\'")}', '${artist.replace(/'/g, "\\'")}', '../${song.file_path}', '../img/${cover}')">
                        <i class="fa-solid fa-music"></i>
                        <div class="song-info"><h4>${song.title}</h4></div>
                    </div>`;
            });
        });
};

window.closeAlbumModal = function() {
    var modal = document.getElementById("album-modal");
    if (modal) modal.classList.remove("show"); 
};

// ================= CÁC HÀM ADMIN =================
window.openAlbumModalAdmin = function(mode) {
    if (mode === 'add') {
        currentEditAlbumId = null; 
        document.getElementById("admin-modal-title").innerText = "Thêm Album";
        document.getElementById("adm-album-title").value = "";
        document.getElementById("adm-album-artist").value = "";
        document.getElementById("adm-album-year").value = "";
        document.getElementById("adm-album-image").value = "";
        
        document.getElementById("album-admin-modal").style.display = "flex";
    }
};

window.closeAlbumModalAdmin = function() {
    document.getElementById("album-admin-modal").style.display = "none";
};

window.submitAlbum = function() {
    var id = currentEditAlbumId; 
    var title = document.getElementById('adm-album-title').value.trim();
    var artist_id = document.getElementById('adm-album-artist').value.trim();
    var release_year = document.getElementById('adm-album-year').value.trim();
    var cover_image = document.getElementById('adm-album-image').value.trim();

    if (!title || !artist_id) {
        alert("Vui lòng nhập đầy đủ tên và ID nghệ sĩ!");
        return;
    }

    var params = new URLSearchParams();
    if (id) params.append('id', id); 
    params.append('title', title);
    params.append('artist_id', artist_id);
    params.append('release_year', release_year);
    params.append('cover_image', cover_image);

    var url = id ? "../api/update_album.php" : "../api/create_album.php";

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    })
    .then(res => {
        if (!res.ok) throw new Error("Server trả về lỗi " + res.status);
        return res.json();
    })
    .then(result => {
        if (result && result.success) {
            alert(result.message || "Thao tác thành công!");
            window.closeAlbumModalAdmin();
            // THAY ĐỔI: Không reload trang, khởi tạo lại Album
            window.initAlbumPage(); 
        } else {
            alert("Lỗi: " + (result ? result.message : "Phản hồi từ server trống"));
        }
    })
    .catch(error => {
        console.error('Chi tiết lỗi:', error);
        alert("Có lỗi xảy ra! Hãy kiểm tra tab Network.");
    });
};

window.prepareEditAlbum = function(id, title, artistId, year, image) {
    currentEditAlbumId = id; 
    document.getElementById("admin-modal-title").innerText = "Chỉnh sửa Album";
    document.getElementById("adm-album-title").value = title;
    document.getElementById("adm-album-artist").value = artistId;
    document.getElementById("adm-album-year").value = year;
    document.getElementById("adm-album-image").value = image;
    document.getElementById("album-admin-modal").style.display = "flex";
};

window.deleteAlbum = function(id) {
    if (confirm("Bạn có chắc chắn muốn xóa album này?")) {
        fetch("../api/delete_album.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id=${id}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // THAY ĐỔI: Không reload trang
                window.initAlbumPage(); 
            } else {
                alert("Lỗi khi xóa!");
            }
        });
    }
};

window.refreshAlbumDisplay = function(data, isSearching = false, role) {
    var featuredSec = document.getElementById("featured-albums");
    var newSec = document.getElementById("new-albums");
    var allList = document.getElementById("all-album-list");

    if (isSearching) {
        if (featuredSec) featuredSec.style.display = "none";
        if (newSec) newSec.style.display = "none";
    } else {
        if (featuredSec) featuredSec.style.display = "block";
        if (newSec) newSec.style.display = "block";
        
        var hotData = [];
        var newData = [];

    // Kiểm tra xem MusicSearchEngine đã load chưa, nếu chưa thì fallback mặc định
        if (typeof window.MusicSearchEngine !== 'undefined') {
            hotData = window.MusicSearchEngine.process(data, { sortBy: 'hot', limit: 6 });
            newData = window.MusicSearchEngine.process(data, { sortBy: 'new', limit: 6 });
        } else {
            // Backup an toàn: lấy 6 album ngẫu nhiên/đầu tiên để tránh bị trống
            hotData = data.slice(0, 6);
            newData = data.slice(0, 6);
        }

        var featuredList = document.getElementById("featured-album-list");
        var newList = document.getElementById("new-album-list");

            if(featuredList) featuredList.innerHTML = hotData.map(a => window.createAlbumHTML(a, role)).join('');
            if(newList) newList.innerHTML = newData.map(a => window.createAlbumHTML(a, role)).join('');
        }

    if (allList) allList.innerHTML = data.map(a => window.createAlbumHTML(a, role)).join('');
    setTimeout(window.initScroll, 150);
};

window.createAlbumHTML = function(album, role) {
    return `
    <div class="album-card" onclick="openAlbumModal(${album.id}, '${album.title.replace(/'/g, "\\'")}', '${album.artist_name.replace(/'/g, "\\'")}', '${album.release_year}', '${album.cover_image}')">
        <div class="album-img">
            <img src="../img/${album.cover_image}" alt="${album.title}">
            <div class="album-play"><i class="fa-solid fa-play"></i></div>
            ${role === "admin" ? `
            <div class="admin-controls">
                <button class="btn-edit" onclick="event.stopPropagation(); prepareEditAlbum(${album.id}, '${album.title.replace(/'/g, "\\'")}', ${album.artist_id}, '${album.release_year}', '${album.cover_image}')">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn-delete" onclick="event.stopPropagation(); deleteAlbum(${album.id})">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>` : ""}
        </div>
        <div class="album-info">
            <h5 title="${album.title}">${album.title}</h5>
            <span class="description">${album.artist_name} • ${album.release_year}</span>
        </div>
    </div>`;
};

window.scrollToSection = function(id) {
    var section = document.getElementById(id);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 100,
            behavior: "smooth"
        });
    }
};