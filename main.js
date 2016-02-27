'use strict';

var app = require('app'); // Module to control application life.
var BrowserWindow = require('browser-window'); // Module to create native browser window.
var path = require( 'path' );


// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // var INDEX = 'file://' + path.join( __dirname, 'index.html' );
    var INDEX = 'file://' + __dirname + '/index.html';

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        resizable: true
    });

    // and load the index.html of the app.
    mainWindow.loadUrl( INDEX );

    // Open the DevTools.
    //mainWindow.openDevTools();

    mainWindow.webContents.on( 'did-finish-load', function () {
        mainWindow.show();
        /* Review:
            http://www.dotnet-rocks.com/2015/05/06/when-electrons-window-settitle-keeps-driving-you-crazy/
        */
        mainWindow.setTitle('Accounting System');
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
