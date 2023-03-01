function logout () {
    window.localStorage.clear();
    window.location.href = "login.html"
}


const username = window.localStorage.getItem("user");
const password = window.localStorage.getItem("password");

const headers = new Headers();
headers.append("user", username);
headers.append("password", password);

if (username == null || password == null) {
    window.location.href = "login.html";
}

fetch("https://api.sagh-st.org/auth/check", { method: "POST", headers: headers})
        .then(response => {
            if (response.status !== 200) {
                window.location.href = "login.html"
            } if (response.status === 200) {
                main();
            }
        })


function main () {
    fetch("https://api.sagh-st.org/teams/SAGH/roster/all")
        .then(response => response.json())
        .then(json => {
            const rosterTable = document.getElementById("team-roster");
            let headers = rosterTable.insertRow();
            headers.innerHTML = "<th style='width: 30%'>ID</th><th style='width: 50%'>Name</th><th style='width: 10%'>Class</th><th style='width: 10%'>Age</th>"
            for (let swimmer in json) {
                console.log(swimmer)
                let row = rosterTable.insertRow();
                row.innerHTML = `<td style='width: 30%'>${json[swimmer]['id']}</td><td style='width: 50%'><a style="color: black; text-decoration: none" href="swimmer.html?swimmer=` + json[swimmer]["id"] + `">${json[swimmer]['last_name']}, ${json[swimmer]['first_name']} ${json[swimmer]['middle_name']}</a></td><td style='width: 10%'>${json[swimmer]['class']}</td><td style='width: 10%'>${json[swimmer]['age']}</td>`
            }
        })

    fetch("https://api.sagh-st.org/meets")
        .then(response => response.json())
        .then(json => {
            const rosterTable = document.getElementById("meets");
            let headers = rosterTable.insertRow();
            headers.innerHTML = "<th style='width: 30%'>ID</th><th style='width: 50%'>Name</th><th style='width: 10%'>Date</th><th style='width: 10%'>Venue</th>"
            for (let meet in json) {
                console.log(meet)
                let row = rosterTable.insertRow();
                row.innerHTML = `<td style='width: 30%'>${json[meet]['id']}</td><td style='width: 50%'>${json[meet]['name']}</td><td style='width: 10%'>${json[meet]['date']}</td><td style='width: 10%'>${json[meet]['venue']}</td>`
            }
        })
}


function createSwimmer () {
    const form = document.getElementById("create-swimmer");
    const formData = new FormData(form);
    let entries = formData.entries();
    let data = {};
    for (let pair of entries) {
        console.log(pair[0] + ": " + pair[1]);
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
    console.log(data);
    data['active'] = 1;
    data['team'] = "SAGH";
    fetch("https://api.sagh-st.org/swimmers", { method: "POST", headers: headers, body: JSON.stringify(data) } )
        .then(response => {
            if (response.status === 200) {
                let respb = document.getElementById("response-message");
                respb.innerText = "Success. Reload page to reflect."
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
        console.log(pair[0] + ": " + pair[1]);
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
    console.log(data);
    data['active'] = 1;
    data['team'] = "SAGH";
    fetch("https://api.sagh-st.org/swimmers", { method: "POST", headers: headers, body: JSON.stringify(data) } )
        .then(response => {
            if (response.status === 200) {
                let respb = document.getElementById("response-message");
                respb.innerText = "Success. Reload page to reflect."
            } else {
                let respb = document.getElementById("response-message");
                respb.innerText = `Failed - ${response.statusText}`
            }
        })
}
