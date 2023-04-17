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
    let resp = await fetch("https://api.sagh-st.org/auth/login", init)
    let json = await resp.json()
    const message = document.getElementById("login-message");
    const token = json['token'];
    if (resp.status === 200) {
        message.innerText = "Success!"
        window.localStorage.setItem("token", token);
        pickDashboard()
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

auth()