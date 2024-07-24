var Settings = {
    "Explorer":{
        "style":{
            "width":300
        }
    },
    "Directory":"./assets/file_index/index.json",
    "Home":{
        "style":{
            "gap":50,
            "height":100
        }
    },
    "OpenDir":{
        "current_directory":{
            "style":{

            }
        },
        "dir_display":{
            "style":{
                "height":50
            },
            "header":"./"
        }
    },
    "temp_data":{}
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
    Explorer.id = "Explorer"; 
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
    const body = document.getElementById("Explorer");
    body.innerHTML = ""; 
    for(let home_key_pointer = 0; home_key_pointer < home_key_amounts; home_key_pointer ++){
        const current_key = home_keys[home_key_pointer];
        const directory = document.createElement("div");
        directory.id = current_key;
        directory.style.position = "absolute";
        directory.className = "text";
        directory.innerHTML = current_key;
        directory.style.top = (home_key_pointer * Settings.Home.style.gap) + Settings.Home.style.height;
        directory.style.color = AccessCSSVar("--col_normalTXT");
        directory.style.width = "100%";
        directory.style.height = Settings.Home.style.height;
        directory.addEventListener("click",function(){
            OpenDir(current_key);
        });
        body.appendChild(directory);

    }
}
function OpenDir(dirname){
    const body = document.getElementById("Explorer");
    body.innerHTML = ""; //clear data here
    console.info("Opening directory " + dirname); 
    const SelectData = DirectoryData[dirname];

    //we count the directories at index 2. Increment a counter if they exist, or create another
    let length_counter = {};
    const total_dir_keys = Object.keys(SelectData);
    const total_dir_length = total_dir_keys.length; 
    console.log(total_dir_length);
    for(let dir_pointer = 0; dir_pointer < total_dir_length; dir_pointer ++){
        const select_dir = SelectData[dir_pointer];
        const file_length = select_dir.files.length;
        const select_2nd_key = select_dir.dir[1];
        if(length_counter[select_2nd_key] == undefined){
            length_counter[select_2nd_key] = 0;
        }
        length_counter[select_2nd_key] = length_counter[select_2nd_key] + file_length; 
    }
    console.info(length_counter); 

    //we spawn the directory name in the dir index at the top

    const dir_name = document.createElement("div");
    dir_name.style.position = "absolute";
    dir_name.style.top = 0;
    dir_name.style.left = 0;
    dir_name.style.width = "100%";
    dir_name.style.height = Settings.OpenDir.dir_display.style.height; 
    dir_name.id = "DirName";
    dir_name.className = "text";
    dir_name.style.color = AccessCSSVar("--col_bold_TXT");
    dir_name.style.fontWeight = 800;
    dir_name.style.textAlign = "center";
    dir_name.style.cursor = "pointer";
    dir_name.innerHTML = Settings.OpenDir.dir_display.header + dirname + "/";
    dir_name.addEventListener("click", function(){
        Home();
    });
    body.appendChild(dir_name);



}