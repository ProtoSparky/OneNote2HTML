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

    RecursiveRun(current_selected_folder);
}

function RecursiveRun(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) { // Check if the property belongs to the object itself
        if (typeof obj[key] === 'object' && obj[key]!== null) {
            RecursiveRun(obj[key]); // Recursive call for nested objects
        } 
        else {
          console.log(`Key: ${key}, Value: ${obj[key]}`); // Process the value here
        }
      }
    }
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