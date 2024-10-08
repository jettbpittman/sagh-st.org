function logout () {
    window.localStorage.clear();
    window.location.href = "/database/login.html"
}

const token = window.localStorage.getItem("token");

const headers = new Headers();
headers.append("token", token);
headers.append("Content-type", "text/plain")

if (token === null) {
    window.location.href = "/database/login.html";
}

async function auth () {
    let resp = await fetch("https://api.ghmvswim.org/auth/check", {method: "POST", headers: headers})
    let json = await resp.json()
    console.log("checked auth")

    if (resp.status !== 200) {
        window.location.href = "/database/login.html"
    }
    console.log("auth success")
    document.getElementById("user-name").innerText = (json['user']['name'].split(" "))[0]
    let perm = json['user']['permissions']
    window.localStorage.setItem("permissions", perm)
    window.localStorage.setItem("id", json['user']['id'])
    if (json['user']['permissions'] >= 2 && location.pathname.toString() === "/database/admin/meet.html" || location.pathname.toString() === "/database/admin/swimmer.html") {
        let add = document.getElementsByClassName("db-add");
        for (let item of add) {
            item.style.display = "block";
        }
    }
    if (json['user']['permissions'] >= 1 && location.pathname.toString() === "/database/admin/index.html" || location.pathname.toString() === "/database/admin/") {
        if (perm >= 2) {
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
        if (perm >= 4) {
            let menu = document.getElementsByClassName("manage-site");
            for (let item of menu) {
                item.style.display = "block";
            }
        }
        main()
    } if (json['user']['linked_swimmer'] != null && location.pathname.toString() === "/database/user/index.html" || location.pathname.toString() === "/database/user/") {
        main()
    } else {
        main()
    }
}

async function pickDashboardMenu () {
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
        location.href = "/database/no-role.html"
    }
}

async function showAdminNav () {
    let resp = await fetch("https://api.ghmvswim.org/auth/check", {method: "POST", headers: headers})
    let json = await resp.json()

    if (json['user']['permissions'] > 0) {
        let nav = document.getElementById("switch-dash");
        nav.style.visibility = 'visible';
    }
}

async function showSwimmerNav () {
    let resp = await fetch("https://api.ghmvswim.org/auth/check", {method: "POST", headers: headers})
    let json = await resp.json()

    if (json['user']['linked_swimmer']) {
        let nav = document.getElementById("switch-dash");
        nav.style.visibility = 'visible';
    }
}

auth()