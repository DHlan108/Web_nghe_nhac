// Thay vì let/const, dùng var để tránh xung đột bộ nhớ trong mô hình SPA
var currentEditId = null;
var globalSongs = [];

// =========================================================
// 1. HÀM KHỞI TẠO TRANG (Router sẽ gọi hàm này khi vào trang)
// =========================================================
window.initSongPage = function() {
    console.log("🚀 Đang khởi tạo trang Bài Hát...");
    var role = localStorage.getItem("role") || "user";

    // 1.1 Hiển thị nút Admin
    var adminTools = document.getElementById("admin-tools");
    if(role === "admin" && adminTools){
        adminTools.innerHTML = `
        <button onclick="openModal('add')" class="admin-add-btn" style="padding:25px 80px; font-size:26px; font-weight:900; margin-bottom:40px; margin-top:20px; background: linear-gradient(135deg, #40c9ff, #e81cff); color:white; border-radius:15px; box-shadow:0 10px 40px rgba(91, 111, 216, 0.6); cursor:pointer; width:100%; max-width:1000px; text-transform:uppercase; letter-spacing:1.5px; transition:all 0.3s ease; display:block; margin-left:auto; margin-right:auto;">
            <span style="color: #FF9500; font-weight: bold; margin-right: 8px;">+</span> Thêm bài hát mới
        </button>`;
    }

    // 1.2 Fetch dữ liệu bài hát
    fetch("../api/get_song.php")
    .then(res => res.json())
    .then(data => {
        globalSongs = data; 
        refreshSongDisplay(globalSongs, role); // Truyền role vào để render

        // 1.3 Kích hoạt tìm kiếm
        if (typeof window.MusicSearchEngine !== 'undefined') {
            window.MusicSearchEngine.initGlobalSearch((keyword) => {
                var featuredSection = document.getElementById("featured-songs");
                var newSection = document.getElementById("new-songs");
                var allList = document.getElementById("all-list");

                if (keyword.trim() !== "") {
                    // Tự động cuộn xuống
                    if(typeof scrollToSection === 'function') scrollToSection('all-songs');
                    // Ẩn các phần không liên quan
                    if(featuredSection) featuredSection.style.display = "none";
                    if(newSection) newSection.style.display = "none";
                } else {
                    if(featuredSection) featuredSection.style.display = "block";
                    if(newSection) newSection.style.display = "block";
                }

                // Lọc và render lại
                var filtered = window.MusicSearchEngine.process(globalSongs, { keyword: keyword });
                if(allList) allList.innerHTML = filtered.map(s => createSong(s, role)).join('');
            });
        }
    })
    .catch(err => console.error("❌ Lỗi Fetch dữ liệu:", err));
};

// =========================================================
// 2. CÁC HÀM RENDER & LOGIC (Gắn vào window để HTML gọi được)
// =========================================================

window.createSong = function(song, role) {
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
                ${role === "admin" ? `
                <div class="admin-btn-row">
                    <button class="btn-edit">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
                ` : ""}
            </div>
        </div>
    </div>
    `;
};

// HÀM: Dùng ID để tìm dữ liệu và phát nhạc
window.playSongFromList = function(id) {
    // globalSongs đã được fetch ở đầu file
    var song = globalSongs.find(s => s.id == id);
    if (song) {
        console.log("Đang phát nhạc:", song.title);
        window.playSongDirectly(song.title, song.artist_name, '../' + song.file_path, '../img/' + song.image_path);
    }
};

window.refreshSongDisplay = function(data, role) {
    var featured = document.getElementById("featured-list");
    var newsong = document.getElementById("new-list");
    var allsong = document.getElementById("all-list");

    var hotData = [];
    var newData = [];

    if (typeof window.MusicSearchEngine !== 'undefined') {
        hotData = window.MusicSearchEngine.process(data, { sortBy: 'hot', limit: 6 });
        newData = window.MusicSearchEngine.process(data, { sortBy: 'new', limit: 6 });
    } else {
        hotData = data.slice(0, 6);
        newData = data.slice(0, 6);
    }

    if(featured) featured.innerHTML = hotData.map(s => createSong(s, role)).join('');
    if(newsong) newsong.innerHTML = newData.map(s => createSong(s, role)).join('');
    if(allsong) allsong.innerHTML = data.map(s => createSong(s, role)).join('');

    // ===== EVENT DELEGATION =====
    [featured, newsong, allsong].forEach(container => {
        if (!container) return;

        container.onclick = function(e) {
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
                var song = globalSongs.find(s => s.id == id);
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

window.deleteSong = function(id) {
    if(confirm("Bạn có chắc muốn xóa không?")){
        fetch("../api/delete_song.php",{
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "id=" + id
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            // THAY ĐỔI QUAN TRỌNG: Không reload trang, chỉ gọi lại hàm khởi tạo
            window.initSongPage(); 
        });
    }
};

window.openModal = function(mode, song = null) {
    document.getElementById("song-modal").style.display = "flex";

    if(mode === "add"){
        currentEditId = null;
        document.getElementById("modal-title").innerText = "Thêm bài hát";
        document.getElementById("song-title").value = "";
        document.getElementById("song-artist").value = "";
        document.getElementById("song-file").value = "";
        document.getElementById("song-album").value = "";
        document.getElementById("song-image").value = "";
        document.getElementById("song-date").value = "";
    }

    if(mode === "edit"){
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

window.closeModal = function() {
    document.getElementById("song-modal").style.display = "none";
};

window.submitSong = function() {
    var title = document.getElementById("song-title").value;
    var artist_id = document.getElementById("song-artist").value;
    var album_id = document.getElementById("song-album").value.trim();
    var file_path = document.getElementById("song-file").value;
    var image_path = document.getElementById("song-image").value;
    var release_date = document.getElementById("song-date").value;
    
    var url = "";
    var body = "";
    
    if(currentEditId){
        url = "../api/update_song.php";
        body = `id=${currentEditId}&title=${encodeURIComponent(title)}&artist_id=${artist_id}&album_id=${album_id !== "" ? album_id : ""}&release_date=${release_date}`;
    } else {
        url = "../api/song_create.php";
        body = `title=${encodeURIComponent(title)}&artist_id=${artist_id}&album_id=${album_id !== "" ? album_id : ""}&file_path=${encodeURIComponent(file_path)}&image_path=${encodeURIComponent(image_path)}&release_date=${release_date}`;
    }
    
    fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/x-www-form-urlencoded"},
        body: body
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if(data.success){
            closeModal();
            // THAY ĐỔI QUAN TRỌNG: Gọi lại hàm render thay vì reload trang
            window.initSongPage(); 
        }
    });
};