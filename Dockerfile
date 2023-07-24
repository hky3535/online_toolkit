FROM ubuntu:latest

COPY . /workspace/online_toolkit

RUN apt-get update && \
    apt-get install -y \
        python3.10 python3-pip \            # 基础需求
        libglib2.0-dev libgl1-mesa-glx      # opencv安装必须要有这两个库

WORKDIR /workspace/online_toolkit
CMD ["sh", "run.sh"]