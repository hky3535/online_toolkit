/**何恺悦 hekaiyue 2023-06-29 */
const main_div = document.getElementById('main_div');
const select_btn = document.getElementById('select_btn');
const _select = document.getElementById('select');
select_btn.addEventListener('click', () => {_select.click();});
const upload_btn = document.getElementById('upload_btn');
const select_number = document.getElementById('select_number');
const upload_url_textarea = document.getElementById('upload_url_textarea');
const copy_url_btn = document.getElementById('copy_url_btn'); copy_url_btn.disabled = true;

const paste_url_btn = document.getElementById('paste_url_btn');
const download_url_textarea = document.getElementById('download_url_textarea');
const download_btn = document.getElementById('download_btn');

const status_popup_div = document.getElementById('status_popup_div');
const status_popup_label = document.getElementById('status_popup_label');

var selected_files_number = 0;
var upload_files_form = new FormData();

_select.addEventListener('change', (event) => {
    /**
     * 查看选择的文件的数量
     * 如果什么都没选择就退出
     * 选择文件后禁用复制链接
     * 选择文件后可以上传文件
     */
    selected_files_number = event.target.files.length;
    if (selected_files_number === 0) {return;}
    copy_url_btn.disabled = true;
    upload_btn.disabled = false;
    upload_files_form = new FormData();
    let files_textarea_show = "已选择文件：\r\n"
    for(const selected_file of event.target.files) {
        files_textarea_show += selected_file.name + "\r\n";
        upload_files_form.append(selected_file.name, selected_file);
    }
    if (selected_files_number !== 0) {
        upload_url_textarea.value = files_textarea_show;
        status_popup(0.5, `已选择${selected_files_number}个文件`);
    }
});

copy_url_btn.addEventListener('click', function() {
    navigator.clipboard.writeText(upload_url_textarea.value)
    .then(() => {
        status_popup(0.5, `已成功复制到剪贴板`);
    })
    .catch((error) => {
        status_popup(0.5, `写入剪贴板时出错`);
    });
});

paste_url_btn.addEventListener('click', function() {
    navigator.clipboard.readText()
    .then(text => {
        download_url_textarea.value = text;
        status_popup(0.5, `已成功粘贴链接`);
    })
    .catch(err => {
        status_popup(0.5, `读取剪贴板时出错`);
    });
});

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
function generate_identification() {
    const date = new Date();
    const now_time = 
        `${date.getFullYear()}-` + 
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` + 
        `${date.getDate().toString().padStart(2, '0')}-` + 
        `${date.getHours().toString().padStart(2, '0')}-` + 
        `${date.getMinutes().toString().padStart(2, '0')}-` + 
        `${date.getSeconds().toString().padStart(2, '0')}` 
    ;
    const identification_code = Math.floor(Math.random() * 9000000) + 1000000;
    const identification_sequence = `[${now_time}][${identification_code}]`;
    return [identification_sequence, identification_code];
}
function generate_url(identification, identification_code) {
    let root_url = window.location.origin;
    let download_url = `${root_url}/limited_time_sharing/download_file/?identification=${identification}`
    let download_text = `长链下载：${download_url}\r\n短链下载：${identification_code}`;
    upload_url_textarea.value = download_text;
    copy_url_btn.disabled = false;
}

function upload_confirm() {
    /**
     * 禁用复制链接按钮
     * 上传文件后禁用上传文件按钮防止重复上传
     * 如果当前上传文件数量为0退出上传
     * 初始化预显示弹窗status_popup_div
     * 设置全局div禁用
     * 获取到上传列表DataForm()迭代器
     * 运行递归函数进行逐个文件上传
     */
    if (selected_files_number === 0) {return;}
    copy_url_btn.disabled = true;
    upload_btn.disabled = true;
    status_popup_div.style.display = 'flex';
    main_div.style.pointerEvents = 'none';
    let upload_files_form_it = upload_files_form.entries();
    let _identification = generate_identification();
    let identification_sequence = _identification[0]; let identification_code = _identification[1];
    upload_fetch(0);

    function upload_fetch(index) {
        /**
         * 获取下一个要上传的元素
         * 如果没有下一个元素了，即上传完成
         *   status_popup显示上传完成
         *   生成分享链接
         *   几秒后关闭弹窗status_popup_div
         *   在upload_url_textarea中显示生成的url
         */
        let upload_file_form_item = upload_files_form_it.next();
        if (upload_file_form_item.done) {
            status_popup_label.textContent = `（${index}/${selected_files_number}）上传完成！`; 
            generate_url(identification_sequence, identification_code);
            setTimeout(() => {
                main_div.style.pointerEvents = 'auto';
                status_popup_div.style.display = 'none';
            }, 500);
            return;
        }

        /**
         * 在状态弹窗文字中设置事件：当前正在上传的文件
         * 创建一个临时独立FormData()
         * 加入文件夹名称['identification', '[日期][固定位数随机数]']
         * 加入文件['文件名称', 文件本体]
         * 向服务器上传该文件
         *   在data中递归本函数
         */
        status_popup_label.textContent = `（${index+1}/${selected_files_number}）上传中...`;
        var upload_file_form_temp = new FormData();
        upload_file_form_temp.append('identification', identification_sequence);
        upload_file_form_temp.append(upload_file_form_item.value[0], upload_file_form_item.value[1]);
        fetch('/limited_time_sharing/upload_file/', {
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

function download_confirm() {
    /**
     * 获取到待下载url
     * 判断url是否为七位数字
     * 若是 则使用短链下载
     * 若否 则使用长链下载
     */
    let url = download_url_textarea.value;
    if (url !== "") {
        const regex = /^\d{7}$/;
        if (regex.test(url)) {
            let short_url = `/limited_time_sharing/download_file/?identification=${url}`
            const link = document.createElement('a'); link.href = short_url; link.click();
        } else {
            let long_url = url;
            const link = document.createElement('a'); link.href = long_url; link.click();
        }
    }
}


$("#select_btn").click(function() {});
$("#upload_btn").click(function() {upload_confirm();});
$("#copy_url_btn").click(function() {});

$("#paste_url_btn").click(function() {});
$("#download_btn").click(function() {download_confirm();});
