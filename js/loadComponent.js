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


fetch("../component/player.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("player-container").innerHTML = data;
  });

document.addEventListener("click", (e) => {
  if (e.target.closest(".logout")) {
    const ok = confirm("Đăng xuất khỏi tài khoản này?");
    if (!ok) return;

    fetch("../api/logout.php", {
      method: "POST"
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = "login.html";
      }
    })
    .catch(() => {
      alert("Lỗi đăng xuất!");
    });
  }
});