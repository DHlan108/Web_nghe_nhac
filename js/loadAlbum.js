document.addEventListener("DOMContentLoaded", () => {

fetch("../api/get_album.php")

.then(res => res.json())

.then(data => {

    if(!data.success) return;

    const container = document.getElementById("album-container");

    data.albums.forEach(album => {

        const html = `
        <div class="pro">

            <div class="img-box">
                <img src="../img/${album.cover}" alt="">
                <div class="play">
                    <i class="fa-solid fa-play"></i>
                </div>
            </div>

            <div class="des">
                <h5>${album.title}</h5>
                <span>${album.artist}</span>
                <small>${album.release_year}</small>
            </div>

        </div>
        `;

        container.innerHTML += html;

    });

});

});