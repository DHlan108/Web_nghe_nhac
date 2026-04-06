// =======================================================
// BIẾN TOÀN CỤC QUẢN LÝ HÀNG ĐỢI (QUEUE) DUY NHẤT
// =======================================================
window.currentSongQueue = []; // Mảng chứa danh sách bài hát hiện tại (có thể là mặc định hoặc playlist)
window.currentSongIndex = 0;  // Vị trí bài hát đang phát trong mảng

// Hàm MỚI: Nhận 1 danh sách bài hát (từ playlist) và bắt đầu phát từ vị trí startIndex
window.playPlaylistQueue = function(songsArray, startIndex) {
    window.currentSongQueue = songsArray; // Cập nhật hàng đợi thành playlist mới
    window.currentSongIndex = startIndex; // Cập nhật vị trí bắt đầu
    
    var song = window.currentSongQueue[window.currentSongIndex];
    
    // Gọi hàm phát nhạc gốc
    window.playSongDirectly(
        song.title, 
        song.artist_name || song.artist, 
        '../' + song.file_path, 
        '../img/' + song.image_path
    );
};

// =======================================================
// 1. HÀM TOÀN CỤC CHẠY NHẠC (ĐỂ NGOÀI CÙNG)
// =======================================================
window.playSongDirectly = function(title, artist, src, img) {
    var audio = document.getElementById('main-audio');
    var playBtn = document.getElementById('play-btn');
    var playerTitle = document.getElementById('player-title');
    var playerArtist = document.getElementById('player-artist');
    var playerImg = document.getElementById('player-img');

    if (!audio) {
        console.warn("Đang tải thanh Player, vui lòng đợi...");
        return;
    }

    // Cập nhật giao diện thanh phát nhạc
    playerTitle.innerText = title;
    playerArtist.innerText = artist;
    playerImg.src = img;
    audio.src = src;

    // Play nhạc và đổi icon sang nút Pause
    audio.play().catch(e => console.log("Trình duyệt chặn Autoplay tạm thời:", e));
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
};

// =======================================================
// 2. HÀM KHỞI TẠO CÁC SỰ KIỆN CHO THANH PLAYER
// =======================================================
function initAudioPlayer() {
    var audio = document.getElementById('main-audio');
    var playBtn = document.getElementById('play-btn');
    
    if (!audio || !playBtn) {
        setTimeout(initAudioPlayer, 50);
        return; 
    }

    var prevBtn = document.getElementById('prev-btn');
    var nextBtn = document.getElementById('next-btn');
    var progressBar = document.getElementById('progress-bar');
    var playerTitle = document.getElementById('player-title');
    var playerArtist = document.getElementById('player-artist');
    var playerImg = document.getElementById('player-img');

    // Lấy danh sách nhạc mặc định từ API khi mới vào web
    fetch('../api/get_song.php')
        .then(res => res.json())
        .then(data => {
            window.currentSongQueue = data; // Lưu vào biến hàng đợi chung
            window.currentSongIndex = 0;
            
            // Hiển thị sẵn bài đầu tiên lên giao diện nhưng không tự động Play
            if (window.currentSongQueue.length > 0) {
                var song = window.currentSongQueue[0];
                playerTitle.innerText = song.title;
                playerArtist.innerText = song.artist_name || song.artist; 
                playerImg.src = "../img/" + song.image_path;
                audio.src = "../" + song.file_path;
            }
        })
        .catch(err => console.error("Lỗi load nhạc:", err));

    // Nút Play/Pause chính
    playBtn.onclick = () => {
        if (audio.paused) {
            audio.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    // Hàm chuyển bài tiếp theo (Dùng chung cho cả nút Next và khi Hết bài)
    window.playNextSong = function() {
        if (window.currentSongQueue.length === 0) return;
        
        // Tự động quay lại bài 1 nếu đang ở bài cuối (Loop)
        window.currentSongIndex = (window.currentSongIndex + 1) % window.currentSongQueue.length;
        var nextSong = window.currentSongQueue[window.currentSongIndex];
        
        window.playSongDirectly(
            nextSong.title, 
            nextSong.artist_name || nextSong.artist, 
            '../' + nextSong.file_path, 
            '../img/' + nextSong.image_path
        );
    };

    // Hàm lùi bài hát
    window.playPrevSong = function() {
        if (window.currentSongQueue.length === 0) return;
        
        window.currentSongIndex = (window.currentSongIndex - 1 + window.currentSongQueue.length) % window.currentSongQueue.length;
        var prevSong = window.currentSongQueue[window.currentSongIndex];
        
        window.playSongDirectly(
            prevSong.title, 
            prevSong.artist_name || prevSong.artist, 
            '../' + prevSong.file_path, 
            '../img/' + prevSong.image_path
        );
    };

    // Gắn sự kiện cho nút Next/Prev
    nextBtn.onclick = window.playNextSong;
    prevBtn.onclick = window.playPrevSong;

    // === ĐÂY LÀ PHẦN XỬ LÝ KHI BÀI HÁT KẾT THÚC (ENDED) ===
    audio.onended = window.playNextSong;

    // Tiến trình nhạc
    audio.ontimeupdate = () => {
        if (audio.duration) {
            var progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progressPercent;
        }
    };

    progressBar.oninput = () => {
        if (audio.duration) {
            audio.currentTime = (progressBar.value * audio.duration) / 100;
        }
    };

    console.log("✅ Player đã load xong và sẵn sàng phát nhạc!");
}

// Kích hoạt vòng lặp chờ Player
initAudioPlayer();