import {app, BrowserWindow} from 'electron';
import isDev from 'electron-is-dev';
import {PythonShell} from 'python-shell';
import {execFile} from 'child_process';
import path, {dirname} from "path";
import {fileURLToPath} from 'url';
import os from "os";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_PROD_PATH = path.join(process.resourcesPath, "../lib/api/api.exe");
const API_DEV_PATH = path.join(__dirname, "api/api.py");

let pythonProcess;

let venvExeFolder = os.platform() === 'win32' ? "Scripts" : "bin";
if (isDev) {
    pythonProcess = new PythonShell(API_DEV_PATH, {
        pythonPath: path.resolve(__dirname, ".venv", venvExeFolder, "python"),
    }).childProcess;
    //TODO MANEJO DE ERRORES

} else {
    pythonProcess = execFile(API_PROD_PATH, {
        windowsHide: true,
    })
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })
    win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
}
app.whenReady().then(() => {
    createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on("before-quit", function () {
    pythonProcess.kill()
})
