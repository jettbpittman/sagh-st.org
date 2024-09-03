function main () {
    const perm = window.localStorage.getItem("permissions");
    if (perm >= 4) {
        loadAdminSettings()
        checkRequests()
    }
}


function checkOrEx (e) {
    if (e === true) {
        return "&#10003;"
    } else {
        return "&#10006;"
    }
}

const token = window.localStorage.getItem("token");

const headers = new Headers();
headers.append("token", token);
headers.append("Content-type", "text/plain")

function loadAdminSettings () {
    loadUsers()
}

function createUser () {
    const form = document.getElementById("create-user");
    const formData = new FormData(form);
    let entries = formData.entries();
    let data = {};
    for (let pair of entries) {
        data[pair[0]] = pair[1];
    }
    fetch("https://api.ghmvswim.org/users", { method: "POST", headers: headers, body: JSON.stringify(data) } )
        .then(response => {
            if (response.status === 200) {
                fetchRoster()
            } else {
                alert("Failed to Add User! " + response.statusText)
            }
        })
}

function loadUsers () {
    fetch("https://api.ghmvswim.org/users/all", { method: "GET", headers: headers})
        .then(response => response.json())
        .then(json => {
            let table = document.getElementById("user-table");
            table.innerHTML = "";
            let r1 = table.insertRow();
            r1.innerHTML = "<th>Name</th><th>Email</th><th>Perms</th><th>Linked Swimmer</th><th>Latest Access</th><th>Active</th>"
            console.log(json)
            let html = "";
            for (let user of json) {
                let r = table.insertRow();
                let ls = "";
                if (user['linked_swimmer']) {
                    ls = `${user['linked_swimmer']['last_name']}, ${user['linked_swimmer']['first_name']} ${user['linked_swimmer']['middle_name']}`
                }
                r.innerHTML = `<td>${user['name']}<br>(${user['username']})</td><td>${user['email']}</td><td>${user['permissions']}</td><td>${ls}</td><td>${user['latest_access']}</td><td>${user['active']}</td>`
                html += "<option value=" + user['id']  + ">" + user['username'] + "</option>"

            }
            let permsSelect = document.getElementById("perms-user-select");
            permsSelect.innerHTML = html;
            let statusSelect = document.getElementById("status-user-select");
            statusSelect.innerHTML = html;
        })
}


function updateUserPerms () {
    const user = document.getElementById("perms-user-select").value;
    const new_perms = parseInt(document.getElementById("perms-perm-select").value);
    let payload = {
        "permissions": new_perms
    }
    fetch("https://api.ghmvswim.org/users/" + user, { method: "PATCH", headers: headers, body: JSON.stringify(payload)})
        .then(response => {
            if (response.status === 200) {
                loadUsers()
            } else {
                alert("Failed to Change Permissions! " + response.statusText)
            }
        })
}


function updateUserState () {
    const user = document.getElementById("status-user-select").value;
    let state = document.getElementById("status-state-select").value;
    state = state === "true";
    let payload = {
        "active": state
    }
    fetch("https://api.ghmvswim.org/users/" + user, { method: "PATCH", headers: headers, body: JSON.stringify(payload)})
        .then(response => {
            if (response.status === 200) {
                loadUsers()
            } else {
                alert("Failed to Change State! " + response.statusText)
            }
        })
}

async function checkRequests () {
    let table = document.getElementById("request-check");
    let html = "<tr><th>Date Submitted</th><th>Swimmer Name</th><th>User Name</th><th>Code</th><th>DOB</th><th>Status</th><th>Approve</th><th>Reject</th></tr>"
    fetch(`https://api.ghmvswim.org/users/linking/requestqueue`, { method: "GET", headers: headers})
        .then(response => response.json())
        .then(json => {
            for (let req in json) {
                html += "<tr><td>" + json[req]['submitted_at'] + "</td><td>" + `${json[req]['swimmer']['last_name']}, ${json[req]['swimmer']['first_name']} ${json[req]['swimmer']['middle_name']}` + "</td><td>" + json[req]['user']['name'] + "</td><td>" + checkOrEx(json[req]['code_match']) +"</td><td>" + checkOrEx(json[req]['dob_match']) +"</td><td>" + json[req]['status'] + '</td><td><button type="button" onclick="approveRequest(' + json[req][`user`][`id`] + ', ' + json[req][`swimmer`][`id`] + ')">Approve</button></td><td><button type="button" onclick="rejectRequest(' + json[req][`user`][`id`] + ', ' + json[req][`swimmer`][`id`] + ')">Reject</button></td></tr>';
            }
            table.innerHTML = html;
        })
}
async function approveRequest (user_id, swimmer_id) {
    let payload = {"user_id": user_id, "swimmer_id": swimmer_id}
    let resp = await fetch("https://api.ghmvswim.org/users/linking/approve", { method: "POST", headers:headers, body: JSON.stringify(payload)})
    if (resp.status === 200) {
        checkRequests()
        loadUsers()
    } else {
        alert("Failed to approve request! " + resp.statusText)
    }
}

async function rejectRequest (user_id, swimmer_id) {
    let payload = {"user_id": user_id, "swimmer_id": swimmer_id}
    let resp = await fetch("https://api.ghmvswim.org/users/linking/reject", { method: "POST", headers:headers, body: JSON.stringify(payload)})
    if (resp.status === 200) {
        checkRequests()
    } else {
        alert("Failed to reject request! " + resp.statusText)
    }
}

main()