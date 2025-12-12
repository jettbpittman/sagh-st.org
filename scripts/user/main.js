async function loadSwimmerInfo () {
    let user = await fetch(api_endpoint + "users/me", { method: "GET", headers});
    let user_data = await user.json();
    let swimmer = await fetch(api_endpoint + "swimmers/" + user_data['linked_swimmer']['id'], { method: "GET", headers});
    let swimmer_data = await swimmer.json()
    document.getElementById("swimmer-info-name").innerText = `${swimmer_data['last_name']}, ${swimmer_data['first_name']} ${swimmer_data['middle_name']}`
    document.getElementById("swimmer-info-dob").innerText = `${swimmer_data['dob']}`
    document.getElementById("swimmer-info-age").innerText = `${swimmer_data['age']}`
    document.getElementById("swimmer-info-usasid").innerText = `${swimmer_data['usas_id']}`
    document.getElementById("swimmer-info-class").innerText = `${swimmer_data['class']}`
    let state;
    if (swimmer_data['active']) {
        state = "Active"
    } else {
        state = "Inactive"
    }
    document.getElementById("swimmer-info-status").innerText = `${state}`
    document.getElementById("swimmer-info-entries").innerText = `${swimmer_data['stats']['entries']}`
    document.getElementById("swimmer-info-meets").innerText = `${swimmer_data['stats']['meet_count']}`
    document.getElementById("user-info-username").innerText = `${user_data['username']}`
    document.getElementById("user-info-email").innerText = `${user_data['email']}`
    document.getElementById("user-info-perms").innerText = `${user_data['permissions']}`
    document.getElementById("user-info-last-login").innerText = `${user_data['latest_access']} UTC`
}

function standards (s) {
    if (s['standards'] != null) {
        return `<span title=` + `"${s['standards']['name']}"` + `>` + s['standards']['short_name'] + "</span>"
    } else {
        return ``
    }
}

function splitsf (s, t) {
    if (s != null) {
        return `<span title=` + `"${s}"` + `>` + t + "</span>"
    } else {
        return ``
    }
}

function formatTime (time) {
    time = time.toString().split(".");
    let seconds = time[0];
    let minutes = Math.trunc(seconds / 60);
    let new_seconds = seconds % 60;
    new_seconds = ("0" + new_seconds).slice(-2);
    if (!time[1]) {
        time[1] = 0
    }
    let milliseconds = (time[1] + "0").slice(0, 2)
    if (minutes === 0) {
        return `${new_seconds}.${milliseconds}`
    } else {
        return `${minutes}:${new_seconds}.${milliseconds}`
    }
}

async function loadSwimmerTimes () {
    let user = await fetch(api_endpoint + "users/me", { method: "GET", headers});
    let user_data = await user.json();
    let swimmer = await fetch(api_endpoint + "swimmers/" + user_data['linked_swimmer']['id'], { method: "GET", headers});
    let swimmer_data = await swimmer.json()
    let entries_resp = await fetch(api_endpoint + "swimmers/" + swimmer_data['id'] + "/entries", { method: "GET", headers})
    let entries = await entries_resp.json()
    let times_table = document.getElementById("user-times");
    for (let event in entries) {
        let r1 = times_table.insertRow().insertCell().innerHTML = `<td style="display: table-cell">${entries[event]['name']}</td>`;
        let r2 = times_table.insertRow();
        let event_table = document.createElement("table");
        event_table.className = "event-time-table";
        event_table.style.borderCollapse = "collapse";
        event_table.insertRow().innerHTML = `<th style="width: 50%; display: table-cell">Meet</th><th style="width: 20%; display: table-cell">Date</th><th style="width: 22%; display: table-cell">Time</th><th style="width: 8%; display: table-cell"></th>`
        for (let entry of entries[event]['entries']) {
            let splits = "";
            for (let split in entry['splits']) {
                splits += `${formatTime(entry['splits'][split])} `
            }
            event_table.insertRow().innerHTML = `<td style="width: 50%; display: table-cell">${entry['meet']['officialname']}</td><td style="width: 20%; display: table-cell">${entry['meet']['date']}</td><td style="width: 22%; display: table-cell">${splitsf(splits, entry['time'])}</td><td style="width: 8%; display: table-cell">${standards(entry)}</td>`
        }

        r2.appendChild(event_table)
    }

}

async function loadSwimmerMeets () {
    let user = await fetch(api_endpoint + "users/me", { method: "GET", headers});
    let user_data = await user.json();
    let swimmer = await fetch(api_endpoint + "swimmers/" + user_data['linked_swimmer']['id'], { method: "GET", headers});
    let swimmer_data = await swimmer.json()
    let meet_table = document.getElementById("user-meets");
    meet_table.insertRow().innerHTML = `<th style="width: 50%">Name</th><th style="width: 40%">Date</th><th style="width: 10%">Venue</th>`;
    console.log(swimmer_data['stats']['meets'])
    for (let meet of JSON.parse(swimmer_data['stats']['meets'])) {
        let m = await fetch(api_endpoint + "meets/" + meet[0])
        let m_data = await m.json();
        let link =
        meet_table.insertRow().innerHTML = `<td style="width: 60%; display: table-cell"><a style="color: black; text-decoration: none" href="/database/meets.html?meet=` + m_data['id'] + `">${m_data['officialname']}</a></td><td style="width: 30%; display: table-cell">${m_data['date']}</td><td style="width: 10%; display: table-cell">${m_data['venue']}</td>`
    }
}

function main () {
    loadSwimmerMeets()
    loadSwimmerInfo()
    loadSwimmerTimes()
}