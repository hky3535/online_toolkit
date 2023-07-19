"""
何恺悦 hekaiyue 2023-07-19
"""
from django.shortcuts import render
from django.http import JsonResponse
from django.http import FileResponse
import json
import os


class Main:
    def __init__(self):
        pass

    def index(self, request):
        return render(request, 'word_cloud_index.html')

    