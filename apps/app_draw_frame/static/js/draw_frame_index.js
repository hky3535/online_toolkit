/**何恺悦 hekaiyue 2023-06-27 */
const main_div = document.getElementById('main_div');
/**文件夹列表 文件列表 元素列表 图像画布 绘制画布 绘制事件画布 绘制信息textarea*/
const folders_ul = document.querySelector('#foldersList');
const files_ul = document.querySelector('#filesList');
const items_ul = document.querySelector('#itemsList');
const frame_canvas = document.getElementById('frameCanvas'); const frame_context = frame_canvas.getContext('2d');
const draw_div = document.getElementById('draw_div');
const draw_event_div = document.getElementById('draw_event_div');
const current_information_textarea = document.getElementById("current_information_textarea");
/**当前文件夹 当前文件 当前元素 当前图片属性 */
var current_folder = ""; var current_file = ""; var current_drawing = ["", []]; var current_frame_attributes = {};
/**上传文件form */
var upload_file_form = new FormData();
/**弹窗 状态弹窗 状态弹窗文字 */
const popup_div = document.getElementById('popup_div');
const status_popup_div = document.getElementById('status_popup_div');
const status_popup_label = document.getElementById('status_popup_label');
/**绑定上传文件按钮 */
const select_button = document.getElementById('select_button');
const select_file = document.getElementById('select_file');
select_button.addEventListener('click', () => {select_file.click();});


function checkbox_status(ul) {
    /**取出所有被勾选的index */
    const indexes = [];

    const li_list = ul.querySelectorAll("li");
    li_list.forEach((li, index) => {
        const checkbox = li.querySelector("input[type=checkbox]");
        if (checkbox.checked) {
            indexes.push(index);
        }
    });
    indexes.reverse();
    return indexes;
}
function set_current(current_key, current_value) {
    var current = "";
    if (current_key === "folder") {
        current_folder = current_value;
        current = 
            "Folder: " + current_folder + "\r\n" + 
            "File: " + "\r\n" + 
            "Attributes: " + "\r\n" + 
            "Drawing: "
        ;
    }
    if (current_key === "file") {
        current_file = current_value;
        current = 
            "Folder: " + current_folder + "\r\n" + 
            "File: " + current_file + "\r\n" + 
            "Attributes: " + "\r\n" + 
            "Drawing: "
        ;
    }
    if (current_key === "frame_attributes") {
        current_frame_attributes = current_value;
        current = 
            "Folder: " + current_folder + "\r\n" + 
            "File: " + current_file + "\r\n" + 
            "Attributes: " + JSON.stringify(current_frame_attributes) + "\r\n" + 
            "Drawing: "
        ;
    }
    if (current_key === "drawing") {
        current_drawing = current_value;    // 对于显示坐标通过round变成整数，实际记录和绘制的时候都是小数（防止刷新的时候因为取舍偏移）
        current = 
            "Folder: " + current_folder + "\r\n" + 
            "File: " + current_file + "\r\n" + 
            "Attributes: " + JSON.stringify(current_frame_attributes) + "\r\n" + 
            "Drawing: " + current_drawing[0] + " " + current_drawing[1].map(num => Math.round(num));
    }
    current_information_textarea.value = current;
}
function select_all(ul) {
    const li_list = ul.querySelectorAll("li");
    /**判断是否有未选 如果有未选则执行全选 如果全都选择则执行取消 */
    var select_all_flag = false;
    li_list.forEach((li, index) => {
        const checkbox = li.querySelector("input[type=checkbox]");
        if (!checkbox.checked) {
            select_all_flag = true;
            return;
        }
    });

    li_list.forEach((li, index) => {
        const checkbox = li.querySelector("input[type=checkbox]");
        checkbox.checked = select_all_flag;
    });
}
function status_popup(seconds, text) {
    status_popup_label.textContent = text;
    status_popup_div.style.display = 'flex';
    main_div.style.pointerEvents = 'none';
    setTimeout(() => {  // 几秒后关闭悬浮窗 复原主屏幕
        /**
         * 解除全局事件禁用
         * 隐藏状态弹窗
         */
        main_div.style.pointerEvents = 'auto';
        status_popup_div.style.display = 'none';
    }, seconds*1000);
}
function now_time() {
    const date = new Date();
    const now_time = `[` + 
        `${date.getFullYear()}-` + 
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` + 
        `${date.getDate().toString().padStart(2, '0')}-` + 
        `${date.getHours().toString().padStart(2, '0')}-` + 
        `${date.getMinutes().toString().padStart(2, '0')}-` + 
        `${date.getSeconds().toString().padStart(2, '0')}` + 
    `]`;
    return now_time;
}


function refresh_folders_list() {
    fetch('/draw_frame/refresh_folders_list/')     // 发送GET请求获取文件夹列表
    .then(response => response.json())  // 得到响应：{'folders_list': ['文件夹名称0', '文件夹名称1', ...]}
    .then(data => {
        /**
        深度清除：
        1、清空文件夹ul列表
        2、清空文件ul列表
        3、清空元素ul列表
        4、清空图像画幅canvas
        5、清空绘制画幅div
        6、清空绘制事件画幅div
        */
        folders_ul.innerHTML = '';
        files_ul.innerHTML = '';
        items_ul.innerHTML = '';
        clear_canvas(frame_canvas);
        draw_div.innerHTML = '';
        draw_event_div.innerHTML = '';
        current_folder = ""; current_file = ""; current_drawing = ["", []];
        set_current("", "");
        /**
        创建列表：
        1、接收到文件夹列表->插入文件夹ul列表
        2、插入内容为li元素嵌套的checkbox+a标签
        3、对a标签绑定事件
        */
        data["folders_list"].forEach(folder => {
            const folder_li = document.createElement('li');
            const folder_cb = document.createElement('input'); folder_cb.type = 'checkbox';
            const folder_a = document.createElement('a'); folder_a.href = '#'; folder_a.textContent = folder;
            folder_a.addEventListener('click', refresh_files_list.bind(null, folder));
            folder_li.appendChild(folder_cb); folder_li.appendChild(folder_a);
            folders_ul.appendChild(folder_li);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function refresh_files_list(folder) {
    set_current("folder", folder);
    fetch('/draw_frame/refresh_files_list/', {     // 发送POST请求获取文件夹下对应的文件列表
        method: 'POST',                 // 发送请求：{'folder': 文件夹名称}
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'folder': folder})
    })
    .then(response => response.json())  // 得到响应：{'files_list': ['文件名称0', '文件名称1', ...]}
    .then(data => {
        /**
        局部清除：
        2、清空文件ul列表
        3、清空元素ul列表
        4、清空图像画幅canvas
        5、清空绘制画幅div
        6、清空绘制事件画幅div
        */
        files_ul.innerHTML = '';
        items_ul.innerHTML = '';
        clear_canvas(frame_canvas);
        draw_div.innerHTML = '';
        draw_event_div.innerHTML = '';
        current_file = "";
        /**
        创建列表：
        1、接收到文件列表->插入文件ul列表
        2、插入内容为li元素嵌套的checkbox+a标签
        3、对a标签绑定事件
        */
        data["files_list"].forEach(file => {
            const file_li = document.createElement('li');
            const file_cb = document.createElement('input'); file_cb.type = 'checkbox';
            const file_a = document.createElement('a'); file_a.href = '#'; file_a.textContent = file;
            file_a.addEventListener('click', refresh_frame.bind(null, folder, file));
            file_li.appendChild(file_cb); file_li.appendChild(file_a);
            files_ul.appendChild(file_li);
        })
        switch_frame("next");
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function refresh_frame(folder, file) {
    set_current("file", file);
    fetch('/draw_frame/refresh_frame/', {          // 发送POST请求获取文件对应的base64图像
        method: 'POST',                 // 发送请求：{'folder': 文件夹名称, 'file': 文件名称}
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'folder': folder, 'file': file})
    })
    .then(response => response.json())  // 得到响应：{"frame": "base64编码的图像", "drawings": [[shape, [x0, y0, x1, y1, ...]], ...]}
    .then(data => {
        /**
        显示图像：
        1、读取base64编码的图片并绘制到canvas上
        2、不作清除，仅覆盖上一次canvas绘制内容，只有在按刷新按钮才会将canvas重置为初始空图
        3、设置显示drawings内容
        3、读取绘制信息并绘制到canvas上
        */
        const frame = new Image();
        frame.onload = function() {
            frame_context.drawImage(frame, 0, 0, 640, 640);     // 覆盖canvas图像

            items_ul.innerHTML = '';
            draw_div.innerHTML = '';
            draw_event_div.innerHTML = '';
            current_drawing = ["", []];
            
            set_current("frame_attributes", data['drawings']['frame_attributes']);

            for (const drawing of data['drawings']['drawings']) {
                normalized_drawing = normalization(current_frame_attributes["resolution"], "normalize", drawing);
                add_drawing(normalized_drawing, "r");
            }
        };
        frame.src = 'data:image/png;base64,' + data['frame'];
       
    })
}


function create_folder(action) {
    /**
     * 弹窗
     * 创建文件夹弹窗
     * 文件夹名称
     */
    const popup_div = document.getElementById('popup_div');
    const create_folder_popup_div = document.getElementById('create_folder_popup_div');
    const create_folder_input = document.getElementById('create_folder_input');
    
    if (action === "") {
        /**
         * 获取当前日期时间预填充文件夹名称
         */
        create_folder_input.value = now_time();

        /**
         * 显示弹窗
         * 显示创建文件夹弹窗
         * 设置全局事件禁用
         * 设置二级弹窗解除禁用
         */
        popup_div.style.display = 'flex';
        create_folder_popup_div.style.display = 'flex';
        main_div.style.pointerEvents = 'none';
        create_folder_popup_div.style.pointerEvents = 'auto';
    }
    if (action === "cancel") {
        /**
         * 解除全局事件禁用
         * 隐藏创建文件夹弹窗
         * 隐藏弹窗
         */
        main_div.style.pointerEvents = 'auto';
        create_folder_popup_div.style.display = 'none';
        popup_div.style.display = 'none';
    }
    if (action === "confirm") {
        fetch('/draw_frame/create_folder/', {     // 发送POST请求获取文件夹下对应的文件列表
            method: 'POST',                 // 发送请求：{'folder': 新建文件夹名称}
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'folder': create_folder_input.value,
            })
        })
        .then(response => response.json())  // 得到响应：{}
        .then(data => {
            /**
             * 解除全局事件禁用
             * 刷新文件夹列表
             * 隐藏创建文件夹弹窗
             * 隐藏弹窗
             */
            main_div.style.pointerEvents = 'auto';
            refresh_folders_list();
            create_folder_popup_div.style.display = 'none';
            popup_div.style.display = 'none';
            status_popup(1, "文件夹创建成功！");
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}
function delete_folder() {
    function del_fetch(index) {
        if (index >= del_indexes.length) {
            refresh_folders_list(); 
            if (index !== 0) {status_popup(1, "文件夹删除成功！");}
            return;
        }

        fetch('/draw_frame/delete_folder/', {     // 发送POST请求获取文件夹下对应的文件列表
            method: 'POST',                 // 发送请求：{}
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "index": del_indexes[index],
            })
        })
        .then(response => response.json())  // 得到响应：{}
        .then(data => {del_fetch(index+1);})
        .catch(error => {
            console.error('Error:', error);
        });
    }

    /**获取需要删除的index删除 */
    del_indexes = checkbox_status(folders_ul);
    
    const folders_li_list = folders_ul.querySelectorAll("li");
    del_indexes.forEach(del_index => {
        /**删除ul中的li */
        folders_ul.removeChild(folders_li_list[del_index]);
    });
    /**删除服务器中的存储内容 递归倒序删除 防止前面删除后后面的元素index发生偏移*/
    del_fetch(0);
}


function upload_file(action) {
    /**
     * 上传文件弹窗
     * 选择文件
     * 上传文件列表
     */
    const upload_file_popup_div = document.getElementById('upload_file_popup_div');
    const upload_ul = document.getElementById('uploadList');

    if (action === "") {
        /**
         * 没选择文件夹就不上传
         * 显示弹窗
         * 显示上传文件弹窗
         * 设置全局事件禁用
         * 设置二级弹窗解除禁用
         */
        if (current_folder === "") {return;}
        popup_div.style.display = 'flex';
        upload_file_popup_div.style.display = 'flex';
        main_div.style.pointerEvents = 'none';
        upload_file_popup_div.style.pointerEvents = 'auto';
        /**
         * 设置选择文件按钮事件
         * 选择文件按钮
         * 选择文件按钮绑定
         */
        select_file.addEventListener('change', (event) => {
            /**
             * 清空upload_file_form 清空upload_ul
             * 通过绑定的event获取到所有选择的文件
             * 将选择的文件以li-a形式逐行插入ul
             * 将选择到的文件以['文件名称', 文件本体]的格式插入到刚刚被清空的upload_file_form中
             */
            upload_file_form = new FormData(); upload_ul.innerHTML = '';
            const selected_file_list = event.target.files;
            for(const selected_file of selected_file_list) {
                const upload_li = document.createElement('li');
                const upload_a = document.createElement('a'); upload_a.href = '#'; upload_a.textContent = selected_file.name;
                upload_li.appendChild(upload_a);
                upload_ul.appendChild(upload_li);
                upload_file_form.append(selected_file.name, selected_file);
            }
        });
    }
    if (action === "confirm") {
        /**
         * 确定到待上传文件的个数
         * 如果没有待上传文件就不上传
         * 如果有待上传文件则获取到文件列表FormData()的迭代器
         * 初始化预显示状态弹窗status_popup_div
         * 设置二级弹窗禁用
         * 运行递归函数逐个文件上传
         */
        const upload_num = upload_ul.querySelectorAll('li').length;
        if (upload_num === 0) {return;}
        var upload_file_form_iterator = upload_file_form.entries();
        status_popup_div.style.display = 'flex';
        upload_file_popup_div.style.pointerEvents = 'none';
        upload_fetch(0);

        function upload_fetch(index) {
            /**
             * 通过迭代器获取后一个元素
             * 如果迭代器结束则结束整个函数准备退出
             */
            var upload_file_form_item = upload_file_form_iterator.next();
            if (upload_file_form_item.done) {
                /**
                 * 根据当前文件夹刷新文件列表
                 * 清空文件选择器中选择的文件
                 * 清空待上传文件FormData()
                 * 清空待上传文件ul
                 * 设置状态弹窗文字为已完成状态
                 */
                refresh_files_list(current_folder);
                select_file.value = '';
                upload_file_form = new FormData();
                upload_ul.innerHTML = '';
                status_popup_label.textContent = `（${index}/${upload_num}）上传完成！`; 
                setTimeout(() => {  // 几秒后关闭悬浮窗 复原主屏幕
                    /**
                     * 解除全局事件禁用
                     * 隐藏创建文件夹弹窗
                     * 隐藏弹窗
                     * 隐藏状态弹窗
                     */
                    main_div.style.pointerEvents = 'auto';
                    upload_file_popup_div.style.display = 'none';
                    popup_div.style.display = 'none';
                    status_popup_div.style.display = 'none';
                }, 1500);
                return;
            }
            
            /**
             * 在状态弹窗文字中设置事件：当前正在上传的文件
             * 创建一个临时独立FormData()
             * 加入文件夹名称['folder', '当前文件夹名称']
             * 加入文件['文件名称', 文件本体]
             * 向服务器上传该文件
             * 在data中递归本函数
             */
            status_popup_label.textContent = `（${index+1}/${upload_num}）上传中...`;
            var upload_file_form_temp = new FormData();
            upload_file_form_temp.append('folder', current_folder);
            upload_file_form_temp.append(upload_file_form_item.value[0], upload_file_form_item.value[1]);
            fetch('/draw_frame/upload_file/', {
                method: 'POST',
                body: upload_file_form_temp
            })
            .then(response => response.json())
            .then(data => {
                index++; upload_fetch(index);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }
    if (action === "cancel") {
        select_file.value = '';
        upload_file_form = new FormData();
        upload_ul.innerHTML = '';
        main_div.style.pointerEvents = 'auto';
        upload_file_popup_div.style.display = 'none';
        popup_div.style.display = 'none';
        status_popup_div.style.display = 'none';
    }
}
function delete_file() {
    // 同时删除图片和绘制文件（如果有的话）
    function del_fetch(index) {
        if (index >= del_indexes.length) {refresh_files_list(current_folder); status_popup(1, "文件删除成功！"); return;}

        fetch('/draw_frame/delete_file/', {     // 发送POST请求获取文件夹下对应的文件列表
            method: 'POST',                 // 发送请求：{}
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "folder": current_folder,
                "index": del_indexes[index],
            })
        })
        .then(response => response.json())  // 得到响应：{}
        .then(data => {del_fetch(index+1);})
        .catch(error => {
            console.error('Error:', error);
        });
    }

    /**获取需要删除的index删除 */
    del_indexes = checkbox_status(files_ul);
    
    const files_li_list = files_ul.querySelectorAll("li");
    del_indexes.forEach(del_index => {
        /**删除ul中的li */
        files_ul.removeChild(files_li_list[del_index]);
    });
    /**删除服务器中的存储内容 递归倒序删除 防止前面删除后后面的元素index发生偏移*/
    del_fetch(0);
}
function download_file(action) {
    /**
     * 下载文件弹窗
     * 下载初始图象checkbox
     * 下载绘制图像checkbox
     * 下载绘制数据checkbox
     * 获取到选择的文件的index
     * 选择的文件的数量
     * 下载参数
     * 下载过程中的唯一标识符（随机生成一个七位随机数）
     */
    const download_file_popup_div = document.getElementById('download_file_popup_div');
    const origin_frame_cb = document.getElementById('origin_frame');
    const drawn_frame_cb = document.getElementById('drawn_frame');
    const drawings_cb = document.getElementById('drawings');
    const download_indexes = checkbox_status(files_ul);
    const download_num = download_indexes.length;
    const download_params = [origin_frame_cb.checked, drawn_frame_cb.checked, drawings_cb.checked];
    const download_identify = now_time() + `[${Math.floor(Math.random() * 9000000) + 1000000}]`;

    if (action === "") {
        /**
         * 没选择文件夹就不下载
         * 显示弹窗
         * 显示下载文件弹窗
         * 设置全局事件禁用
         * 设置二级弹窗解除禁用
         */
        if (download_num === 0) {return;}
        popup_div.style.display = 'flex';
        download_file_popup_div.style.display = 'flex';
        main_div.style.pointerEvents = 'none';
        download_file_popup_div.style.pointerEvents = 'auto';
    }

    if (action === "confirm") {
        /**
         * 初始化预显示状态弹窗status_popup_div
         * 设置二级弹窗禁用
         * 运行递归函数逐个文件上传
         */
        status_popup_div.style.display = 'flex';
        download_file_popup_div.style.pointerEvents = 'none';
        download_fetch(0);

        function download_fetch(index) {
            /**
             * 当下载文件超过文件列表长度则退出
             * 状态弹窗文字
             * 
             */
            if (index >= download_num) {
                status_popup_label.textContent = `（${index}/${download_num}）下载准备完成！`;
                setTimeout(() => {
                    /**
                     * 隐藏下载文件弹窗
                     * 隐藏弹窗
                     * 状态弹窗文字
                     */
                    download_file_popup_div.style.display = 'none';
                    popup_div.style.display = 'none';
                    status_popup_label.textContent = "下载开始！";
                    setTimeout(() => {
                        /**
                         * 隐藏状态弹窗
                         * 解除全局事件禁用
                         * 触发下载
                         */
                        status_popup_div.style.display = 'none';
                        main_div.style.pointerEvents = 'auto';
                        const link = document.createElement('a'); link.href = `/draw_frame/download_file/?folder_identify=${current_folder}${download_identify}.tar`; link.click();
                    }, 1500);
                }, 1500);
                return;
            }

            status_popup_label.textContent = `（${index+1}/${download_num}）下载准备中...`;
            fetch('/draw_frame/prepare_download_file/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "identify": download_identify,
                    "folder": current_folder,
                    "params": download_params,
                    "index": download_indexes[index],
                })
            })
            .then(response => response.json())
            .then(data => {
                index++; download_fetch(index);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }
    if (action === "cancel") {
        main_div.style.pointerEvents = 'auto';
        download_file_popup_div.style.display = 'none';
        popup_div.style.display = 'none';
        status_popup_div.style.display = 'none';
    }
}


function del_drawing() {

    function del_fetch(index) {
        if (index >= del_indexes.length) {return;}

        fetch('/draw_frame/del_drawing/', {     // 发送POST请求获取文件夹下对应的文件列表
            method: 'POST',                 // 发送请求：{}
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'folder': current_folder,
                "file": current_file,
                "index": del_indexes[index],
            })
        })
        .then(response => response.json())  // 得到响应：{}
        .then(data => {del_fetch(index+1);})
        .catch(error => {
            console.error('Error:', error);
        });
    }

    /**获取需要删除的index删除 */
    del_indexes = checkbox_status(items_ul);
    
    const draw_canvas_list = draw_div.querySelectorAll("canvas");
    const items_li_list = items_ul.querySelectorAll("li");
    del_indexes.forEach(del_index => {
        /**删除canvas */
        draw_div.removeChild(draw_canvas_list[del_index]);
        /**删除ul中的li */
        items_ul.removeChild(items_li_list[del_index]);
    });
    /**删除服务器中的存储内容 递归倒序删除 防止前面删除后后面的元素index发生偏移*/
    del_fetch(0);
}


function switch_frame(next_last) {
    const li_list = files_ul.querySelectorAll("li");
    if (li_list.length === 0) {return;}

    var loop_index = 0;
    li_list.forEach((li, index) => {
        const a = li.querySelector("a");
        if (a.textContent === current_file) {
            if (next_last === "next") {loop_index = index+1; return;}
            if (next_last === "last") {loop_index = index-1; return;}  
        }
    });

    if (loop_index >= li_list.length) {loop_index = 0;}
    if (loop_index < 0) {loop_index = li_list.length-1;}
    
    refresh_frame(current_folder, li_list[loop_index].textContent);
}
function draw_event(shape) {
    if (current_file === "") {return;}
    /*蒙一层新的canvas*/
    draw_event_div.innerHTML = '';

    const draw_event_canvas = document.createElement('canvas');                       // 创建新一层canvas
    draw_event_canvas.width = "640"; draw_event_canvas.height = "640"; draw_event_canvas.style.position = 'absolute'; draw_event_canvas.style.top = 0; draw_event_canvas.style.left = 0;                         
    draw_event_canvas.style.zIndex = 1001;                                               // 0:frame_div 1:draw_div 2~:draw_canvas 999:draw_event_div 1000:draw_event_canvas
    draw_event_div.appendChild(draw_event_canvas);

    var drawn_points = [];
    function event_draw_shape(shape, status, _x, _y) {
        var x = Math.trunc(_x); var y = Math.trunc(_y);
        var done_flag = false;
        function event_draw_point() {
            if (status === "mouseup") {
                drawn_points.push(x, y);
                if (drawn_points.length === 2) {done_flag = true;}
            }
            if (status === "mousemove" && drawn_points.length === 0) {
                draw_shape(["point", [x, y]], draw_event_canvas, false);
            }
        }
        function event_draw_line() {
            if (status === "mouseup") {
                drawn_points.push(x, y);
                if (drawn_points.length === 4) {done_flag = true;}
            }
            if (status === "mousemove" && drawn_points.length === 2) {
                draw_shape(["line", [...drawn_points, ...[x, y]]], draw_event_canvas, false);
            }
        }
        function event_draw_rect() {
            if (status === "mouseup") {
                drawn_points.push(x, y);
                if (drawn_points.length === 4) {done_flag = true;}
            }
            if (status === "mousemove" && drawn_points.length === 2) {
                draw_shape(["rect", [...drawn_points, ...[x, y]]], draw_event_canvas, false);
            }
        }
        function event_draw_circle() {
            function xy_radius(xy_list) {
                const cx = xy_list[0]; const cy = xy_list[1];
                const x = xy_list[2]; const y = xy_list[3];
                const radius = Math.trunc(Math.sqrt((x - cx)**2 + (y - cy)**2));
                radius_list = [cx, cy, radius];
                return radius_list;
            }
            if (status === "mouseup") {
                drawn_points.push(x, y);
                if (drawn_points.length === 4) {drawn_points = xy_radius(drawn_points);done_flag = true;}
            }
            if (status === "mousemove" && drawn_points.length === 2) {
                draw_shape(["circle", xy_radius([...drawn_points, ...[x, y]])], draw_event_canvas, false);
            }
        }
        function event_draw_polygon() {
            if (drawn_points.length >= 6 && Math.abs(x-drawn_points[0]) <= 12 && Math.abs(y-drawn_points[1]) <= 12) {
                x = drawn_points[0]; y = drawn_points[1];
            }
            if (status === "mouseup") {
                drawn_points.push(x, y);
                if (drawn_points.length >= 6 && x === drawn_points[0] && y === drawn_points[1]) {done_flag = true;}
            }
            if (status === "mousemove" && drawn_points.length >= 2) {
                draw_shape(["polygon", [...drawn_points, ...[x, y]]], draw_event_canvas, false);
            }
        }

        switch (shape) {
            case "point": {event_draw_point(); break;}
            case "line": {event_draw_line(); break;}
            case "rect": {event_draw_rect(); break;}
            case "circle": {event_draw_circle(); break;}
            case "polygon": {event_draw_polygon(); break;}
            default: {break;}
        }

        if (done_flag) {
            add_drawing([shape, drawn_points], "w");
                    
            drawn_points = [];
            clear_canvas(draw_event_canvas);
            draw_event_canvas.removeEventListener("mouseup", event_draw_shape);
            draw_event_canvas.removeEventListener("mousemove", event_draw_shape);
            draw_event_div.innerHTML = '';
        }
    }
    
    draw_event_canvas.addEventListener("mouseup", function(event) {
        event_draw_shape(
            shape, 
            "mouseup", 
            event.clientX - frame_canvas.getBoundingClientRect().left, 
            event.clientY - frame_canvas.getBoundingClientRect().top
        )
    });
    draw_event_canvas.addEventListener("mousemove", function(event) {
        event_draw_shape(
            shape, 
            "mousemove", 
            event.clientX - frame_canvas.getBoundingClientRect().left, 
            event.clientY - frame_canvas.getBoundingClientRect().top
        )
    });

}
function add_drawing(drawing, rw) {
    const shape = drawing[0]; const item = drawing[1];
   
    /** 向draw_div里面层层堆叠新的draw_canvas */
    const draw_canvas = document.createElement('canvas');                       // 创建新一层canvas
    draw_canvas.width = "640"; draw_canvas.height = "640"; draw_canvas.style.position = 'absolute'; draw_canvas.style.top = 0; draw_canvas.style.left = 0;                         
    draw_canvas.style.zIndex = 2;                                               // // 0:frame_div 1:draw_div 2~:draw_canvas 999:draw_event_div 1000:draw_event_canvas
    draw_div.appendChild(draw_canvas);                                          // 将新一层canvas放入div

    /** 将抓取到的内容设置为ul列表中的 */
    const item_li = document.createElement('li');   // 创建li列表元素
    const item_cb = document.createElement('input'); item_cb.type = 'checkbox';
    const item_a = document.createElement('a'); item_a.textContent = shape; item_a.href = '#';  
    item_a.addEventListener('mousedown', draw_shape.bind(null, drawing, draw_canvas, true));
    item_a.addEventListener('mouseup', draw_shape.bind(null, drawing, draw_canvas, false));
    item_li.appendChild(item_cb); item_li.appendChild(item_a);
    items_ul.appendChild(item_li);
 
    /** 开始绘制 */
    denormalized_drawing = draw_shape(drawing, draw_canvas, false);     // 逆归一化结果
    if (rw === "w") {
        fetch('/draw_frame/add_drawing/', {     // 发送POST请求获取文件夹下对应的文件列表
            method: 'POST',                 // 发送请求：{'folder': 文件夹名称}
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'folder': current_folder,
                "file": current_file,
                "drawing": denormalized_drawing,
            })
        })
        .then(response => response.json())  // 得到响应：{}
        .then(data => {})
        .catch(error => {
            console.error('Error:', error);
        });
    }   
}
function draw_shape(drawing, draw_canvas, sel_flag) {
    function draw_point(item, draw_context) {
        draw_context.beginPath();
        draw_context.arc(item[0], item[1], 2, 0, 2 * Math.PI);
        draw_context.stroke();
    }
    function draw_line(item, draw_context) {
        draw_context.beginPath();
        draw_context.moveTo(item[0], item[1]);
        draw_context.lineTo(item[2], item[3]);
        draw_context.stroke();
    }
    function draw_rect(item, draw_context) {
        draw_context.beginPath();
        draw_context.strokeRect(item[0], item[1], item[2] - item[0], item[3] - item[1]);
        draw_context.stroke();
    }
    function draw_circle(item, draw_context) {
        draw_context.beginPath();
        draw_context.arc(item[0], item[1], item[2], 0, 2 * Math.PI);
        draw_context.stroke();
    }
    function draw_polygon(item, draw_context) {
        draw_context.beginPath();
        draw_context.moveTo(item[0], item[1]);
        for (var j = 2; j < item.length; j += 2) {draw_context.lineTo(item[j], item[j + 1]);}
        draw_context.stroke();
    }

    clear_canvas(draw_canvas);
    const draw_context = draw_canvas.getContext('2d');
    if (sel_flag) { draw_context.lineWidth = 5; draw_context.strokeStyle = '#ff0000';
    } else {        draw_context.lineWidth = 3; draw_context.strokeStyle = '#00ff00';}

    const shape = drawing[0]; const item = drawing[1];
    switch (shape) {
        case 'point': draw_point(item, draw_context); break;
        case 'line': draw_line(item, draw_context); break;
        case 'rect': draw_rect(item, draw_context); break;
        case 'circle': draw_circle(item, draw_context); break;
        case 'polygon': draw_polygon(item, draw_context); break;
        default: console.error("Error:"); break;
    }
    const denormalized_drawing = normalization(current_frame_attributes["resolution"], "denormalize", drawing);
    set_current("drawing", denormalized_drawing);    //画完后显示最新的绘制结果
    return denormalized_drawing;
}
function clear_canvas(canvas) {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, frame_canvas.width, frame_canvas.height);
}
function normalization(frame_resolution, normalization_flag, drawing) {
    const shape = drawing[0]; const item = drawing[1];
    var ratio; var x_shift; var y_shift;
    const frame_height = frame_resolution[0]*1.0; const frame_width = frame_resolution[1]*1.0;
    var return_drawing;

    if (normalization_flag === "normalize") {
        if (frame_height > frame_width) {ratio = 640.0/frame_height; x_shift = (640.0 - frame_width*ratio)/2; y_shift = 0;} 
        else                            {ratio = 640.0/frame_width; x_shift = 0; y_shift = (640.0 - frame_height*ratio)/2;}
        console.log(ratio, x_shift, y_shift);
    }
    if (normalization_flag === "denormalize") {
        if (frame_height > frame_width) {ratio = frame_height/640.0; x_shift = (frame_height-frame_width)/2; y_shift = 0;} 
        else                            {ratio = frame_width/640.0; x_shift = 0; y_shift = (frame_height-frame_width)/2;}
    }

    switch (shape) {
        case "point": normalize_point(); break;
        case "line": normalize_line(); break;
        case "rect": normalize_rect(); break;
        case "circle": normalize_circle(); break;
        case "polygon": normalize_polygon(); break;
        default: break;
    }

    function normalize_point() {
        let point = [
            item[0]*ratio+x_shift, 
            item[1]*ratio+y_shift
        ];
        return_drawing = ["point", point];
    }
    function normalize_line() {
        let line = [
            item[0]*ratio+x_shift, 
            item[1]*ratio+y_shift,
            item[2]*ratio+x_shift, 
            item[3]*ratio+y_shift
        ];
        return_drawing = ["line", line];
    }
    function normalize_rect() {
        let rect = [
            item[0]*ratio+x_shift, 
            item[1]*ratio+y_shift,
            item[2]*ratio+x_shift, 
            item[3]*ratio+y_shift
        ];
        return_drawing = ["rect", rect];
    }
    function normalize_circle() {
        let circle = [
            item[0]*ratio+x_shift, 
            item[1]*ratio+y_shift,
            item[2]*ratio 
        ];
        return_drawing = ["circle", circle];
    }
    function normalize_polygon() {
        let polygon = [];
        for (let i = 0; i < item.length; i += 2) {
            let x = item[i]*ratio+x_shift;
            let y = item[i + 1]*ratio+y_shift;
            polygon.push(x, y);
        }
        return_drawing = ["polygon", polygon];
    }
    return return_drawing;
}


window.onload = refresh_folders_list()

$("#refreshFolderBtn").click(function() {refresh_folders_list(); status_popup(1, "文件夹列表刷新成功！");});
$("#createFolderBtn").click(function() {create_folder("")});
    $("#create_confirm").click(function() {create_folder("confirm")});
    $("#create_cancel").click(function() {create_folder("cancel")});
$("#deleteFolderBtn").click(function() {delete_folder()});
$("#selectallFolderBtn").click(function() {select_all(folders_ul)});

$("#uploadFileBtn").click(function() {upload_file("")});
    $("#upload_confirm").click(function() {upload_file("confirm")});
    $("#upload_cancel").click(function() {upload_file("cancel")});
$("#deleteFileBtn").click(function() {delete_file()});
$("#selectallFileBtn").click(function() {select_all(files_ul)});
$("#downloadFileBtn").click(function() {download_file("")});
    $("#download_confirm").click(function() {download_file("confirm")});
    $("#download_cancel").click(function() {download_file("cancel")});

$("#deleteItemBtn").click(function() {del_drawing()});
$("#selectallItemBtn").click(function() {select_all(items_ul)});

$("#lastFrameBtn").click(function() {switch_frame("last")});
$("#nextFrameBtn").click(function() {switch_frame("next")});
$("#drawPointBtn").click(function() {draw_event("point")});
$("#drawLineBtn").click(function() {draw_event("line")});
$("#drawRectBtn").click(function() {draw_event("rect")});
$("#drawCircleBtn").click(function() {draw_event("circle")});
$("#drawPolygonBtn").click(function() {draw_event("polygon")});

document.addEventListener('keydown', (event) => {
    console.log(event.code);
    switch (event.code) {
        case "ArrowLeft": $("#lastFrameBtn").click(); break;
        case "ArrowRight": $("#nextFrameBtn").click(); break;
        case "Numpad1": $("#drawPointBtn").click(); break;
        case "Numpad2": $("#drawLineBtn").click(); break;
        case "Numpad3": $("#drawRectBtn").click(); break;
        case "Numpad4": $("#drawCircleBtn").click(); break;
        case "Numpad5": $("#drawPolygonBtn").click(); break;
        default: break;
    }
});
