window.initHorizontalScroll = function (wrapperSelector) {
  const wrappers = document.querySelectorAll(wrapperSelector);

  wrappers.forEach((wrapper) => {
    const container = wrapper.querySelector(".pro-container");
    const btnLeft = wrapper.querySelector(".scroll-btn.left");
    const btnRight = wrapper.querySelector(".scroll-btn.right");

    if (!container) return;

    
    container.dataset.scrollInit = "true";

    // --- LOGIC KIỂM TRA HIỆN NÚT ---
    const check = () => {
      const max = container.scrollWidth - container.clientWidth;
      const left = container.scrollLeft;

      if (btnLeft) btnLeft.style.visibility = left <= 10 ? "hidden" : "visible";
      if (btnRight)
        btnRight.style.visibility = left >= max - 10 ? "hidden" : "visible";
    };

    // --- LOGIC CLICK NÚT ---
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

    // ---  LOGIC KÉO CHUỘT (DRAG) ---
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
      check(); 
    });

    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.8;
      container.scrollLeft = scrollLeft - walk;
    });

    // --- THEO DÕI THAY ĐỔI LAYOUT ---
    container.addEventListener("scroll", check);
    const resizeObserver = new ResizeObserver(() => {
      check();
    });
    resizeObserver.observe(container);

    requestAnimationFrame(check);

    setTimeout(check, 300);
  });
};
