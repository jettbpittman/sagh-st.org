fetchRoster()

function fetchRoster () {
    fetch("https://api.sagh-st.org/teams/SAGH/roster/current")
        .then(response => response.json())
        .then(json => {
            const rosterTable = document.getElementById("roster-table");
            rosterTable.innerHTML = "";
            let headers = rosterTable.insertRow();
            headers.innerHTML = "<th style='width: 25%'>Name</th><th style='width: 5%'>Class</th><th style='width: 10%'>DOB</th><th style='width: 10%'>USAS ID</th>"
            for (let swimmer in json) {
                let row = rosterTable.insertRow();
                let usasID;
                if (json[swimmer]['usas_id']) {
                    usasID = json[swimmer]['usas_id']
                }
                else {
                    usasID = ""
                }
                row.innerHTML = `<td style='width: 25%; text-align: left; padding-left: 6px'>${json[swimmer]['last_name']}, ${json[swimmer]['first_name']} ${json[swimmer]['middle_name']}</td><td style='width: 5%'>${json[swimmer]['class']}</td><td style='width: 10%'>${json[swimmer]['dob']}</td><td style='width: 10%'>${usasID}</td><td style="width: 25%"><input type="radio" class="present" value="present" name="${json[swimmer]['id']}" checked><label for="present">Present</label>   <input type="radio" class="absent" value="absent" name="${json[swimmer]['id']}"><label for="absent">Absent</label></td>`
            }
        })
}

function handleSubmit (form) {
    const data = new FormData(form);
    let obj = {};
    data.forEach((value, key) => (obj[key] = value))
    console.log(JSON.stringify(obj))
    fetch("https://api.sagh-st.org/attendance/submit", { method: "POST", headers: headers, body: JSON.stringify(obj)})
        .then(response => {
            if (response.status === 200) {
                let box = document.getElementById("submit-message");
                box.innerText = "Success!"
            } else {
                alert("Failed to Submit Attendance! " + response.statusText)
            }
        })
}

async function updateAttendance (date) {
    let resp = await fetch("https://api.sagh-st.org/attendance/date/" + date, {method: "GET", headers: headers})
    let json = await resp.json()
    let reset = document.getElementsByClassName("present");
    for (let i in reset) {
        reset[i].checked = true;
    }
    if (Object.keys(json).length === 1) {
        return console.log("no attendance")
    }
    delete json.date;
    for (let swimmer in json) {
        let input = document.getElementsByName(swimmer);
        input.value = json[swimmer]
        if (json[swimmer] === "absent") {
            input[1].checked=true;
        }
    }

}