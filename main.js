const electron = require('electron');
const fs = require('fs');
const path = require('path');

//specific elements of electron that we want to include
const {app, BrowserWindow, ipcMain} = require('electron');

//our window variable
let window;

//creates a window based on the html included
//as an argument
function createWindowFromHTML(){
  window = new BrowserWindow({
    width : 800,
    height : 500,
    webPreferences: {
      nodeIntegration: true
    }
  });
  window.loadFile('./pages/mainpage.html');
  window.on('closed', function(){
    window = null;
  });
}

ipcMain.on('load', function(){
  let files = fs.readdirSync(path.join(__dirname, '/tunings/'));
  window.webContents.send('render_files', files)
});

ipcMain.on('get_tuning', function(event, file){
  let tuning_data = fs.readFileSync(path.join(__dirname, '/tunings/', file + '.json'));
  window.webContents.send('load_tuning', tuning_data);
});

app.on('ready', createWindowFromHTML);
