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

            const featuredContainer = document.getElementById("featured-album-list");
            const newContainer = document.getElementById("new-album-list");
            const allContainer = document.getElementById("all-album-list");

            // Reset nội dung cũ
            if (allContainer) allContainer.innerHTML = "";
            if (featuredContainer) featuredContainer.innerHTML = "";
            if (newContainer) newContainer.innerHTML = "";

           data.albums.forEach((album) => {
            // SỬA LỖI 2 & 3: Dùng class admin-controls thống nhất với CSS và truyền ID nghệ sĩ đúng cách
              const html = `
            <div class="album-card" onclick="openAlbumModal(${album.id}, '${album.title.replace(/'/g, "\\'")}', '${album.artist_name.replace(/'/g, "\\'")}', '${album.release_year}', '${album.cover_image}')">
            <div class="album-img">
            <img src="../img/${album.cover_image}" alt="${album.title}">
            <div class="album-play">
                <i class="fa-solid fa-play"></i>
            </div>

            ${role === "admin" ? `
            <div class="admin-controls">
                <button class="btn-edit" onclick="event.stopPropagation(); prepareEditAlbum(${album.id}, '${album.title.replace(/'/g, "\\'")}', ${album.artist_id}, '${album.release_year}', '${album.cover_image}')">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn-delete" onclick="event.stopPropagation(); deleteAlbum(${album.id})">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
            ` : ""}
        </div>

        <div class="album-info">
            <h5 title="${album.title}">${album.title}</h5>
            <span class="description">${album.artist_name} • ${album.release_year}</span>
        </div>
    </div>`;

            if (allContainer) allContainer.innerHTML += html;
            if (newContainer) newContainer.innerHTML += html;
            if (featuredContainer) featuredContainer.innerHTML += html;
            });

            // === TÍNH NĂNG MỚI: CHÈN NÚT "THÊM ALBUM" CHO ADMIN ===
            if (role === "admin") {
            const firstSection = document.querySelector('.album-section');
            // Chỉ chèn nếu TRÊN TRANG CHƯA CÓ nút này
            if (firstSection && !document.querySelector('.admin-add-btn-main')) {
            firstSection.style.position = 'relative';
            const btnAdd = `
            <button class="admin-add-btn-main" onclick="openAlbumModalAdmin('add')">
                <i class="fa-solid fa-plus"></i> Thêm Album
            </button>`;
            firstSection.insertAdjacentHTML('afterbegin', btnAdd);
    }
}

            // Khởi tạo scroll sau khi load xong (Logic của nhóm)
            setTimeout(() => {
                initScroll();
            }, 100);
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
    const id = currentEditAlbumId;
    const title = document.getElementById('adm-album-title').value;
    const artist_id = document.getElementById('adm-album-artist').value;
    const release_year = document.getElementById('adm-album-year').value;
    const cover_image = document.getElementById('adm-album-image').value;

    if (!title || !artist_id) {
        alert("Vui lòng nhập đầy đủ tên và ID nghệ sĩ!");
        return;
    }

    const params = new URLSearchParams();
    if (id) params.append('id', id); // Gửi ID để PHP biết là Update
    params.append('title', title);
    params.append('artist_id', artist_id);
    params.append('release_year', release_year);
    params.append('cover_image', cover_image);

    // SỬA TẠI ĐÂY: Đổi từ edit_album.php thành update_album.php
    const url = id ? "../api/update_album.php" : "../api/create_album.php";

    console.log("Đang gọi API:", url, "với ID:", id);

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    })
    .then(res => {
        // Kiểm tra xem phản hồi có phải là JSON không
        return res.json();
    })
    .then(result => {
        if (result.success) {
            alert(result.message);
            closeAlbumModalAdmin();
            location.reload(); // Tải lại trang để cập nhật giao diện
        } else {
            alert("Lỗi từ Server: " + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Không thể kết nối tới update_album.php. Kiểm tra lại đường dẫn file!");
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