document.addEventListener("DOMContentLoaded", () => {
  fetch("/Web_nghe_nhac/api/get_album.php")
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) return;

      const featuredContainer = document.getElementById("featured-album-list");
      const newContainer = document.getElementById("new-album-list");
      const allContainer = document.getElementById("all-album-list");
      
      if(allContainer) allContainer.innerHTML = "";
      if(featuredContainer) featuredContainer.innerHTML = "";
      if(newContainer) newContainer.innerHTML = "";

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
                    <span class="description" title="${album.artist_name} • ${album.release_year}">
                        ${album.artist_name} • ${album.release_year}
                    </span>
            </div>

        </div>
        `;

        if(allContainer) allContainer.innerHTML += html;
        // Tạm thời đổ chung data vào Nổi bật và Mới ra để test giao diện (bạn có thể xóa nếu API tách riêng)
        if(featuredContainer) featuredContainer.innerHTML += html;
        if(newContainer) newContainer.innerHTML += html;
      });
    });
});
