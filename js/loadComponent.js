fetch("../component/navbar.html")
  .then((res) => res.text())
  .then((data) => {
    // Chèn HTML của navbar vào trang
    document.getElementById("navbar-container").innerHTML = data;

    // NGAY SAU ĐÓ, TÌM NÚT LOGOUT VÀ GẮN SỰ KIỆN
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất không?");

        if (confirmLogout) {
          fetch("../api/logout.php", {
            method: "POST",
          })
            .then((response) => {
              if (response.ok) {
                localStorage.removeItem("user");
                window.location.href = "../pages/login.html";
              } else {
                alert("Có lỗi xảy ra khi đăng xuất.");
              }
            })
            .catch((error) => {
              console.error("Lỗi:", error);
            });
        }
      });
    }
  });

fetch("../component/sidebar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("sidebar-container").innerHTML = data;

    const currentPage =
      window.location.pathname.split("/").pop() || "home.html";
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

    links.forEach((link) => {
      const href = link.getAttribute("href");

      if (href === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });


fetch("../component/player.html")
  .then((res) => res.text())
  .then((data) => {
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
