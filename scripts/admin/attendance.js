fetchRoster()

function fetchRoster () {
    fetch("https://api.ghmvswim.org/teams/SAGH/roster/current", { headers: headers })
        .then(response => response.json())
        .then(json => {
            const rosterTable = document.getElementById("roster-table");
            rosterTable.innerHTML = "";
            let headers = rosterTable.insertRow();
            headers.innerHTML = "<th style='width: 25%'>Name</th><th style='width: 5%' class='desktop'>Class</th><th style='width: 10%' class='desktop'>DOB</th><th style='width: 10%' class='desktop'>USAS ID</th><th></th>"
            for (let swimmer in json) {
                let row = rosterTable.insertRow();
                let usasID;
                let dob;
                if (json[swimmer]['usas_id']) {
                    usasID = json[swimmer]['usas_id']
                }
                else {
                    usasID = ""
                }
                if (json[swimmer]['dob']) {
                    dob = json[swimmer]['dob']
                }
                else {
                    dob = ""
                }
                row.innerHTML = `<td style='width: 25%; text-align: left; padding-left: 6px'>${json[swimmer]['last_name']}, ${json[swimmer]['first_name']} ${json[swimmer]['middle_name']}</td><td class="desktop" style='width: 5%'>${json[swimmer]['class']}</td><td class="desktop" style='width: 10%'>${dob}</td><td class="desktop" style='width: 10%'>${usasID}</td><td class="mobile" style="width: 5%"><div class="mobile-hover" style="width: 100%; user-select: none; -webkit-user-select: none;"><span id="swimmer-info-dropdown"><b><i style="font-size: large">i</i></b></span><div class="swimmer-information"><table class="swimmer-info-table"><tr><td>Class</td><td>${json[swimmer]['class']}</td></tr><tr><td>DOB</td><td>${dob}</td></tr><tr><td>USAS ID</td><td>${usasID}</td></tr></table></div></div></td><td style="width: 25%"><input type="radio" class="present" value="present" name="${json[swimmer]['id']}" checked><label for="present">Present</label>   <input type="radio" class="absent" value="absent" name="${json[swimmer]['id']}"><label for="absent">Absent</label></td>`
            }
        })
    fetch("https://api.ghmvswim.org/teams/SAGH/roster/current/managers", { headers: headers })
        .then(response => response.json())
        .then(json => {
            const rosterTable = document.getElementById("manager-table");
            rosterTable.innerHTML = "";
            let headers = rosterTable.insertRow();
            headers.innerHTML = "<th style='width: 25%'>Name</th><th style='width: 5%' class='desktop'>Class</th><th style='width: 10%' class='desktop'>DOB</th><th></th>"
            for (let swimmer in json) {
                let row = rosterTable.insertRow();
                let dob;
                if (json[swimmer]['dob']) {
                    dob = json[swimmer]['dob']
                }
                else {
                    dob = ""
                }
                row.innerHTML = `<td style='width: 25%; text-align: left; padding-left: 6px'>${json[swimmer]['last_name']}, ${json[swimmer]['first_name']} ${json[swimmer]['middle_name']}</td><td class="desktop" style='width: 5%'>${json[swimmer]['class']}</td><td class="desktop" style='width: 10%'>${dob}</td><td class="mobile" style="width: 5%"><div class="mobile-hover" style="width: 100%; user-select: none; -webkit-user-select: none;"><span id="swimmer-info-dropdown"><b><i style="font-size: large">i</i></b></span><div class="swimmer-information"><table class="swimmer-info-table"><tr><td>Class</td><td>${json[swimmer]['class']}</td></tr><tr><td>DOB</td><td>${dob}</td></tr></table></div></div></td><td style="width: 25%"><input type="radio" class="present" value="present" name="${json[swimmer]['id']}" checked><label for="present">Present</label>   <input type="radio" class="absent" value="absent" name="${json[swimmer]['id']}"><label for="absent">Absent</label></td>`
            }
        })

}

function handleSubmit (form) {
    const data = new FormData(form);
    let obj = {};
    data.forEach((value, key) => (obj[key] = value))
    console.log(JSON.stringify(obj))
    fetch("https://api.ghmvswim.org/attendance/submit", { method: "POST", headers: headers, body: JSON.stringify(obj)})
        .then(response => {
            if (response.status === 200) {
                let box = document.getElementById("submit-message");
                box.innerText = "Success!"
            } else {
                alert("Failed to Submit Attendance! " + response.statusText)
            }
        })
}

async function updateAttendance () {
    if (document.readyState === "complete") {
        const date = document.getElementById("date").value;
        const type = document.getElementById("type").value;
        let resp = await fetch("https://api.ghmvswim.org/attendance/date/" + date + "/" + type, {
            method: "GET",
            headers: headers
        })
        let json = await resp.json()
        let reset = document.getElementsByClassName("present");
        for (let i in reset) {
            reset[i].checked = true;
        }
        if (Object.keys(json).length === 1) {
            let d = document.getElementById("attendance-message");
            d.innerText = "No Attendance Submitted!"
            return console.log("no attendance")
        } else {
            let d = document.getElementById("attendance-message");
            d.innerHTML = "";
        }
        delete json.date;
        console.log(json)
        for (let swimmer in json) {
            let input = document.getElementsByName(swimmer);
            input.value = json[swimmer]
            if (json[swimmer] === "absent") {
                input[1].checked = true;
            }
        }
    }
}