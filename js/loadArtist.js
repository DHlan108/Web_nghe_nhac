let globalArtists = []; // 1. Thêm kho lưu trữ dữ liệu

// 2. Gom đoạn fetch và vẽ của cậu vào một hàm để search có thể gọi lại
function renderArtistList(artists, isSearching = false) {
    const container = document.getElementById("artist-container");
    const songSection = document.querySelector(".song-section");
    const artistHeader = document.querySelector("#product1 h2");

    if (!container) return;
    container.innerHTML = ""; // Xóa nội dung cũ để vẽ lại từ đầu

    // Logic làm gọn giao diện giống trang Song/Album cậu muốn
    if (isSearching) {
        if (songSection) songSection.style.display = "none";
        if (artistHeader) artistHeader.innerText = "Kết quả tìm kiếm nghệ sĩ";
    } else {
        if (songSection) songSection.style.display = "block";
        if (artistHeader) artistHeader.innerText = "Nghệ Sĩ";
    }

    // --- GIỮ NGUYÊN 100% MẪU HTML CỦA CẬU ---
    artists.forEach(artist => {
        const html = `
            <div class="artist-card" onclick="loadArtistSongs(${artist.id},'${artist.name.replace(/'/g, "\\'")}')">
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
}

// 3. Chạy fetch dữ liệu khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
    fetch("../api/get_artist.php")
        .then(res => res.json())
        .then(data => {
            if (!data.success) return;
            globalArtists = data.artists; // Lưu dữ liệu vào kho

            // Hiển thị ban đầu
            renderArtistList(globalArtists);

            // 4. KẾT NỐI TÌM KIẾM
            if (typeof MusicSearchEngine !== 'undefined') {
                MusicSearchEngine.initGlobalSearch((keyword) => {
                    const isTyping = keyword.trim() !== "";
                    const filtered = MusicSearchEngine.process(globalArtists, { keyword: keyword });
                    renderArtistList(filtered, isTyping);
                });
            }
        });
});

// 5. HÀM LOAD BÀI HÁT (GIỮ NGUYÊN 100% CODE CỦA CẬU)
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
            // Cuộn xuống để xem bài hát
            window.scrollTo({ top: document.querySelector('.song-section').offsetTop - 100, behavior: 'smooth' });
        })
        .catch(err => console.error("Lỗi fetch bài hát:", err));
}