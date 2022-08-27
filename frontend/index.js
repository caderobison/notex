const table = document.getElementById("stack");
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
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

var username = getCookie("username");
/*
Scanning in files - the plan

the plan is that after the login, there is a cookie stored.

1. We check if that cookie auth is associated with a user, if not, boot them back
to the sign in screen and remove that cookie

2. If that cookie is valid, look up the user, and make a GET request
for every file that is stored for that user. That list of files is scanned into
the drop down menu of files

3. Once that is done, the user should be able to click on the file they want to load
from the dropdown menu. When they select a file AND click Load, the page will be REFRESHED

        (this part is weird so read carefully)

4. The auth key is retained with the refresh, and a new cookie is added with the file the user wants

5. We go back to step 1, BUT, if there is a file cookie associated with that user, we send a GET request
and load the file.

        i.e. every time the page is refreshed and checked for if there is a file they want loaded

This is so we dont need to deal with clearing the compile string or clearing the table




 */
var userText = "";
var title = "";
var generator = new latexjs.HtmlGenerator({ hyphenate: false})
var frameObj = document.getElementById('latexWindow');
var frameContent = frameObj.contentWindow.document;
var jsonSave = {
    "product": "NoTeX",
    "version": 1,
    "document": {
        "id": -1,
        "title": "",
        "author": "",
        "date": "",
        "blocks": [
        ]
    }
}
var jsonLoad = {
    "product": "NoTeX",
    "version": 1,
    "user": "\"" + username + "\"",
    "document": {
        "id": -1,
        "title": "Template Title",
        "author": "Template Author",
        "date": "Template Date",
        "blocks": [
            {
                "type": "Center",
                "text": "some center text"
            },
            {
                "type": "Abstract",
                "text": "some abstract text"
            },
            {
                "type": "Enum",
                "text": ["some text 1", "some text 2"]
            },
            {
                "type": "Itemize",
                "text": ["some new text 1", "some new text 2", "some new text 3"]
            }
        ]
    }
}
const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});

    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
};

/*export*/ function storeUser(user){
    username = user;
}

function clear(){
    var stack = document.getElementById("stack");
    var length = stack.rows.length
    for (i = 0; i < length; i++){
        stack.deleteRow(0);
    }
    logSubmit();
}

function writeToJSON(){
    var json ="{\"Product\": \"NoTeX\", \"user\": \"" + username +"\", \"document\": {";
    var title = document.getElementById("Title").value;
    // if (title == "") title = "Untitled Document";
    var author = document.getElementById("Author").value;
    // if (author == "") author = " ";
    var date = document.getElementById("Date").value;
    // if (date == "") title = "null";
    json += "\"title\": \"" + title + "\", \"author\": \"" +author+ "\", \"date\": \"" + date + "\",";
    json += "\"blocks\": [";
    var table = document.getElementById("stack");
    for (let i = 0; i < table.rows.length; i++){
        var block = "{";
        var row = table.rows[i];
        let type = row.className;
        if (type == "Enum" || type == "Itemize"){
            block += "\"type\": \"" + type + "\", \"text\": [";
            let text = row.children[1];
            block += "\"" +text.children[0].value+ "\", ";
            for (let j = 1; j < text.children.length; j++){
                block += "\""+ text.children[j].children[0].value +"\"";
                if (j != text.children.length - 1) block += ",";
            }
            block +="]}";
        }
        else{
            block += "\"type\": \"" + type + "\", \"text\": \"" + row.cells[1].innerText + "\"}";
        }
        if(i != table.rows.length - 1) block += ",";
        json += block;
    }

    json += "]}}";
    jsonLoad = JSON.parse(json);
    // console.log(json);
    return json;
}

function addFile(){
    var json = writeToJSON();
    fetch("/saveFile", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body:  json,
    }).then(response => response.json()).then(data => {
        if (data.response == "Success") {

        } else {
            alert("Could not save file");
        }
    });
}

function add(type, textLoad) {
    var row = table.insertRow(-1);
    row.classList.add(type);
    var cell1 = row.insertCell(0);

    var cell2 = row.insertCell(1);

    var cell3 = row.insertCell(2);
    cell1.style.width = "10%";
    cell2.style.width = "80%";
    cell3.style.width = "10%";
    cell3.setAttribute("colspan", "2");
    cell1.innerHTML = type;
    console.log(textLoad)
    cell2.innerHTML = "<textarea rows='1' data-block-kind='"+ type +"' oninput='logSubmit()' class='userSpace'>"+textLoad+"</textarea>"         /*   "<input type='text' class='userSpace "+type+"' oninput='logSubmit()'/>"*/;
    cell3.innerHTML = "<button type='button' style='margin: auto; display: flex'>-</button>"
    cell3.onclick = function() {
        table.deleteRow(this.parentNode.rowIndex);
        logSubmit()
    }
    logSubmit()
    return row;
}
function add_list(type, text){
    //to change the name of the table cell 1 while allowing the styles and latex compile to still work
    let x
    if (type == "Enum"){
        x = "List";
    }
    else if (type == "Itemize"){
        x = "Bullet";
    }
    else{
        x = type;
    }
    let numr = 1;
    var row = table.insertRow(-1);
    row.classList.add(type);
    var cell1 = row.insertCell(0);

    var cell2 = row.insertCell(1);

    var cellAdd = row.insertCell(2);
    // var cellSub = row.insertCell(3);

    var cell3 = row.insertCell(3);
    cell1.style.width = "10%";
    cell2.style.width = "80%";
    cellAdd.style.width = "10%";
    // cellSub.style.width = "10%";
    cell3.style.width = "10%";

    cell1.innerHTML = x;
    cell2.innerHTML = "<textarea rows='1' data-block-kind='"+ type +"' oninput='logSubmit()' class='userSpace'>"+text+"</textarea>"         /*   "<input type='text' class='userSpace "+type+"' oninput='logSubmit()'/>"*/;
    cellAdd.innerHTML = "<button type='button' style='margin: auto; display: flex'>+Row</button>"

    // cellSub.innerHTML = "<button type='button'>-Row</button>"
    cell3.innerHTML = "<button type='button' style='margin: auto; display: flex'>-</button>"
    cell3.onclick = function() {
        table.deleteRow(this.parentNode.rowIndex);
        logSubmit()
    }
    cellAdd.onclick = function() {
        var this_num = numr
        numr++;
        // cell2.appendChild(document.createElement("br"))
        var div = cell2.appendChild(document.createElement("div"))
        // div.style.border = "thin solid #FFFFFF"
        div.id = "divr" + type + this_num
        var newRow = div.appendChild(document.createElement("textarea"))
        newRow.style.width = "95%";
        newRow.dataset.blockKind = type
        newRow.oninput = function(){logSubmit()};
        // newRow.addEventListener('change', logSubmit());
        console.log(newRow.dataset.blockKind)
        // newRow.cols = "40";
        newRow.rows = "1";
        // newRow.id = "Enumrow"/* + this.parentNode.rowIndex + "row" + numr*/
        newRow.className = "vertical-center"
        var sub = div.appendChild(document.createElement("button"))
        sub.innerText = "-";
        sub.className = "vertical-center"
        sub.onclick = function(){
            div.parentNode.removeChild(div)
            logSubmit();
        }
        logSubmit();
    }
    logSubmit();
    return row;
}
function scanIn(externalJson){
    clear();
    document.getElementById("Title").value = externalJson.document.title;
    document.getElementById("Author").value = externalJson.document.author;
    document.getElementById("Date").value = externalJson.document.date;
    console.log(externalJson.document.title)
    for (let i = 0; i < externalJson.document.blocks.length; i++) {
        console.log(externalJson.document.blocks[i].type)
        if(externalJson.document.blocks[i].type == "Enum" || externalJson.document.blocks[i].type == "Itemize"){
            let row = add_list(externalJson.document.blocks[i].type, externalJson.document.blocks[i].text[0])
            for ( j = 1; j < externalJson.document.blocks[i].text.length; j++){
                row.cells[2].click();
                row.cells[1].children[j].children[0].value = externalJson.document.blocks[i].text[j];
            }
        }
        else {
            add(externalJson.document.blocks[i].type, externalJson.document.blocks[i].text)
        }
    }
    logSubmit();
}
function logSubmit() {
    generator.reset()
    var inputF = document.getElementsByClassName("userSpace");
    userText = ""
    var headerText = "" //added
    jsonSave.document.blocks = []
    // LOOP THROUGH EACH ROW OF THE TABLE AFTER HEADER.
    for (i = 0; i < inputF.length; i++) {
        // GET THE CELLS COLLECTION OF THE CURRENT ROW.
        headerText = "";
        blockType = inputF[i].dataset.blockKind
        blockText = inputF[i].value
        if(blockType != "Title" & blockType != "Date" & blockType != "Author") {
            var jsonBlockTemp = {
                "type": blockType,
                "text": blockText
            }
            jsonSave.document.blocks.push(jsonBlockTemp)
        }
        if(blockType == "Title"){
            if (blockText == "") blockText = "Untitled"
            title=blockText; // for file export
            jsonSave.document.title = blockText;

            headerText = "\\documentclass{article}\\title{"+blockText+"}\\begin{document}" /*+ "\\maketitle"*/ //maketitle has to go after date and author
        }
        else if(blockType == "Date"){
            jsonSave.document.date = blockText;
            headerText = ("\\date{"+blockText+"}")
        }
        else if(blockType == "Author"){
            jsonSave.document.author = blockText;
            headerText = ("\\author{"+blockText+"}")
        }
        let pos = userText.indexOf("\\maketitle"); //this section was reworked
        if (pos == -1) userText += headerText + "\\maketitle";
        else userText = userText.slice(0,pos) + headerText + userText.slice(pos)
        if (blockType == "Section"){
            userText += ("\\section{" + blockText + "}")
        }
        else if(blockType == "Subsection"){ //added
            userText += ("\\subsection{" + blockText + "}")
        }
        else if(blockType == "Abstract"){
            userText += ("\\begin{abstract}" + blockText + "\\end{abstract}")
        }
        else if(blockType == "Center"){
            userText += ("\\begin{center}" + blockText + "\\end{center}")
        }
        else if(blockType == "Paragraph") {
            userText += " " + blockText
        }
        else if(blockType == "Equation"){
            if(blockText == "") blockText = " ";
            userText += ("$$" + blockText + "$$")
        }
        else if(blockType == "Enum"){
            userText += "\\begin{enumerate}\n\\item " + blockText + "\n";
            var children = inputF[i].parentNode.children;
            for(let i = 1; i < children.length; i++){
                userText += "\\item " + children[i].children[0].value +"\n";
            }
            userText += "\\end{enumerate}"
        }
        else if(blockType == "Itemize"){
            userText += "\\begin{itemize}\n\\item " + blockText + "\n";
            var children = inputF[i].parentNode.children;
            for(let i = 1; i < children.length; i++){
                userText += "\\item " + children[i].children[0].value +"\n";
            }
            userText += "\\end{itemize}"
        }
        function checkAndReplace(block){
            if (blockType != "Title" && blockType != "Author" && blockType != "Date" && block.style.height.replace('px','') != (block.scrollHeight)){
                function replaceHeight(box){
                    if (box.style.height.replace('px','') < (box.scrollHeight )) box.style.height = (box.scrollHeight ) + 'px';
                    else do{box.style.height = (box.style.height.replace('px', '') - 20) +  'px';}while(block.style.height.replace('px','') > (block.scrollHeight)) //lineHeight wasn't working I don't know why. 18 is line height
                }
                replaceHeight(block);
            }
        }
        checkAndReplace(inputF[i]);
        if (blockType == "Itemize" || blockType == "Enum"){
            var children = inputF[i].parentNode.children;
            for(let i = 1; i < children.length; i++){
                checkAndReplace(children[i].children[0]);
            }
        }
    }
    userText += "\\end{document}"
    console.log(userText)
    generator = latexjs.parse(userText, { generator: generator })
    frameContent.body.replaceChildren(generator.domFragment())

}
generator = latexjs.parse("", { generator: generator })
frameContent.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/"))
const style = document.createElement("style")
style.textContent = "body { display: block; }"
frameContent.head.appendChild(style)
logSubmit()
let cookie = getCookie("username")

fetch("/getlist", {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
        body: "{ \"cookie\": \"" + cookie.value + "\" }"
    }).then(response => response.json()).then(data => {
        if (data.response == "Success") {
            for (let i = 0; i < data.length; i++) {
                var x = document.getElementById("files");
                var option = document.createElement("option");
                option.text = data[i];
                x.add(option);
            }
        } else {

        }
});
document.querySelector('#btnExportTeX').addEventListener('click', () => {
    downloadToFile(userText, title+'.ltx', 'text/plain');
});
document.querySelector('#btnSave').addEventListener('click', () => {
    fetch("/storefile", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body:"{ \"name\": \"" + title + "\", \"file\": \"" + JSON.stringify(jsonSave) + "\"}"
    }).then(response => response.json()).then(data => {
        if (data.response == "Success") {
            scanIn(data);
        } else {

        }
    });
});
document.querySelector('#loadFile').addEventListener('click', () => {
    scanIn(jsonLoad);
});
