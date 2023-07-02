import re
import os


class Basic:
    def __init__(self, parent):
        self.parent = parent
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    def sanitize(self, file_name):
        illegal_chars = r'[\/:*?"<>|]'
        emoticons = r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]'
        
        pattern = '|'.join((illegal_chars, emoticons))
        return re.sub(pattern, '', file_name)

    def extract_url(self, raw):
        pattern = r'https?://\S+'

        matches = re.findall(pattern, raw)
        if len(matches) == 1:
            return True, matches[0]
        return False, "无法获取有效url"

    def download_to_server(self, identification, source, url):
        if source == "douyin":
            res, content = self.parent.douyin.download(url)
        if source == "weibo":
            pass
        if source == "bilibili":
            pass
        
        if res:
            try:
                save_dir = f"{self.base_dir}/utils/download_temp/[{source}]{identification}{content[0]}.mp4"
                open(save_dir, "wb").write(content[1])
                return True, content[0]
            except Exception as e:
                return False, "文件写入失败"
        else:
            return False, content

    def download(self, identification_code):
        file_name = ""
        download_temp_dir = f"{self.base_dir}/utils/download_temp/"
        for file in os.listdir(download_temp_dir):
            if (f"[{identification_code}]" in file):
                file_name = f"{file}"
                break
        return open(f"{download_temp_dir}/{file_name}", 'rb'), file_name
