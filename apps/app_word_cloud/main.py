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
        pass