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
               setCookie("session",JSON.parse(data['body'])['session_id'],1)
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
                document.getElementById("earn-minute-manual").style.visibility = 'visible';
                document.getElementById("earn-minute-auto").style.visibility = 'visible';
                document.getElementById("buy-minute").style.visibility = 'visible';
                document.getElementById("click-ptc-ad").style.visibility = 'visible';
                document.getElementById("credit").style.visibility = 'visible';
                
            }
            else{
                document.getElementById("earn-minute-manual").style.visibility = 'visible';
                document.getElementById("earn-minute-auto").style.visibility = 'visible';
                document.getElementById("buy-minute").style.visibility = 'visible';
                document.getElementById("click-ptc-ad").style.visibility = 'visible';
                document.getElementById("credit").style.visibility = 'visible';
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
    });
  
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
        if(list[i][cols[2]] == "BLOCKED"){
            row.addClass("row-blocked");
        }
        else if(list[i][cols[1]] == "INACTIVE"){
            row.addClass("row-inactive");
            row.append($('<td/>').html('<input type="button" class="button-row" value="view" onclick="viewtestpage(\'' + list[i][cols[0]] +'\')">'));
            row.append($('<td/>').html('<input type="button" class="button-row" value="Add" onclick="add_remove_site(\'' + list[i][cols[0]] +'\',\'ADD\')">'));
        }
        else if(list[i][cols[2]] == "ACTIVE"){
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

function add_site(type='SITE'){
    site = '';
    description = '';
    reward = '1';
    if (type === 'SITE'){
        site = document.getElementById("site_url").value;
        if(site === null || site.trim().length === 0){
            return;
        }
    }
    if (type === 'PTC'){
        site = document.getElementById("ptc_ad_site_url").value;
        if(site === null || site.trim().length === 0){
            return;
        }
        description = document.getElementById("banner_description").value;
        if(image_url === null || image_url.trim().length === 0){
            return;
        }
        reward = document.getElementById("banner_rewards_click").value;
        if(reward === null || reward.trim().length === 0){
            return;
        }
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
            type: type,
            description: description,
            reward: reward,
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
            document.getElementById("buy-minute").style.visibility = 'visible';
            document.getElementById("click-ptc-ad").style.visibility = 'visible';
            document.getElementById("credit").style.visibility = 'visible';
                
            document.getElementById("sites").innerHTML="";
            if(type==='SITE'){
                document.getElementById("site_url").value="";
            }
            if(type==='PTC'){
                document.getElementById("ptc_ad_site_url").value="";
                document.getElementById("banner_image_url").value="";
            
            }
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
            document.getElementById("buy-minute").style.visibility = 'visible';
            document.getElementById("click-ptc-ad").style.visibility = 'visible';
            document.getElementById("credit").style.visibility = 'visible';
                
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
function initializePTCScreen(){
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
    
}
function getPTCAd(advert ='', advertiser = '', reward=0){
    display = document.querySelector('#time');
    display.innerHTML="1:00"
    display.style.backgroundColor ='#eee';
    document.getElementById("warning").style.visibility="hidden";
    // POST request using fetch()
    fetch("https://os6p24onhg.execute-api.eu-north-1.amazonaws.com/live/exchange", {
        
        // Adding method type
        method: "POST",
        
        // Adding body or contents to send
        body: JSON.stringify(
            {
                user_name: getCookie("username"),
                session_id: getCookie("session"),
                type: 'AUTO',
                adType: 'PTC',
                advert: advert,
                advertiser: advertiser,
                reward: reward
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
            body = JSON.parse(data['body'])
            setCookie("session",body[0]['session_id'], 1);
            ptc_ads=document.getElementsByClassName("ptc-ad-container");
             
            for (var i=0;i<ptc_ads.length;i++){
                image=document.getElementById("ptc-advert"+i) ;
                document.getElementById("text"+i).innerHTML = body[i]['description'].substring(0, 50);
                document.getElementById("reward"+i).innerHTML=body[i]['reward'] + " TOKENS";
                image.addEventListener("click", click_ptc_advert);
                image.advert=body[i]['site_url'];
                image.reward = body[i]['reward'];
                image.advertiser = body[i]['user_name'];
            } 
             for (var i = 0; i < ptc_ads.length; i ++) {
                ptc_ads[i].style.visibility = 'visible';
            }
            
        }
        else{
             console.log(data);
            window.location.href="https://www.webtrafficexchange.co.uk";
        }
        
    })
    .catch(error =>{
        console.log(error);
        window.location.href="https://www.webtrafficexchange.co.uk";
    })
}

function click_ptc_advert(evt){
    var oneMinutes = 60 * 1,
    display = document.querySelector('#time');
    
    startTimer(evt.currentTarget.advert, evt.currentTarget.advertiser, evt.currentTarget.reward, oneMinutes, display); 
}

function startTimer(advert, advertiser, reward, duration, display) {
    document.getElementById("warning").style.visibility="hidden";
    for (var i = 0; i < ptc_ads.length; i ++) {
        ptc_ads[i].style.visibility = 'hidden';
    }
    ptc_window_handle = window.open(
        advert,
        '_blank' 
      );
    var timer = duration, minutes, seconds;
    var countDownTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        if(ptc_window_handle.closed){
            document.getElementById("warning").innerHTML="You closed PTC Ad window too soon.";
            document.getElementById("warning").style.visibility="visible";
        }
        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
    setTimeout( function() {
        clearInterval(countDownTimer);
        if(!ptc_window_handle.closed){
            getPTCAd(advert, advertiser, reward); 
        }
        }, 60000);
}

function exchangeTimer(duration, display) {
    var timer = duration, minutes, seconds;
    display.style.backgroundColor ='#F4C2C2';
    var countDownTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        
        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
    setTimeout( function() {
        display.style.backgroundColor ='#eee'
        clearInterval(countDownTimer);
        }, 60000);
}

function initializeIframe(type='AUTO', adType='SITE'){
    
    // POST request using fetch()
    fetch("https://os6p24onhg.execute-api.eu-north-1.amazonaws.com/live/exchange", {
        
        // Adding method type
        method: "POST",
        
        // Adding body or contents to send
        body: JSON.stringify(
            {
                user_name: getCookie("username"),
                session_id: getCookie("session"),
                type: type,
                adType: adType
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
            setCookie("session",data['body']['session_id'], 1);
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
