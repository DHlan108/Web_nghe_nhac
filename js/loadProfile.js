fetch("/Web_nghe_nhac/api/profile.php", {
  credentials: "include",
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      document.getElementById("username").innerText = data.user.username;
      document.getElementById("email").innerText = data.user.email;
      document.getElementById("role").innerText = data.user.role;
    } else {
      alert("Bạn chưa đăng nhập!");
      window.location.href = "login.html";
    }
  });
