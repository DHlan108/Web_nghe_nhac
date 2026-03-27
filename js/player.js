const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerImg = document.getElementById('player-img');

let songs = [];
let songIndex = 0;

// Lấy danh sách nhạc từ API
fetch('../api/get_song.php') // Đảm bảo đường dẫn này đúng với file PHP của bạn
    .then(res => res.json())
    .then(data => {
        songs = data;
        if (songs.length > 0) loadSong(songs[songIndex]);
    })
    .catch(err => console.error("Lỗi load nhạc:", err));

function loadSong(song) {
    if (!song) return;
    playerTitle.innerText = song.title;
    playerArtist.innerText = song.artist_name || song.artist; 
    playerImg.src = "../img/" + song.image_path;
    audio.src = "../" + song.file_path;
}

// Play/Pause
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Next/Prev
nextBtn.addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

prevBtn.addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

// Thanh tiến trình
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressPercent || 0;
});

progressBar.addEventListener('input', () => {
    audio.currentTime = (progressBar.value * audio.duration) / 100;
});

// Hàm hỗ trợ khi bấm trực tiếp vào bài hát trong danh sách
function playSongDirectly(title, artist, src, img) {
    playerTitle.innerText = title;
    playerArtist.innerText = artist;
    playerImg.src = img;
    audio.src = src;
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}