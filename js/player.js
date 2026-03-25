/*play/pause nhạc*/
const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerImg = document.getElementById('player-img');

// Dữ liệu mẫu (sau này bạn dùng API từ database đổ vào đây)
let songs = [
    { 
        id: 1, 
        title: "người điên", 
        artist: "tlinh", 
        src: "../music/nguoi_dien.mp3", // Kiểm tra file này có trong thư mục music chưa
        img: "../img/ai.jpg"            // Kiểm tra ảnh này có trong thư mục img chưa
    },
    { 
        id: 3, 
        title: "Anh đã ổn hơn", 
        artist: "RPT MCK", 
        src: "../music/anh_da_on_hon.mp3", 
        img: "../img/99.jpg" 
    }
];

let songIndex = 0;

// Hàm tải bài hát
function loadSong(song) {
    playerTitle.innerText = song.title;
    playerArtist.innerText = song.artist;
    playerImg.src = song.img;
    audio.src = song.src;
}

// Chức năng Play/Pause
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Chuyển bài
nextBtn.addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    audio.play();
});

prevBtn.addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    audio.play();
});

// Cập nhật thanh Progress
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressPercent || 0;
});

// Tua nhạc
progressBar.addEventListener('change', () => {
    audio.currentTime = (progressBar.value * audio.duration) / 100;
});

// Khởi tạo bài đầu tiên
loadSong(songs[songIndex]);
function playSongDirectly(title, artist, src, img) {
    // Cập nhật thông tin lên thanh nhạc
    playerTitle.innerText = title;
    playerArtist.innerText = artist;
    playerImg.src = img;
    audio.src = src;

    // Phát nhạc ngay lập tức
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}