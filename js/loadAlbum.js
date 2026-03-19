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
        <div class="album-card">
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
    
    // 🌟 🌟 🌟 SỬA ĐỔI: Gộp isDown = false và checkScrollStatus khi mouseup xong
    container.addEventListener("mouseup", () => {
      isDown = false;
      // Thêm một chút delay để scroll bar kịp cập nhật giá trị scrollLeft sau khi kéo thả xong
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
