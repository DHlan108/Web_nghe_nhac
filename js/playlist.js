document.addEventListener("DOMContentLoaded", () => {

const playlistList = document.getElementById("playlist-list");
const songList = document.getElementById("song-list");
const title = document.getElementById("playlist-title");

const modal = document.getElementById("playlist-modal");
const closeModal = document.getElementById("close-playlist-modal");
const saveBtn = document.getElementById("save-playlist-btn");
const addBtn = document.getElementById("add-playlist-btn");

const addSongBtn = document.getElementById("add-song-btn");
const songModal = document.getElementById("song-modal");
const closeSongModal = document.getElementById("close-song-modal");
const songSelectList = document.getElementById("song-select-list");

let editPlaylistId = null;
let currentPlaylistId = null;

//them sua
addBtn.onclick = () => {
    console.log("CLICK ADD");
    editPlaylistId = null;
    document.getElementById("playlist-modal-title").innerText = "Tạo danh sách phát";
    modal.classList.remove("hidden");
};

closeModal.onclick = () => {
    modal.classList.add("hidden");
};


saveBtn.onclick = () => {
    const name = document.getElementById("playlist-name").value;
    const file = document.getElementById("playlist-image").files[0];
    const formData = new FormData();
    formData.append("name", name);

    if (file) {
        formData.append("image", file);
    }

    let url = editPlaylistId
        ? "../api/update_playlist.php"
        : "../api/create_playlist.php";

        if (editPlaylistId) {
            formData.append("id", editPlaylistId);
        }

        fetch(url, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                location.reload();
            }
        });
};


//them bai hat
addSongBtn.onclick = () => {
    if (!currentPlaylistId) {
        alert("Chưa chọn danh sách phát");
        return;
    }
    songModal.classList.remove("hidden");

    fetch("../api/get_song.php")
    .then(res => res.json())
    .then(data => {
        songSelectList.innerHTML = "";

        data.forEach(song => {
            songSelectList.innerHTML += `
                <div class="song-select-item">
                    <div class="song-select-text">
                        <h5>${song.title}</h5>
                        <span>${song.artist_name}</span>
                    </div>
                    <button class="add-song-small-btn" onclick="addSongToPlaylist(${song.id})">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                `;
        });
    });
};

closeSongModal.onclick = () => {
    songModal.classList.add("hidden");
}

//load playlist
function loadPlaylists() {
    fetch("../api/get_playlists.php")
    .then(res => res.json())
    .then(data => {
        console.log("PLAYLIST:", data);

        playlistList.replaceChildren();

        data.forEach(pl => {
            const div = document.createElement("div");
            div.className = "playlist-item";
            div.dataset.id = pl.id;

            div.innerHTML = `
                <div class="pl-cover">
                    <img src="../img/${pl.playlist_image || "default_playlist.jpg"}">
                </div>
                <div class="pl-info"> 
                    <span class="pl-name">${pl.name}</span>
                    <span class="pl-actions">
                        <button class="edit-btn">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="delete-btn">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </span>
                </div>
            `;

            div.querySelector(".edit-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                editPlaylist(pl.id, pl.name);
            });

            div.querySelector(".delete-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                deletePlaylist(e, pl.id);
            });

            div.addEventListener("click", () => {
                currentPlaylistId = pl.id;

                document.querySelectorAll(".playlist-item")
                    .forEach(e => e.classList.remove("active"));

                div.classList.add("active");

                document.getElementById("playlist-view").classList.remove("hidden");

                title.innerText = pl.name;

                const cover = document.getElementById("playlist-cover");
                cover.src = "../img/" + (pl.playlist_image || "default_playlist.jpg");

                loadSongs(pl.id);
            });

            playlistList.appendChild(div);
        });
    });
}
loadPlaylists();

function loadSongs(playlistId) {
    fetch(`../api/get_playlist_songs.php?playlist_id=${playlistId}`)
    .then(res => res.json())
    .then(songs => {
        songList.innerHTML = "";

        songs.forEach((song, index) => {
            songList.innerHTML += `
            <div class="song-row">
                <div class="song-left">
                    <span class="song-index">${index + 1}</span>
                    <div class="song-cover">
                        <img src="../img/${song.image_path}">
                        <div class="play-overlay">
                            <i class="fa-solid fa-play"></i>
                        </div>
                    </div>
                    <div class="song-text">
                        <h5>${song.title}</h5>
                        <span>${song.artist_name}</span>
                    </div>
                </div>
                <div class="song-right">
                    <button class="delete-song-btn" onclick="removeSongFromPlaylist(event, ${song.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            `;
        });
    });
}

window.editPlaylist = (id, name) => {
    editPlaylistId = id;

    document.getElementById("playlist-name").value = name;
    document.getElementById("playlist-modal-title").innerText = "Sửa danh sách phát";
    modal.classList.remove("hidden");
};



window.deletePlaylist = (e, id) => {

    e.stopPropagation();

    if (!confirm("Xóa danh sách phát này?")) return;

    fetch("../api/delete_playlist.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id=" + id
    })
    .then(res => res.json())
    .then(data => {

        console.log("DELETE:", data);

        if (data.success) {
            alert(data.message);

            // ❗ XÓA UI
            const item = document.querySelector(`.playlist-item[data-id='${id}']`);
            if (item) item.remove();

            // ❗ RESET nếu đang chọn playlist đó
            if (currentPlaylistId == id) {
                currentPlaylistId = null;

                document.getElementById("playlist-view").classList.add("hidden");
                songList.innerHTML = "";
                title.innerText = "";
            }

            // ❗ QUAN TRỌNG: reload lại list từ server
            loadPlaylists();
        }
    })
    .catch(err => console.error(err));
};

window.addSongToPlaylist = (songId) => {
    fetch("../api/add_song_to_playlist.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },    
        body: `playlist_id=${currentPlaylistId}&song_id=${songId}`
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            songModal.classList.add("hidden");
            loadSongs(currentPlaylistId);
        }
    });
};

window.removeSongFromPlaylist = (e, songId) => {

    e.stopPropagation();

    if (!confirm("Xóa bài hát này khỏi danh sách phát?")) return;

    fetch("../api/remove_song_from_playlist.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `playlist_id=${currentPlaylistId}&song_id=${songId}`
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            loadSongs(currentPlaylistId);
        }
    });
};


document.addEventListener("click", function(e) {
    if (e.target.closest(".pl-actions")) {
        e.stopPropagation();
    }
});

});