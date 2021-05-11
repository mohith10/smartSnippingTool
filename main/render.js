
const electron = require('electron');
const { webContents, desktopCapturer, shell, remote, ipcRenderer } = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const {Menu} = remote
const fs = require('fs')
const os = require('os')
const path = require('path')

const captureButton = document.querySelector('.capture');
const appSourceButton = document.querySelector('.video-sources')

var monitorWidth = screen.width * window.devicePixelRatio;
var monitorHeight = screen.height * window.devicePixelRatio;
console.log(monitorWidth, monitorHeight);

ipcRenderer.on('extract-text-index', (event, rcvd) => {
    console.log('rcvd',rcvd);
  })
let captureWindow = null;
captureButton.addEventListener('click', async () => {
    
    remote.BrowserWindow.getFocusedWindow().minimize();
/*
    const inputSource = await desktopCapturer.getSources({
        types : ['window','screen'],
        thumbnailSize: {'width': monitorWidth, 'height':monitorHeight}
    })
    console.log(inputSource)
    source = inputSource[0]
    //inputSource.forEach((source) =>{
        const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')
        let size = {
            x:0,
            y:0,
            width : 800,
            height : 400
        }
        let cropped = source.thumbnail.crop(size)
        fs.writeFile(screenshotPath, cropped.toPNG(), (error) => {
          if (error) return console.log(error)
          shell.openExternal(`file://${screenshotPath}`)
          
        })
    */
   
    captureWindow = new BrowserWindow({
        width: monitorWidth,
        height: monitorHeight,
        opacity:0.3,
        icon: path.join(__dirname+'/icon.png'),
        //resizable:false,
        fullscreen:true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
          } ,
        frame:false,
    });
    captureWindow.on('close', ()=>{
        win = null;
    })
    captureWindow.loadFile(path.join(__dirname,'canvas.html'));
    captureWindow.show();
  
})
