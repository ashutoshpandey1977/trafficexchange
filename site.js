import (checkCookie,getCookie) from "cookie.js";
function initialize(){
    checkCookie();
    document.getElementById("username").innerHTML=getCookie("username");
    // main.js

    // POST request using fetch()
    fetch("https://os6p24onhg.execute-api.eu-north-1.amazonaws.com/live/search_sites", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify(
            {
            user_name: cookie.getCookie("username"),
            session_id: getCookie("session")
            }
        ),

        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    // Converting to JSON
    .then(response => response.json())
    // Displaying results to console
    .then(data => {
        if (data['statusCode']==200) {
            console.log(data);
            document.getElementById("sites").innerHTML="";
            constructTable(JSON.parse(data['body']['sites']), document.getElementById("sites"))
            document.getElementById("current_balance").innerHTML=JSON.parse(data['body']['credit']);
        }

    })
    .catch(error =>{
        console.log(error);
        window.location.href="https://www.webtrafficexchange.co.uk";
    })

}
setInterval(initialize, 600000);

function constructTable(list, selector) {

// Getting the all column names
    let cols = Headers(list, selector);

// Traversing the JSON data
    for (let i = 0; i < list.length; i++) {
        let row = $('<tr/>');
        for (let colIndex = 0; colIndex < cols.length; colIndex++) {
            let val = list[i][cols[colIndex]];

            // If there is any key, which is matching
            // with the column name
            if (val == null) val = "";
            row.append($('<td/>').html(val));
        }
        if(list[i][cols[1]] == "INACTIVE"){
            row.addClass("row-inactive");
            row.append($('<td/>').html('<input type="button" class="button-row" value="Add" onclick="add_remove_site(\'' + list[i][cols[0]] +'\',\'ADD\')">'));
        }
        else{
            row.addClass("row-active");
            row.append($('<td/>').html('<input type="button" class="button-row" value="remove" onclick="add_remove_site(\'' + list[i][cols[0]] +'\',\'REMOVE\')">'));
        }
        // Adding each row to the table
        $(selector).append(row);
    }
    }

function Headers(list, selector) {
    let columns = [];
    let header = $('<tr/>');

    for (let i = 0; i < list.length; i++) {
        let row = list[i];

        for (let k in row) {
            if ($.inArray(k, columns) == -1) {
                columns.push(k);

                // Creating the header
                header.append($('<th/>').html(k));
            }
        }

    }
    header.append($('<th/>').html("ACTION"));

    // Appending the header to the table
    $(selector).append(header);
    return columns;
}

function add_site(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // POST request using fetch()
    fetch("https://os6p24onhg.execute-api.eu-north-1.amazonaws.com/live/sites", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify(
            {
            user_name: getCookie("username"),
            session_id: getCookie("session"),
            site_url: document.getElementById("site_url").value,
            action: "ADD"
            }
        ),

        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    // Converting to JSON
    .then(response => response.json())

    // Displaying results to console
    .then(data => {
        console.log(data);
        if (data['statusCode']==200) {
            document.getElementById("sites").innerHTML="";
            document.getElementById("site_url").value="";
            constructTable(JSON.parse(data['body']), document.getElementById("sites"));
        }
        }
    )
    .catch(error =>{
        console.log(error);
        window.location.href="https://www.webtrafficexchange.co.uk";
    })

}

function add_remove_site(site_name,action){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // POST request using fetch()
    fetch("https://os6p24onhg.execute-api.eu-north-1.amazonaws.com/live/sites", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify(
            {
            user_name: getCookie("username"),
            session_id: getCookie("session"),
            site_url: site_name,
            action: action
            }
        ),

        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    // Converting to JSON
    .then(response => response.json())

    // Displaying results to console
    .then(data => {
        console.log(data);
        if (data['statusCode']==200) {
            document.getElementById("sites").innerHTML="";
            document.getElementById("site_url").value="";
            constructTable(JSON.parse(data['body']), document.getElementById("sites"));
        }
        }
    )
    .catch(error =>{
        console.log(error);
        window.location.href="https://www.webtrafficexchange.co.uk";
    })

}
function start_traffic_exchange(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    window.open('https://www.webtrafficexchange.co.uk/exchange.html','_blank');
}