
const role = localStorage.getItem("role") || "user"
console.log("ROLE", role)

let currentEditId = null

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

  <span class="artist">${song.artist_name}</span>

  <div class="bottom-row">
    <small class="year">
      ${song.release_date ? song.release_date.split("-")[0] : ""}
    </small>

    ${role === "admin" ? `
    <div class="admin-btn-row">
      <button class="btn-edit" onclick='openModal("edit", ${JSON.stringify(song).replace(/'/g, "&apos;")})'>
        <i class="fa-regular fa-pen-to-square"></i>
      </button>
      <button class="btn-delete" onclick="deleteSong(${song.id})">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    </div>
    ` : ""}
  </div>
</div>

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
<button onclick="openModal('add')" class="admin-add-btn" style="padding:25px 80px; font-size:26px; font-weight:900; margin-bottom:40px; margin-top:20px; background:linear-gradient(135deg, #5B6FD8 0%, #7B5FB8 100%); color:white; border:3px solid #6B78D8; border-radius:15px; box-shadow:0 10px 40px rgba(91, 111, 216, 0.6); cursor:pointer; width:100%; max-width:1000px; text-transform:uppercase; letter-spacing:1.5px; transition:all 0.3s ease; display:block; margin-left:auto; margin-right:auto;">
<span style="color: #FF9500; font-weight: bold; margin-right: 8px;">+</span> Thêm bài hát mới
</button>
`
}

const featured = document.getElementById("featured-list")
const newsong = document.getElementById("new-list")
const allsong = document.getElementById("all-list")

if(featured) featured.innerHTML = ""
if(newsong) newsong.innerHTML = ""
if(allsong) allsong.innerHTML = ""

let allHTML = ""
let featuredHTML = ""

data.forEach(song => {
  allHTML += createSong(song)

  if(song.listens && song.listens > 1000){
    featuredHTML += createSong(song)
  }
})

if(allsong) allsong.innerHTML = allHTML
if(featured) featured.innerHTML = featuredHTML


})
console.log("✅ Render song xong")

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

function openModal(mode, song = null){
  document.getElementById("song-modal").style.display = "flex"

  if(mode === "add"){
    currentEditId = null
    document.getElementById("modal-title").innerText = "Thêm bài hát"

    document.getElementById("song-title").value = ""
    document.getElementById("song-artist").value = ""
    document.getElementById("song-file").value = ""
    document.getElementById("song-album").value = ""
    document.getElementById("song-image").value = ""
    document.getElementById("song-date").value = ""
  }

  if(mode === "edit"){
    currentEditId = song.id
    document.getElementById("modal-title").innerText = "Sửa bài hát"

    document.getElementById("song-title").value = song.title
    document.getElementById("song-artist").value = song.artist_id || ""
    document.getElementById("song-album").value = song.album_id
    document.getElementById("song-file").value = song.file_path
    document.getElementById("song-image").value = song.image_path
    document.getElementById("song-date").value = song.release_date
  }
}

function closeModal(){
  document.getElementById("song-modal").style.display = "none"
}

// ===== SUBMIT (ADD + EDIT) =====
function submitSong(){
  const title = document.getElementById("song-title").value
  const artist_id = document.getElementById("song-artist").value
  const album_id = document.getElementById("song-album").value.trim()
  const file_path = document.getElementById("song-file").value
  const image_path = document.getElementById("song-image").value
  const release_date = document.getElementById("song-date").value

  let url = ""
  let body = ""

  if(currentEditId){
    url = "../api/update_song.php"
    body = `id=${currentEditId}&title=${encodeURIComponent(title)}&artist_id=${artist_id}&album_id=${album_id !== "" ? album_id : ""}&release_date=${release_date}`
  } else {
    url = "../api/song_create.php"
    body = body = `title=${encodeURIComponent(title)}&artist_id=${artist_id}&album_id=${album_id !== "" ? album_id : ""}&file_path=${encodeURIComponent(file_path)}&image_path=${encodeURIComponent(image_path)}&release_date=${release_date}`
  }

  fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body: body
  })
  .then(res=>res.json())
  .then(data=>{
    alert(data.message)
    if(data.success){
      closeModal()
      location.reload()
    }
  })
}