fetch("../component/navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar-container").innerHTML = data;
  });

fetch("../component/sidebar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar-container").innerHTML = data;

const currentPage = window.location.pathname.split("/").pop() || "home.html";
            const links = document.querySelectorAll("#sidebar a");

            links.forEach(link => {
                const href = link.getAttribute("href");
                
                if (href === currentPage) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        });
loadSidebar();

fetch("../component/player.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("player-container").innerHTML = data;
  });