/**何恺悦 hekaiyue 2023-07-28 */

const main_div = document.getElementById('main_div');
/**指令列表 */
const commands_div = document.getElementById('commands_div');
const tip_div = document.getElementById('tip_div');


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
    
    /**创建参数输入 */
    let params = line_inner.match(/{(.+?)}/g);
    if (params) {
        for (var i = 0; i < params.length; i++) {
            let param = params[i];
            let param_name = param.slice(1, -1);
            let property = item["params"][param_name];

            let param_input = document.createElement('input');
            param_input.type = 'text';
            param_input.id = item["en_name"] + "&" + param_name;
            param_input.placeholder = property["en_name"];
            line_inner = line_inner.replace(param, param_input.outerHTML);
        }
    }

    /**绑定各元素触发 */
    line.innerHTML = line_inner;
    document.getElementById(input_button.id).addEventListener('click', upload.bind(null, item["en_name"]));
    document.getElementById(output_button.id).addEventListener('click', download.bind(null, item["en_name"]));
    if (params) {
        for (var i = 0; i < params.length; i++) {
            let param = params[i];
            let param_name = param.slice(1, -1);
            let property = item["params"][param_name];
            let param_input_id = item["en_name"] + "&" + param_name;
            let param_input = document.getElementById(param_input_id);
            param_input.addEventListener('mouseenter', tip_param_input.bind(null, true, param_input, property));
            param_input.addEventListener('mouseleave', tip_param_input.bind(null, false, param_input, property));
        }
    }
}

function upload(en_name) {
    console.info("upload" + en_name);
}
function download(en_name) {
    console.info("download " + en_name);
}
function tip_param_input(show, param_input, property) {
    if (show) {
        tip_div.innerHTML = 
            `<label class='tip_label'>英文名称：${property["en_name"]}</label>` +
            `<label class='tip_label'>中文名称：${property["zh_name"]}</label>` +
            `<label class='tip_label'>描述：${property["describe"]}</label>` +
            `<label class='tip_label'>类型：${property["type"]}</label>` +
            `<label class='tip_label'>范围：${property["range"]}</label>` +
            `<label class='tip_label'>默认值：${property["default"]}</label>`
        ;

        param_position = param_input.getBoundingClientRect();
        tip_div.style.top = param_position.bottom + 'px';
        tip_div.style.left = param_position.left + 'px';

        tip_div.style.display = 'flex';
    } else {
        tip_div.style.display = 'none';
    }
}
function check_param_input(en_name) {

}








refresh_commands();


