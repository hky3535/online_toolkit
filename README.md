# online_toolbox
django+html+css+js

## 当前工具箱功能
* 绘制图像
* 限时分享
* 媒体抓取
* 词云生成
* 媒体处理（ffmpeg在线操作）

## docker使用方式
### 一键部署
```bash
git clone https://github.com/hky3535/online_toolkit.git && cd online_toolkit && docker build -t online_toolkit:latest . && docker run -itd --name online_toolkit -p 60000:30000 --restart always --privileged online_toolkit:latest && cd ..
```
* 可以使用docker logs online_toolkit查看初始化进度，等待所有初始化库安装完成即可开始运行
### 设置bilibili爬虫的cookie
```bash
BILIBILI_SESSDATA=      # 填入你的cookie里的SESSDATA
docker exec online_toolkit sed -i "s/\('SESSDATA': '\)[^']*\(.*\)/\1$BILIBILI_SESSDATA\2/" /workspace/online_toolkit/apps/app_media_scrape/utils/bilibili.py
```
### 分解部署
```bash
git clone https://github.com/hky3535/online_toolkit.git
cd online_toolkit
docker build -t online_toolkit:latest .
docker run -itd --name online_toolkit -p 60000:30000 --restart always --privileged online_toolkit:latest
 && cd ..
```
* 可以使用docker logs online_toolkit查看初始化进度，等待所有初始化库安装完成即可开始运行
### 访问https://0.0.0.0:60000进入网站

## 功能详细介绍
### 绘制图像
* 可以创建文件夹、上传图像文件，然后在右侧绘图区域绘制各种形状线条
* 各功能都绑定了快捷键
> 上一张：左箭头 下一张：右箭头  
> 点，线，矩形，圆，多边形：小键盘1、2、3、4、5  
* 文件上传部分支持混合上传图片文件和json文件
> json文件用于导入先前导出的或者自己根据格式制作的绘制文件  
* 支持文件导出
> 可以导出原图+绘制完成的原图+绘制文件  

### 限时分享
* TODO: 限时自动删除部分还没做，目前上传的文件并不会自动删除
* 上传部分可以支持多文件选择，在后端会自动压成tar包并提供一个下载用的url
* 该url包含长链和短链两种格式，长链可以直接点击下载，短链需要在当前页面的下载框内输入后点击下载，后端会自动匹配该短链并找到文件

### 媒体抓取
* 输入视频的url（输入内容可以是混着中文、符号之类的文字内容，只要里面含有完整的“http://”或者“https://”带领的url就可以自动匹配出来）
> 抖音：右下角“分享”，点击“复制链接”  
> 微博：轻享版/普通版/国际版，现在都统一分享链接了，直接“分享”，点击“复制链接”  
> B站：“分享”，点击“复制链接”，如果需要用自己的账号下载大会员1080P60帧的话，需要在程序中设置cookie，详见“media_scrape.git”项目 
* 后端会先把视频下载到服务器，然后提供下载链接，服务器内的视频在被下载后并不会删除

### 词云生成
* 根据配置结果生成所需词云

### 媒体处理
* 在本地配置文件中可以自行添加ffmpeg语句
* 本地配置文件路径：apps/app_ffmpeg_toolkit/utils/data/ffmpeg_commands.json
* 语句中保留字段为{input}和{output}，分别会被解析为“上传”按钮和“应用及下载”按钮