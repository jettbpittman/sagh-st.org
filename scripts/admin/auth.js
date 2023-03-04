function logout () {
    window.localStorage.clear();
    window.location.href = "auth.html"
}


const token = window.localStorage.getItem("token");

const headers = new Headers();
headers.append("token", token);

if (token === null) {
    window.location.href = "login.html";
}

fetch("https://api.sagh-st.org/auth/check", { method: "POST", headers: headers})
        .then(response => {
            if (response.status !== 200) {
                window.location.href = "login.html"
            } if (response.status === 200 || location.toString() === "/database/admin/index.html") {
                main();
            }
        })