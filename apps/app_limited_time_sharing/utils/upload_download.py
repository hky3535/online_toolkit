import os
import tarfile
from io import BytesIO


class UploadDownload:
    def __init__(self, parent):
        self.parent = parent
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.download_temp_dir = f"{self.base_dir}/utils/download_temp"

    def upload(self, identification, file_name, file_size, file_chunks):
        tar = tarfile.open(f"{self.download_temp_dir}/{identification}.tar", mode='a')   # 追加模式向tar写入
        
        tarinfo = tarfile.TarInfo(name=file_name)   # 创建tarinfo对象
        tarinfo.size = file_size
        for file_chunk in file_chunks:              # 逐块写入文件
            fileobj = BytesIO(file_chunk)
            tar.addfile(tarinfo, fileobj=fileobj)
        tar.close()
    
    def download(self, identification):
        file_name = "FileNoFound"
        if (identification.isdigit() and len(identification) == 7):
            for file in os.listdir(self.download_temp_dir):
                if (f"[{identification}]" in file):
                    file_name = f"{file}"
                    break
        else:
            file_name = f"{identification}.tar"
        
        return open(f"{self.download_temp_dir}/{file_name}", 'rb'), file_name
