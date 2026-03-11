fetch("../api/get_artist.php")
.then(res => res.json())
.then(data => {

    if(!data.success) return;
    const container = document.getElementById("artist-container");
    data.artists.forEach(artist => {

        const html = `
        <div class="pro">

            <div class="img-box">
                <img src="../img/artist.png" alt="">
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