"""
何恺悦 hekaiyue 2023-06-27
"""
import os
import json
import shutil
import tarfile
import cv2
import numpy


class FolderFile:
    def __init__(self, parent):
        self.parent = parent

    def drawings(self, operation, folder, file, *operation_content):
        drawings_dir = f"{self.parent.basic.base_dir}/utils/storage/{folder}/drawings/{file}.json"
        if not os.path.exists(drawings_dir):
            init_write = open(drawings_dir, "w")
            init_write.write("{\"frame_attributes\": {\"resolution\": []}, \"drawings\": []}")
            init_write.close()
        drawings = json.load(open(drawings_dir, "r"))

        if operation == "write_frame_attributes":
            drawings["frame_attributes"][operation_content[0]] = operation_content[1]
        if operation == "read_drawings":
            return drawings
        if operation == "write_drawing":
            drawings["drawings"].append(operation_content[0])
        if operation == "delete_drawing":
            drawings_temp = drawings["drawings"].copy()
            drawings_temp.pop(operation_content[0])
            drawings["drawings"] = drawings_temp.copy()
        
        json.dump(drawings, open(drawings_dir, "w"))

    def create_delete_folder(self, operation, folder):
        folder_dir = f"{self.parent.basic.base_dir}/utils/storage"
        
        if operation == "create":
            os.mkdir(f"{folder_dir}/{folder}")
            os.mkdir(f"{folder_dir}/{folder}/_frames")
            os.mkdir(f"{folder_dir}/{folder}/drawings")
            os.mkdir(f"{folder_dir}/{folder}/frames")

        if operation == "delete":
            folder = self.parent.refresh.refresh_folders_list()[folder]
            shutil.rmtree(f"{folder_dir}/{folder}")
    
    def upload_delete_file(self, operation, folder, file, file_chunks=None):
        folder_dir = f"{self.parent.basic.base_dir}/utils/storage"
        
        if operation == "upload":   # 可以同时处理json文件的上传和图片文件的上传
            if file.endswith(".json"):
                file_write = open(f"{folder_dir}/{folder}/drawings/{file}", "wb+")
            else:
                file_write = open(f"{folder_dir}/{folder}/frames/{file}", "wb+")
            for chunk in file_chunks:
                file_write.write(chunk)
        
        if operation == "delete":
            file = self.parent.refresh.refresh_files_list(folder)[file]
            if os.path.exists(f"{folder_dir}/{folder}/_frames/_{file}.jpg"):
                os.remove(f"{folder_dir}/{folder}/_frames/_{file}.jpg")
            if os.path.exists(f"{folder_dir}/{folder}/drawings/{file}.json"):
                os.remove(f"{folder_dir}/{folder}/drawings/{file}.json")
            os.remove(self.parent.basic.match_extension(f"{folder_dir}/{folder}/frames/{file}"))

    def download_file_preprocess(self, identify, folder, params, file):
        
        def draw_frame(frame, _frame, drawings):
            frame_cv2 = cv2.imread(frame)
            for drawing in drawings:
                shape = drawing[0]
                item = drawing[1]
                if shape == "point":
                    frame_cv2 = cv2.circle(frame_cv2, (item[0], item[1]), 3, (0, 255, 0), 5)
                if shape == "line":
                    frame_cv2 = cv2.line(frame_cv2, (item[0], item[1]), (item[2], item[3]), (0, 255, 0), 5)  # 绘制直线
                if shape == "rect":
                    frame_cv2 = cv2.rectangle(frame_cv2, (item[0], item[1]), (item[2], item[3]), (0, 255, 0), 5)
                if shape == "circle":
                    frame_cv2 = cv2.circle(frame_cv2, (item[0], item[1]), item[2], (0, 255, 0), 5)
                if shape == "polygon":
                    pts = numpy.array(item, numpy.int32)
                    pts = pts.reshape((-1, 1, 2))
                    frame_cv2 = cv2.polylines(frame_cv2, [pts], True, (0, 255, 0), 5)
            cv2.imwrite(_frame, frame_cv2)
        
        download_temp_dir = f"{self.parent.basic.base_dir}/utils/download_temp"
        download_tar_dir = f"{download_temp_dir}/{folder}{identify}.tar"

        download_tar = tarfile.open(download_tar_dir, "a")

        file = self.parent.refresh.refresh_files_list(folder)[file]
        with self.parent.basic.change_dir(f"{self.parent.basic.base_dir}/utils/storage/{folder}"):
            frame = self.parent.basic.match_extension(f"frames/{file}")
            _frame = f"_frames/_{file}.jpg"
            drawing = f"drawings/{file}.json"

            drawings = self.drawings("read_drawings", folder, file)["drawings"]
            if params[0]:
                download_tar.add(frame, arcname=frame)
            if params[1]:
                draw_frame(frame, _frame, drawings)
                download_tar.add(_frame, arcname=_frame)
            if params[2]:
                download_tar.add(drawing, arcname=drawing)
        download_tar.close()
