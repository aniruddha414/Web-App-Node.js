console.log("JS is running");
var username="";
var password="";
 document.getElementById("loginButton").addEventListener("click",function () {
   username = document.getElementById("emailInput").value;
   password = document.getElementById("passwordInput").value;

   console.log("username : "+username);
   console.log("password : "+password);
 });
