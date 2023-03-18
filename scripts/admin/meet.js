venue_colors = {
    "AH": "F8FFB0",
    "AM": "FFCCCC",
    "BU": "FFCCFF",
    "CC": "99CCFF",
    "CO": "99CCFF",
    "NE": "CCCCFF",
    "NS": "66DD88",
    "SA": "FFCC99",
    "SW": "99FFCC",
    "TM": "FFFFFF",
    "UT": "FFCC99"
}

venues = {
    "AH": "Alamo Heights Natatorium",
    "AM": "Texas A&M Student Recreation Center Natatorium",
    "BU": "YMCA of the Highland Lakes",
    "CC": "Corpus Cristi ISD Natatorium",
    "CO": "Coronado Pool",
    "NE": "Josh Davis Natatorium/Bill Walker Pool",
    "NS": "NISD Natatorium & Swim Center",
    "SA": "San Antonio Natatorium",
    "SW": "Southwest Aquatic Center",
    "TM": "TMI Episcopal",
    "UT": "Lee & Joe Jamail Texas Swimming Center"
}

fetch("https://api.sagh-st.org/meets")
        .then(response => response.json())
        .then(json => {
            let html = "";
            for (let meet in json) {
                html += "<option value=" + json[meet]['id']  + ">" + json[meet]['name'] + "</option>"
            }
            let select = document.getElementById("meets");
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
        return "Men's"
    }
    if (code[0] === "F") {
        return "Women's"
    }
}

function relay (seed) {
    if (seed === "RELAY_LEADOFF") {
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

function getMeet (param) {
    let meetID = getMID(param);
    console.log(meetID)
    fetch("https://api.sagh-st.org/meets/" + meetID)
        .then(response => response.json())
        .then(json => {
            let box = document.getElementById("meet-info");
            box.innerHTML = "";
            let data = document.createElement("p");
            data.innerHTML = `<b>${json['name']}</b><br>${venues[json['venue']]}`
            let id = document.createElement("p");
            id.innerText = json['id'];
            id.id = "meet-id";
            box.appendChild(data);
            box.appendChild(id);
            let infoBox = document.getElementById("meet-information");
            infoBox.style.visibility = "visible";
            infoBox.style.backgroundColor = `#${venue_colors[json['venue']]}`;
        })
    fetch("https://api.sagh-st.org/meets/" + meetID + "/entries")
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
                    console.log(results[times])
                    let r3 = swimmersTable.insertRow().innerHTML = `<td style="width: 62%">${results[times]['swimmer']}</td><td style="width: 15%">${relay(results[times]['seed'])}</td><td style="width: 15%">${results[times]['time']}</td><td style="width: 8%">${standards(results[times])}</td>`
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
    fetch("https://api.sagh-st.org/entries", { method: "POST", headers: headers, body: JSON.stringify(data) } )
        .then(response => {
            if (response.status === 200) {
                let respb = document.getElementById("response-message");
                respb.innerText = "Success!"
                getMeet(false)
            } else {
                let respb = document.getElementById("response-message");
                respb.innerText = `Failed - ${response.statusText}`
            }
        })
}