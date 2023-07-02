/**何恺悦 hekaiyue 2023-06-29 */
const main_div = document.getElementById('main_div');

const paste_url_btn = document.getElementById('paste_url_btn');
const download_url_textarea = document.getElementById('download_url_textarea');
const source_select = document.getElementById('source_select');
const download_btn = document.getElementById('download_btn');

const status_popup_div = document.getElementById('status_popup_div');
const status_popup_label = document.getElementById('status_popup_label');

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

function download_confirm() {
    /**
     * 获取到待下载url
     */
    let source = source_select.value;
    let url = download_url_textarea.value;
    let _identification = generate_identification();
    let identification_sequence = _identification[0];
    let identification_code = _identification[1];

    if (url !== "") {
        status_popup_label.textContent = "url解析中...";
        status_popup_div.style.display = 'flex';
        main_div.style.pointerEvents = 'none';
    }
    
    fetch('/media_scrape/scrape_download/', {     // 发送POST请求获取文件夹下对应的文件列表
        method: 'POST',                 // 发送请求：{'folder': 文件夹名称}
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'identification': identification_sequence,
            'source': source,
            'url': url
        })
    })
    .then(response => response.json())  // 得到响应：{'files_list': ['文件名称0', '文件名称1', ...]}
    .then(data => {
        if (data["res"] !== true) {
            status_popup_label.textContent = "下载出错！";
            download_url_textarea.value = data["res"]; 
        } else {
            status_popup_label.textContent = "开始下载！";
            let url = `/media_scrape/download_file/?identification_code=${identification_code}`;
            const link = document.createElement('a'); link.href = url; link.download = data["content"]; link.click();
        }
        setTimeout(() => {  // 几秒后关闭悬浮窗 复原主屏幕
            /**
             * 解除全局事件禁用
             * 隐藏状态弹窗
             */
            main_div.style.pointerEvents = 'auto';
            status_popup_div.style.display = 'none';
        }, 1500);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

$("#paste_url_btn").click(function() {});
$("#download_btn").click(function() {download_confirm();});
