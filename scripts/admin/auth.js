function logout () {
    window.localStorage.clear();
    window.location.href = "login.html"
}


const token = window.localStorage.getItem("token");

const headers = new Headers();
headers.append("token", token);

if (token === null) {
    window.location.href = "login.html";
}

async function auth () {
    let resp = await fetch("https://api.sagh-st.org/auth/check", {method: "POST", headers: headers})
    let json = await resp.json()

    if (resp.status !== 200) {
        window.location.href = "login.html"
    }
    if (resp.status === 200 || location.toString() === "/database/admin/index.html") {
        let hello = document.getElementById("user-name").innerText = (json['user']['name'].split(" "))[0]
        let perm = json['user']['permissions']
        window.localStorage.setItem("permissions", perm)
        if (perm >= 1) {
            let add = document.getElementsByClassName("db-add");
            for (let item of add) {
                item.style.display = "block";
            }
        }
        if (perm >= 3) {
            let menu = document.getElementsByClassName("admin-settings");
            for (let item of menu) {
                item.style.display = "table-cell";
            }
        }
        main()
    }
}

auth()
