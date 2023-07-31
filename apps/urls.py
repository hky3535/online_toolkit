"""
何恺悦 hekaiyue 2023-06-27
"""
from django.contrib import admin
from django.urls import path

from . import app_
from . import app_base
from . import app_draw_frame
from . import app_limited_time_sharing
from . import app_media_scrape
from . import app_word_cloud
from . import app_ffmpeg_toolkit

_main = app_.main.Main()
base_main = app_base.main.Main()
draw_frame_main = app_draw_frame.main.Main()
limited_time_sharing_main = app_limited_time_sharing.main.Main()
media_scrape_main = app_media_scrape.main.Main()
word_cloud_main = app_word_cloud.main.Main()
ffmpeg_toolkit_main = app_ffmpeg_toolkit.main.Main()


urlpatterns = [
    path('admin/', admin.site.urls),

    # app_base
    path('', base_main.index),

    # app_draw_frame
    path('draw_frame/', draw_frame_main.index),
        path('draw_frame/refresh_folders_list/', draw_frame_main.refresh_folders_list),
        path('draw_frame/refresh_files_list/', draw_frame_main.refresh_files_list),
        path('draw_frame/refresh_frame/', draw_frame_main.refresh_frame),
        path('draw_frame/add_drawing/', draw_frame_main.add_drawing),
        path('draw_frame/del_drawing/', draw_frame_main.del_drawing),
        path('draw_frame/create_folder/', draw_frame_main.create_folder),
        path('draw_frame/delete_folder/', draw_frame_main.delete_folder),
        path('draw_frame/upload_file/', draw_frame_main.upload_file),
        path('draw_frame/delete_file/', draw_frame_main.delete_file),
        path('draw_frame/prepare_download_file/', draw_frame_main.download_file_preprocess),
        path('draw_frame/download_file/', draw_frame_main.download_file),
    
    # app_limited_time_sharing
    path('limited_time_sharing/', limited_time_sharing_main.index),
        path('limited_time_sharing/upload_file/', limited_time_sharing_main.upload_file),
        path('limited_time_sharing/download_file/', limited_time_sharing_main.download_file),

    # app_media_scrape
    path('media_scrape/', media_scrape_main.index),
    path('media_scrape/scrape_download/', media_scrape_main.scrape_download),
    path('media_scrape/download_file/', media_scrape_main.download_file),

    # app_word_cloud
    path('word_cloud/', word_cloud_main.index),
        path('word_cloud/apply/', word_cloud_main.apply),
        path('word_cloud/generate/', word_cloud_main.generate),
        path('word_cloud/refresh_frame/', word_cloud_main.refresh_frame),
        path('word_cloud/prepare_download_file/', word_cloud_main.prepare_download_file),
        path('word_cloud/download_file/', word_cloud_main.download_file),

    # app_ffmpeg_toolkit
    path('ffmpeg_toolkit/', ffmpeg_toolkit_main.index),
        path('ffmpeg_toolkit/refresh_commands/', ffmpeg_toolkit_main.refresh_commands),
        path('ffmpeg_toolkit/apply/', ffmpeg_toolkit_main.apply),
        path('ffmpeg_toolkit/apply_progress/', ffmpeg_toolkit_main.apply_progress),
        path('ffmpeg_toolkit/download_file/', ffmpeg_toolkit_main.download_file)
]
