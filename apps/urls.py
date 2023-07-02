"""
何恺悦 hekaiyue 2023-06-27
"""
from django.contrib import admin
from django.urls import path
from .app_root.main import Main as RootMain
from .app_draw_frame.main import Main as DrawFrameMain
from .app_limited_time_sharing.main import Main as LimitedTimeSharingMain
from .app_media_scrape.main import Main as MediaScrapeMain

root_main = RootMain()
draw_frame_main = DrawFrameMain()
limited_time_sharing_main = LimitedTimeSharingMain()
media_scrape_main = MediaScrapeMain()

urlpatterns = [
    path('admin/', admin.site.urls),

    # app_root
    path('', root_main.index),

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
    path('media_scrape/download_file/', media_scrape_main.download_file)
]
