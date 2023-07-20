from collections import Counter
import jieba
from wordcloud import WordCloud, STOPWORDS
import os
import copy
import matplotlib.pyplot as plt
from PIL import Image
import numpy
import base64
import io
"""
机器学习是人工智能的一个分支

人工智能的
机器学习
"""

class Basic:
    def __init__(self):
        self.data_dict = {}
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.storage_dir = f"{self.base_dir}/storage"
        self.generate_dir(self.storage_dir)
    
    def generate_dir(self, dir):                # 确保文件下载目录存在
        if not os.path.exists(dir):
            os.mkdir(dir)
    
    def apply(self, data_dict):
        self.data_dict = copy.deepcopy(data_dict)
        identification_code = self.data_dict.get('identification_code')
        self.generate_dir(f"{self.storage_dir}/{str(identification_code)}")
        
        # 通过user_dict来获取到text的分割词
        text = self.data_dict.get('text')
        user_dict = self.data_dict.get('user_dict')
        jieba.load_userdict(user_dict.split("\n"))
        print(user_dict.split("\n"))
        words_list = jieba.cut(text, cut_all=False) # cut_all是分词模式，True是全模式，False是精准模式，默认False
        words = " ".join(words_list)

        # 获取到背景图 形状图
        bg = data_dict.get('bg')
        mask = data_dict.get('mask')
        size = data_dict.get('size')

        if bg == "default":
            bg_array = numpy.ones((size[0], size[1])) * 255
            bg_array = bg_array.astype(numpy.uint8)
        else:
            bg_data = base64.b64decode(bg)
            bg_image = Image.open(io.BytesIO(bg_data))
            bg_array = numpy.array(bg_image)
        
        if mask == "default":
            mask_array = numpy.zeros((size[1], size[0], 3), dtype=numpy.uint8)
        else:
            mask_data = base64.b64decode(mask)
            mask_image = Image.open(io.BytesIO(mask_data))
            mask_array = numpy.array(mask_image)
        
        # 加载词云生成器
        generator = WordCloud(
            background_color="white", 
            width=size[0], height=size[1], 
            mask=mask_array, 
            max_words=2000, 
            stopwords=set(STOPWORDS),
            font_path=f"{self.base_dir}/data/msyh.ttf"
            # color_func=random_color
        )
        
        generator.generate(words)
        generator.to_file(f"{self.storage_dir}/{str(identification_code)}/a.png")

        h_range = data_dict.get('h_range')
        s_range = data_dict.get('s_range')
        l_range = data_dict.get('l_range')

    def generate(self):
        pass

