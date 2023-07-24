FROM ubuntu:latest

COPY . /workspace/online_toolkit

RUN apt-get update && \
    apt-get install -y python3.10 python3-pip libglib2.0-dev libgl1-mesa-glx

WORKDIR /workspace/online_toolkit
CMD ["sh", "run.sh"]