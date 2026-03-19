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

    // 👉 Scroll button
    btnRight?.addEventListener("click", () => {
      container.scrollBy({ left: 400, behavior: "smooth" });
    });

    btnLeft?.addEventListener("click", () => {
      container.scrollBy({ left: -400, behavior: "smooth" });
    });

    // 👉 Drag
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener("mouseleave", () => (isDown = false));
    container.addEventListener("mouseup", () => (isDown = false));

    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
  });
}
