fetch("../api/get_artist.php")
.then(res => res.json())
.then(data => {

    if(!data.success) return;
    const container = document.getElementById("artist-container");
    data.artists.forEach(artist => {

        const html = `
            <div class="artist-card" onclick="loadArtistSongs(${artist.id},'${artist.name}')">

                <div class="artist-img">
                    <img src="../img/${artist.avatar}">
                </div>

                <div class="artist-info">
                    <h5>${artist.name}</h5>
                    <span>${artist.country}</span>
                </div>

            </div>
            `;

        container.innerHTML += html;

    });

});
function loadArtistSongs(id, name) {
    document.getElementById("artist-name").innerText = "Bài hát của " + name;

    fetch("../api/get_artistsong.php?id=" + id)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("song-container");
            container.innerHTML = ""; // Xóa nội dung cũ

            if (!data.songs || data.songs.length === 0) {
                container.innerHTML = "<p>Nghệ sĩ này chưa có bài hát.</p>";
                return;
            }

            data.songs.forEach(song => {
                // Tách lấy năm từ chuỗi 2024-09-27 thành 2024
                const year = song.release_date ? song.release_date.split('-')[0] : "";

                const html = `
                    <div class="pro">
                        <div class="img-box">
                            <img src="../img/${song.image_path}" alt="${song.title}">
                            <div class="play">
                                <i class="fa-solid fa-play"></i>
                            </div>
                        </div>
                        <div class="des">
                            <h5>${song.title}</h5>
                            <small>${year}</small>
                        </div>
                    </div>
                `;
                container.innerHTML += html;
            });
        })
        .catch(err => console.error("Lỗi fetch bài hát:", err));
}