"""
何恺悦 hekaiyue 2023-07-01
"""
from django.shortcuts import render


class Main:
    def __init__(self):
        pass

    def index(self, request):   # GET
        return render(request, 'base_index.html')