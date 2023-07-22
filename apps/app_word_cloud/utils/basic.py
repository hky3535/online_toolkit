from collections import Counter
import jieba
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
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
        self.wc_generator = None

        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.storage_dir = f"{self.base_dir}/storage"
        self.generate_dir(self.storage_dir)
    
    def generate_dir(self, dir):                # 确保文件下载目录存在
        if not os.path.exists(dir):
            os.mkdir(dir)
    
    def apply(self, data_dict):

        def color_func(hsl_range):
            h, s, l = hsl_range
            def _color_func(word, font_size, position, orientation, random_state=None, **kwargs):
                h_value = numpy.random.randint(h[0], h[1])
                s_value = numpy.random.randint(s[0], s[1])
                l_value = numpy.random.randint(l[0], l[1])
                return "hsl({}, {}%, {}%)".format(h_value, s_value, l_value)
            return _color_func
        
        def type_pure(type_dict):
            wc_generator = WordCloud(
                width=type_dict['shape'][0], 
                height=type_dict['shape'][1], 
                background_color=tuple(type_dict['bg_bgr']), 
                color_func=color_func(type_dict['word_hsl']),

                max_words=2000, 
                stopwords=set(STOPWORDS),
                font_path=f"{self.base_dir}/data/msyh.ttf"
            )
            return wc_generator
        
        def type_mask(type_dict):
            # 加载mask 如果是default生成默认全黑mask 如果有的话从base64转成numpy.array
            if type_dict['mask'] == "default":
                mask_array = numpy.zeros((1080, 1920, 3), dtype=numpy.uint8)
            else:
                mask_data = base64.b64decode(type_dict['mask'])
                mask_image = Image.open(io.BytesIO(mask_data))
                mask_array = numpy.array(mask_image)

            wc_generator = WordCloud(
                background_color=tuple(type_dict['bg_bgr']),
                mask=mask_array, 
                contour_width=type_dict['border_thickness'], 
                contour_color=tuple(type_dict['border_bgr']),

                max_words=2000, 
                stopwords=set(STOPWORDS),
                font_path=f"{self.base_dir}/data/msyh.ttf"
            )
            return wc_generator
        
        def type_bg(type_dict):
            # 加载bg 如果是default生成默认全白bg 如果有的话从base64转成numpy.array
            if type_dict['bg'] == "default":
                bg_array = numpy.ones((1080, 1920)) * 255
                bg_array = bg_array.astype(numpy.uint8)
            else:
                bg_data = base64.b64decode(type_dict['bg'])
                bg_image = Image.open(io.BytesIO(bg_data))
                bg_array = numpy.array(bg_image)
            
            wc_generator = WordCloud(
                background_color=tuple(type_dict['bg_bgr']),
                mask=bg_array, 
                contour_width=type_dict['border_thickness'], 
                contour_color=tuple(type_dict['border_bgr']),
                color_func=ImageColorGenerator(bg_array),

                max_words=2000, 
                stopwords=set(STOPWORDS),
                font_path=f"{self.base_dir}/data/msyh.ttf"
            )
            return wc_generator
        
        self.data_dict = copy.deepcopy(data_dict)
        identification_code = self.data_dict['identification_code']
        self.generate_dir(f"{self.storage_dir}/{str(identification_code)}")
        
        # 通过user_dict来获取到text的分割词
        text = self.data_dict['text']
        user_dict = self.data_dict['user_dict']
        if text == "":
            return
        jieba.load_userdict(user_dict.split("\n"))
        words_list = jieba.cut(text)
        words = " ".join(words_list)

        # 获取到需要生成的样式
        type = self.data_dict['type']
        if type == "type_pure":
            self.wc_generator = type_pure(self.data_dict[type])
        if type == "type_mask":
            self.wc_generator = type_mask(self.data_dict[type])
        if type == "type_bg":
            self.wc_generator = type_bg(self.data_dict[type])

        self.wc_generator.generate(words)
        self.wc_generator.to_file(f"{self.storage_dir}/{str(identification_code)}/a.png")

    def generate(self):
        pass

