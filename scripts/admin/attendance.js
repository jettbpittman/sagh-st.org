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
                row.innerHTML = `<td style='width: 25%'>${json[swimmer]['last_name']}, ${json[swimmer]['first_name']} ${json[swimmer]['middle_name']}</td><td style='width: 5%'>${json[swimmer]['class']}</td><td style='width: 10%'>${json[swimmer]['dob']}</td><td style='width: 10%'>${usasID}</td><td style="width: 25%"><input type="radio" class="present" value="present" name="${json[swimmer]['id']}" checked><label for="present">Present</label>   <input type="radio" class="absent" value="absent" name="${json[swimmer]['id']}"><label for="absent">Absent</label></td>`
            }
        })
}

function handleSubmit (form) {
    const data = new FormData(form);
    let obj = {};
    data.forEach((value, key) => (obj[key] = value))
    console.log(obj)
}