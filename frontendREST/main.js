//invia richiesta GET al webservice e ritorna l'oggetto xhr per gestire il risultato
function GET(async = true)
{
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:8080/api/tutorial/1.0/employees/", async);
    xhr.send();

    return xhr;
}

//stesso di sopra ma con id
function GET_id(id, async = true)
{
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:8080/api/tutorial/1.0/employees/" + id, async);
    xhr.send();

    return xhr;
}

//invia una richiesta POST per aggiungere un nuovo impiegato e ritorna l'oggetto xhr
function POST(emp, async = true) 
{
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:8080/api/tutorial/1.0/employees/", async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(emp));

    return xhr;
}

//invia una richiesta DELETE per rimuovere un impiegato e ritorna l'oggetto xhr
function DELETE(id, async = true) 
{
    var xhr = new XMLHttpRequest();

    xhr.open("DELETE", "http://localhost:8080/api/tutorial/1.0/employees/" + id, async);
    xhr.send();

    return xhr;
}

//invia una richiesta PUT per aggiornare un impiegato e ritorna l'oggetto xhr
function PUT(emp, async = true) 
{
    var xhr = new XMLHttpRequest();

    xhr.open("PUT", "http://localhost:8080/api/tutorial/1.0/employees/" + emp.employeeId, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(emp));

    return xhr;
}

//reset del contenuto della tabella (tranne la riga dell'header) e riempimento con dati passati per argomento
function updateEmployeesInTable(emps)
{
    var tbody = document.getElementById("contenutoTabella");
    tbody.innerHTML = "";

    for (let i = 0; i < emps.length; i++) 
    {
        let riga = tbody.insertRow();

        let cellaNome = riga.insertCell(0);
        let cellaCognome = riga.insertCell(1);
        let cellaEmail = riga.insertCell(2);
        let cellaTelefono = riga.insertCell(3);
        let cellaControllo = riga.insertCell(4);
        
        cellaNome.innerHTML = emps[i].firstName;
        cellaCognome.innerHTML = emps[i].lastName;
        cellaEmail.innerHTML = emps[i].email;
        cellaTelefono.innerHTML = emps[i].phone;
        cellaControllo.innerHTML = `<button class="btn" onclick="updateEmployee(${emps[i].employeeId}, prompt('Nome'), prompt('Cognome'), prompt('Email'), prompt('Telefono'))"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg></button><button class="btn" onclick="removeEmployee(${emps[i].employeeId})"><i class="fa fa-trash"></i></button>`;
        cellaControllo.style.textAlign = "center";
    }    
}

//aggiunge un nuovo impiegato
function addNewEmployee(firstName, lastName, email, phone)
{
    let emp = {
        employeeId: Math.floor(Math.random() * 1000000),
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone
    };

    POST(emp).onreadystatechange = function(){
        if (this.readyState == XMLHttpRequest.DONE && this.status == 201)
        {
            GET().onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 200) 
                    updateEmployeesInTable(JSON.parse(this.response));
            }
        }
    };
}

//rimuove un impiegato
function removeEmployee(id) 
{
    DELETE(id).onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200)
        {
            GET().onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 200) 
                    updateEmployeesInTable(JSON.parse(this.response));
            }
        }
    }; 
}

//aggiorna un impiegato
function updateEmployee(id, firstName, lastName, email, phone) 
{
    let emp = {
        employeeId: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone
    };

    PUT(emp).onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200)
        {
            GET().onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 200) 
                    updateEmployeesInTable(JSON.parse(this.response));
            }
        }
    }; 
}

//MAIN - inizio programma

GET().onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) 
        updateEmployeesInTable(JSON.parse(this.response));
}