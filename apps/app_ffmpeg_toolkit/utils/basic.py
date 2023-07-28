import os
import json



class Basic:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_dir = f"{self.base_dir}/data"
        self.storage_dir = f"{self.base_dir}/storage"
        self.generate_dir(self.storage_dir)
    
    def generate_dir(self, dir):
        if not os.path.exists(dir):
            os.mkdir(dir)

    def refresh_commands(self):
        ffmpeg_commands_dir = f"{self.base_dir}/data/ffmpeg_commands.json"
        ffmpeg_commands_file = open(ffmpeg_commands_dir, 'r')

        ffmpeg_commands_json = json.load(ffmpeg_commands_file)
        return ffmpeg_commands_json
