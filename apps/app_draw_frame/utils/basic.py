"""
何恺悦 hekaiyue 2023-06-27
"""
import os
import json
import shutil
import cv2
import numpy


class Basic:
    def __init__(self, parent):
        self.parent = parent
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    def change_dir(self, target_dir):   # 切换当前程序目录至target_dir结束后再切换回程序根目录
        parent = self   # 连接域
        class ChangeDir:
            def __init__(self, parent, target_dir):
                self.base_dir = parent.base_dir
                self.target_dir = target_dir
            
            def __enter__(self):
                os.chdir(self.target_dir)
            
            def __exit__(self, exc_type, exc_value, traceback):
                os.chdir(self.base_dir)
        
        return ChangeDir(parent, target_dir)
    
    def match_extension(self, file):
        extensions = [".jpg", ".png"]
        for extension in extensions:
            if os.path.isfile(f"{file}{extension}"):
                return f"{file}{extension}"
