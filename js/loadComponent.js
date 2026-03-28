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
    const currentPage = window.location.pathname.split("/").pop() || "home.html";
    const links = document.querySelectorAll("#sidebar a"); // Khai báo bên trong block
    links.forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });
  });

// 3. LOAD PLAYER (Quan trọng nhất)
fetch("../component/player.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("player-container").innerHTML = data;

    // Chỉ chèn script xử lý nhạc KHI VÀ CHỈ KHI HTML đã xuất hiện
    if (!document.querySelector('script[src="../js/player.js"]')) {
      const script = document.createElement("script");
      script.src = "../js/player.js";
      document.body.appendChild(script);
    }
  })
  .catch(err => console.error("Lỗi tải thanh nhạc:", err));