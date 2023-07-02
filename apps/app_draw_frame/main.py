"""
何恺悦 hekaiyue 2023-06-27
"""
from django.shortcuts import render
from django.http import JsonResponse
from django.http import FileResponse
import json

from .utils.basic import Basic
from .utils.refresh_handle import Refresh
from .utils.folder_file_handle import FolderFile


class Main:
    def __init__(self):
        self.basic = Basic(self)
        self.refresh = Refresh(self)
        self.folder_file = FolderFile(self)

    def index(self, request):   # GET
        return render(request, 'draw_frame_index.html')

    def refresh_folders_list(self, request):  # GET
        folders_list = {"folders_list": self.refresh.refresh_folders_list()}
        return JsonResponse(folders_list)
    
    def refresh_files_list(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)
        folder = data_dict.get('folder')

        files_list = {"files_list": self.refresh.refresh_files_list(folder)}
        return JsonResponse(files_list)
    
    def refresh_frame(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)
        folder = data_dict.get('folder')
        file = data_dict.get('file')

        frame_base64, drawings = self.refresh.refresh_frame(folder, file)
        frame = {"frame": frame_base64, "drawings": drawings}
        return JsonResponse(frame)

    def add_drawing(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)
        folder = data_dict.get('folder')
        file = data_dict.get('file')
        drawing = data_dict.get('drawing')
        
        self.folder_file.drawings("write_drawing", folder, file, drawing)
        return JsonResponse({})

    def del_drawing(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)
        folder = data_dict.get('folder')
        file = data_dict.get('file')
        index = data_dict.get('index')
        
        self.folder_file.drawings("delete_drawing", folder, file, index)
        return JsonResponse({})

    def create_folder(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)
        folder = data_dict.get('folder')
        
        self.folder_file.create_delete_folder("create", folder)
        return JsonResponse({})

    def delete_folder(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)
        index = data_dict.get('index')
        
        self.folder_file.create_delete_folder("delete", index)
        return JsonResponse({})

    def upload_file(self, request):
        folder = request.POST.get('folder')
        file = request.FILES
        file_name = list(file.keys())[0]
        file_chunks = file.get(file_name).chunks()

        self.folder_file.upload_delete_file("upload", folder, file_name, file_chunks)
        return JsonResponse({})

    def delete_file(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)
        folder = data_dict.get('folder')
        index = data_dict.get('index')

        self.folder_file.upload_delete_file("delete", folder, index)
        return JsonResponse({})

    def download_file_preprocess(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)
        identify = data_dict.get('identify')
        folder = data_dict.get('folder')
        params = data_dict.get('params')
        index = data_dict.get('index')

        self.folder_file.download_file_preprocess(identify, folder, params, index)
        return JsonResponse({})

    def download_file(self, request):
        folder_identify = request.GET.get('folder_identify')  # 根据identify来下载文件
        file = open(f"{self.basic.base_dir}/utils/download_temp/{folder_identify}", 'rb')
        response = FileResponse(file)
        response['Content-Disposition'] = f'attachment; filename="{folder_identify}"'
        return response 
