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
    "invert_color_toggle":false
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
    Explorer.style.overflowY = "scroll";
    Explorer.id = "Explorer"; 
    const Body = document.getElementById("content-fullscreen"); 
    Body.appendChild(Explorer); 

    document.body.style.backgroundColor = AccessCSSVar("--col_bg_content");
    //we load the Directory listing
    DirectoryData = ReadJSON(Settings.Directory, false);

    //prepare iframe
    PrepareIframe();
    //we load the home screen
    Home(); 

}

function Home(){
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
function OpenDir(key){
    const select_dir = DirectoryData[key]; 

    //clear sidebar
    const Explorer = document.getElementById("Explorer");
    Explorer.innerHTML = ""; 
    Explorer.style.display = "flex";
    Explorer.style.flexDirection = "column";


    const top_index_keys = Object.keys(select_dir);
    const top_index_keys_counted = top_index_keys.length;
    for(let top_index_pointer = 0; top_index_pointer < top_index_keys_counted; top_index_pointer ++){
        const select_top_index_name = top_index_keys[top_index_pointer];
        const select_top_index_data = select_dir[select_top_index_name];


        //spawn sub container
        const sub_cont = document.createElement("div");
        sub_cont.style.display = "flex";
        sub_cont.style.flexDirection = "column"; 
        sub_cont.id = select_top_index_name;
        sub_cont.style.color = "white";

        const sub_cont_header = document.createElement("div");
        sub_cont_header.innerHTML = select_top_index_name;
        sub_cont_header.id = "sub_cont_header"; 
        sub_cont_header.style.color = "white";
        sub_cont.appendChild(sub_cont_header); 


        const sub_cont_indexes = select_top_index_data.index;
        const sub_cont_indexes_len = sub_cont_indexes.length;
        for(let sub_cont_index_pointer =0; sub_cont_index_pointer < sub_cont_indexes_len; sub_cont_index_pointer ++ ){
            const current_sub_cont_index = sub_cont_indexes[sub_cont_index_pointer];
            const current_sub_cont_data = select_top_index_data.sub[current_sub_cont_index]; //contains array
            const u_sub_cont = document.createElement("div");
            u_sub_cont.id = "u_sub_cont";
            u_sub_cont.style.position = "relative";
            u_sub_cont.style.left = "40px"; 
            u_sub_cont.display = "flex";
            u_sub_cont.flexDirection = "column";
            sub_cont.appendChild(u_sub_cont);

            const u_sub_cont_header = document.createElement("div");
            u_sub_cont_header.id = "u_sub_cont_header";
            u_sub_cont_header.innerHTML = current_sub_cont_index; 
            u_sub_cont.appendChild(u_sub_cont_header);

            const current_sub_cont_data_length = current_sub_cont_data.length;
            for(let current_ultra_sub_cont_pointer= 0;current_ultra_sub_cont_pointer < current_sub_cont_data_length; current_ultra_sub_cont_pointer ++ ){
                const current_ultra_sub_cont = current_sub_cont_data[current_ultra_sub_cont_pointer];
                const my_sub_cont = document.createElement("div");
                my_sub_cont.id = "my_sub_cont";
                my_sub_cont.style.position = "relative";
                my_sub_cont.style.left = "40px"; 
                my_sub_cont.style.fontWeight = "1000"; 
                my_sub_cont.style.color = AccessCSSVar("--col_bold_TXT"); 
                my_sub_cont.innerHTML = current_ultra_sub_cont.slice(0,-4);
                my_sub_cont.style.cursor = "pointer"; 
                my_sub_cont.addEventListener("click", function(){
                    OpenFile("./exports/"+key + "/" + select_top_index_name + "/"+ current_sub_cont_index + "/" + current_ultra_sub_cont);
                });
                u_sub_cont.appendChild(my_sub_cont); 
            }
        }


        Explorer.appendChild(sub_cont);

    }


}

function OpenFile(file_dir){
    const iframe = document.getElementById("expolorer_viewer");
    console.info("Opening file " + file_dir); 
    iframe.src = file_dir; 
    iframe.onload = function() {
        // Change the text color to white after loading
        let invert_col_btn = document.getElementById("invert_col");
        if(invert_col_btn == undefined){
            invert_col_btn = document.createElement("button");
            invert_col_btn.innerHTML = "Invert text color";
            invert_col_btn.style.position = "absolute";
            invert_col_btn.style.zIndex = "9999";
            invert_col_btn.style.right = "0px"; 
            invert_col_btn.style.bottom = "0px";
            invert_col_btn.addEventListener("click", function(){
                invert_color();
            });
            document.getElementById("content-fullscreen").appendChild(invert_col_btn); 
        }
    };
}

function PrepareIframe(){
    const content_fullscreen = document.getElementById("content-fullscreen");
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = Settings.Explorer.style.width;
    iframe.style.width = window.innerWidth - Settings.Explorer.style.width;
    iframe.style.borderStyle = "none"; 
    iframe.style.height = "100%";
    iframe.id = "expolorer_viewer";
    content_fullscreen.appendChild(iframe);

}
function invert_color(){
    const iframe = document.getElementById("expolorer_viewer");
    if(Settings.invert_color_toggle){
        Settings.invert_color_toggle = false; 
        iframe.contentWindow.document.body.style.color = 'white';
    }
    else{
        Settings.invert_color_toggle = true;
        iframe.contentWindow.document.body.style.color = 'black';
    }
}