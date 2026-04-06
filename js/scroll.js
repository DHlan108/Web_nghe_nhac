window.initHorizontalScroll = function (wrapperSelector) {
  document.querySelectorAll(wrapperSelector).forEach((wrapper) => {
    const container = wrapper.querySelector(".pro-container");
    const btnLeft = wrapper.querySelector(".scroll-btn.left");
    const btnRight = wrapper.querySelector(".scroll-btn.right");

    if (!container) return;

    if (container.dataset.scrollInit === "true") return;
    container.dataset.scrollInit = "true";

    const check = () => {
      const max = container.scrollWidth - container.clientWidth;
      const left = container.scrollLeft;

      if (btnLeft) btnLeft.style.visibility = left <= 5 ? "hidden" : "visible";
      if (btnRight)
        btnRight.style.visibility = left >= max - 5 ? "hidden" : "visible";
    };

    // BUTTON
    if (btnRight)
      btnRight.onclick = () => {
        container.scrollBy({ left: 400, behavior: "smooth" });
        setTimeout(check, 350);
      };

    if (btnLeft)
      btnLeft.onclick = () => {
        container.scrollBy({ left: -400, behavior: "smooth" });
        setTimeout(check, 350);
      };

    // SCROLL
    container.addEventListener("scroll", check);
    // DRAG
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
      setTimeout(check, 50);
    });

    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.8; //
      container.scrollLeft = scrollLeft - walk;
    });

    // ===== INIT =====
    setTimeout(check, 100); // 👉 fix render chưa xong
  });
};
