import os
import subprocess
# Correr desde la carpeta raiz

python_folder = "./.venv/scripts" if os.name == "nt" else "./.venv/bin"
subprocess.run([os.path.join(python_folder, "python"), "./api/api.py"])