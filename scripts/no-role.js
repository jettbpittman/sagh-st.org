async function checkRequestStatus () {
    let table = document.getElementById("request-check");
    let html = "<tr><th>Date Submitted</th><th>Swimmer Name</th><th>Status</th></tr>"
    fetch(`https://api.ghmvswim.org/users/linking/requests`, { method: "GET", headers: headers})
        .then(response => response.json())
        .then(json => {
            console.log("checking")
            for (let req in json) {
                console.log("1")
                html += "<tr><td>" + json[req]['submitted_at'] + "</td><td>" + `${json[req]['swimmer']['last_name']}, ${json[req]['swimmer']['first_name']} ${json[req]['swimmer']['middle_name']}` + "</td><td>" + json[req]['status'] +"</td></tr>";
            }
            table.innerHTML = html;
        })
}

async function getSwimmers () {
    fetch("https://api.ghmvswim.org/teams/SAGH/roster/all_pub", {headers: headers})
        .then(response => response.json())
        .then(json => {
            let html = "";
            for (let swimmer in json) {
                html += "<option value=" + json[swimmer]['id'] + ">" + json[swimmer]['last_name'] + ", " + json[swimmer]['first_name'] + " " + json[swimmer]['middle_name'] + " - \'" + json[swimmer]['class'] + "</option>"
            }
            let select = document.getElementById("swimmers");
            select.innerHTML = html;
        })
}

async function link () {
    let reqd_swimmer = document.getElementById("swimmers").value;
    let verf = document.getElementById("verification-code").value;
    let dob = document.getElementById("swimmer-dob").value;
    let user_id = window.localStorage['id'];
    let payload = {"user_id": user_id, "swimmer_id": reqd_swimmer, "verification_code": verf, "team": "SAGH", "dob": dob}
    let resp = await fetch("https://api.ghmvswim.org/users/linking/request", { method: "POST", headers: headers, body: JSON.stringify(payload)})
    let json = await resp.json()
    const message = document.getElementById("link-message");
    if (resp.status === 200) {
        message.innerText = "Success! Please allow for a few days for processing. You or your swimmer may be contacted to verify your identity."
    } else {
        message.innerText = `Failed to request linking, ${json['reason']}`
    }
    checkRequestStatus()
}

async function main () {
    getSwimmers();
    checkRequestStatus()
}