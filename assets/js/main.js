var Settings = {
    "SideBar":{
        "FolderSize":{
            "x": 300,
            "y": 50,
            "offset":10
        },
        "NestedFolderSize":{
            "y":4,
            "offset":20,
            "offset_y":20,
            "VisualHight":40
        },
        "current_nested_object":0
        
    }
}
var FileIndex = undefined;
function init(){
    //we try to get the JSON object
    const JsonFileLoc = "./assets/file_index/index.json";
    FileIndex = ReadJSON(JsonFileLoc, false);
    
    console.info("Everything loaded. Spawning UI");
    //everything Ok, launch rest of code
    const Root = document.getElementById("content-fullscreen");
    
    //we spawn the sidebar
    const SideBar = document.createElement("div");
    SideBar.id = "SideBar"; 
    SideBar.style.left = "0px";
    SideBar.style.top = "0px";
    SideBar.style.position = "absolute"; 
    SideBar.style.height = "100%";
    SideBar.style.width = "300px";
    SideBar.style.backgroundColor = AccessCSSVar("--col_bg_lighter");
    Root.appendChild(SideBar);
    document.body.style.backgroundColor = AccessCSSVar("--col_bg_content");

    ShowRoot(FileIndex);    
}

function SpreadFolder(FolderName){
    const SideBar = document.getElementById("SideBar");
    SideBar.innerHTML = "";
    //spawn tree
    Tree(FolderName);

}

function Back(){
    const SideBar = document.getElementById("SideBar");
    SideBar.innerHTML= "";
    ShowRoot(FileIndex);
}

function Tree(FolderName){
    //we iterate trough all folders
    const current_selected_folder = FileIndex[FolderName];

    //visualizeJSON(current_selected_folder,"SideBar");
    //extend the ui for the display size
    traverseObjectDepthFirst(current_selected_folder)
}

function traverseObjectDepthFirst(obj, depth = 0) {
    for (let key in obj) {
        let value = obj[key];
        let type = typeof value;

        // Check if the current item is a key or a value
        let isKey = type === "object" &&!Array.isArray(value);
        const container = document.getElementById("SideBar");
        const current_key_name = key;
        const val = document.createElement("div");
        val.style.position = "absolute";
        val.style.left = depth * 10;        
        val.className = "text";
        val.style.color = "white";
        val.style.width = "100%";
        val.style.height = Settings.SideBar.FolderSize.y;

        if(isKey){
            //it is a key     
            val.style.top = Settings.SideBar.current_nested_object * Settings.SideBar.NestedFolderSize.y;
            //val.innerHTML = current_key_name;
            const img = document.createElement("img");
            img.src = "./assets/img/folder.svg";
            img.style.position = "absolute";
            img.style.top = "50%";
            img.style.left = 0;
            img.style.transform = "translate(0,-50%)";
            img.style.height = "100%";
            img.style.width = "30px";

            const text = document.createElement("div");
            text.style.position = "absolute";
            text.style.left = "20px";
            text.style.top = "50%";
            text.style.transform = "translate(0,-50%)";
            text.className = "text";
            text.innerHTML = current_key_name; 

            val.appendChild(img);
            val.appendChild(text);                        
        }
        else{
            //is value
            //val.innerHTML = value;
            for(let pointer = 0; pointer < value.length; pointer ++){
                const current_val = value[pointer];
                const val2 = document.createElement("div");
                val2.style.position  ="absolute";
                val2.style.left = depth * 50;
                val2.style.color = "white";
                val2.style.width = "100%";
                val2.className = "text";
                val2.innerHTML = truncateString(current_val, 30);
                val2.style.top = (Settings.SideBar.current_nested_object * Settings.SideBar.NestedFolderSize.y) + Settings.SideBar.NestedFolderSize.offset;
                val2.style.height = Settings.SideBar.NestedFolderSize.VisualHight; 
                val2.style.zIndex = 999999;
                Settings.SideBar.current_nested_object = Settings.SideBar.current_nested_object + 10;
                val.appendChild(val2);
            }
        }
        container.appendChild(val);
        //iterate the current nested object size 
        Settings.SideBar.current_nested_object ++; 
        if (isKey) {
            traverseObjectDepthFirst(value, depth + 1);
        }
    }
}

function visualizeJSON(jsonObj, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Temporary variable for custom JavaScript
    let customJS = '';

    // Recursive function to traverse the JSON object and create nested divs
    function renderJSON(obj, indentLevel = 0) {
        let output = '';
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = typeof obj[key] === 'object' && obj[key]!== null? renderJSON(obj[key], indentLevel + 1) : obj[key];

                // Check if the current item is an object (directory)
                if (typeof value === 'object' && value!== null) {
                    // Append custom JS for directories here if needed
                    customJS += `/* Custom JS for directory ${key} */`;
                } else if (Array.isArray(value)) {
                    // Append custom JS for arrays here if needed
                    customJS += `/* Custom JS for array ${key} */`;
                }

                // Adjust the output based on whether the current item is an object or an array
                output += `<div style="padding-left: ${indentLevel * 20}px;">${key}: <span>${value}</span></div>`;
            }
        }
        return output;
    }

    // Insert custom JavaScript before rendering the JSON structure
    container.innerHTML = `
        ${customJS}
        ${renderJSON(jsonObj)}
    `;
}

function ShowRoot(FileIndex){
    //we crawl the FileIndex and create the root folders
    const SideBar = document.getElementById("SideBar");
    const TopDirKeys = Object.keys(FileIndex);
    const TopDirKeylength = TopDirKeys.length;
    for(let TopPointer = 0; TopPointer < TopDirKeylength; TopPointer ++){
        const current_key_name = TopDirKeys[TopPointer];
        const current_key_object = FileIndex[current_key_name];


        const CurrentFolder = document.createElement("div");
        CurrentFolder.style.position = "absolute";
        CurrentFolder.style.width = Settings.SideBar.FolderSize.x;
        CurrentFolder.style.height = Settings.SideBar.FolderSize.y;
        CurrentFolder.style.top = Settings.SideBar.FolderSize.y * TopPointer;
        CurrentFolder.style.left = 0;
        CurrentFolder.id = current_key_name; 
        CurrentFolder.style.cursor = "pointer";
        CurrentFolder.addEventListener("click", function(){
            SpreadFolder(current_key_name);
        });
        SideBar.appendChild(CurrentFolder);
        const CurrentFolderHeader = document.createElement("div");
        CurrentFolderHeader.style.position = "absolute"; 
        CurrentFolderHeader.style.left = 8;
        CurrentFolderHeader.style.top = "50%";
        CurrentFolderHeader.innerHTML = current_key_name;
        CurrentFolderHeader.class = "text";
        CurrentFolderHeader.style.transform = "translate(0,-50%)";
        CurrentFolderHeader.style.color = AccessCSSVar("--col_normalTXT");
        CurrentFolder.appendChild(CurrentFolderHeader);      

        
    }
}
function ApplyStyle(){

}