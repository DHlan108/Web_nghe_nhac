fetch("../component/navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar-container").innerHTML = data;
  });

fetch("../component/sidebar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar-container").innerHTML = data;
  });
fetch("../component/player.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("player-container").innerHTML = data;
  });