

class Weibo:
    def __init__(self, parent):
        self.parent = parent
        self.headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Edg/103.0.1264.49',
            'cookie': 'cookie: douyin.com; ttwid=1%7CItNlMCU7XA1dzJ9JAfTYqyN3USS6C6uA6qsKkTJIA6c%7C1657586709%7Ca79b507f07e9bcb5abfffb06464d0d52e27bbec7b9f5486adba85f422bb0807d; home_can_add_dy_2_desktop=%220%22; strategyABtestKey=1657586711.076; s_v_web_id=verify_l5hgbw04_lpTAiRhv_vQC7_4AIj_96aY_8ZoIWVk23QTN; passport_csrf_token=7af7437a540d0d5cc283723636e4587d; passport_csrf_token_default=7af7437a540d0d5cc283723636e4587d; douyin.com; ttcid=31a9b5634fc345d5b4093ff39468684d19; THEME_STAY_TIME=%22299807%22; IS_HIDE_THEME_CHANGE=%221%22; pwa_guide_count=%223%22; tt_scid=OZe3.Wjx-I1ER.n9xIU9lv3n4nNHrMUKcBzQvXLhWI6Upp7AFiw8-.l0O8i6bs5Pd3b9; msToken=vbkXsGQvVg8LNHWnXJC_i7vLlFGAVaQGb-5SlXumYncK-p7sFf1iSRL2Rm794Xt8aHeh3U2VXnr3r8TawYbQQNJpon-zsapnDQYzVfRpPrE3OvKpTle4OCqHjDIHrB8=; msToken=5u6A2XAWnny4DUk5dAdPPbhJv_mlazQUkBKg6DbVQLp_7ZoKB9ff_gG1NRgHUWL34lR8cT5jABIAA3NsnkSg4vKBDN3NNRedxmuRL6RQyXkYETwsxSJsnSug4VtdaoQ=; __ac_nonce=062ccf5a5006526b92e98; __ac_signature=_02B4Z6wo00f01K9lC3wAAIDAL2fxPy86hmSvRQ.AAEka9Ue40fx5.YjdUUDYmtadVC-ST9OAPlpAZRGfIGzxYSfqE2Ow3YRHrCSjbTqGz6a5-He0pfl956i951KWXbb-USn2cO6zUlg074pufd; __ac_referer=https://www.douyin.com/video/7118292929868811527'
        }

    def download(self, url):
        try:
            page = requests.get(url=url, headers=self.headers, allow_redirects=False).content.decode('utf8')    # 获取页面重定向
            serial = re.search(r'video/(\d+)/', page).group(1)                                                  # 获取到真实的视频序列号
            url = f"https://www.douyin.com/video/{serial}"                                                      # page_type = video/note
            page = urllib.parse.unquote(requests.get(url=url, headers=self.headers).content.decode('utf8'))     # 获取到真实播放页面
        except Exception as e:
            return False, "抖音页面爬取失败"

        try:
            # 匹配页面内容抽出json部分
            title_url_json = json.loads(re.search(r'<script id="RENDER_DATA" type="application/json">(.*?)</script>', page, re.DOTALL).group(1))
            title_url_json = title_url_json[[s for s in list(title_url_json.keys()) if len(s) > 20 and all(c.isalnum() for c in s)][0]]
            # 获取到标题和链接
            title = self.parent.basic.sanitize(title_url_json["aweme"]["detail"]["desc"])
            url = "https:" + title_url_json["aweme"]["detail"]["video"]["playAddr"][0]["src"]
            content = requests.get(url).content
            return True, (title, content)
        except Exception as e:
            return False, "抖音视频爬取失败"

"""

def download_weibo_url_button_response(request):  # 对列表中的单个按钮动作进行实际响应
    file_path = list(dict(request.POST).keys())[0].split("?")    # 找到按钮对应的name值，转化为[file_class, file_name, file_type]的list型
    file_class, file_name, file_type = file_path
    return file_response(file_class, file_name, file_type)

# =====获取下载文件名和URL===== #
weibo_headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            'cookie': 'cookie: UPSTREAM-V-WEIBO-COM=35846f552801987f8c1e8f7cec0e2230; SUB=_2AkMVlhjxf8NxqwJRmP4QzG7gZYtwyQnEieKjyukqJRMxHRl-yT9kqnAptRB6PhY2HsQvBKoqJMCji5R14UbO0cJCWYVZ; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9Wh9Rfa7w.qXlHYsBFpkn13y; _s_tentry=passport.weibo.com; Apache=9715304069495.375.1657444295450; SINAGLOBAL=9715304069495.375.1657444295450; ULV=1657444295629:1:1:1:9715304069495.375.1657444295450:; WBPSESS=kErNolfXeoisUDB3d9TFHxMQ-D0mmn1-2yTwmmv0_2mLxERcOagvoCHb3lyBMD3t_eqAbYygMyrFTCH9zaUwFxetzm4_TUgc-pFIc3sQyhbGE_pFtcbMOCmW2kWW9YoC; XSRF-TOKEN=VEGvZ8WugsTcTg_TRzlLWfpm'
            }

def weibo_page_redirect(url):       # 网页版微博的重定向
    # 对url进行预处理 因为实际get到视频下载链接的url与复制出来的url并不是同一个
    video_sequence_list = url.split('fid=')[1].split(':')   # 获取视频序列
    url = 'https://weibo.com/tv/api/component?page=%2Ftv%2Fshow%2F' + video_sequence_list[0] + '%3A' + video_sequence_list[1]
    payload = {
                'page': f'/tv/show/{video_sequence_list[0]}:{video_sequence_list[1]}',
                'data': f'{{"Component_Play_Playinfo":{{"oid":"{video_sequence_list[0]}:{video_sequence_list[1]}"}}}}'
                }
    return url, payload

def download_weibo_video(url):      # 下载微博视频至服务器（手机版+网页版）
    video_title, video_url = None, None
    # 手机版微博视频分享链接
    if "share.api" in url:
        weibo_page = requests.get(url=url).content.decode()
        # 选取文字段的第一行为标题，并找到视频url
        video_title = weibo_page.split("<div class=\"weibo-text\">")[1].split("<!--video-->")[0].split("<br/>")[0].strip()
        video_url = weibo_page.split("<video id=\"video\"")[1].split("</video>")[0].split("src=\"")[1].split("\"")[0].strip()
        video_title = handle_file_name_formats(video_title)     # 处理文件名格式
    
    # 网页版微博视频分享链接
    if "video.weibo.com/show" in url:
        url, payload = weibo_page_redirect(url)
        # 对视频获取url进行爬取获得所有内容
        weibo_page = requests.get(url=url, headers=weibo_headers, params=payload).content.replace(b'\\/', b'/').decode('unicode_escape')
        weibo_page_list = weibo_page.split('\",\"')
        # 在所有内容中筛选出 所有分辨率的视频链接 和 视频名称
        weibo_video_dict = dict()
        for weibo_page_line in weibo_page_list:
            if 'P\":\"//' in weibo_page_line:
                weibo_page_line = weibo_page_line.split('\":\"')
                # 创建字典weibo_video_dict 格式 {分辨率: 分辨率对应的url}
                weibo_video_dict[weibo_page_line[0].split(' ')[-1].strip('P')] = 'https:' + weibo_page_line[1]
            if 'title' in weibo_page_line:
                video_title = weibo_page_line.split('\":\"')[-1]
        video_url = weibo_video_dict[max(weibo_video_dict.keys())]
        video_title = handle_file_name_formats(video_title)
    download_files_list = get_file_download_video_full_path_list("video", video_title, video_url)
    return download_files_list    # 下载视频文件并形成文件列表

def download_weibo_picture(url):    # 下载微博图片至服务器
    print("what")

# =====通过文件名和URL完成下载操作===== #
# 下载内容缓存位置根目录
from private_server import config
sub_download_weibo_url_root = f"{config.private_server_root_path}/main_download_urls/sub_download_weibo_url/file_repository"
# 禁用的文件名字符(后面的列表是自己加的)
banned_file_name_symbols = ["<", ">", ":", "\"", "/", "\\", "|", "?", "*"] + [".", " ", "\n", "\r"]

def get_file_download_video_full_path_list(file_class, file_name, url): # 从处理完的目标视频url中下载视频放入本地并形成文件响应
    # 从目标url下载文件至服务器本体
    file_full_path = f"{sub_download_weibo_url_root}/{file_class}/{file_name}.mp4"
    file_handle = open(file_full_path, "wb")
    file_handle.write(requests.get(url).content)
    download_files_list = [[file_class, file_name, ".mp4"]]
    return download_files_list  # 返回待下载文件完整路径

def handle_file_name_formats(file_name):    # 处理文件名格式为可存储的标准格式
    # 限制文件名称长度为20个字符
    file_name = file_name[:20] if len(file_name) >= 21 else file_name
    # 遍历禁用字符去除文件名中非法字符并替换为符号"-"
    for banned_file_name_symbol in banned_file_name_symbols:
        if banned_file_name_symbol in file_name:
            file_name = file_name.replace(banned_file_name_symbol, "-")
    return file_name

def file_response(file_class, file_name, file_type):
    # 将下载完成的文件形成下载响应
    file_open = open(f"{sub_download_weibo_url_root}/{file_class}/{file_name}{file_type}", 'rb')
    file_download_response = FileResponse(file_open)
    file_download_response['Content-Type'] = 'application/octet-stream'
    file_download_response['Content-Disposition'] = "attachment; filename*=UTF-8''{}".format(escape_uri_path(f"{file_name}{file_type}"))
    return file_download_response
"""