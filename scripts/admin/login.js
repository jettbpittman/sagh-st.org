function auth () {
    const form = document.getElementById("login-form");
    const formData = new FormData(form);
    window.localStorage.clear();
    let entries = formData.entries();
    let headers = new Headers();
    for (let pair of entries) {
        console.log(pair[0] + ": " + pair[1]);
        headers.append(pair[0].toString(), pair[1].toString())
    }
    const init = {
        method: "POST",
        headers: headers
    }
    fetch("https://api.sagh-st.org/auth/check", init)
        .then(response => {
            const message = document.getElementById("login-message");
            if (response.status === 200) {
                message.innerText = "Success!"
                for (let pair of formData.entries()) {
                    console.log("adding to ls")
                    console.log(pair[0] + ": " + pair[1]);
                    window.localStorage.setItem(pair[0].toString(), pair[1].toString());
                    window.location.href = "index.html";
                }
            } else {
                message.innerText = `Failed to login, ${response.statusText}`
            }
        })

}

function togglePassword () {
  let x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}