FROM ubuntu:latest

COPY . /workspace/online_toolkit

WORKDIR /workspace/online_toolkit
CMD ["sh", "run.sh"]