import os
import subprocess

if os.name == "nt":
    subprocess.run(
        [os.path.join("./.venv/scripts", "pyinstaller"), "api/api.py", "--onefile", "--distpath", os.path.join(
            "build", "api")])
else:
    subprocess.run(
        ["wineconsole", "--backend=curses", "pyinstaller", "api/api.py", "--onefile", "--distpath", os.path.join(
            "build", "api")])
