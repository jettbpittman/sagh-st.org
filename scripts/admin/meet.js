fetch("https://api.ghmvswim.org/meets", { method: "GET", headers: headers })
        .then(response => response.json())
        .then(json => {
            let html = "";
            for (let meet in json) {
                html += "<option value=" + json[meet]['id']  + ">" + json[meet]['officialname'] + "</option>"
            }
            let select = document.getElementById("meets");
            select.innerHTML = html;
        })

fetch("https://api.ghmvswim.org/teams/SAGH/roster/all", { method: "GET", headers: headers })
        .then(response => response.json())
        .then(json => {
            let html = "";
            for (let swimmer in json) {
                html += "<option value=" + json[swimmer]['id']  + ">" + json[swimmer]['last_name'] + ", " + json[swimmer]['first_name'] + " " + json[swimmer]['middle_name'] + " - \'" + json[swimmer]['class'] + "</option>"
            }
            let select = document.getElementById("swimmers");
            select.innerHTML = html;
        })

function getMID (param) {
    if (param) {
        const urlParams = new URLSearchParams(window.location.search);
        let params = urlParams.get('meet').toString();
        if (params == null) {
            return document.getElementById("meets").value;
        } else {
            urlParams.delete("meet");
            return params;
        }
    } else {
        return document.getElementById("meets").value;
    }
}

function gender (code) {
    if (code[0] === "M") {
        return "Men"
    }
    if (code[0] === "F") {
        return "Women"
    }
    if (code[0] === "I") {
        return "Mixed"
    }
}

function formatTime (time) {
    time = time.toString().split(".");
    let seconds = time[0];
    let minutes = Math.trunc(seconds / 60);
    let new_seconds = seconds % 60;
    new_seconds = ("0" + new_seconds).slice(-2);
    console.log(time[1])
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

function relay (seed) {
    if (seed === "RL") {
        return `<span title='Official Split'>RL</span>`
    } else {
        return seed
    }
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

function getMeet (param) {
    let meetID = getMID(param);
    console.log(meetID)
    fetch("https://api.ghmvswim.org/meets/" + meetID, { method: "GET", headers: headers })
        .then(response => response.json())
        .then(json => {
            let box = document.getElementById("meet-info");
            box.innerHTML = "";
            let data = document.createElement("p");
            if (json['format'] === "pf") {
                data.innerHTML = `<b>${json['officialname']}</b><br>${venues[json['venue']]}<br>${json['date']}<br>Warmups @ ${json['pwarmups']} (P) ${json['fwarmups']} (F) <br>Meet @ ${json['pwarmups']} (P) ${json['fstart']} (F)<br><b style="color: darkred">${json['notes']}</b>`
            } else {
                data.innerHTML = `<b>${json['officialname']}</b><br>${venues[json['venue']]}<br>${json['date']}<br>Warmups @ ${json['fwarmups']}<br>Meet @ ${json['fstart']}<br><b style="color: darkred">${json['notes']}</b>`
            }
            let id = document.createElement("p");
            id.innerText = json['id'];
            id.id = "meet-id";
            box.appendChild(data);
            box.appendChild(id);
            let infoBox = document.getElementById("meet-information");
            infoBox.style.visibility = "visible";
            infoBox.style.backgroundColor = `#${venue_colors[json['venue']]}`;
        })
    fetch("https://api.ghmvswim.org/meets/" + meetID + "/entries", { method: "GET", headers: headers })
        .then(response => response.json())
        .then(json => {
            let t = document.getElementById("entries-table");
            t.innerHTML = "";
            let r1 = t.insertRow();
            let d1 = r1.insertCell();
            let resultTable = document.createElement('table');
            resultTable.style.width = "100%";
            for (let event in json) {
                console.log(event)
                if (json[event]['entries'] == null) {
                    continue
                }
                let results = json[event]['entries']
                console.log(results)
                let r = resultTable.insertRow();
                let d = r.insertCell();
                d.className = "event-cell";
                let eventTable = document.createElement('table');
                eventTable.className = "event-table"
                let row = eventTable.insertRow();
                let nameCell = row.insertCell(0);
                nameCell.innerText = `${gender(results[0]['event']['code'])}\n${results[0]['event']['name']}`;
                nameCell.className = "namecell";
                nameCell.style.width = "30%";
                let dataCell = row.insertCell(1);
                dataCell.className = "datacell"
                dataCell.style.width = "70%";
                let swimmersTable = document.createElement("table");
                swimmersTable.style.width = "100%";
                swimmersTable.className = "swimmers-table"
                let r4 = swimmersTable.insertRow().innerHTML = `<th style="width: 62%">Name</th><th style="width: 15%">Seed</th><th style="width: 15%">Time</th><th style="width: 8%"></th>`
                for (let times in results) {
                    let splits = "";
                    for (let split in results[times]['splits']) {
                        splits += `${formatTime(results[times]['splits'][split])} `
                    }
                    console.log(splits)
                    if (results[times]['relay']) {
                        try {
                            swimmers = `${results[times]['relay']['1']['last_name']}, ${results[times]['relay']['1']['first_name']} ${results[times]['relay']['1']['middle_name']}<br>${results[times]['relay']['2']['last_name']}, ${results[times]['relay']['2']['first_name']} ${results[times]['relay']['2']['middle_name']}<br>${results[times]['relay']['3']['last_name']}, ${results[times]['relay']['3']['first_name']} ${results[times]['relay']['3']['middle_name']}<br>${results[times]['relay']['4']['last_name']}, ${results[times]['relay']['4']['first_name']} ${results[times]['relay']['4']['middle_name']}`
                        } catch {
                        }
                        let r3 = swimmersTable.insertRow().innerHTML = `<td style="width: 62%">${swimmers}</td><td style="width: 15%">${relay(results[times]['seed'])}</td><td style="width: 15%">${splitsf(splits, results[times]['time'])}</td><td style="width: 8%">${standards(results[times])}</td>`
                    } else {
                        let r3 = swimmersTable.insertRow().innerHTML = `<td style="width: 62%">${results[times]['swimmer']}</td><td style="width: 15%">${relay(results[times]['seed'])}</td><td style="width: 15%">${splitsf(splits, results[times]['time'])}</span></td><td style="width: 8%">${standards(results[times])}</td>`
                    }
                }
                dataCell.appendChild(swimmersTable)
                d.appendChild(eventTable)
            }
            d1.appendChild(resultTable)
        })
}

getMeet(true);

function createEntry () {
    const form = document.getElementById("create-entry");
    const formData = new FormData(form);
    let entries = formData.entries();
    let data = {};
    for (let pair of entries) {
        console.log(pair[0] + ": " + pair[1]);
        if (pair[0] === "swimmer") {
            let numb = parseInt(pair[1].toString());
            data[pair[0]] = numb;
        } if (pair[0] === "splits") {
            data[pair[0]] = JSON.parse(pair[1].toString());
        }
        else {
            data[pair[0]] = pair[1];
        }
    }
    data['meet'] = parseInt(document.getElementById("meet-id").innerText);
    console.log(data);
    fetch("https://api.ghmvswim.org/entries", { method: "POST", headers: headers, body: JSON.stringify(data) } )
        .then(response => {
            if (response.status === 200) {
                let respb = document.getElementById("response-message");
                respb.innerText = "Success!"
                getMeet(true)
            } else {
                let respb = document.getElementById("response-message");
                respb.innerText = `Failed - ${response.statusText}`
            }
        })
}

function editMeetGen () {
    const form = document.getElementById("edit-meet-gen");
    const formData = new FormData(form);
    let entries = formData.entries();
    let data = {};
    for (let pair of entries) {
        if (pair[0] === "concluded") {
            data[pair[0]] = true
        } else {
            data['concluded'] = false
            if (pair[1] === "") {
                    continue
            } else {
                if (pair[0] === "season") {
                    let numb = parseInt(pair[1].toString());
                    data[pair[0]] = numb;
                } else {
                    data[pair[0]] = pair[1]
                }
            }
        }
    }
    fetch("https://api.ghmvswim.org/meets/" + document.getElementById("meet-id").textContent + "/geninfo", { method: "PATCH", headers: headers, body: JSON.stringify(data) } )
        .then(response => {
            if (response.status === 200) {
                let respb = document.getElementById("response-message1");
                respb.innerText = "Success!"
                getMeet()
            } else {
                let respb = document.getElementById("response-message1");
                respb.innerText = `Failed - ${response.statusText}`
            }
        })
}

function editMeetDT () {
    const form = document.getElementById("edit-meet-dt");
    const formData = new FormData(form);
    let entries = formData.entries();
    let data = {};
    for (let pair of entries) {
        if (pair[1] === "") {
            continue
        } else {
            data[pair[0]] = pair[1]
        }
    }
    fetch("https://api.ghmvswim.org/meets/" + document.getElementById("meet-id").textContent + "/dtinfo", { method: "PATCH", headers: headers, body: JSON.stringify(data) } )
        .then(response => {
            if (response.status === 200) {
                let respb = document.getElementById("response-message2");
                respb.innerText = "Success!"
                getMeet()
            } else {
                let respb = document.getElementById("response-message2");
                respb.innerText = `Failed - ${response.statusText}`
            }
        })
}