"""
何恺悦 hekaiyue 2023-06-27
"""
import os
import natsort
import cv2
import numpy
import base64


class Refresh:
    def __init__(self, parent):
        self.parent = parent

    def refresh_folders_list(self):
        folders_list = os.listdir(f"{self.parent.basic.base_dir}/utils/storage")
        folders_list = natsort.natsorted(folders_list)
        return folders_list

    def refresh_files_list(self, folder):
        files_list = os.listdir(f"{self.parent.basic.base_dir}/utils/storage/{folder}/frames")
        files_list = [os.path.splitext(file)[0] for file in files_list]
        files_list = natsort.natsorted(files_list)
        return files_list

    def refresh_frame(self, folder, file):
        frame_dir = f"{self.parent.basic.base_dir}/utils/storage/{folder}/frames"
        
        with self.parent.basic.change_dir(frame_dir):
            frame_cv2 = cv2.imread(self.parent.basic.match_extension(file))
            
            # 对原图补边归一化成640*640分辨率
            height, width = frame_cv2.shape[:2]
            self.parent.folder_file.drawings("write_frame_attributes", folder, file, "resolution", [height, width])
            if height > width:
                ratio = height / 640
                return_height = 640
                return_width = int(width / ratio)
            else:
                ratio = width / 640
                return_height = int(height / ratio)
                return_width = 640
            x_offset = int((640 - return_width) / 2)
            y_offset = int((640 - return_height) / 2)
            return_frame_cv2 = numpy.zeros((640, 640, 3), numpy.uint8)
            return_frame_cv2[y_offset:y_offset + return_height, x_offset:x_offset + return_width] = cv2.resize(frame_cv2, (return_width, return_height))
            # 将图片转为base64格式
            retval, buffer = cv2.imencode('.jpg', return_frame_cv2.copy())
            frame_base64 = base64.b64encode(buffer).decode('utf-8')

        drawings = self.parent.folder_file.drawings("read_drawings", folder, file)
        return frame_base64, drawings
