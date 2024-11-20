import os
import json

def load_configuration():
    config_path = "config/config.json"
    if (not os.path.exists(config_path)):
        return {}
    with open(config_path, "r") as fh:
        return json.load(fh)
    