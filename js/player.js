// =======================================================
// BIẾN TOÀN CỤC QUẢN LÝ HÀNG ĐỢI (QUEUE) DUY NHẤT
// =======================================================
window.currentSongQueue = [];
window.currentSongIndex = 0;

window.playPlaylistQueue = function (songsArray, startIndex) {
  window.currentSongQueue = songsArray;
  window.currentSongIndex = startIndex;
  var song = window.currentSongQueue[window.currentSongIndex];
  window.playSongDirectly(
    song.title,
    song.artist_name || song.artist,
    "../" + song.file_path,
    "../img/" + song.image_path,
  );
};

// =======================================================
// 1. HÀM TOÀN CỤC CHẠY NHẠC
// =======================================================
window.playSongDirectly = function (title, artist, src, img) {
  var audio = document.getElementById("main-audio");
  var playBtn = document.getElementById("play-btn");
  var playerTitle = document.getElementById("player-title");
  var playerArtist = document.getElementById("player-artist");
  var playerImg = document.getElementById("player-img");
  var vBar = document.getElementById("volume-bar"); // Đã lấy đúng ID

  if (!audio) return;

  playerTitle.innerText = title;
  playerArtist.innerText = artist;
  playerImg.src = img;
  audio.src = src;

  // Sửa lỗi sai tên biến ở đây
  if (vBar) {
    audio.volume = vBar.value / 100;
  }

  audio.play().catch((e) => console.log("Autoplay block:", e));
  if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
};

// =======================================================
// 2. HÀM KHỞI TẠO CÁC SỰ KIỆN CHO THANH PLAYER
// =======================================================
function initAudioPlayer() {
  var audio = document.getElementById("main-audio");
  var playBtn = document.getElementById("play-btn");

  if (!audio || !playBtn) {
    setTimeout(initAudioPlayer, 50);
    return;
  }

  var prevBtn = document.getElementById("prev-btn");
  var nextBtn = document.getElementById("next-btn");
  var progressBar = document.getElementById("progress-bar");
  var volumeBar = document.getElementById("volume-bar");
  var playerTitle = document.getElementById("player-title");
  var playerArtist = document.getElementById("player-artist");
  var playerImg = document.getElementById("player-img");

  // Load nhạc mặc định
  fetch("../api/get_song.php")
    .then((res) => res.json())
    .then((data) => {
      window.currentSongQueue = data;
      if (window.currentSongQueue.length > 0) {
        var song = window.currentSongQueue[0];
        playerTitle.innerText = song.title;
        playerArtist.innerText = song.artist_name || song.artist;
        playerImg.src = "../img/" + song.image_path;
        audio.src = "../" + song.file_path;
        // Khởi tạo âm lượng ban đầu
        if (volumeBar) audio.volume = volumeBar.value / 100;
      }
    });

  playBtn.onclick = () => {
    if (audio.paused) {
      audio.play();
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      audio.pause();
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  };

  window.playNextSong = function () {
    if (window.currentSongQueue.length === 0) return;
    window.currentSongIndex =
      (window.currentSongIndex + 1) % window.currentSongQueue.length;
    var s = window.currentSongQueue[window.currentSongIndex];
    window.playSongDirectly(
      s.title,
      s.artist_name || s.artist,
      "../" + s.file_path,
      "../img/" + s.image_path,
    );
  };

  window.playPrevSong = function () {
    if (window.currentSongQueue.length === 0) return;
    window.currentSongIndex =
      (window.currentSongIndex - 1 + window.currentSongQueue.length) %
      window.currentSongQueue.length;
    var s = window.currentSongQueue[window.currentSongIndex];
    window.playSongDirectly(
      s.title,
      s.artist_name || s.artist,
      "../" + s.file_path,
      "../img/" + s.image_path,
    );
  };

  nextBtn.onclick = window.playNextSong;
  prevBtn.onclick = window.playPrevSong;
  audio.onended = window.playNextSong;

  audio.ontimeupdate = () => {
    if (audio.duration) {
      progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
  };

  progressBar.oninput = () => {
    if (audio.duration) {
      audio.currentTime = (progressBar.value * audio.duration) / 100;
    }
  };

  // QUAN TRỌNG: XỬ LÝ ÂM LƯỢNG KHI TRƯỢT
  if (volumeBar) {
    volumeBar.oninput = function () {
      audio.volume = this.value / 100;
      console.log("Volume changed to:", audio.volume);
    };
  }

  console.log("✅ Player đã sẵn sàng!");
}

initAudioPlayer();
