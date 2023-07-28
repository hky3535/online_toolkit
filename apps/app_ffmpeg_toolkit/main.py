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

        download_name = self.basic.apply(identification_code, en_name, params, file_name, file_chunks)
        return JsonResponse({})