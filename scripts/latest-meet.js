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

fetch("https://api.sagh-st.org/latest/meet", { method: "GET" })
        .then(response => response.json())
        .then(json => {
            let t = document.getElementById("recent-meet");
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
            fetch("https://api.sagh-st.org/meets/" + json['id'] + "/entries/SAGH")
                    .then(resp => resp.json())
                    .then(json1 => {
                        const events = [`I200RM`, `F200RM`, `M200RM`,`F200F`, `M200F`, `F200M`, `M200M`,`F50F`, `M50F`, `F100L`, `M100L`, `F100F`, `M100F`, `F500F`, `M500F`, `F200RF`, `M200RF`, `I100RF`,`F100B`, `M100B`, `F100S`, `M100S`, `F400RF`, `M400RF`, `F50B`, `M50B`, `I50B`, `F50S`, `M50S`, `F50L`, `M50L`, `F100M`, `M100M`, `F200B`, `M200B`, `F200S`, `M200S`, `F200L`, `M200L`,`F400RM`, `M400RM`, `F400M`, `M400M`, `F1000F`, `M1000F`, `F1650F`, `M1650F`, `F800RF`, `M800RF`, `F500RF`, `M500RF`]
                        for (let event of events) {
                            console.log(event)
                            if (json1[event] === undefined) {
                                continue
                            }
                            let results = json1[event]
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
                    })
            d2.appendChild(resultTable)
        })