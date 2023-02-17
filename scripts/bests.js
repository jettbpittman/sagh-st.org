let s = document.querySelector("#season-selector");
console.log(s)
let value = "all"
if (value === "all") {
    fetch("https://api.sagh-st.org/teams/SAGH/roster/all", { method: "GET" })
        .then(response => response.json())
        .then(json => {
            let t = document.getElementById("bests");
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
                let timesTable = document.createElement('table')
                timesTable.className = 'times';
                fetch("https://api.sagh-st.org/swimmers/" + swimmer['id'] + "/best")
                    .then(resp => resp.json())
                    .then(json1 => {
                        const events = [`${g}200F`, `${g}200M`, `${g}50F`, `${g}100L`, `${g}100F`, `${g}500F`, `${g}100B`, `${g}100S`]
                        for (let event of events) {
                            let entry = json1[event];
                            console.log(entry)
                            if (entry['seed'] === "RELAY_LEADOFF") {
                                entry['time'] += "R"
                            }
                            timesTable.insertRow().innerHTML = `<td style="width: 25%">${entry['event']['name']}</td><td style="width: 20%">${entry['time']}</td><td style="width: 55%">${entry['meet']['name']}</td>`
                        }
                        dataCell.appendChild(timesTable);
                    })
                d1.appendChild(swimmerTable)
            }
        }
)
}