import os

# 获取到.../online_toolkit/apps的绝对路径
base_dir = os.path.dirname(os.path.abspath(__file__))

# 找到所有以“app_”开头的文件夹自动形成程序名称列表
apps = [app for app in os.listdir(base_dir) if app.startswith("app_")]

# 根据程序名称获取到templates和static文件夹的绝对路径
templates_dirs = [f"{base_dir}/{app}/templates" for app in apps]
static_dirs = [f"{base_dir}/{app}/static" for app in apps]
