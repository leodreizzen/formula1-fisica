import os
import subprocess

# Crea el entorno virtual
python = "python" if os.name == "nt" else "python3"
subprocess.run([python, "-m", "venv", ".venv"])

# Path to a Python interpreter that runs any Python script
# under the virtualenv /path/to/virtualenv/
python_bin = "./.venv/scripts/python" if os.name == "nt" else "./.venv/bin/python"
subprocess.run([python_bin, "-m", "pip", "install", "-r", os.path.join(".", "api", "requirements.txt")])
