const { app, BrowserWindow, ipcMain, dialog, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize store for app settings
const store = new Store();

// Keep a global reference of the window object
let mainWindow;
let tray;

// Development mode check
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        title: 'VN Proxy Manager',
        show: false, // Don't show until ready
        frame: true,
        titleBarStyle: 'default'
    });

    // Load the app
    if (isDev) {
        mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
    }

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Emitted when the window is closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle window state
    mainWindow.on('close', () => {
        if (!app.isQuiting) {
            mainWindow.hide();
            return false;
        }
    });

    // Create tray
    createTray();
}

// Create tray
function createTray() {
    // Create tray icon - use default icon if custom icon doesn't exist
    let icon;
    try {
        const iconPath = path.join(__dirname, 'assets', 'icon.ico');
        icon = nativeImage.createFromPath(iconPath);
    } catch (error) {
        // Use default icon if custom icon doesn't exist
        icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    }

    tray = new Tray(icon);
    tray.setToolTip('VN Proxy Manager');

    // Create tray menu
    const trayMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                mainWindow.show();
            }
        },
        {
            label: 'Hide App',
            click: () => {
                mainWindow.hide();
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(trayMenu);

    // Double click to show window
    tray.on('double-click', () => {
        mainWindow.show();
    });
}

// Create menu
function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Export Keys',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        mainWindow.webContents.send('menu-export-keys');
                    }
                },
                {
                    label: 'Import Keys',
                    accelerator: 'CmdOrCtrl+I',
                    click: () => {
                        mainWindow.webContents.send('menu-import-keys');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// IPC Handlers
ipcMain.handle('get-app-settings', () => {
    return store.get('settings', {
        localAddress: '127.0.0.1',
        theme: 'dark',
        language: 'vi'
    });
});

ipcMain.handle('save-app-settings', (event, settings) => {
    store.set('settings', settings);
    return true;
});

ipcMain.handle('export-keys', async (event, data) => {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Export Keys',
        defaultPath: 'proxy-keys.txt',
        filters: [
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (filePath) {
        return { success: true, filePath };
    }
    return { success: false };
});

ipcMain.handle('import-keys', async () => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Import Keys',
        properties: ['openFile'],
        filters: [
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (filePaths && filePaths.length > 0) {
        return { success: true, filePath: filePaths[0] };
    }
    return { success: false };
});

// App event handlers
app.whenReady().then(() => {
    createWindow();
    createMenu();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
    });
});

// Handle app quit
app.on('before-quit', () => {
    app.isQuiting = true;
    if (tray) {
        tray.destroy();
    }
});
