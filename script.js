function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function checkCookie() {
    let user = getCookie("username");
    if (user == "") {
        window.location.href="https://www.webtrafficexchange.co.uk";
    } 
  }

  function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
function register(){
    var username=document.getElementById('registration-username').value
    var password=document.getElementById('registration-password').value
    var email=document.getElementById('registration-email').value
   
    fetch('https://os6p24onhg.execute-api.eu-north-1.amazonaws.com/live/register', {
     method: 'POST',
     body: JSON.stringify({
       username:username,
       password:password,
       email:email
   
     }),
     headers: {
       'Content-type': 'application/json; charset=UTF-8',
     }
     })
    .then(response => response.json())
     .then(data => {
           if (JSON.parse(data['body']).hasOwnProperty('user_name')) {
               setCookie("username",JSON.parse(data['body'])['user_name'],60)
               setCookie("session",JSON.parse(data['body'])['session_id'],0.01)
               window.location.href = "https://www.webtrafficexchange.co.uk/home.html"
           }
           else{
               document.getElementById('signup-warning').innerText ='Error occurred while registering user';
           }
      })
     .catch((error) => {
      console.error('Error:', error);
      document.getElementById('signup-warning').innerText ='Error occurred while registering user';
   });
   }
   
   function login(){
    var username=document.getElementById('login-username').value
    var password=document.getElementById('login-password').value
   
    fetch('https://os6p24onhg.execute-api.eu-north-1.amazonaws.com/live/login', {
     method: 'POST',
     body: JSON.stringify({
       username:username,
       password:password
   
     }),
     headers: {
       'Content-type': 'application/json; charset=UTF-8',
     }
     })
    .then(response => response.json())
     .then(data => {
           if (JSON.parse(data['body']).hasOwnProperty('user_name')) {
             setCookie("username",JSON.parse(data['body'])['user_name'],60)
             setCookie("session",JSON.parse(data['body'])['session_id'],1)
             window.location.href = "https://www.webtrafficexchange.co.uk/home.html"
           }
           else{
               document.getElementById('login-warning').innerText ='Invalid username password';
           }
      })
     .catch((error) => {
      console.error('Error:', error);
      document.getElementById('login-warning').innerText ='Invalid username password';
   });
   }

   function logoff(){
    deleteAllCookies();
    window.location.href = "https://www.webtrafficexchange.co.uk/index.html"
   }


function initialize(){
    checkCookie();
    document.getElementById("username").addEventListener("click", function(e) {
        document.getElementById("myDropdown").classList.toggle("show");
        });
    
    
        // Close the dropdown if the user clicks outside of it
        window.addEventListener("click", function(event) {
        if (!event.target.matches('.dropbtn')) {
            document.querySelectorAll(".dropdown-content.show")
            .forEach(openDropdown => openDropdown.classList.remove('show'))
        }
        });
    document.getElementById("username").innerHTML=getCookie("username");
    // main.js

    // POST request using fetch()
    fetch("https://os6p24onhg.execute-api.eu-north-1.amazonaws.com/live/search_sites", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify(
            {
            user_name: getCookie("username"),
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
            if(JSON.parse(data['body']['sites']).length == 0){
                document.getElementById("earn-minute-manual").style.visibility = 'hidden'
                document.getElementById("earn-minute-auto").style.visibility = 'hidden'
                document.getElementById("credit").style.visibility = 'hidden'
                document.getElementById("guide-step2").style.visibility = 'hidden'
            }
            else{
                document.getElementById("earn-minute-manual").style.visibility = 'visible'
                document.getElementById("earn-minute-auto").style.visibility = 'visible'
                document.getElementById("credit").style.visibility = 'visible'
                document.getElementById("guide-step2").style.visibility = 'visible'
                console.log(data);
                document.getElementById("sites").innerHTML="";
                constructTable(JSON.parse(data['body']['sites']), document.getElementById("sites"))
                document.getElementById("current_balance").innerHTML=JSON.parse(data['body']['credit']);
                setCookie("credit",data['body']['credit'], 1)
            }
            
        }
        else{
            window.location.href="https://www.webtrafficexchange.co.uk";
        }

    })
    .catch(error =>{
        console.log(error);
        window.location.href="https://www.webtrafficexchange.co.uk";
    })

}


function constructTable(list, selector, append_action=true) {

// Getting the all column names
    let cols = Headers(list, selector,append_action);

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
        if(list[i][cols[1]] == "BLOCKED"){
            row.addClass("row-blocked");
        }
        else if(list[i][cols[1]] == "INACTIVE"){
            row.addClass("row-inactive");
            row.append($('<td/>').html('<input type="button" class="button-row" value="view" onclick="viewtestpage(\'' + list[i][cols[0]] +'\')">'));
            row.append($('<td/>').html('<input type="button" class="button-row" value="Add" onclick="add_remove_site(\'' + list[i][cols[0]] +'\',\'ADD\')">'));
        }
        else if(list[i][cols[1]] == "ACTIVE"){
            row.addClass("row-active");
            row.append($('<td/>').html('<input type="button" class="button-row" value="view" onclick="viewtestpage(\'' + list[i][cols[0]] +'\')">'));
            row.append($('<td/>').html('<input type="button" class="button-row" value="remove" onclick="add_remove_site(\'' + list[i][cols[0]] +'\',\'REMOVE\')">'));
        }
        
        // Adding each row to the table
        $(selector).append(row);
    }
    }

function Headers(list, selector, append_action) {
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
    if(append_action){
        header.append($('<th/>').html("TEST PAGE"));
        header.append($('<th/>').html("ACTION"));
    }
    

    // Appending the header to the table
    $(selector).append(header);
    return columns;
}

function add_site(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    site = document.getElementById("site_url").value;
    if(site === null || site.trim().length === 0){
        return;
    }
    // POST request using fetch()
    fetch("https://os6p24onhg.execute-api.eu-north-1.amazonaws.com/live/sites", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify(
            {
            user_name: getCookie("username"),
            session_id: getCookie("session"),
            site_url: site,
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
            document.getElementById("earn-minute-manual").style.visibility = 'visible';
            document.getElementById("earn-minute-auto").style.visibility = 'visible';
            document.getElementById("credit").style.visibility = 'visible';
            document.getElementById("guide-step2").style.visibility = 'visible';
                
            document.getElementById("sites").innerHTML="";
            document.getElementById("site_url").value="";
            constructTable(JSON.parse(data['body']), document.getElementById("sites"));
        }
        else{
            window.location.href="https://www.webtrafficexchange.co.uk";
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
            document.getElementById("earn-minute-manual").style.visibility = 'visible';
            document.getElementById("earn-minute-auto").style.visibility = 'visible';
            document.getElementById("credit").style.visibility = 'visible';
            document.getElementById("guide-step2").style.visibility = 'visible';
                
            var element =  document.getElementById("sites");
            if (typeof(element) != 'undefined' && element != null)
            {
                element.innerHTML="";
                element.value="";
                constructTable(JSON.parse(data['body']), element);
            }
            
        }
        else{
            window.location.href="https://www.webtrafficexchange.co.uk";
        }
        }
    )
    .catch(error =>{
        console.log(error);
        window.location.href="https://www.webtrafficexchange.co.uk";
    })

}
function start_traffic_exchange(type){
    if(type=='AUTO'){
        window.open('https://www.webtrafficexchange.co.uk/exchange.html','_blank');
    }
    else{
        window.open('https://www.webtrafficexchange.co.uk/exchange_manual.html','_blank');
    }
    
}

function initializeIframe(type='AUTO'){
    
    // POST request using fetch()
    fetch("https://os6p24onhg.execute-api.eu-north-1.amazonaws.com/live/exchange", {
        
        // Adding method type
        method: "POST",
        
        // Adding body or contents to send
        body: JSON.stringify(
            {
                user_name: getCookie("username"),
                session_id: getCookie("session"),
                type: type
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
            setCookie("credit",data['body']['credit'], 1);
            setCookie("session",data['body']['session_id'], 0.01);
            setCookie("advert",data['body']['advert'], 0.01);
            document.getElementById("advert").src=data['body']['advert'];
            document.getElementById("site_url").innerHTML=data['body']['advert'];
        }
        else{
            window.location.href="https://www.webtrafficexchange.co.uk";
        }
        
    })
    .catch(error =>{
        console.log(error);
        window.location.href="https://www.webtrafficexchange.co.uk";
    })

}

function blocksite(){
    add_remove_site(getCookie("advert"),"BLOCK");
}

function back(){
    window.location.href="https://www.webtrafficexchange.co.uk/home.html";
}

function show_messages(){
    window.location.href="https://www.webtrafficexchange.co.uk/messages.html";
}

function messages(){
    // POST request using fetch()
    fetch("https://os6p24onhg.execute-api.eu-north-1.amazonaws.com/live/messages", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify(
            {
            user_name: getCookie("username"),
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
            document.getElementById("messages").innerHTML="";
            constructTable(JSON.parse(data['body']['messages']), document.getElementById("messages"), false); 
                
        }
        else{
            window.location.href="https://www.webtrafficexchange.co.uk";
        }

    })
    .catch(error =>{
        console.log(error);
        window.location.href="https://www.webtrafficexchange.co.uk";
    })   
}

function viewtestpage(advert){
    sessionStorage.setItem("advert", advert);
    window.open(
        'https://www.webtrafficexchange.co.uk/exchange_test.html',
        '_blank' // <- This is what makes it open in a new window.
      );
    
}
