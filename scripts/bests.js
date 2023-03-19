
function getRoster () {
    let s = document.getElementById("rosters");
    console.log(s)
    let value = s.value;
    if (value === "all") {
        fetch("https://api.sagh-st.org/teams/SAGH/roster/all", {method: "GET"})
            .then(response => response.json())
            .then(json => {
                    let t = document.getElementById("bests");
                    t.innerHTML = "";
                    for (let swimmer of json) {
                        let g = swimmer['gender'].toUpperCase();
                        let r1 = t.insertRow();
                        let d1 = r1.insertCell();
                        let swimmerTable = document.createElement('table');
                        swimmerTable.className = "swimmer"
                        let row = swimmerTable.insertRow(0);
                        let nameCell = row.insertCell(0).innerText = `${swimmer['last_name']}, ${swimmer['first_name']} ${swimmer['middle_name']} ('${swimmer['class']})`;
                        console.log(swimmer)
                        nameCell.className = "namecell";
                        let dataCell = row.insertCell(1);
                        dataCell.className = "datacell";
                        let timesTable = document.createElement('table');
                        timesTable.insertRow().innerHTML = `<th style="width: 25%">Event</th><th style="width: 25%">Time</th><th style="width: 55%">Meet</th>`;
                        timesTable.className = 'times';
                        fetch("https://api.sagh-st.org/swimmers/" + swimmer['id'] + "/best")
                            .then(resp => resp.json())
                            .then(json1 => {
                                const events = [`${g}200F`, `${g}200M`, `${g}50F`, `${g}100L`, `${g}100F`, `${g}500F`, `${g}100B`, `${g}100S`]
                                for (let event of events) {
                                    let entry = json1[event];
                                    console.log(entry)
                                    let time_data = `<td style="width: 25%">${entry['time']}`
                                    if (entry['seed'] === "RELAY_LEADOFF") {
                                        time_data += " <span title='Official Split'>R</span>"
                                    }
                                    if (entry['standards'] != null) {
                                        time_data += ` <span title=` + `"${entry['standards']['name']}"` + `>` + entry['standards']['short_name'] + "</span>"
                                    }
                                    time_data += "</td>"
                                    timesTable.insertRow().innerHTML = `<td style="width: 25%">${entry['event']['name']}</td>${time_data}<td style="width: 55%">${entry['meet']['name']}</td>`
                                }
                                dataCell.appendChild(timesTable);
                            })
                        d1.appendChild(swimmerTable)
                    }
                }
            )
    }
    if (value === "current") {
        fetch("https://api.sagh-st.org/teams/SAGH/roster/current", {method: "GET"})
            .then(response => response.json())
            .then(json => {
                    let t = document.getElementById("bests");
                    t.innerHTML = "";
                    for (let swimmer of json) {
                        let g = swimmer['gender'].toUpperCase();
                        let r1 = t.insertRow();
                        let d1 = r1.insertCell();
                        let swimmerTable = document.createElement('table');
                        swimmerTable.className = "swimmer"
                        let row = swimmerTable.insertRow(0);
                        let nameCell = row.insertCell(0).innerText = `${swimmer['last_name']}, ${swimmer['first_name']} ${swimmer['middle_name']} ('${swimmer['class']})`;
                        console.log(swimmer)
                        nameCell.className = "namecell";
                        let dataCell = row.insertCell(1);
                        dataCell.className = "datacell";
                        let timesTable = document.createElement('table');
                        timesTable.insertRow().innerHTML = `<th style="width: 25%">Event</th><th style="width: 25%">Time</th><th style="width: 55%">Meet</th>`;
                        timesTable.className = 'times';
                        fetch("https://api.sagh-st.org/swimmers/" + swimmer['id'] + "/best")
                            .then(resp => resp.json())
                            .then(json1 => {
                                const events = [`${g}200F`, `${g}200M`, `${g}50F`, `${g}100L`, `${g}100F`, `${g}500F`, `${g}100B`, `${g}100S`]
                                for (let event of events) {
                                    let entry = json1[event];
                                    console.log(entry)
                                    let time_data = `<td style="width: 25%">${entry['time']}`
                                    if (entry['seed'] === "RELAY_LEADOFF") {
                                        time_data += " <span title='Official Split'>R</span>"
                                    }
                                    if (entry['standards'] != null) {
                                        time_data += ` <span title=` + `"${entry['standards']['name']}"` + `>` + entry['standards']['short_name'] + "</span>"
                                    }
                                    time_data += "</td>"
                                    timesTable.insertRow().innerHTML = `<td style="width: 25%">${entry['event']['name']}</td>${time_data}<td style="width: 55%">${entry['meet']['name']}</td>`
                                }
                                dataCell.appendChild(timesTable);
                            })
                        d1.appendChild(swimmerTable)
                    }
                }
            )
    }
}