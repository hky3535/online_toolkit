FROM ubuntu:latest

COPY . /workspace/container_desktop

WORKDIR /workspace/container_desktop
CMD ["sh", "run.sh"]