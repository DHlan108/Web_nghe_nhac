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
<small>${song.release_year}</small>
</div>

</div>

`
}


fetch("../api/get_song.php")
.then(res=>res.json())
.then(data=>{

const featured = document.getElementById("featured-list")
const newsong = document.getElementById("new-list")
const allsong = document.getElementById("all-list")

data.forEach(song=>{

// tất cả bài
allsong.innerHTML += createSong(song)


// bài nổi bật
if(song.views > 1000){
featured.innerHTML += createSong(song)
}


// 6 bài mới nhất //

})

})