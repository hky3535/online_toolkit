/**何恺悦 hekaiyue 2023-07-28 */

const main_div = document.getElementById('main_div');
/**指令列表 */
const commands_div = document.getElementById('commands_div');





var commands = [];


function refresh_commands() {
    fetch('/ffmpeg_toolkit/refresh_commands/', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        data["commands"].forEach(item => {
            add_command(item);
        });
    })
    .catch(error => {
        console.error(error);
    });
}

/**添加一个新的指令div */
function add_command(item) {
    /**创建command_div */
    let command_div = document.createElement("div");
    command_div.className = 'command_div';
    commands_div.appendChild(command_div);

    /**创建name_div */
    let name_div = document.createElement("div");
    name_div.className = 'name_div';
    command_div.appendChild(name_div);
    /**添加中英文名 */
    let zh_name = document.createElement("label");  /**中文名 */
    zh_name.className = 'zh_name';
    zh_name.innerHTML = item["zh_name"];
    name_div.appendChild(zh_name); 
    let en_name = document.createElement("label");  /**英文名 */
    en_name.className = 'en_name';
    en_name.innerHTML = item["en_name"];
    name_div.appendChild(en_name);

    /**创建line_div*/
    let line_div = document.createElement("div");
    line_div.className = 'line_div';
    command_div.appendChild(line_div);
    /**添加执行语句 上传 参数 下载*/
    let line = document.createElement("span");
    line.className = 'line';
    line_div.appendChild(line);

    let line_inner = item["line"];
    /**创建上传按钮 */
    let input_button = document.createElement('button');
    input_button.id = item["en_name"] + "&input";
    input_button.innerHTML = 'upload';
    line_inner = line_inner.replace('{input}', input_button.outerHTML);
    /**创建下载按钮 */
    let output_button = document.createElement('button');
    output_button.id = item["en_name"] + "&output";
    output_button.innerHTML = 'download';
    line_inner = line_inner.replace('{output}', output_button.outerHTML);
    line.innerHTML = line_inner;    /**绑定触发 */
    document.getElementById(input_button.id).addEventListener('click', upload.bind(null, item["en_name"]));
    document.getElementById(output_button.id).addEventListener('click', download.bind(null, item["en_name"]));
    
    /**创建参数输入 */
    let parameters = line.innerHTML.match(/{(.+?)}/g);
    if (parameters) {
        for (var i = 0; i < parameters.length; i++) {
            parameter = parameters[i];
            let parameter_name = parameter.slice(1, -1);
            let parameter_input = document.createElement('input'); parameter_input.type = 'text';
            



            line_inner = line_inner.replace(parameter, parameter_input.outerHTML);
            line.innerHTML = line_inner;
        }
    }




    
}

function upload(en_name) {
    console.info("upload " + en_name);
}
function download(en_name) {
    console.info("download " + en_name);
}
function parameter (en_name, key, value) {
    console.info(en_name + " " + key + " " + value);
}

refresh_commands();


