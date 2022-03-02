async function getNbgAPI() {
    let nbgResponse = await fetch("https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json");
    let nbgJson = await nbgResponse.json();
    let date = nbgJson[0].date;
    let currencies = nbgJson[0].currencies;
    let currencyHeader = Object.keys(currencies[0]);

    let tableParent = document.querySelector(".table");
    let dateEl = document.createElement("div");
    let tableEl = document.createElement("table");
    dateEl.className = "date";
    tableEl.style.borderSpacing = '25px'
    tableParent.before(dateEl);
    tableParent.append(tableEl);

    dateEl.textContent = new Date(date);
    await generateTableHead(tableEl, currencyHeader);
    await generateTable(tableEl, currencies)
}

getNbgAPI().catch(console.log);

async function generateTableHead(table, currencies) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let currency of currencies) {
        let th = document.createElement("th");
        th.style.textTransform = 'capitalize'
        let text = document.textContent = currency;
        th.append(text);
        row.append(th);
    }
}

async function generateTable(table, data) {
    for(let el of data) {
        let row = table.insertRow();
        for(let key in el) {
            let cell = row.insertCell();
            let text;
            key == 'date' || key == 'validFromDate' ? text = document.textContent = new Date(el[key]) : text = document.textContent = el[key];
            cell.append(text)
        }
    }
}