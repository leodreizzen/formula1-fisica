import os
import subprocess

python_folder = "./.venv/scripts" if os.name == "nt" else "./.venv/bin"
subprocess.run([os.path.join(python_folder, "pyinstaller"), "api/api.py", "--onefile", "--distpath", os.path.join("build", "api")])
