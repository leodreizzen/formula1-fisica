import {app, BrowserWindow, dialog, session} from 'electron';
import isDev from 'electron-is-dev';
import {PythonShell} from 'python-shell';
import {execFile} from 'child_process';
import path from "path";
import url, {fileURLToPath} from 'url';
import os from "os";
import treeKill from "tree-kill";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_PROD_PATH = path.join(__dirname, "../build/api/api.exe");
const API_DEV_PATH = path.join(__dirname, "api/api.py");
const INDEX_PROD_PATH = path.join(__dirname, 'build/client/index.html');
let pythonProcess;

let venvExeFolder = os.platform() === 'win32' ? "Scripts" : "bin";
let serverPid = null;

let serverReady;
const serverReadyPromise = new Promise((resolve, reject) => {
    serverReady = resolve;
    setTimeout(reject, 15000);
})

function processApiStderr(data) {
    if (serverPid === null) {
        let match = data.match(".*Started server process \\[(\\d+)]");
        if (match) {
            serverPid = match[1];
            serverReady();
        }
    }
}

if (isDev) {
    let pythonShell =  new PythonShell(API_DEV_PATH, {
        pythonPath: path.resolve(__dirname, ".venv", venvExeFolder, "python")
    })

    pythonShell.on('message', console.log);
    pythonShell.on('stderr', processApiStderr);
    pythonShell.end((err,code,signal) =>{
      if (err) throw err;
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
    });
    pythonProcess = pythonShell.childProcess;
} else {
    pythonProcess = execFile(API_PROD_PATH, {
        windowsHide: true,
    })
    pythonProcess.stderr.on('data', processApiStderr);
    pythonProcess.stdout.on('data', console.log);
    pythonProcess.on('exit', (code, signal) => {
        if(code !== 0 && code !== null)
            dialog.showErrorBox("API exited", `API exited with code ${code} and signal ${signal}`);
    });
}

function killServer() {
    if (pythonProcess) {
        treeKill(pythonProcess.pid, "SIGINT");
        pythonProcess = null;
    }
    if (serverPid) {
        treeKill(serverPid, "SIGINT");
        serverPid = null;
    }
}

async function installExtensions() {
    if(isDev) {
        const installer = await import ('electron-devtools-installer');
        const res = await installer.default.default(installer.REACT_DEVELOPER_TOOLS, {loadExtensionOptions: {allowFileAccess: true}});
        session.defaultSession.getAllExtensions().map(e => {
            if (e.name === 'React Developer Tools') {
                session.defaultSession.loadExtension(e.path);
            }
        });
    }
}
let previousSize;
try {
    const createWindow = async () => {
        const win = new BrowserWindow({
            width: 1200,
            height: 800,
            minHeight:650,
            minWidth:800
        })
        previousSize = win.getSize()
        win.on('resize', (e) => {
            const size = win.getSize()
            const [width, height] = size
            const maxAspectRatio = 1.85;
            if(height > 0 && width / height > maxAspectRatio) {
                if (size[0] !== previousSize[0]) {
                    win.setSize(size[0], Math.round(size[0] / maxAspectRatio))
                }
                else
                    win.setSize(Math.round(size[1] * maxAspectRatio), size[1])
            }
            previousSize = size
        })
        win.maximize()
        win.loadURL(isDev ? 'http://localhost:3000' : url.format({
            pathname: INDEX_PROD_PATH,
            protocol: 'file:',
            slashes: true
        })).catch(() => {
            dialog.showErrorBox("Error", "Failed to load index.html")
        });
    }
    app.whenReady()
        .then(installExtensions)
        .then(() => {
        serverReadyPromise.then(()=> {
            createWindow()
        }).catch((e) => {
            dialog.showErrorBox("Error", "Failed to start api")
            killServer();
        });
    })
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })

    app.on("before-quit", function () {
        killServer();
    });

    }
catch (e) {
    killServer();
    throw e;
}
