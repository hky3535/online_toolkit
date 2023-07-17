import os
import tarfile
from io import BytesIO
import random


class Basic:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.storage_dir = f"{self.base_dir}/storage"
        self.generate_dir(self.storage_dir)
    
    def generate_dir(self, dir):                # 确保文件下载目录存在
        if not os.path.exists(dir):
            os.mkdir(dir)

    def upload(self, identification_code, file_name, file_size, file_chunks):
        tar = tarfile.open(f"{self.storage_dir}/{identification_code}.tar", mode='a')   # 追加模式向tar写入
        
        tarinfo = tarfile.TarInfo(name=file_name)   # 创建tarinfo对象
        tarinfo.size = file_size
        for file_chunk in file_chunks:              # 逐块写入文件
            fileobj = BytesIO(file_chunk)
            tar.addfile(tarinfo, fileobj=fileobj)
        tar.close()
    
    def download(self, identification_code):
        file_name = f"{identification_code}.tar"
        file_dir = f"{self.storage_dir}/{file_name}"
        if not os.path.exists(file_dir):
            open(f"{self.storage_dir}/FileNoFound", "w").write("FileNoFound")
            file_name = "FileNoFound"
            file_dir = f"{self.storage_dir}/{file_name}"
        
        return open(file_dir, 'rb'), file_name
