var Settings = {
    "SideBar":{
        "FolderSize":{
            "x": 300,
            "y": 50
        },
        "NestedFolderSize":{
            
        }
        
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

    visualizeJSON(current_selected_folder,"SideBar");
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