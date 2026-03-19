document.addEventListener("DOMContentLoaded", () => {
  // ================= FETCH DATA =================
  fetch("/Web_nghe_nhac/api/get_album.php")
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) return;

      const featuredContainer = document.getElementById("featured-album-list");
      const newContainer = document.getElementById("new-album-list");
      const allContainer = document.getElementById("all-album-list");

      if (allContainer) allContainer.innerHTML = "";
      if (featuredContainer) featuredContainer.innerHTML = "";
      if (newContainer) newContainer.innerHTML = "";

      data.albums.forEach((album) => {
        const html = `
        <div class="album-card" onclick="openAlbumModal(${album.id}, '${album.title}', '${album.artist_name}', '${album.release_year}', '${album.cover_image}')">
            <div class="album-img">
                <img src="../img/${album.cover_image}" alt="">
                <div class="album-play">
                    <i class="fa-solid fa-play"></i>
                </div>
            </div>

            <div class="album-info">
                <h5 title="${album.title}">${album.title}</h5>
                <span class="description">
                    ${album.artist_name} • ${album.release_year}
                </span>
            </div>
        </div>
        `;

        if (allContainer) allContainer.innerHTML += html;
        if (featuredContainer) featuredContainer.innerHTML += html;
        if (newContainer) newContainer.innerHTML += html;
      });

      // ================= SCROLL + DRAG =================
      setTimeout(() => {
        initScroll();
      }, 100);
    });
});

function initScroll() {
  document.querySelectorAll(".album-wrapper").forEach((wrapper) => {
    const container = wrapper.querySelector(".pro-container");
    const btnLeft = wrapper.querySelector(".scroll-btn.left");
    const btnRight = wrapper.querySelector(".scroll-btn.right");

    if (!container) return;

    // 🌟 🌟 🌟 SỬA ĐỔI: Hàm kiểm tra trạng thái cuộn để ẩn/hiện nút kịch
    function checkScrollStatus() {
      if (btnLeft && btnRight) {
        // Nếu ở đầu danh sách (scrollLeft <= 0), ẩn nút trái
        if (container.scrollLeft <= 0) {
          // Dùng visibility:hidden để nút vẫn chiếm diện tích nhưng không nhìn thấy
          btnLeft.style.visibility = "hidden"; 
        } else {
          btnLeft.style.visibility = "visible";
        }

        // Nếu ở cuối danh sách (scrollLeft + chiều rộng container >= tổng chiều rộng nội dung), ẩn nút phải
        // Chúng ta cần một chút dung sai (ví dụ 2px) vì sai số làm tròn của trình duyệt
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScrollLeft - 2) {
          btnRight.style.visibility = "hidden";
        } else {
          btnRight.style.visibility = "visible";
        }
      }
    }

    // 👉 Scroll button
    btnRight?.addEventListener("click", () => {
      // Vì JS này đã xóa scroll-behavior: smooth trong CSS,
      // ta cần ép behavior smooth ở đây để nút bấm vẫn cuộn mượt.
      container.scrollBy({ left: 400, behavior: "smooth" });
      // Sau khi cuộn xong (smooth cuộn khoảng 0.3s), ta check lại trạng thái nút
      setTimeout(checkScrollStatus, 350);
    });

    btnLeft?.addEventListener("click", () => {
      container.scrollBy({ left: -400, behavior: "smooth" });
      setTimeout(checkScrollStatus, 350);
    });

    // 🌟 🌟 🌟 THÊM MỚI: Lắng nghe sự kiện scroll trên container
    container.addEventListener("scroll", checkScrollStatus);

    // 🌟 🌟 🌟 THÊM MỚI: Gọi hàm kiểm tra lần đầu khi trang tải xong
    checkScrollStatus();

    // 👉 Drag (giữ nguyên logic drag, chỉ gộp mouseup lại)
    let isDown = false;
    let startX;
    let scrollLeft;

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
// ================= LOGIC MODAL ALBUM =================
const modal = document.getElementById("album-modal");
const closeBtn = document.querySelector(".close-album-modal");

// Đóng Modal khi bấm nút X
closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
});

// Đóng Modal khi click ra ngoài khung đen
modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("show");
});

// Hàm mở Modal và gọi API lấy bài hát
function openAlbumModal(albumId, title, artist, year, cover) {
    // 1. Gắn thông tin album vào Header của Modal
    document.getElementById("modal-album-img").src = `../img/${cover}`;
    document.getElementById("modal-album-title").innerText = title;
    document.getElementById("modal-album-artist").innerText = `${artist} • ${year}`;
    
    const songListContainer = document.getElementById("modal-song-list");
    songListContainer.innerHTML = "<p style='color:#a7a7a7;'>Đang tải bài hát...</p>";
    
    // 2. Hiện Modal lên
    modal.classList.add("show");

    // 3. Gọi API lấy danh sách bài hát 
    fetch(`/Web_nghe_nhac/api/get_albumsong.php?album_id=${albumId}`)
        .then(res => res.json())
        .then(data => {
            if (!data.success || data.songs.length === 0) {
                songListContainer.innerHTML = "<p style='color:#a7a7a7;'>Album này chưa có bài hát nào.</p>";
                return;
            }

            // Đổ danh sách bài hát ra
            songListContainer.innerHTML = "";
            data.songs.forEach((song, index) => {
                songListContainer.innerHTML += `
                    <div class="modal-song-item" onclick="playSong(${song.id})">
                        <i class="fa-solid fa-music"></i>
                        <div class="song-info">
                            <h4 style="font-size:15px; margin:0;">${song.title}</h4>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => {
            console.error(err);
            songListContainer.innerHTML = "<p style='color:red;'>Lỗi tải dữ liệu!</p>";
        });
}