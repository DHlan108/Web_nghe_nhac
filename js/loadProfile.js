document.addEventListener("DOMContentLoaded", () => {

    const avatar = document.getElementById("avatar");

    const editBtn = document.getElementById("edit-btn");
    const modal = document.getElementById("edit-modal");
    const cancelBtn = document.getElementById("cancel-btn");
    const saveBtn = document.getElementById("save-btn");
    

    // bật form
    editBtn.onclick = () => {
        modal.classList.remove("hidden");
    };

    // tắt form
    cancelBtn.onclick = () => {
            modal.classList.add("hidden");
        };


    // LOAD PROFILE
    fetch("../api/profile.php", {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {

        if(data.success){

            document.getElementById("username").innerText = data.user.username;
            document.getElementById("email").innerText = data.user.email;
            document.getElementById("role").innerText = data.user.role;

            // đổ vào form
            document.getElementById("edit-username").value = data.user.username;
            document.getElementById("edit-email").value = data.user.email;

            //  AVATAR 
            if (data.user.ava_user) {
                avatar.src = "../img/" + data.user.ava_user;
            } else {
                avatar.src = "../img/default.jpg";
            }

        }else{
            alert("Bạn chưa đăng nhập!");
            window.location.href = "login.html";
        }

    });

    // SAVE
    if(saveBtn){
        saveBtn.onclick = () => {

            const avatarInput = document.getElementById("edit-avatar");
            if (!avatarInput) {
                console.log("Không tìm thấy");
                return;
            }
            const file = avatarInput.files[0];

            const username = document.getElementById("edit-username").value;
            const email = document.getElementById("edit-email").value;

            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);

            if(file) {
                formData.append("avatar", file);
            }

            fetch("../api/update_profile.php", {
                method: "POST",
                body: formData })
                
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    document.getElementById("username").innerText = username;
                    document.getElementById("email").innerText = email;
                    if(data.avatar){
                        avatar.src = "../img/" + data.avatar;
                    }
                    modal.classList.add("hidden");
                }else{
                    alert("Cập nhật thất bại!");
                }
            });

        };
    }

});