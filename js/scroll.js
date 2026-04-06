window.initHorizontalScroll = function (wrapperSelector) {
  const wrappers = document.querySelectorAll(wrapperSelector);

  wrappers.forEach((wrapper) => {
    const container = wrapper.querySelector(".pro-container");
    const btnLeft = wrapper.querySelector(".scroll-btn.left");
    const btnRight = wrapper.querySelector(".scroll-btn.right");

    if (!container) return;

    // Đánh dấu đã init để tránh lặp (cho SPA)
    container.dataset.scrollInit = "true";

    // --- 1. LOGIC KIỂM TRA HIỆN NÚT ---
    const check = () => {
      const max = container.scrollWidth - container.clientWidth;
      const left = container.scrollLeft;

      // Dùng độ lệch 10px để tính toán chính xác hơn trên các trình duyệt khác nhau
      if (btnLeft) btnLeft.style.visibility = left <= 10 ? "hidden" : "visible";
      if (btnRight)
        btnRight.style.visibility = left >= max - 10 ? "hidden" : "visible";
    };

    // --- 2. LOGIC CLICK NÚT ---
    if (btnRight) {
      btnRight.onclick = (e) => {
        e.preventDefault();
        container.scrollBy({ left: 400, behavior: "smooth" });
      };
    }

    if (btnLeft) {
      btnLeft.onclick = (e) => {
        e.preventDefault();
        container.scrollBy({ left: -400, behavior: "smooth" });
      };
    }

    // --- 3. LOGIC KÉO CHUỘT (DRAG) ---
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener("mousedown", (e) => {
      isDown = true;
      container.classList.add("dragging");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener("mouseleave", () => {
      isDown = false;
      container.classList.remove("dragging");
    });

    container.addEventListener("mouseup", () => {
      isDown = false;
      container.classList.remove("dragging");
      check(); // Kiểm tra lại nút sau khi thả chuột
    });

    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.8;
      container.scrollLeft = scrollLeft - walk;
    });

    // --- 4. THEO DÕI THAY ĐỔI LAYOUT (QUAN TRỌNG NHẤT) ---
    container.addEventListener("scroll", check);

    // Theo dõi khi nội dung bên trong thay đổi (do API đổ dữ liệu vào chậm)
    const resizeObserver = new ResizeObserver(() => {
      check();
    });
    resizeObserver.observe(container);

    // Chạy lần đầu tiên ngay khi render xong nhịp đầu
    requestAnimationFrame(check);

    // Backup thêm một lần nữa sau 300ms đề phòng ảnh tải chậm
    setTimeout(check, 300);
  });
};
