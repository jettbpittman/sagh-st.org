
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

function getSID (param) {
    if (param) {
        const urlParams = new URLSearchParams(window.location.search);
        let params = urlParams.get('swimmer').toString();
        if (params == null) {
            return document.getElementById("swimmers").value;
        } else {
            urlParams.delete("swimmer");
            return params;
        }
    } else {
        return document.getElementById("swimmers").value;
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

function splitsf (s, t) {
    if (s != null) {
        return `<span title=` + `"${s}"` + `>` + t + "</span>"
    } else {
        return ``
    }
}

function getSwimmer (param) {
    let swimmerID = getSID(param);
    console.log(swimmerID)
    fetch("https://api.sagh-st.org/attendance/swimmer/" + swimmerID,{ method: "GET", headers: headers } )
        .then(response => response.json())
        .then(json => {
            console.log(json)
            let attTable = document.getElementById("attendance-table");
            attTable.innerHTML = "";
            attTable.insertRow().innerHTML = "<th>Date</th><th>Type</th><th>Status</th>"
            for (let date in json['records']) {
                console.log(date)
                attTable.insertRow().innerHTML = `<td>${date}</td><td>${json['records'][date][1]}</td><td>${json['records'][date][0]}</td>`;

            }
        })

    fetch("https://api.sagh-st.org/swimmers/" + swimmerID, { headers: headers })
        .then(response => response.json())
        .then(json => {
            let box = document.getElementById("swimmer-info");
            box.innerHTML = "";
            let data = document.createElement("p");
            let active;
            if (json['active'] === true) {
                active = "Active"
            } else {
                active = "Inactive"
            }
            let usasId;
            if (json['usas_id']) {
                usasId = json['usas_id']
            }
            else {
                usasId = "NO USAS ID"
            }
            if (json['homeschool'] === true) {
                json['class'] += ' (H)';
            }
            data.innerHTML = `<b>${json['last_name']}, ${json['first_name']} ${json['middle_name']}</b><br>${usasId}<br><i>Class of 20${json['class']}</i><br>${json['dob']}<br><b>${active}</b>`
            box.appendChild(data);
        })
    fetch("https://api.sagh-st.org/swimmers/" + swimmerID + "/entries", { headers: headers })
        .then(response => response.json())
        .then(json => {
            let t = document.getElementById("times-table");
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
                let r4 = swimmersTable.insertRow().innerHTML = `<th style="width: 62%">Meet</th><th style="width: 15%">Seed</th><th style="width: 15%">Time</th><th style="width: 8%"></th>`
                for (let times in results) {
                    let splits = "";
                    for (let split in results[times]['splits']) {
                        splits += `${formatTime(results[times]['splits'][split])} `
                    }
                    console.log(results[times])
                    let r3 = swimmersTable.insertRow().innerHTML = `<td style="width: 62%">${results[times]['meet']['name']}</td><td style="width: 15%">${relay(results[times]['seed'])}</td><td style="width: 15%">${splitsf(splits, results[times]['time'])}</td><td style="width: 8%">${standards(results[times])}</td>`
                }
                dataCell.appendChild(swimmersTable)
                d.appendChild(eventTable)
            }
            d1.appendChild(resultTable)
        })
}

getSwimmer(true);