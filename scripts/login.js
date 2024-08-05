async function login () {
    const form = document.getElementById("login-form");
    const formData = new FormData(form);
    window.localStorage.clear();
    let entries = formData.entries();
    let body = {}
    for (let pair of entries) {
        body[pair[0].toString()] = pair[1].toString()
    }
    console.log(body)
    const init = {
        method: "POST",
        body: JSON.stringify(body)
    }
    let resp = await fetch("https://api.ghmvswim.org/auth/login", init)
    let json = await resp.json()
    const message = document.getElementById("login-message");
    const token = json['token'];
    if (resp.status === 200) {
        message.innerText = "Success!"
        window.localStorage.setItem("token", token);
        await pickDashboard(token)
    } else {
        message.innerText = `Failed to login, ${resp.statusText}`
    }

}

function togglePassword () {
  let x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

async function pickDashboard (token) {
    let headers = new Headers();
    headers.append("token", token);
    headers.append("Content-type", "text/plain")
    let resp = await fetch("https://api.ghmvswim.org/auth/check", {method: "POST", headers: headers})
    let json = await resp.json()
    console.log("checked auth")

    if (json['user']['permissions'] > 0) {
        location.href = "/database/admin/index.html"
    }
    else if (json['user']['linked_swimmer']) {
        location.href = "/database/user/index.html"
    }
    else {
        location.href = "/database/index.html"
    }
}

async function checkIfSignedIn () {
    const token = window.localStorage.getItem("token");
    if (token) {
        pickDashboard(token)
    }
}