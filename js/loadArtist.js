fetch("../api/get_artist.php")
.then(res => res.json())
.then(data => {

    if(!data.success) return;
    const container = document.getElementById("artist-container");
    data.artists.forEach(artist => {

        const html = `
        <div class="pro" onclick="openArtist(${artist.id},'${artist.name}')">

            <div class="img-box">
                <img src="../img/artist.png">
            </div>

            <div class="des">
                <h5>${artist.name}</h5>
                <span>${artist.country}</span>
            </div>

        </div>
        `;

        container.innerHTML += html;

    });

});
function loadArtistSongs(id, name){

document.getElementById("artist-name").innerText =
"Bài hát của " + name;

fetch("../php/getArtistSongs.php?id=" + id)

.then(res => res.json())

.then(data => {

    const container = document.getElementById("song-container");

    container.innerHTML = "";

    data.songs.forEach(song => {

        const html = `
        <div class="pro">

            <div class="img-box">
                <img src="../img/song.png">
            </div>

            <div class="des">
                <h5>${song.title}</h5>
                <small>${song.release_year}</small>
            </div>

        </div>
        `;

        container.innerHTML += html;

    });

});

}