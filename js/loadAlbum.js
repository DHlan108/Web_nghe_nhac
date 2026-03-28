let globalAlbums = [];
// 1. Khai báo role và biến tạm ngay đầu file
const role = localStorage.getItem("role") || "user";
let currentEditAlbumId = null;

document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.querySelector(".close-album-modal");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeAlbumModal);
    }

    // Đóng khi click ra ngoài vùng modal
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("album-modal");
        const adminModal = document.getElementById("album-admin-modal");
        if (e.target === modal) {
            closeAlbumModal();
        }
        if (e.target === adminModal) {
            closeAlbumModalAdmin();
        }
    });
   fetch("/Web_nghe_nhac/api/get_album.php")
        .then((res) => res.json())
        .then((data) => {
            if (!data.success) return;
            globalAlbums = data.albums; // Lưu vào kho để tìm kiếm

            // --- BẮT ĐẦU PHẦN SỬA ---
            // 1. Kết nối bộ máy tìm kiếm (search.js)
            // 1. Kết nối bộ máy tìm kiếm (search.js)
    if (typeof MusicSearchEngine !== 'undefined') {
        MusicSearchEngine.initGlobalSearch((keyword) => {
            const isTyping = keyword.trim() !== ""; // Kiểm tra xem có đang gõ không
            const filtered = MusicSearchEngine.process(globalAlbums, { keyword: keyword });
            
            // Truyền filtered và trạng thái isTyping vào hàm vẽ
            refreshAlbumDisplay(filtered, isTyping);
            
            // ĐÃ BỎ lệnh window.scrollTo ở đây để tối ưu trải nghiệm
        });
    }

            // 2. Hiển thị dữ liệu ban đầu
            refreshAlbumDisplay(globalAlbums);
            // --- KẾT THÚC PHẦN SỬA ---

            // === Giữ nguyên đoạn hiện nút "Thêm Album" cho Admin bên dưới của cậu ===
            if (role === "admin") {
                const firstSection = document.querySelector('.album-section');
                if (firstSection && !document.querySelector('.admin-add-btn-main')) {
                    const btnAdd = `<button class="admin-add-btn-main" onclick="openAlbumModalAdmin('add')"><i class="fa-solid fa-plus"></i> Thêm Album</button>`;
                    firstSection.insertAdjacentHTML('afterbegin', btnAdd);
                }
            }
            setTimeout(() => { initScroll(); }, 100);
        })
        .catch((err) => {
            console.error("Lỗi khi tải album:", err);
        });
});
// ================= LOGIC CUỘN & DRAG (GIỮ NGUYÊN 100% CỦA NHÓM) =================
function initScroll() {
    document.querySelectorAll(".album-wrapper").forEach((wrapper) => {
        const container = wrapper.querySelector(".pro-container");
        const btnLeft = wrapper.querySelector(".scroll-btn.left");
        const btnRight = wrapper.querySelector(".scroll-btn.right");

        if (!container) return;

        function checkScrollStatus() {
            if (btnLeft && btnRight) {
                btnLeft.style.visibility = container.scrollLeft <= 0 ? "hidden" : "visible";
                const maxScrollLeft = container.scrollWidth - container.clientWidth;
                btnRight.style.visibility = container.scrollLeft >= maxScrollLeft - 2 ? "hidden" : "visible";
            }
        }

        btnRight?.addEventListener("click", () => {
            container.scrollBy({ left: 400, behavior: "smooth" });
            setTimeout(checkScrollStatus, 350);
        });

        btnLeft?.addEventListener("click", () => {
            container.scrollBy({ left: -400, behavior: "smooth" });
            setTimeout(checkScrollStatus, 350);
        });

        container.addEventListener("scroll", checkScrollStatus);
        checkScrollStatus();

        let isDown = false; let startX; let scrollLeft;
        container.addEventListener("mousedown", (e) => {
            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        container.addEventListener("mouseleave", () => (isDown = false));
        container.addEventListener("mouseup", () => {
            isDown = false;
            setTimeout(checkScrollStatus, 50);
        });
        container.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    });
}

// ================= OPEN MODAL CHI TIẾT ALBUM (GIỮ NGUYÊN CỦA NHÓM) =================
function openAlbumModal(albumId, title, artist, year, cover) {
    const modal = document.getElementById("album-modal");
    if (!modal) return;

    document.getElementById("modal-album-img").src = `../img/${cover}`;
    document.getElementById("modal-album-title").innerText = title;
    document.getElementById("modal-album-artist").innerText = `${artist} • ${year}`;

    const songListContainer = document.getElementById("modal-song-list");
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
                    <div class="modal-song-item" onclick="playSong(${song.id})">
                        <i class="fa-solid fa-music"></i>
                        <div class="song-info"><h4>${song.title}</h4></div>
                    </div>`;
            });
        });
}

function closeAlbumModal() {
    const modal = document.getElementById("album-modal");
    if (modal) {
        modal.classList.remove("show"); // Gỡ bỏ class show để ẩn modal
    }
}

// ================= CÁC HÀM ADMIN MỚI (BỔ SUNG) =================

function openAlbumModalAdmin(mode) {
    if (mode === 'add') {
        currentEditAlbumId = null; // Xóa ID cũ nếu có
        document.getElementById("admin-modal-title").innerText = "Thêm Album";
        // Xóa sạch dữ liệu cũ trong form
        document.getElementById("adm-album-title").value = "";
        document.getElementById("adm-album-artist").value = "";
        document.getElementById("adm-album-year").value = "";
        document.getElementById("adm-album-image").value = "";
        
        document.getElementById("album-admin-modal").style.display = "flex";
    }
}

function closeAlbumModalAdmin() {
    document.getElementById("album-admin-modal").style.display = "none";
}

function submitAlbum() {
    // 1. Lấy dữ liệu từ Form
    const id = currentEditAlbumId; 
    const title = document.getElementById('adm-album-title').value.trim();
    const artist_id = document.getElementById('adm-album-artist').value.trim();
    const release_year = document.getElementById('adm-album-year').value.trim();
    const cover_image = document.getElementById('adm-album-image').value.trim();

    // 2. Kiểm tra dữ liệu đầu vào
    if (!title || !artist_id) {
        alert("Vui lòng nhập đầy đủ tên và ID nghệ sĩ!");
        return;
    }

    // 3. Đóng gói dữ liệu (Dùng URLSearchParams cho chuẩn với headers bên dưới)
    const params = new URLSearchParams();
    if (id) params.append('id', id); 
    params.append('title', title);
    params.append('artist_id', artist_id);
    params.append('release_year', release_year);
    params.append('cover_image', cover_image);

    // 4. Xác định URL (Nếu không có id thì CHẮC CHẮN là create)
    const url = id ? "../api/update_album.php" : "../api/create_album.php";

    console.log("Gửi dữ liệu tới:", url, "Data:", params.toString());

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    })
    .then(res => {
        // Kiểm tra xem phản hồi có ok không (tránh lỗi 500/404)
        if (!res.ok) throw new Error("Server trả về lỗi " + res.status);
        return res.json();
    })
    .then(result => {
        if (result && result.success) {
            alert(result.message || "Thao tác thành công!");
            closeAlbumModalAdmin();
            location.reload(); 
        } else {
            // Nếu result undefined hoặc success = false
            alert("Lỗi: " + (result ? result.message : "Phản hồi từ server trống"));
        }
    })
    .catch(error => {
        console.error('Chi tiết lỗi:', error);
        alert("Có lỗi xảy ra! Hãy kiểm tra tab Network để xem file PHP có lỗi cú pháp không.");
    });
}

function prepareEditAlbum(id, title, artistId, year, image) {
    currentEditAlbumId = id; // Gán ID để biết là đang sửa
    
    // Đổi tiêu đề modal
    document.getElementById("admin-modal-title").innerText = "Chỉnh sửa Album";
    
    // Điền dữ liệu vào các ô input
    document.getElementById("adm-album-title").value = title;
    document.getElementById("adm-album-artist").value = artistId;
    document.getElementById("adm-album-year").value = year;
    document.getElementById("adm-album-image").value = image;
    
    // Hiển thị modal
    document.getElementById("album-admin-modal").style.display = "flex";
}
function deleteAlbum(id) {

    if (confirm("Bạn có chắc chắn muốn xóa album này?")) {
        fetch("../api/delete_album.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id=${id}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) location.reload();
            else alert("Lỗi khi xóa!");
        });
    }
}
function refreshAlbumDisplay(data, isSearching = false) {
    const featuredSec = document.getElementById("featured-albums");
    const newSec = document.getElementById("new-albums");
    const allList = document.getElementById("all-album-list");

    if (isSearching) {
        // KHI TÌM KIẾM: Ẩn toàn bộ các mục phụ, chỉ hiện mục Tất cả
        if (featuredSec) featuredSec.style.display = "none";
        if (newSec) newSec.style.display = "none";
    } else {
        // KHI BÌNH THƯỜNG: Hiện lại và chia 6 bài
        if (featuredSec) featuredSec.style.display = "block";
        if (newSec) newSec.style.display = "block";

        const hotData = MusicSearchEngine.process(data, { sortBy: 'hot', limit: 6 });
        const newData = MusicSearchEngine.process(data, { sortBy: 'new', limit: 6 });

        document.getElementById("featured-album-list").innerHTML = hotData.map(createAlbumHTML).join('');
        document.getElementById("new-album-list").innerHTML = newData.map(createAlbumHTML).join('');
    }

    // Mục Tất cả luôn hiển thị kết quả khớp với dữ liệu truyền vào
    if (allList) allList.innerHTML = data.map(createAlbumHTML).join('');
    
    setTimeout(initScroll, 150);
}
function createAlbumHTML(album) {
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
}
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 100, // Trừ đi khoảng cách Navbar
            behavior: "smooth"
        });
    }

}