"""
何恺悦 hekaiyue 2023-06-29
"""
from django.shortcuts import render
from django.http import JsonResponse
from django.http import FileResponse
import json

from .utils.upload_download import UploadDownload


class Main:
    def __init__(self):
        self.upload_download = UploadDownload(self)

    def index(self, request):   # GET
        return render(request, 'limited_time_sharing_index.html')

    def upload_file(self, request):
        identification = request.POST.get('identification')
        file = request.FILES
        file_name = list(file.keys())[0]
        file_size = file.get(file_name).size
        file_chunks = file.get(file_name).chunks()

        self.upload_download.upload(identification, file_name, file_size, file_chunks)
        return JsonResponse({})

    def download_file(self, request):
        identification = request.GET.get('identification')  # 根据identify来下载文件
        file, file_name = self.upload_download.download(identification)
        response = FileResponse(file)
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'
        return response 
