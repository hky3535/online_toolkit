"""
何恺悦 hekaiyue 2023-07-01
"""
from django.shortcuts import render
from django.http import JsonResponse
from django.http import FileResponse
import json
import os

from .utils import basic
from .utils import douyin
from .utils import weibo
from .utils import bilibili


class Main:
    def __init__(self):
        self.basic = basic.Basic()
        self.douyin = douyin.Douyin()
        self.weibo = weibo.Weibo()
        self.bilibili = bilibili.Bilibili()

        self.source = {
            "douyin": self.douyin,
            "weibo": self.weibo,
            "bilibili": self.bilibili
        }

    def index(self, request):   # GET
        return render(request, 'media_scrape_index.html')

    def scrape_download(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)

        source = data_dict.get('source')
        input_url = data_dict.get('input_url')

        ret, page_url = self.basic.extract_url(input_url)
        if not ret:
            return JsonResponse({"ret": ret, "res": page_url})
        
        ret, media_info = self.source[source].scrape_url(page_url)
        if not ret:
            return JsonResponse({"ret": ret, "res": media_info})
        
        ret, download_info = self.basic.save(source, *media_info)
        if not ret:
            return JsonResponse({"ret": ret, "res": download_info})

        return JsonResponse({"ret": ret, "res": download_info})

    def download_file(self, request):

        def file_open(identification_code):
            file_name = ""
            for file in os.listdir(self.basic.storage_dir):
                if (f"[{identification_code}]" in file):
                    file_name = f"{file}"
                    break
            return open(f"{self.basic.storage_dir}/{file_name}", 'rb'), file_name

        identification_code = request.GET.get('identification_code')  # 根据identify来下载文件

        file, file_name = file_open(identification_code)
        response = FileResponse(file)
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'
        return response 
