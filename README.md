# online_toolbox
django+html+css+js

## 当前工具箱功能
* 绘制图像
* 限时分享
* 媒体抓取

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
* TODO: 目前仅完成了抖音的视频的抓取，即将做微博和B站的抓取
* 输入视频的url（输入内容可以是混着中文、符号之类的文字内容，只要里面含有完整的“http://”或者“https://”带领的url就可以自动匹配出来）
> 抖音：右下角“分享”，点击“复制链接”  
> 微博：轻享版/普通版/国际版，现在都统一分享链接了，直接“分享”，点击“复制链接”  
> B站：TODO  
* 后端会先把视频下载到服务器，然后提供下载链接，服务器内的视频在被下载后并不会删除
