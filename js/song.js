
const role = localStorage.getItem("role") || "user"
console.log("ROLE", role)
function createSong(song){
return `

<div class="pro">

<div class="img-box">
<img src="../img/${song.image_path}">
<div class="play">
<i class="fa-solid fa-play"></i>
</div>
</div>

<div class="des">
<h5>${song.title}</h5>
<span>${song.artist_name}</span>
<small>${song.release_date ? song.release_date.split("-")[0] : ""}</small>
</div>

${role === "admin" ? `
<div class="admin-btn">
<button onclick="editSong(${song.id})">✏️</button>
<button onclick="deleteSong(${song.id})">🗑</button>
</div>
` : ""}

</div>

`
}

fetch("../api/get_song.php")
.then(res=>res.json())
.then(data=>{
console.log("✅ Fetch data thành công:", data)
console.log("👤 Role:", role)

const adminTools = document.getElementById("admin-tools")
console.log("🛠️ Admin tools element:", adminTools)

if(role === "admin"){
console.log("✅ set admin button")
adminTools.innerHTML = `
<button onclick="addNewSong()" class="admin-add-btn" style="padding:25px 80px; font-size:26px; font-weight:900; margin-bottom:40px; margin-top:20px; background:linear-gradient(135deg, #5B6FD8 0%, #7B5FB8 100%); color:white; border:3px solid #6B78D8; border-radius:15px; box-shadow:0 10px 40px rgba(91, 111, 216, 0.6); cursor:pointer; width:100%; max-width:1000px; text-transform:uppercase; letter-spacing:1.5px; transition:all 0.3s ease; display:block; margin-left:auto; margin-right:auto;">
<span style="color: #FF9500; font-weight: bold; margin-right: 8px;">+</span> Thêm bài hát mới
</button>
`
}

const featured = document.getElementById("featured-list")
const newsong = document.getElementById("new-list")
const allsong = document.getElementById("all-list")

// tránh bị lặp
featured.innerHTML = ""
newsong.innerHTML = ""
allsong.innerHTML = ""

data.forEach(song=>{

allsong.innerHTML += createSong(song)

if(song.listens && song.listens > 1000){
featured.innerHTML += createSong(song)
}

})
console.log("✅ Render song xong")
})
.catch(err => console.error("❌ Error fetch:", err))

function deleteSong(id){

if(confirm("Bạn có chắc muốn xóa không?")){

fetch("../api/delete_song.php",{
method: "POST",
headers: {
"Content-Type": "application/x-www-form-urlencoded"
},
body: "id=" + id
})
.then(res => res.json())
.then(data => {
alert(data.message)
location.reload()
})

}

}

function editSong(id){

let title = prompt("Chỉnh sửa tên bài hát:")
if(title === null) return

let artist_id = prompt("Nhập ID ca sĩ:\n1=G-Dragon, 2=Taylor Swift, 3=Sơn Tùng, 4=SOOBIN, 5=VŨ, 6=RPT MCK, 7=tlinh")
if(artist_id === null || artist_id === "") return

let release_date = prompt("Nhập ngày phát hành (YYYY-MM-DD ví dụ: 2024-06-20):")
if(release_date === null) return

if(confirm("Lưu thay đổi?")){

fetch("../api/update_song.php",{
method: "POST",
headers: {
"Content-Type": "application/x-www-form-urlencoded"
},
body: `id=${id}&title=${encodeURIComponent(title)}&artist_id=${artist_id}&release_date=${encodeURIComponent(release_date)}`
})
.then(res=>res.json())
.then(data=>{
alert(data.message)
if(data.success) location.reload()
})
.catch(err => alert("Lỗi kết nối: " + err))

}

}

function addNewSong(){

let title = prompt("Nhập tên bài hát:")
if(title === null || title === "") return

let artist_id = prompt("Nhập ID ca sĩ:\n1=G-Dragon, 2=Taylor Swift, 3=Sơn Tùng, 4=SOOBIN, 5=VŨ, 6=RPT MCK, 7=tlinh")
if(artist_id === null || artist_id === "") return

let file_path = prompt("Nhập đường dẫn file nhạc (ví dụ: music/song.mp3):")
if(file_path === null || file_path === "") return

let image_path = prompt("Nhập đường dẫn ảnh (ví dụ: ai.jpg):")
if(image_path === null || image_path === "") return

let release_date = prompt("Nhập ngày phát hành (YYYY-MM-DD ví dụ: 2024-06-20):")
if(release_date === null || release_date === "") return

if(!confirm("Thêm bài hát mới?")) return

fetch("../api/song_create.php",{
method: "POST",
headers: {
"Content-Type": "application/x-www-form-urlencoded"
},
body: `title=${encodeURIComponent(title)}&artist_id=${artist_id}&file_path=${encodeURIComponent(file_path)}&image_path=${encodeURIComponent(image_path)}&release_date=${encodeURIComponent(release_date)}`
})
.then(res=>res.json())
.then(data=>{
alert(data.message)
if(data.success) location.reload()
})
.catch(err => alert("Lỗi kết nối: " + err))

}