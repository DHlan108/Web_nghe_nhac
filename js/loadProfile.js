// =========================================================
// HÀM KHỞI TẠO TRANG PROFILE 
// =========================================================
window.initProfilePage = function () {
  console.log("🚀 Đang khởi tạo trang Hồ Sơ...");

  var avatar = document.getElementById("avatar");
  var editBtn = document.getElementById("edit-btn");
  var modal = document.getElementById("edit-modal");
  var cancelBtn = document.getElementById("cancel-btn");
  var saveBtn = document.getElementById("save-btn");

  // Bật form
  if (editBtn) {
    editBtn.onclick = () => {
      if (modal) modal.classList.remove("hidden");
    };
  }

  // Tắt form
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      if (modal) modal.classList.add("hidden");
    };
  }

  // LOAD PROFILE TỪ API
  fetch("../api/profile.php", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        var uName = document.getElementById("username");
        var uEmail = document.getElementById("email");
        var uRole = document.getElementById("role");
        var editUName = document.getElementById("edit-username");
        var editUEmail = document.getElementById("edit-email");

        // Hiển thị ra ngoài
        if (uName) uName.innerText = data.user.username;
        if (uEmail) uEmail.innerText = data.user.email;
        if (uRole) uRole.innerText = data.user.role;

        // Đổ dữ liệu vào form sửa
        if (editUName) editUName.value = data.user.username;
        if (editUEmail) editUEmail.value = data.user.email;

        // Xử lý Avatar
        if (avatar) {
          if (data.user.ava_user) {
            avatar.src = "../img/" + data.user.ava_user;
          } else {
            avatar.src = "../img/default.jpg";
          }
        }
      } else {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "login.html"; // Chuyển hướng hoàn toàn ra trang ngoài
      }
    })
    .catch((err) => console.error("Lỗi fetch profile:", err));

  // XỬ LÝ LƯU (SAVE)
  if (saveBtn) {
    saveBtn.onclick = () => {
      var avatarInput = document.getElementById("edit-avatar");
      if (!avatarInput) {
        console.log("Không tìm thấy thẻ input avatar");
        return;
      }
      var file = avatarInput.files[0];
      var username = document.getElementById("edit-username").value;
      var email = document.getElementById("edit-email").value;

      var formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);

      if (file) {
        formData.append("avatar", file);
      }

      fetch("../api/update_profile.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Cập nhật hồ sơ thành công!");

            // Cập nhật lại UI ngay lập tức
            var uName = document.getElementById("username");
            var uEmail = document.getElementById("email");
            if (uName) uName.innerText = username;
            if (uEmail) uEmail.innerText = email;

            if (data.avatar && avatar) {
              avatar.src = "../img/" + data.avatar;
            }
            if (modal) modal.classList.add("hidden");
          } else {
            alert("Cập nhật thất bại!");
          }
        })
        .catch((err) => console.error("Lỗi update profile:", err));
    };
  }
};
