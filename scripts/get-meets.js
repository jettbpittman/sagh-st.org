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
    "UT": "FFCC99",
    "PA": "99CCFF",
    "DC": "99CCFF",
    "LC": "99CCFF",
    undefined: "99CCFF"
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
    "UT": "Lee & Joe Jamail Texas Swimming Center",
    "PA": "Palo Alto Natatorium",
    "LC": "Lamar CISD Natatorium",
    "DC": "Don Cook Natatorium"
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

function getMeet () {
    let meetID = document.getElementById("meets").value;
    console.log(meetID)
    fetch("https://api.sagh-st.org/meets/" + meetID)
        .then(response => response.json())
        .then(json => {
            console.log(json)
            let t = document.getElementById("meet-results");
            t.innerHTML = "";
            let r1 = t.insertRow();
            let d1 = r1.insertCell();
            r1.className = "top-row";
            d1.style.backgroundColor = `#${venue_colors[json['venue']]}`;
            d1.innerHTML = `<p><b>${json['name']}</b><br>${venues[json['venue']]}<br>${json['date']}<br></p>`;
            let r2 = t.insertRow();
            let d2 = r2.insertCell();
            d2.style.backgroundColor = `#${venue_colors[json['venue']]}`;
            let title = document.createElement("h3");
            title.innerText = "Results";
            title.style.textDecoration = "underline";
            d2.appendChild(title);
            r2.className = "bottom-row";
            let resultTable = document.createElement('table');
            resultTable.style.width = "100%";
            fetch("https://api.sagh-st.org/meets/" + meetID + "/entries/SAGH")
                    .then(resp => resp.json())
                    .then(json1 => {
                        const events = [`F200F`, `M200F`, `F200M`, `M200M`,`F50F`, `M50F`, `F100L`, `M100L`, `F100F`, `M100F`, `F500F`, `M500F`, `F100B`, `M100B`, `F100S`, `M100S`, `F50B`, `M50B`]
                        for (let event of events) {
                            if (json1[event] === undefined) {
                                continue
                            }
                            let results = json1[event]
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
                                console.log(times)
                                if (results[times]['relay']) {
                                    try {
                                        swimmers = `1) ${results[times]['relay']['1']['last_name']}, ${results[times]['relay']['1']['first_name']} ${results[times]['relay']['1']['middle_name']}   2) ${results[times]['relay']['2']['last_name']}, ${results[times]['relay']['2']['first_name']} ${results[times]['relay']['2']['middle_name']}<br>3) ${results[times]['relay']['3']['last_name']}, ${results[times]['relay']['3']['first_name']} ${results[times]['relay']['3']['middle_name']}   4) ${results[times]['relay']['4']['last_name']}, ${results[times]['relay']['4']['first_name']} ${results[times]['relay']['4']['middle_name']}`
                                    } catch {
                                    }
                                    let r3 = swimmersTable.insertRow().innerHTML = `<td style="width: 62%">${swimmers}</td><td style="width: 15%">${relay(results[times]['seed'])}</td><td style="width: 15%">${results[times]['time']}</td><td style="width: 8%">${standards(results[times])}</td>`
                                } else {
                                    let r3 = swimmersTable.insertRow().innerHTML = `<td style="width: 62%">${results[times]['swimmer']}</td><td style="width: 15%">${relay(results[times]['seed'])}</td><td style="width: 15%">${results[times]['time']}</td><td style="width: 8%">${standards(results[times])}</td>`
                                }                            }
                            dataCell.appendChild(swimmersTable)
                            d.appendChild(eventTable)
                        }
                    })
            d2.appendChild(resultTable)
        })
}