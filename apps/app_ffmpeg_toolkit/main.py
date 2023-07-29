from django.shortcuts import render
from django.http import JsonResponse
from django.http import FileResponse
import json
from .utils import basic


class Main:
    def __init__(self):
        self.basic = basic.Basic()

    def index(self, request):
        return render(request, 'ffmpeg_toolkit_index.html')

    def refresh_commands(self, request):

        ffmpeg_commands_json = self.basic.refresh_commands()
        return JsonResponse({"commands": ffmpeg_commands_json})
    
    def apply(self, request):

        identification_code = request.POST.get('identification_code')
        en_name = request.POST.get('en_name')
        params = request.POST.get('params')
        
        file = request.FILES
        file_name = list(file.keys())[0]
        file_chunks = file.get(file_name).chunks()

        file_dir, file_name = self.basic.apply(identification_code, en_name, params, file_name, file_chunks)
        return JsonResponse({"file_dir": file_dir, "file_name": file_name})

    def apply_progress(self, request):

        exec_output = self.basic.exec_output
        return JsonResponse({"exec_output": exec_output})

    def download_file(self, request):
        file_dir = request.GET.get('file_dir')
        file_name = request.GET.get('file_name')
        
        file = open(f"{file_dir}", 'rb')
        response = FileResponse(file)
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'
        return response 