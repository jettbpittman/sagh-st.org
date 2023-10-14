function main () {
    const perm = window.localStorage.getItem("permissions");
    fetchRoster()
    fetchMeets()
    if (perm >= 3) {
        loadManagerSettings()
    }
    if (perm >= 4) {
        loadAdminSettings()
    }
}


function loadManagerSettings () {
    fetch("https://api.sagh-st.org/teams/SAGH/roster/all", { headers: headers })
        .then(response => response.json())
        .then(json => {
            let html = "";
            for (let swimmer in json) {
                html += "<option value=" + json[swimmer]['id']  + ">" + json[swimmer]['last_name'] + ", " + json[swimmer]['first_name'] + " " + json[swimmer]['middle_name'] + " - \'" + json[swimmer]['class'] + "</option>"
            }
            let select = document.getElementById("swimmers");
            select.innerHTML = html;
        })
}

function loadAdminSettings () {
    loadUsers()
}

function loadUsers () {
    fetch("https://api.sagh-st.org/users/all", { method: "GET", headers: headers})
        .then(response => response.json())
        .then(json => {
            let table = document.getElementById("user-table");
            table.innerHTML = "";
            let r1 = table.insertRow();
            r1.innerHTML = "<th style='width: 50%'>Name</th><th style='width: 25%'>Perms</th><th style='width: 25%'>Active</th>"
            console.log(json)
            let html = "";
            for (let user of json) {
                let r = table.insertRow();
                r.innerHTML = `<td style='width: 50%'>${user['name']}<br>(${user['username']})</td><td style='width: 25%'>${user['permissions']}</td><td style='width: 25%'>${user['active']}</td>`
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
    fetch("https://api.sagh-st.org/users/" + user, { method: "PATCH", headers: headers, body: JSON.stringify(payload)})
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
    fetch("https://api.sagh-st.org/users/" + user, { method: "PATCH", headers: headers, body: JSON.stringify(payload)})
        .then(response => {
            if (response.status === 200) {
                loadUsers()
            } else {
                alert("Failed to Change State! " + response.statusText)
            }
        })
}

function fetchRoster () {
    fetch("https://api.sagh-st.org/teams/SAGH/roster/all", { headers: headers })
        .then(response => response.json())
        .then(json => {
            const rosterTable = document.getElementById("team-roster");
            rosterTable.innerHTML = "";
            let headers = rosterTable.insertRow();
            headers.innerHTML = "<th style='width: 30%'>ID</th><th style='width: 50%'>Name</th><th style='width: 10%'>Class</th><th style='width: 10%'>Age</th>"
            for (let swimmer in json) {
                let row = rosterTable.insertRow();
                let style = "text-decoration: none;";
                let color;
                if (json[swimmer]['active'] === false) {
                    style += " font-style: italic; color: #5A5A5A;"
                    color = "color: #5A5A5A;"
                    row.className = "inactive"
                } else {
                    color = "color: black"
                    row.className = "active"
                }
                row.innerHTML = `<td style='width: 30%; ${color}'>${json[swimmer]['id']}</td><td style='width: 50%'><a style="${style} ${color}" href="swimmer.html?swimmer=` + json[swimmer]["id"] + `">${json[swimmer]['last_name']}, ${json[swimmer]['first_name']} ${json[swimmer]['middle_name']}</a></td><td style='width: 10%; ${color}'>${json[swimmer]['class']}</td><td style='width: 10%; ${color}'>${json[swimmer]['age']}</td>`
            }
        })
}

function fetchMeets () {
    fetch("https://api.sagh-st.org/meets", { headers: headers })
        .then(response => response.json())
        .then(json => {
            const rosterTable = document.getElementById("meets");
            rosterTable.innerHTML = "";
            let headers = rosterTable.insertRow();
            headers.innerHTML = "<th style='width: 30%'>ID</th><th style='width: 50%'>Name</th><th style='width: 10%'>Date</th><th style='width: 10%'>Venue</th>"
            for (let meet in json) {
                let row = rosterTable.insertRow();
                row.innerHTML = `<td style='width: 30%'>${json[meet]['id']}</td><td style='width: 50%'><a style="color: black; text-decoration: none" href="meet.html?meet=` + json[meet]['id'] + `">${json[meet]['name']}</td><td style='width: 10%'>${json[meet]['date']}</td><td style='width: 10%'>${json[meet]['venue']}</td>`
            }
        })
}

function changeStatusIndiv () {
    const swimmer = document.getElementById("swimmers").value;
    let status = document.getElementById("active-indiv").value;
    status = status === "true";
    let payload = {
        "active": status
    }
    fetch("https://api.sagh-st.org/swimmers/" + swimmer, { method: "PATCH", headers: headers, body: JSON.stringify(payload)})
        .then(response => {
            if (response.status === 200) {
                fetchRoster()
            } else {
                alert("Failed to Change Status! " + response.statusText)
            }
        })
}

function changeStatusClass () {
    const swimmer = document.getElementById("classes").value;
    let status = document.getElementById("active-class").value;
    status = status === "true";
    let payload = {
        "active": status
    }
    fetch("https://api.sagh-st.org/class/" + swimmer + "/active", { method: "PATCH", headers: headers, body: JSON.stringify(payload)})
        .then(response => {
            if (response.status === 200) {
                fetchRoster()
            } else {
                alert("Failed to Change Status! " + response.statusText)
            }
        })
}


function updateTopFive () {
    fetch("https://api.sagh-st.org/top5/update", { method: "GET", headers: headers})
        .then(response => {
            if (response.status === 200) {
                let box = document.getElementById("update-top5-message");
                box.innerText = "Success!"
            } else {
                alert("Failed to Change Status! " + response.statusText)
            }
        })
}


function createSwimmer () {
    const form = document.getElementById("create-swimmer");
    const formData = new FormData(form);
    let entries = formData.entries();
    let data = {};
    for (let pair of entries) {
        if (pair[0] === "name") {
            let names = pair[1].split(", ")
            let l_name = names[0];
            let fm_name = names[1].split(" ");
            let f_name = fm_name[0];
            let m_name = fm_name[1];
            data["first_name"] = f_name;
            data["last_name"] = l_name;
            data["middle_name"] = m_name;
        } if (pair[0] === "age" || pair[0] === "class") {
            let numb = parseInt(pair[1].toString());
            data[pair[0]] = numb;
        } else {
            data[pair[0]] = pair[1];
        }
    }
    data['active'] = 1;
    data['team'] = "SAGH";
    fetch("https://api.sagh-st.org/swimmers", { method: "POST", headers: headers, body: JSON.stringify(data) } )
        .then(response => {
            if (response.status === 200) {
                let respb = document.getElementById("response-message");
                respb.innerText = "Success!"
                fetchRoster()
            } else {
                let respb = document.getElementById("response-message");
                respb.innerText = `Failed - ${response.statusText}`
            }
        })
}

function createMeet () {
    const form = document.getElementById("create-meet");
    const formData = new FormData(form);
    let entries = formData.entries();
    let data = {};
    for (let pair of entries) {
        if (pair[0] === "season") {
            let numb = parseInt(pair[1].toString());
            data[pair[0]] = numb;
        } else {
            data[pair[0]] = pair[1];
        }
    }
    if (data['most_recent'] === "on") {
        data['most_recent'] = 1;
    } else {
        data['most_recent'] = 0;
    }
    fetch("https://api.sagh-st.org/meets", { method: "POST", headers: headers, body: JSON.stringify(data) } )
        .then(response => {
            if (response.status === 200) {
                let respb = document.getElementById("response-message1");
                respb.innerText = "Success!"
                fetchMeets()
            } else {
                let respb = document.getElementById("response-message1");
                respb.innerText = `Failed - ${response.statusText}`
            }
        })
}

function createUser () {
    const form = document.getElementById("create-user");
    const formData = new FormData(form);
    let entries = formData.entries();
    let data = {};
    for (let pair of entries) {
        data[pair[0]] = pair[1];
    }
    fetch("https://api.sagh-st.org/users", { method: "POST", headers: headers, body: JSON.stringify(data) } )
        .then(response => {
            if (response.status === 200) {
                fetchRoster()
            } else {
                alert("Failed to Add User! " + response.statusText)
            }
        })
}

function toggleInactive () {
    let checkbox = document.getElementById("roster-toggle-inactive");
    if (checkbox.checked) {
        swapStyleSheet("/css/database/admin/showInactive.css")
    }
    if (!checkbox.checked) {
        swapStyleSheet("/css/database/admin/hideInactive.css")
    }
}

function swapStyleSheet(sheet) {
    document.getElementById("inactive-sheet").setAttribute("href", sheet);
}
