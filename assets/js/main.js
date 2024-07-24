var Settings = {
    "Explorer":{
        "style":{
            "width":300
        }
    },
    "Directory":"./assets/file_index/index.json",
    "SelectedHome":null,
    "Home":{
        "style":{
            "gap":50
        }
    }
};
var DirectoryData = null; 
function init(){
    console.info("starting CE");

    //spawn sidebar
    const Explorer = document.createElement("div");
    Explorer.style.top = "0px";
    Explorer.style.position = "absolute";
    Explorer.style.left = "0px";
    Explorer.style.height = "100%";
    Explorer.style.width = Settings.Explorer.style.width;
    Explorer.style.backgroundColor = AccessCSSVar("--col_bg_lighter"); 
    const Body = document.getElementById("content-fullscreen"); 
    Body.appendChild(Explorer); 


    //we load the Directory listing
    DirectoryData = ReadJSON(Settings.Directory, false);

    //we load the home screen
    Home(); 

}

function Home(){
    //this function will display the choise data for the home directories (I know this is confusing)
    const home_keys = Object.keys(DirectoryData);
    const home_key_amounts = home_keys.length;
    for(let home_key_pointer = 0; home_key_pointer < home_key_amounts; home_key_pointer ++){
        const current_key = home_keys[home_key_pointer];
        const directory = document.createElement("div");
        

    }
}