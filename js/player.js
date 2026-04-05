var currentPlaylist = [];
var currentSongIndex = 0;

// =======================================================
// 1. HÀM TOÀN CỤC CHẠY NHẠC (ĐỂ NGOÀI CÙNG ĐỂ HTML LUÔN GỌI ĐƯỢC)
// =======================================================
window.playSongDirectly = function(title, artist, src, img) {
    // Luôn lấy DOM mới nhất mỗi khi được gọi
    var audio = document.getElementById('main-audio');
    var playBtn = document.getElementById('play-btn');
    var playerTitle = document.getElementById('player-title');
    var playerArtist = document.getElementById('player-artist');
    var playerImg = document.getElementById('player-img');

    // Nếu HTML của Player chưa được đắp vào web thì báo lỗi nhẹ và thoát
    if (!audio) {
        console.warn("Đang tải thanh Player, vui lòng đợi...");
        return;
    }

    // Cập nhật giao diện thanh phát nhạc
    playerTitle.innerText = title;
    playerArtist.innerText = artist;
    playerImg.src = img;
    audio.src = src;
    
    // Đồng bộ Index để các nút Next/Prev biết đang ở bài số mấy
    var foundIndex = currentPlaylist.findIndex(s => s.title === title);
    if (foundIndex !== -1) {
        currentSongIndex = foundIndex;
    }

    // Play nhạc và đổi icon sang nút Pause
    audio.play().catch(e => console.log("Trình duyệt chặn Autoplay tạm thời:", e));
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
};


// =======================================================
// 2. HÀM KHỞI TẠO CÁC SỰ KIỆN CHO THANH PLAYER (CHỜ HTML LOAD XONG)
// =======================================================
function initAudioPlayer() {
    var audio = document.getElementById('main-audio');
    var playBtn = document.getElementById('play-btn');
    
    // NẾU CHƯA TÌM THẤY (Do HTML chưa fetch về kịp) -> Chờ 50ms rồi tự gọi lại chính mình
    if (!audio || !playBtn) {
        setTimeout(initAudioPlayer, 50);
        return; 
    }

    // NẾU ĐÃ TÌM THẤY -> Bắt đầu gắn biến và các sự kiện
    var prevBtn = document.getElementById('prev-btn');
    var nextBtn = document.getElementById('next-btn');
    var progressBar = document.getElementById('progress-bar');
    var playerTitle = document.getElementById('player-title');
    var playerArtist = document.getElementById('player-artist');
    var playerImg = document.getElementById('player-img');

    // Lấy danh sách nhạc từ API (Dùng làm danh sách phát mặc định)
    fetch('../api/get_song.php')
        .then(res => res.json())
        .then(data => {
            currentPlaylist = data;
            // Hiển thị sẵn bài đầu tiên nhưng không tự động Play
            if (currentPlaylist.length > 0) {
                loadSong(currentPlaylist[currentSongIndex]);
            }
        })
        .catch(err => console.error("Lỗi load nhạc:", err));

    function loadSong(song) {
        if (!song) return;
        playerTitle.innerText = song.title;
        playerArtist.innerText = song.artist_name || song.artist; 
        playerImg.src = "../img/" + song.image_path;
        audio.src = "../" + song.file_path;
    }

    // Nút Play/Pause chính trên thanh Player
    playBtn.onclick = () => {
        if (audio.paused) {
            audio.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    function playNextSong() {
        if (currentPlaylist.length === 0) return;
        currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
        loadSong(currentPlaylist[currentSongIndex]);
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function playPrevSong() {
        if (currentPlaylist.length === 0) return;
        currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        loadSong(currentPlaylist[currentSongIndex]);
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    // Sự kiện nút chuyển bài
    nextBtn.onclick = playNextSong;
    prevBtn.onclick = playPrevSong;

    // Tự động chuyển bài khi bài hiện tại chạy hết
    audio.onended = playNextSong;

    // Cập nhật thanh tiến trình chạy theo bài nhạc
    audio.ontimeupdate = () => {
        if (audio.duration) {
            var progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progressPercent;
        }
    };

    // Cho phép người dùng click/kéo để tua nhạc
    progressBar.oninput = () => {
        if (audio.duration) {
            audio.currentTime = (progressBar.value * audio.duration) / 100;
        }
    };

    console.log("✅ Player đã load xong và sẵn sàng phát nhạc!");
}

// Kích hoạt vòng lặp chờ Player
initAudioPlayer();