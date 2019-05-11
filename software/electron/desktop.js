const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1056,
		height: 594,
		backgroundColor: "#000000",
		webPreferences: {
			preload: __dirname + "/desktop-preload.js",
			webSecurity: false
		},
		icon: path.join(__dirname, "/assets/icon-512x512.png")
	});

	mainWindow.setFullScreen(true);

	if (process.env.SHOW_DEV_TOOLS) mainWindow.webContents.openDevTools();

	const startUrl =
		process.env.ELECTRON_START_URL ||
		url.format({
			pathname: path.join(__dirname, "/./index.html"),
			protocol: "file:",
			slashes: true
		});

	// Load the initial URL
	mainWindow.loadURL(startUrl);

	// Emitted when the window is closed.
	mainWindow.on("closed", function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
	app.quit();
});
