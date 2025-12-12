function loadUser () {
    const box = document.getElementById("user-info");
    fetch(api_endpoint + "users/me", { method: "GET", headers: headers})
        .then(response => response.json())
        .then(json => {
            box.innerText = `<b>Name -<br> ${json['name']}<br><b>Username -</b>${json['username']}<br><b>Email -</b>${json['email']}`
        })
}

function changePassword () {
    let oldP = document.getElementById("old_password").value;
    let newP = document.getElementById("new_password").value;
    let confirm = document.getElementById("user-change-password-confirm").value;
    if (!confirm) {
        let message = document.getElementById("user-change-password-message");
        message.innerText = "Please Confirm!"
        return
    }
    let user_id = window.localStorage.getItem("id")
    let payload = {
        "old_password": oldP,
        "new_password": newP
    }
    fetch(api_endpoint + "users/" + user_id + "/password", { method: "POST", headers: headers, body: JSON.stringify(payload)})
        .then(response => {
            let message = document.getElementById("user-change-password-message");
            if (response.status === 200) {
                message.innerText = "Success!";
            } else {
                message.innerText = "Failed to Change Password! " + response.statusText
            }
        })
}

loadUser()

