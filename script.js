import { setCookie } from 'cookie.js';
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
               setCookie("username",JSON.parse(data['body'])['user_name'],0.01)
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
             setCookie("username",JSON.parse(data['body'])['user_name'],0.01)
             setCookie("session",JSON.parse(data['body'])['session_id'],0.01)
             window.location.href = window.location.href = "https://www.webtrafficexchange.co.uk/home.html"
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