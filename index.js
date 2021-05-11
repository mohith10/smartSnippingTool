const {app, BrowserWindow, ipcMain} = require("electron");
const Tesseract = require('tesseract.js');
const path = require('path')
let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({
        width : 400,
        height : 200,
        icon: path.join(__dirname,'main','icon.png'),
        //resizable:false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
          } 
    })
    mainWindow.loadFile(path.join(__dirname,'main/','index.html'));
}

app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
let extractedText
ipcMain.on('extract-text', (event, arg) => {
  console.log("Rcvd ", arg)
  Tesseract.recognize(
    arg,
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    console.log(text);
    event.reply('extract-text', text)
    extractedText = text
  })
})

ipcMain.on('send-text', (event,arg)=>{
  event.reply('send-text', extractedText)
})

  app.on('close', () => {
      app.quit()
  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

