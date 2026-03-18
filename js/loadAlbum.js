document.addEventListener("DOMContentLoaded", () => {
  fetch("/Web_nghe_nhac/api/get_album.php")
    .then((res) => res.json())

    .then((data) => {
      if (!data.success) return;

      const container = document.getElementById("all-album-list");

      data.albums.forEach((album) => {
        const html = `
        <div class="pro">

            <div class="img-box">
                <img src="../img/${album.cover_image}" alt="">
                <div class="play">
                    <i class="fa-solid fa-play"></i>
                </div>
            </div>

            <div class="des">
                <h5>${album.title}</h5>
                <span>${album.artist_name}</span>
                <small>${album.release_year}</small>
            </div>

        </div>
        `;

        container.innerHTML += html;
      });
    });
});
