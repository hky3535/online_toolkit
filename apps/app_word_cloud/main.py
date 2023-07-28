"""
何恺悦 hekaiyue 2023-07-19
"""
from django.shortcuts import render
from django.http import JsonResponse
from django.http import FileResponse
import json
from .utils import basic


class Main:
    def __init__(self):
        self.basic = basic.Basic()

    def index(self, request):
        return render(request, 'word_cloud_index.html')

    def apply(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)
        
        self.basic.apply(data_dict)
        return JsonResponse({})
    
    def generate(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)

        self.basic.generate(data_dict)
        return JsonResponse({})

    def refresh_frame(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)

        frame = self.basic.refresh_frame(data_dict)
        return JsonResponse({'frame': frame})

    def prepare_download_file(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)

        self.basic.prepare_download_file(data_dict)
        return JsonResponse({})

    def download_file(self, request):
        code = request.GET.get('code')  # 根据identify来下载文件
        file = open(f"{self.basic.storage_dir}/download_temp/{code}", 'rb')
        response = FileResponse(file)
        response['Content-Disposition'] = f'attachment; filename="{code}"'
        return response 