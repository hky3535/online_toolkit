"""
何恺悦 hekaiyue 2023-07-01
"""
from django.shortcuts import render
from django.http import JsonResponse
from django.http import FileResponse
import json

from .utils.basic import Basic
from .utils.douyin import Douyin
from .utils.weibo import Weibo
from .utils.bilibili import Bilibili

class Main:
    def __init__(self):
        self.basic = Basic(self)
        self.douyin = Douyin(self)
        self.weibo = Weibo(self)
        self.Bilibili = Bilibili(self)

    def index(self, request):   # GET
        return render(request, 'media_scrape_index.html')

    def scrape_download(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)
        identification = data_dict.get('identification')
        source = data_dict.get('source')
        url = data_dict.get('url')

        res, content = self.basic.extract_url(url)   
        if not res: 
            return JsonResponse({"res": res, "content": content})   # res: False, content: "无法获取有效url"
        # res: True, content: "{url}"

        res, content = self.basic.download_to_server(identification, source, content)
        if not res: 
            return JsonResponse({"res": res, "content": content})   # False, {error_type}
        # res: True, content: "{文件名称}"

        return JsonResponse({"res": res, "content": content})

    def download_file(self, request):
        identification_code = request.GET.get('identification_code')  # 根据identify来下载文件
        file, file_name = self.basic.download(identification_code)
        response = FileResponse(file)
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'
        return response 
