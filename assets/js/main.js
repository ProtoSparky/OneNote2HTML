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
        "dir_display":{
            "style":{
                "box_height":150,
                "header_top":0,
                "header_height":20
            }
        },
        "dir_header":{
            "style":{
                "height":50
            },
            "header":"./"
        }
    },
    "temp_data":{}//the data stored here will change and be mutable
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

    document.body.style.backgroundColor = AccessCSSVar("--col_bg_content");
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
        const select_2nd_key = select_dir.I_dir[1];
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
    dir_name.style.height = Settings.OpenDir.dir_header.style.height; 
    dir_name.id = "DirName";
    dir_name.className = "text";
    dir_name.style.color = AccessCSSVar("--col_bold_TXT");
    dir_name.style.fontWeight = 800;
    dir_name.style.textAlign = "center";
    dir_name.style.cursor = "pointer";
    dir_name.innerHTML = Settings.OpenDir.dir_header.header + dirname + "/";
    dir_name.addEventListener("click", function(){
        Home();
    });
    body.appendChild(dir_name);


    //we add the frame all directories will stay in
    const dir_frame = document.createElement("div");
    dir_frame.id = "dir_frame";
    dir_frame.style.position = "absolute";
    dir_frame.style.top = Settings.OpenDir.dir_header.style.height;
    dir_frame.style.height = "100%";
    dir_frame.style.width = "100%";
    body.appendChild(dir_frame); 



    //we load in all base directories
    const base_directory_array = Object.keys(length_counter);
    const base_directory_count = base_directory_array.length; 
    Settings.temp_data.base_directory_pointer = 0; //clear pointer before it is used
    for(let base_directory_pointer = 0; base_directory_pointer < base_directory_count; base_directory_pointer++){
        const current_base_dir_name = base_directory_array[base_directory_pointer]; 
        const current_base_dir = length_counter[current_base_dir_name];
        const base_directory_select = document.createElement("div")
        base_directory_select.style.position  ="absolute";
        base_directory_select.style.width = "100%";
        base_directory_select.style.left = 0;
        base_directory_select.id = current_base_dir_name;
        base_directory_select.style.height = Settings.OpenDir.dir_display.style.box_height * current_base_dir;

        base_directory_select.style.top = Settings.temp_data.base_directory_pointer; 
        Settings.temp_data.base_directory_pointer = Settings.temp_data.base_directory_pointer + Settings.OpenDir.dir_display.style.box_height * current_base_dir;
        dir_frame.appendChild(base_directory_select); 

        //add base directory headers
        const header = document.createElement("div");
        header.innerHTML = current_base_dir_name;
        header.style.position = "absolute";
        header.style.left = 0;
        header.style.top = Settings.OpenDir.dir_display.style.header_top;
        header.style.height = Settings.OpenDir.dir_display.style.header_height;
        header.style.width = "100%";
        header.style.color = AccessCSSVar("--col_bold_TXT");
        header.style.fontWeight = 900;
        header.style.textAlign = "center";
        header.style.className = "text";
        base_directory_select.appendChild(header);

        //clear temp directory top pointers
        Settings.temp_data[current_base_dir_name] = 0;
    }

    //increase size of sidebar
    body.style.height = Settings.temp_data.base_directory_pointer;

    //iterate over all files and append them to their respected places
    

}