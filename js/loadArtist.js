
let globalArtists = []; 
const userRole = localStorage.getItem("role") || "user";

// 1. Định nghĩa hàm render trước để các chỗ khác gọi được
function renderArtistList(artists, isSearching = false) {
    const container = document.getElementById("artist-container");
    const songSection = document.querySelector(".song-section");
    const artistHeader = document.querySelector("#product1 h2");

    if (!container) return;
    container.innerHTML = ""; 

    if (isSearching) {
        if (songSection) songSection.style.display = "none";
        if (artistHeader) artistHeader.innerText = "Kết quả tìm kiếm nghệ sĩ";
    } else {
        if (songSection) songSection.style.display = "block";
        if (artistHeader) artistHeader.innerText = "Nghệ Sĩ";
    }

artists.forEach(artist => {
    const html = `
        <div class="artist-card" onclick="loadArtistSongs(${artist.id},'${artist.name}')">
            
            <div class="artist-img">
                <img src="../img/${artist.avatar}">
            </div>

            <div class="artist-info">
                <h5>${artist.name}</h5>
                <span>${artist.country}</span>

                ${userRole === "admin" ? `
                <div class="artist-admin-controls">
                    <button class="btn-edit"
                        onclick="event.stopPropagation(); prepareEditArtist(${artist.id}, '${artist.name.replace(/'/g, "\\'")}', '${artist.country.replace(/'/g, "\\'")}', '${artist.avatar}')">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>

                    <button class="btn-delete"
                        onclick="event.stopPropagation(); deleteArtist(${artist.id})">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
                ` : ""}
            </div>
        </div>`;
    
    container.innerHTML += html;
});

} // Đóng hàm render chuẩn xác

// 2. Sự kiện DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    // KHAI BÁO BIẾN Ở ĐÂY ĐỂ DÒNG 86 KHÔNG BỊ LỖI
    const container = document.getElementById("artist-container");
    const arrowsBox = document.querySelector(".arrows-box");

    fetch("../api/get_artist.php")
        .then(res => res.json())
        .then(data => {
            if (!data.success) return;
            globalArtists = data.artists; 
            renderArtistList(globalArtists); // Gọi hàm render

            if (typeof MusicSearchEngine !== 'undefined') {
                MusicSearchEngine.initGlobalSearch((keyword) => {
                    const isTyping = keyword.trim() !== "";
                    const filtered = MusicSearchEngine.process(globalArtists, { keyword: keyword });
                    renderArtistList(filtered, isTyping);
                });
            }
        })
        .catch(err => console.error("Lỗi fetch:", err));

    if(userRole === "admin" && container){
        const section = document.getElementById("product1");
        if (section && !document.querySelector(".admin-add-btn-artist")) {
            const addBtn = document.createElement("button");
            addBtn.className = "admin-add-btn-artist";
            addBtn.innerHTML = "+ Thêm Nghệ Sĩ";
            addBtn.onclick = openArtistModal; // Gán sự kiện mở modal
            section.appendChild(addBtn);
        }
        container.style.display = "grid";
        container.style.gridTemplateRows = "repeat(2, auto)"; 
        container.style.gridAutoFlow = "column";            
        container.style.gridAutoColumns = "max-content";    
        container.style.gap = "20px";
        container.style.overflowX = "auto";                
        container.style.overflowY = "hidden";              
        container.style.paddingBottom = "20px";
        container.style.scrollBehavior = "smooth";
        
        if (arrowsBox) {
            arrowsBox.style.display = "flex";
            arrowsBox.style.justifyContent = "flex-end"; 
            arrowsBox.style.marginTop = "-40px";         
            arrowsBox.style.paddingRight = "20px";       
        }
    }
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

let currentEditArtistId = null;

// 2. Hàm mở Modal để thêm mới
function openArtistModal() {
    currentEditArtistId = null; // Reset ID về null để biết là thêm mới
    document.getElementById("admin-artist-modal-title").innerText = "Thêm Nghệ Sĩ";
    // Xóa sạch dữ liệu cũ trong form
    document.getElementById("adm-artist-name").value = "";
    document.getElementById("adm-artist-country").value = "";
    document.getElementById("adm-artist-avatar").value = "";
    document.getElementById("artist-admin-modal").style.display = "flex";
}

// 3. Hàm mở Modal để sửa (Hàm này sẽ được nút bút chì gọi)
function prepareEditArtist(id, name, country, avatar) {
    currentEditArtistId = id; // Lưu ID lại
    document.getElementById("admin-artist-modal-title").innerText = "Sửa Thông Tin Nghệ Sĩ";
    // Đổ dữ liệu cũ vào các ô input
    document.getElementById("adm-artist-name").value = name;
    document.getElementById("adm-artist-country").value = country;
    document.getElementById("adm-artist-avatar").value = avatar;
    document.getElementById("artist-admin-modal").style.display = "flex";
}

// 4. HÀM CHÍNH: Xử lý khi nhấn nút "Lưu" (Đã đổi tên thành submitArtist)
function submitArtist() {
    const name = document.getElementById("adm-artist-name").value;
    const country = document.getElementById("adm-artist-country").value;
    const avatar = document.getElementById("adm-artist-avatar").value;

    if (!name) {
        alert("Vui lòng nhập tên nghệ sĩ!");
        return;
    }

    const formData = new URLSearchParams();
    if (currentEditArtistId) formData.append("id", currentEditArtistId); // Gửi ID nếu đang sửa
    formData.append("name", name);
    formData.append("country", country);
    formData.append("avatar", avatar);

    // Quyết định gọi API Create hay Update dựa trên currentEditArtistId
    const url = currentEditArtistId ? "../api/update_artist.php" : "../api/create_artist.php";

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert(data.message || "Thành công!");
            document.getElementById('artist-admin-modal').style.display='none'; // Đóng modal
            location.reload(); // Load lại trang
        } else {
            alert("Lỗi từ server: " + data.message);
        }
    })
    .catch(err => {
        console.error("Lỗi:", err);
        alert("Không thể kết nối tới server. Hãy kiểm tra lại file PHP!");
    });
}

// 5. Hàm xóa
function deleteArtist(id) {
    if(confirm("Bạn có chắc chắn muốn xóa nghệ sĩ này không?")) {
        fetch("../api/delete_artist.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id=${id}`
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) location.reload();
            else alert("Lỗi khi xóa: " + data.message);
        });
    }
}