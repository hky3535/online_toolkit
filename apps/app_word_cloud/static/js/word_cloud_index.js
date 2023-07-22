/**何恺悦 hekaiyue 2023-07-19 */

const main_div = document.getElementById('main_div');
/**输入文本 */
const text_paste_button = document.getElementById('text_paste_button');
const text_clear_button = document.getElementById('text_clear_button');
const text_textarea = document.getElementById('text_textarea');
/**用户词典 */
const user_dict_paste_button = document.getElementById('user_dict_paste_button');
const user_dict_clear_button = document.getElementById('user_dict_clear_button');
const user_dict_textarea = document.getElementById('user_dict_textarea');

/**样式选择 1、纯色 2、形状 3、背景*/
const type_select = document.getElementById('type_select');
const type_pure_div = document.getElementById('type_pure_div');
const type_mask_div = document.getElementById('type_mask_div');
const type_bg_div = document.getElementById('type_bg_div');
/**1、纯色 */
const pure_width = document.getElementById('pure_width');
const pure_height = document.getElementById('pure_height');
const pure_bg_b = document.getElementById('pure_bg_b');
const pure_bg_g = document.getElementById('pure_bg_g');
const pure_bg_r = document.getElementById('pure_bg_r');
const pure_h_0 = document.getElementById('pure_h_0'); const pure_h_1 = document.getElementById('pure_h_1');
const pure_s_0 = document.getElementById('pure_s_0'); const pure_s_1 = document.getElementById('pure_s_1');
const pure_l_0 = document.getElementById('pure_l_0'); const pure_l_1 = document.getElementById('pure_l_1');
/**2、形状 */
const mask_default_button = document.getElementById('mask_default_button');
const mask_select_button = document.getElementById('mask_select_button'); const mask_select = document.getElementById('mask_select');
const mask_selected = document.getElementById('mask_selected');
const mask_bg_b = document.getElementById('mask_bg_b');
const mask_bg_g = document.getElementById('mask_bg_g');
const mask_bg_r = document.getElementById('mask_bg_r');
const mask_h_0 = document.getElementById('mask_h_0'); const mask_h_1 = document.getElementById('mask_h_1');
const mask_s_0 = document.getElementById('mask_s_0'); const mask_s_1 = document.getElementById('mask_s_1');
const mask_l_0 = document.getElementById('mask_l_0'); const mask_l_1 = document.getElementById('mask_l_1');
const mask_border_thickness = document.getElementById('mask_border_thickness');
const mask_border_b = document.getElementById('mask_border_b');
const mask_border_g = document.getElementById('mask_border_g');
const mask_border_r = document.getElementById('mask_border_r');
/**3、背景 */
const bg_default_button = document.getElementById('mask_border_b');
const bg_select_button = document.getElementById('bg_select_button'); const bg_select = document.getElementById('bg_select');
const bg_selected = document.getElementById('bg_selected');
const bg_bg_b = document.getElementById('bg_bg_b');
const bg_bg_g = document.getElementById('bg_bg_g');
const bg_bg_r = document.getElementById('bg_bg_r');
const bg_border_thickness = document.getElementById('bg_border_thickness');
const bg_border_b = document.getElementById('bg_border_b');
const bg_border_g = document.getElementById('bg_border_g');
const bg_border_r = document.getElementById('bg_border_r');

/**生成数量 */
const generate_number = document.getElementById('generate_number');
const apply_button = document.getElementById('apply_button');
const generate_button = document.getElementById('generate_button');
/**文件列表 */
const deleteFile_button = document.getElementById('deleteFile_button');
const selectallFile_button = document.getElementById('selectallFile_button');
const downloadFile_button = document.getElementById('downloadFile_button');
const files_ul = document.getElementById('files_ul');
/**词云预览 */
const last_button = document.getElementById('last_button');
const next_button = document.getElementById('next_button');
const current_frame = document.getElementById('current_frame');
const wordcloud_canvas = document.getElementById('wordcloud_canvas');

const status_popup_div = document.getElementById('status_popup_div');
const status_popup_label = document.getElementById('status_popup_label');

const identification_code = Math.floor(Math.random() * 9000000) + 1000000;
var default_json = {
    'identification_code': identification_code,
    'text': '你好，世界！\nHello World!',
    'user_dict': '',
    'type': 'type_pure',
    'type_pure': {
        'shape': [1920, 1080],
        'bg_bgr': [255, 255, 255],
        'word_hsl': [[0, 360], [0, 100], [0, 100]]
    },
    'type_mask': {
        'mask': 'default',
        'bg_bgr': [255, 255, 255],
        'word_hsl': [[0, 360], [0, 100], [0, 100]],
        'border_thickness': 0,
        'border_bgr': [0, 0, 0]
    },
    'type_bg': {
        'bg': 'default',
        'bg_bgr': [255, 255, 255],
        'border_thickness': 0,
        'border_bgr': [0, 0, 0]
    }
};
var apply_json = default_json;
var latest_index = 0;
var applied = false;

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

type_select.addEventListener("change", function() {
    type_pure_div.style.display = "none";
    type_mask_div.style.display = "none";
    type_bg_div.style.display = "none";
    
    let type_selected = type_select.value;
    document.getElementById(`${type_selected}_div`).style.display = "flex";
    apply_json["type"] = type_selected;
});
mask_select.addEventListener('change', (event) => {
    let selected_files_number = event.target.files.length;
    if (selected_files_number === 0) {status_popup(0.5, "未选择文件"); return;}
    if (selected_files_number >= 2) {status_popup(0.5, "选择文件过多"); return;}

    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function() {
        let binaryData = reader.result; let base64Data = btoa(binaryData);
        apply_json['type_mask']['mask'] = base64Data;
        mask_selected.innerHTML = file.name.substring(file.name.length-10, file.name.length);
    };
    reader.readAsBinaryString(file);
});
bg_select.addEventListener('change', (event) => {
    let selected_files_number = event.target.files.length;
    if (selected_files_number === 0) {status_popup(0.5, "未选择文件"); return;}
    if (selected_files_number >= 2) {status_popup(0.5, "选择文件过多"); return;}

    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function() {
        let binaryData = reader.result; let base64Data = btoa(binaryData);
        apply_json['type_bg']['bg'] = base64Data;
        bg_selected.innerHTML = file.name.substring(file.name.length-10, file.name.length);
    };
    reader.readAsBinaryString(file);
});

function refresh_frame(identification_code, index) {
    current_frame.innerHTML = `${identification_code}/${index}.png`;

    fetch('/word_cloud/refresh_frame/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'identification_code': identification_code, 'index': index})
    })
    .then(response => response.json())
    .then(data => {
        let ctx = wordcloud_canvas.getContext("2d");
        let frame = new Image();
        
        frame.onload = function() {
            wordcloud_canvas.width = wordcloud_canvas.clientWidth;
            wordcloud_canvas.height = wordcloud_canvas.clientHeight;

            let scale = Math.min(wordcloud_canvas.clientWidth / frame.width, wordcloud_canvas.clientHeight / frame.height);

            let width = frame.width * scale;
            let height = frame.height * scale;

            let x = (wordcloud_canvas.clientWidth - width) / 2;
            let y = (wordcloud_canvas.clientHeight - height) / 2;

            ctx.drawImage(frame, x, y, width, height);
        };
        frame.src = 'data:image/png;base64,' + data['frame'];
    })
    
}

function check_apply() {
    /**给空置的内容填入初始值 */
    /**判断所有的阈值区间 */
    const inRange = (x, lower, upper) => lower <= x && x <= upper;
    /**1、纯色 */
    if (pure_width.value === ''             || !inRange(parseInt(pure_width.value), 640, 1920))                     {pure_width.value = default_json['type_pure']['shape'][0];}
    if (pure_height.value === ''            || !inRange(parseInt(pure_height.value), 640, 1080))                    {pure_height.value = default_json['type_pure']['shape'][1];}
    if (pure_bg_b.value === ''              || !inRange(parseInt(pure_bg_b.value), 0, 255))                         {pure_bg_b.value = default_json['type_pure']['bg_bgr'][0];}
    if (pure_bg_g.value === ''              || !inRange(parseInt(pure_bg_g.value), 0, 255))                         {pure_bg_g.value = default_json['type_pure']['bg_bgr'][1];}
    if (pure_bg_r.value === ''              || !inRange(parseInt(pure_bg_r.value), 0, 255))                         {pure_bg_r.value = default_json['type_pure']['bg_bgr'][2];}
    if (pure_h_0.value === ''               || !inRange(parseInt(pure_h_0.value), 0, 360))                          {pure_h_0.value = default_json['type_pure']['word_hsl'][0][0];} 
    if (pure_h_1.value === ''               || !inRange(parseInt(pure_h_1.value), parseInt(pure_h_0.value), 360))   {pure_h_1.value = default_json['type_pure']['word_hsl'][0][1];}
    if (pure_s_0.value === ''               || !inRange(parseInt(pure_s_0.value), 0, 100))                          {pure_s_0.value = default_json['type_pure']['word_hsl'][1][0];} 
    if (pure_s_1.value === ''               || !inRange(parseInt(pure_s_1.value), parseInt(pure_s_0.value), 100))   {pure_s_1.value = default_json['type_pure']['word_hsl'][1][1];}
    if (pure_l_0.value === ''               || !inRange(parseInt(pure_l_0.value), 0, 100))                          {pure_l_0.value = default_json['type_pure']['word_hsl'][2][0];} 
    if (pure_l_1.value === ''               || !inRange(parseInt(pure_l_1.value), parseInt(pure_l_0.value), 100))   {pure_l_1.value = default_json['type_pure']['word_hsl'][2][1];}
    /**2、形状 */
    if (mask_bg_b.value === ''              || !inRange(parseInt(mask_bg_b.value), 0, 255))                         {mask_bg_b.value = default_json['type_mask']['bg_bgr'][0];}
    if (mask_bg_g.value === ''              || !inRange(parseInt(mask_bg_g.value), 0, 255))                         {mask_bg_g.value = default_json['type_mask']['bg_bgr'][1];}
    if (mask_bg_r.value === ''              || !inRange(parseInt(mask_bg_r.value), 0, 255))                         {mask_bg_r.value = default_json['type_mask']['bg_bgr'][2];}
    if (mask_h_0.value === ''               || !inRange(parseInt(mask_h_0.value), 0, 360))                          {mask_h_0.value = default_json['type_mask']['word_hsl'][0][0];} 
    if (mask_h_1.value === ''               || !inRange(parseInt(mask_h_1.value), parseInt(mask_h_0.value), 360))   {mask_h_1.value = default_json['type_mask']['word_hsl'][0][1];}
    if (mask_s_0.value === ''               || !inRange(parseInt(mask_s_0.value), 0, 100))                          {mask_s_0.value = default_json['type_mask']['word_hsl'][1][0];} 
    if (mask_s_1.value === ''               || !inRange(parseInt(mask_s_1.value), parseInt(mask_s_0.value), 100))   {mask_s_1.value = default_json['type_mask']['word_hsl'][1][1];}
    if (mask_l_0.value === ''               || !inRange(parseInt(mask_l_0.value), 0, 100))                          {mask_l_0.value = default_json['type_mask']['word_hsl'][2][0];} 
    if (mask_l_1.value === ''               || !inRange(parseInt(mask_l_1.value), parseInt(mask_l_0.value), 100))   {mask_l_1.value = default_json['type_mask']['word_hsl'][2][1];}
    if (mask_border_thickness.value === ''  || !inRange(parseInt(mask_border_thickness.value), 0, 10))              {mask_border_thickness.value = default_json['type_mask']['border_thickness'];}
    if (mask_border_b.value === ''          || !inRange(parseInt(mask_border_b.value), 0, 255))                     {mask_border_b.value = default_json['type_mask']['border_bgr'][0];}
    if (mask_border_g.value === ''          || !inRange(parseInt(mask_border_g.value), 0, 255))                     {mask_border_g.value = default_json['type_mask']['border_bgr'][1];}
    if (mask_border_r.value === ''          || !inRange(parseInt(mask_border_r.value), 0, 255))                     {mask_border_r.value = default_json['type_mask']['border_bgr'][2];}
    /**3、背景 */
    if (bg_bg_b.value === ''                || !inRange(parseInt(bg_bg_b.value), 0, 255))                           {bg_bg_b.value = default_json['type_bg']['bg_bgr'][0];}
    if (bg_bg_g.value === ''                || !inRange(parseInt(bg_bg_g.value), 0, 255))                           {bg_bg_g.value = default_json['type_bg']['bg_bgr'][1];}
    if (bg_bg_r.value === ''                || !inRange(parseInt(bg_bg_r.value), 0, 255))                           {bg_bg_r.value = default_json['type_bg']['bg_bgr'][2];}
    if (bg_border_thickness.value === ''    || !inRange(parseInt(bg_border_thickness.value), 0, 10))                {bg_border_thickness.value = default_json['type_bg']['border_thickness'];}
    if (bg_border_b.value === ''            || !inRange(parseInt(bg_border_b.value), 0, 255))                       {bg_border_b.value = default_json['type_bg']['border_bgr'][0];}
    if (bg_border_g.value === ''            || !inRange(parseInt(bg_border_g.value), 0, 255))                       {bg_border_g.value = default_json['type_bg']['border_bgr'][1];}
    if (bg_border_r.value === ''            || !inRange(parseInt(bg_border_r.value), 0, 255))                       {bg_border_r.value = default_json['type_bg']['border_bgr'][2];}

    if (text_textarea.value === '') {text_textarea.value = default_json['text'];}
    if (generate_number.value === '') {generate_number.value = '1';}

    /**给上报json赋值 */
    apply_json['text'] = text_textarea.value;
    apply_json['user_dict'] = user_dict_textarea.value;
    apply_json['type'] = type_select.value;
    /**1、纯色 */
    apply_json['type_pure']['shape'] = [parseInt(pure_width.value), parseInt(pure_height.value)];
    apply_json['type_pure']['bg_bgr'] = [parseInt(pure_bg_b.value), parseInt(pure_bg_g.value), parseInt(pure_bg_r.value)];
    apply_json['type_pure']['word_hsl'] = [
        [parseInt(pure_h_0.value), parseInt(pure_h_1.value)], 
        [parseInt(pure_s_0.value), parseInt(pure_s_1.value)], 
        [parseInt(pure_l_0.value), parseInt(pure_l_1.value)]
    ];
    /**2、形状 */
    apply_json['type_mask']['bg_bgr'] = [parseInt(mask_bg_b.value), parseInt(mask_bg_g.value), parseInt(mask_bg_r.value)];
    apply_json['type_mask']['word_hsl'] = [
        [parseInt(mask_h_0.value), parseInt(mask_h_1.value)], 
        [parseInt(mask_s_0.value), parseInt(mask_s_1.value)], 
        [parseInt(mask_l_0.value), parseInt(mask_l_1.value)]
    ];
    apply_json['type_mask']['border_thickness'] =  parseInt(mask_border_thickness.value);
    apply_json['type_mask']['border_bgr'] = [parseInt(mask_border_b.value), parseInt(mask_border_g.value), parseInt(mask_border_r.value)];
    /**3、背景 */
    apply_json['type_bg']['bg_bgr'] = [parseInt(bg_bg_b.value), parseInt(bg_bg_g.value), parseInt(bg_bg_r.value)];
    apply_json['type_bg']['border_thickness'] = parseInt(bg_border_thickness.value);
    apply_json['type_bg']['border_bgr'] = [parseInt(bg_border_b.value), parseInt(bg_border_g.value), parseInt(bg_border_r.value)];
}

function apply() {
    /**
     * 生成一个配置json信息
     */
    check_apply();

    status_popup_label.textContent = "设置应用中...";
    status_popup_div.style.display = 'flex';
    main_div.style.pointerEvents = 'none';

    fetch('/word_cloud/apply/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(apply_json)
    })
    .then(response => response.json())
    .then(data => {
        applied = true;
        setTimeout(() => {  // 几秒后关闭悬浮窗 复原主屏幕
            /**
             * 解除全局事件禁用
             * 隐藏状态弹窗
             */
            main_div.style.pointerEvents = 'auto';
            status_popup_div.style.display = 'none';
        }, 1000);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function generate() {
    if (!applied) {
        status_popup(1, "设置还未应用！");
        return;
    }
    let times = parseInt(generate_number.value);

    status_popup_div.style.display = 'flex';
    main_div.style.pointerEvents = 'none';
    generate_fetch(0);
    
    function generate_fetch(index) {
        if (index >= times) {
            status_popup_label.textContent = `（${index}/${times}）生成完成！`;
            refresh_frame(identification_code, latest_index-1);   /**刷新最新图像 */
            setTimeout(() => {
                status_popup_div.style.display = 'none';
                main_div.style.pointerEvents = 'auto';
            }, 1000);
            return;
        }

        status_popup_label.textContent = `（${index+1}/${times}）生成中...`;
        fetch('/word_cloud/generate/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "identification_code": identification_code,
                "latest_index": latest_index
            })
        })
        .then(response => response.json())
        .then(data => {
            /**创建新的文件列表内容 */
            const file_li = document.createElement('li');
            const file_cb = document.createElement('input'); file_cb.type = 'checkbox';
            const file_a = document.createElement('a'); file_a.href = '#'; file_a.textContent = `${identification_code}/${latest_index}.png`;
            file_a.addEventListener('click', refresh_frame.bind(null, identification_code, latest_index));
            file_li.appendChild(file_cb); file_li.appendChild(file_a);
            files_ul.appendChild(file_li);
            /**迭代 */
            latest_index++; index++; generate_fetch(index);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }





}










text_paste_button.addEventListener('click', function() {
    navigator.clipboard.readText()
    .then(text => {
        text_textarea.value = text;
        status_popup(0.5, `已成功粘贴文本`);
    })
    .catch(err => {
        status_popup(0.5, `读取剪贴板时出错`);
    });
});
user_dict_paste_button.addEventListener('click', function() {
    navigator.clipboard.readText()
    .then(text => {
        user_dict_textarea.value = text;
        status_popup(0.5, `已成功粘贴文本`);
    })
    .catch(err => {
        status_popup(0.5, `读取剪贴板时出错`);
    });
});
text_clear_button.addEventListener('click', function() {
    text_textarea.value = '';
});
user_dict_clear_button.addEventListener('click', function() {
    user_dict_textarea.value = '';
});

$("#mask_default_button").click(function() {mask_selected.innerHTML = "default"; apply_json['type_mask']['mask'] = "default";});
$("#bg_default_button").click(function() {bg_selected.innerHTML = "default"; apply_json['type_bg']['bg'] = "default";});
$("#mask_select_button").click(function() {mask_select.click();})
$("#bg_select_button").click(function() {bg_select.click();})
$("#apply_button").click(function() {apply();});
$("#generate_button").click(function() {generate();});

$("#selectallFile_button").click(function() {});
$("#downloadFile_button").click(function() {});

$("#last_button").click(function() {});
$("#next_button").click(function() {});

check_apply()
