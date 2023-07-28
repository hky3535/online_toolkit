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