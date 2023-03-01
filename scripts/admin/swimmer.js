
fetch("https://api.sagh-st.org/teams/SAGH/roster/all")
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

function getSwimmer (param) {
    let swimmerID = getSID(param);
    console.log(swimmerID)
    fetch("https://api.sagh-st.org/swimmers/" + swimmerID)
        .then(response => response.json())
        .then(json => {
            let box = document.getElementById("swimmer-info");
            box.innerHTML = "";
            let data = document.createElement("p");
            data.innerHTML = `<b>Name - </b> ${json['last_name']}, ${json['first_name']} ${json['middle_name']}<br><b>Class of 20${json['class']}</b>`
            box.appendChild(data);
        })
    fetch("https://api.sagh-st.org/swimmers/" + swimmerID + "/entries")
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
                    console.log(results[times])
                    let r3 = swimmersTable.insertRow().innerHTML = `<td style="width: 62%">${results[times]['meet']['name']}</td><td style="width: 15%">${relay(results[times]['seed'])}</td><td style="width: 15%">${results[times]['time']}</td><td style="width: 8%">${standards(results[times])}</td>`
                }
                dataCell.appendChild(swimmersTable)
                d.appendChild(eventTable)
            }
            d1.appendChild(resultTable)
        })
}

getSwimmer(true);