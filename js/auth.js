/*đăng nhập*/
async function xulyDangnhap() {
    // 1. Lấy dữ liệu từ 2 ô input
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    // Kiểm tra xem người dùng có để trống không
    if (user === "" || pass === "") {
        alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
        return;
    }

    // 2. Gói dữ liệu để gửi đi
    const formData = new FormData();
    formData.append('username', user);
    formData.append('password', pass);

    // 3. Gửi sang PHP bằng Fetch API
    try {
        const response = await fetch('../api/login.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json(); // Đọc kết quả PHP trả về

        // 4. Xử lý kết quả
        if (result.success) {
            alert("Đăng nhập thành công với quyền: " + result.role);
            // Chuyển hướng sang trang chủ (bộ khung index.html)
            window.location.href = "../index.html"; 
        } else {
            alert("Đăng nhập thất bại: " + result.message);
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        alert("Không thể kết nối tới máy chủ!");
    }
}
//đăng ký
async function xulyDangky() {
    // 1. Lấy dữ liệu từ các ô input đăng ký
    const user = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const pass = document.getElementById("reg-password").value;

    // 2. Kiểm tra không được để trống
    if (user === "" || email === "" || pass === "") {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    // 3. Gói dữ liệu
    const formData = new FormData();
    formData.append('username', user);
    formData.append('email', email);
    formData.append('password', pass);

    // 4. Gửi sang file PHP
    try {
        const response = await fetch('../api/register.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();

        if (result.success) {
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            window.location.href = "login.html"; // Chuyển về trang đăng nhập
        } else {
            alert("Đăng ký thất bại: " + result.message);
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể kết nối tới máy chủ!");
    }
}
//quên mật khẩu
async function xulyQuenMatKhau() {
    const email = document.getElementById("reset-email").value;
    const newPass = document.getElementById("new-password").value;

    if (email === "" || newPass === "") {
        alert("Vui lòng nhập Email và Mật khẩu mới!");
        return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('new_password', newPass);

    try {
        const response = await fetch('../api/reset_password.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();

        if (result.success) {
            alert("Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.");
            window.location.href = "login.html"; // Chuyển về trang đăng nhập
        } else {
            alert("Lỗi: " + result.message);
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể kết nối tới máy chủ!");
    }
}