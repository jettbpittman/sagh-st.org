fetch("https://api.ghmvswim.org/info")
        .then(response => response.json())
        .then(json => {
            let sp = document.getElementById("db-stats");
            let p = document.createElement("p");
            p.innerText = `Athletes - ${json['athletes']}\nMeets - ${json['meets']}\nEntries - ${json['entries']}`;
            sp.appendChild(p);
        })