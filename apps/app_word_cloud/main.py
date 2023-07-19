"""
何恺悦 hekaiyue 2023-07-19
"""
from django.shortcuts import render
from django.http import JsonResponse
from django.http import FileResponse
import json
import os
import copy


class Main:
    def __init__(self):
        self.apply_json = {}

    def index(self, request):
        return render(request, 'word_cloud_index.html')

    def apply(self, request):
        data = request.body.decode('utf-8')
        data_dict = json.loads(data)

        identification_code = data_dict.get('identification_code')
        text = data_dict.get('text')
        user_dict = data_dict.get('user_dict')
        shape = data_dict.get('shape')
        size = data_dict.get('size')
        h_range = data_dict.get('h_range')
        s_range = data_dict.get('s_range')
        l_range = data_dict.get('l_range')

        self.apply_json = copy.deepcopy(data_dict)
        print(self.apply_json)

        return JsonResponse({})
    
    def generate(self, request):
        pass