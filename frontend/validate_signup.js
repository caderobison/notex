// import { storeUser } from 'index.js';
// var this_username;
function signup(){
    let bool = validate_all();
    //if (bool) window.location.href = "index.html"; 
	
	let userNameInput = document.getElementById("username");
    let passwordInput  = document.getElementById("password");	
	let firstnameInput  = document.getElementById("first");	
	let lastnameInput  = document.getElementById("last");	
	let emailInput  = document.getElementById("email");	
	
	if (bool) fetch("/signup", {
		method: "POST",
		headers: {'Content-Type': 'application/json'}, 
		body: "{ \"username\": \"" + userNameInput.value + "\", \"password\": \"" + passwordInput.value + "\", \"firstname\": \"" + firstnameInput.value + "\", \"lastname\": \"" + lastnameInput.value + "\", \"email\": \"" + emailInput.value + "\" }"
	}).then(response => response.json()).then(data => {
		if (data.response == "Success") {
            // this_username = userNameInput.value;
            document.cookie = "username="+userNameInput.value+";";
            window.location.href = "index.html"
            // storeUser(userNameInput); //need this function from index.js
		} else {
			displayInvalidUsername("username");
		}
	});
}

function validate_all(){
    let bool;
    let allGood = true;
    const ids = ["first", "last", "username", "password", "confirm", "email"];
    for (let i = 0; i < ids.length; i++){
        switch(ids[i]){
            case "first":
            case "last":
                bool = allAlph(document.getElementById(ids[i]).value);
                if (!bool) allGood = false;
                break;
            case "username":
            case "password":
                if (document.getElementById(ids[i]).value == "") bool = false;
                else bool = true;
                if (!bool) allGood = false;
                break;
            case "confirm":
                if (document.getElementById("password").value == "" || !isSame("confirm", "password")) bool = false;
                else bool = true;
                if (!bool) allGood = false;
                break;
            case "email":
                bool = isEmail("email");
                if (!bool) allGood = false;
                break;
            default: break;
        }
        getErrorMessageSignup(ids[i], bool);
    }
    return allGood;
}

function isEmail(identity){
    let email = document.getElementById(identity).value;
    let emailParts = email.split('@');
    let username = emailParts[0];
    if(!validateAlphaNum(username) || username.length == email.length || emailParts.length != 2){
        return false;
    }
    let domainParts = emailParts[1].split('.')
    if(domainParts.length != 2){
        return false;
    }
    if(domainParts[1].length != 3){
        return false;
    }
    return true;
    
}

function validateAlphaNum(word){
    let regex = /^[a-z0-9]+$/i;
    if(word == null || !word.match(regex)){
        return false;
    }
    return true;
}

function allAlph(word){
    let regex = /^[a-z]+$/i;
    if(word == null || !word.match(regex)){
        return false;
    }
    return true;
}

function isSame(id1, id2){
    let string1 = document.getElementById(id1).value;
    let string2 = document.getElementById(id2).value;
    if(string1 == string2) return true;
    return false;

}

function getErrorMessageSignup(index, bool){
    var label = document.getElementById(index+"Label");
    var div = document.getElementById(index + "Div");

    // if (label == null) {
    //     label = document.createElement("LABEL");
    //     label.id = index + "label";
    //     label.setAttribute( 'class', 'errorMessage' );
    //   }
    if(!bool){
        div.style.backgroundColor = "rgba(255, 143, 143, 0.5)";
    } 
    if(bool){
        div.style.backgroundColor = "lightgray";
         label.innerHTML = "";
    }
    else if(index == "email"){
        label.innerHTML =  "Email is required and must be in the form xxxxxx@xxx.xxx where x is alphanumeric";
    }
    else if(index == "first" || index == "last"){
        label.innerHTML = "Your " + index + " name must be alphabetic";
    }
    else if(index == "username" || index == "password"){
        label.innerHTML = "You must have a " + index;
    }
    else if(index == "confirm"){
        label.innerHTML = "Passwords must match";
    }
    else{
        label.innerHTML = "0";
    }
}

function displayInvalidUsername(index){
    var label = document.getElementById(index+"Label");
    var div = document.getElementById(index + "Div");
	
	div.style.backgroundColor = "rgba(255, 143, 143, 0.5)";
	 label.innerHTML = "Username already in use!";
}