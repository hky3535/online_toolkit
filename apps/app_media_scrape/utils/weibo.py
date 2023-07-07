

class Weibo:
    def __init__(self, parent):
        self.parent = parent
        self.headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            'cookie': 'cookie: UPSTREAM-V-WEIBO-COM=35846f552801987f8c1e8f7cec0e2230; SUB=_2AkMVlhjxf8NxqwJRmP4QzG7gZYtwyQnEieKjyukqJRMxHRl-yT9kqnAptRB6PhY2HsQvBKoqJMCji5R14UbO0cJCWYVZ; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9Wh9Rfa7w.qXlHYsBFpkn13y; _s_tentry=passport.weibo.com; Apache=9715304069495.375.1657444295450; SINAGLOBAL=9715304069495.375.1657444295450; ULV=1657444295629:1:1:1:9715304069495.375.1657444295450:; WBPSESS=kErNolfXeoisUDB3d9TFHxMQ-D0mmn1-2yTwmmv0_2mLxERcOagvoCHb3lyBMD3t_eqAbYygMyrFTCH9zaUwFxetzm4_TUgc-pFIc3sQyhbGE_pFtcbMOCmW2kWW9YoC; XSRF-TOKEN=VEGvZ8WugsTcTg_TRzlLWfpm'
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



# =====获取下载文件名和URL===== #

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

"""