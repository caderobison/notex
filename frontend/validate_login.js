// import { storeUser } from './index.js';
// var this_username;
function login(){
    let bool = validateLogin();
    // if (bool) window.location.href = "index.html";
    
	let userNameInput = document.getElementById("username");
    let passwordInput  = document.getElementById("password");	
	
	if (bool) fetch("/login", {
		method: "POST",
		headers: {'Content-Type': 'application/json'}, 
		body: "{ \"username\": \"" + userNameInput.value + "\", \"password\": \"" + passwordInput.value + "\" }"
	}).then(response => response.json()).then(data => {
		if (data.response == "Success") {
            document.cookie = "username="+userNameInput.value+";";
            window.location.href = "index.html"
            // storeUser(userNameInput); //need this function from index.js
		} else {
            displayInvalidLogin("username");
			displayInvalidLogin("password");
		}
	});
    
    
	
	
	/*.then(res => {
        let status = res.json()
		console.log(status.);
	});*/
}

function validateLogin(){
    let userBox = document.getElementById("username");
    let passBox  = document.getElementById("password");
    let userBool = true;
    let passBool = true;
    if(userBox.value == "") userBool = false;
    if(passBox.value == "") passBool = false;
    getErrorMessageLogin("username", userBool);
    getErrorMessageLogin("password", passBool);
    if (userBool && passBool){
        return true;
    }
    return false;
}
function getErrorMessageLogin(index, bool){
    var label = document.getElementById(index+"Label");
    var div = document.getElementById(index + "Div");
    if(!bool){
        div.style.backgroundColor = "rgba(255, 143, 143, 0.5)";
    } 
    if(bool){
        div.style.backgroundColor = "lightgray";
        label.innerHTML = "";
    }
    else {
        label.innerHTML = "Please enter your " + index;
    }
}
function displayInvalidLogin(index){
    var label = document.getElementById(index+"Label");
    var div = document.getElementById(index + "Div");

    div.style.backgroundColor = "rgba(255, 143, 143, 0.5)";
    

    label.innerHTML = "Invalid username or password!";
    
}
