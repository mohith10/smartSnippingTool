const { rejects } = require('assert');

const electron = require('electron');
const { ipcRenderer, webContents, desktopCapturer, shell, remote } = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const fs = require('fs')
const os = require('os');
const { resolve } = require('path');
const path = require('path')
const canvas = document.getElementById('canvas');
var monitorWidth = screen.width //* window.devicePixelRatio;
var monitorHeight = screen.height ;//* window.devicePixelRatio;
canvas.style.width = monitorWidth + 'px';
canvas.style.height = monitorHeight + 'px';
var mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
};
var element = null;
var size = {
    x:0,
    y:0,
    width:0,
    height:0
}
   
function setMousePosition(e) {
var ev = e || window.event; //Moz || IE
if (ev.pageX) { //Moz
    mouse.x = ev.pageX + window.pageXOffset;
    mouse.y = ev.pageY + window.pageYOffset;
} else if (ev.clientX) { //IE
    mouse.x = ev.clientX + document.body.scrollLeft;
    mouse.y = ev.clientY + document.body.scrollTop;
}
}
    


 canvas.onmousemove = function (e) {
    setMousePosition(e);
    if (element !== null) {
        canvas.style.cursor = "crosshair";
        let x = (mouse.x - mouse.startX < 0) ? mouse.x  : mouse.startX ;
        let y = (mouse.y - mouse.startY < 0) ? mouse.y  : mouse.startY ;
        let width = Math.abs(mouse.x - mouse.startX)
        let height = Math.abs(mouse.y - mouse.startY)
        element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
        element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
        element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
        element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
       // ctx.rect(element.style.top, element.style.left, element.style.width, element.style.height);
        //ctx.stroke();
        /*let x = (mouse.x - mouse.startX < 0) ? mouse.x  : mouse.startX ;
        let y = (mouse.y - mouse.startY < 0) ? mouse.y  : mouse.startY ;
        let width = (mouse.x - mouse.startX)
        let height = (mouse.y - mouse.startY)
       // ctx.clearRect(0, 0, 1200, 1090);*/
       // ctx.rect(x, y, width, height);
       console.log(x,y , width, height);
        //ctx.stroke();
    }
}

 canvas.onclick = function (e) {
    console.log('H&W ',canvas.style);
    if (element !== null) {
        element = null;
        canvas.style.cursor = "default"; 
        let x = (mouse.x - mouse.startX < 0) ? mouse.x  : mouse.startX ;
        let y = (mouse.y - mouse.startY < 0) ? mouse.y  : mouse.startY ;
        let width = Math.abs(mouse.x - mouse.startX)
        let height = Math.abs(mouse.y - mouse.startY)
        console.log('finished', x,y , width, height);
        size.x = x;
        size.y = y;
        size.width = width;
        size.height = height;
        init() 
    } else {
       // ctx.beginPath();
        canvas.removeChild(canvas.childNodes[0]);
        mouse.startX = mouse.x;
        mouse.startY = mouse.y;
        element = document.createElement('span');
        element.className = 'rectangle'
        element.style.borderStyle = 'solid'
        element.style.left = mouse.x + 'px';
        element.style.top = mouse.y + 'px';
        canvas.appendChild(element)
        console.log('Started ',mouse.startX, mouse.startY);
        canvas.style.cursor = "crosshair";
        //console.log(element.style.width,element.style.height , mouse.startX, mouse.startY);
    }
}

async function init(){
    remote.BrowserWindow.getFocusedWindow().minimize();
    
    const inputSource = await desktopCapturer.getSources({
        types : ['window','screen'],
        thumbnailSize: {'width': monitorWidth, 'height':monitorHeight}
    })
    let newWin = null
    if(newWin!=null){
        newWin.close()
    }
    newWin = new BrowserWindow({
        width:350,
        height:350,
        icon: path.join(__dirname+'/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
          } 
    })
    newWin.loadFile(path.join(__dirname,'loader.html'))
    newWin.setAlwaysOnTop(true,'screen')
    source = inputSource[0]
    //console.log('size of def ', source.thumbnail.getSize())
    //inputSource.forEach((source) =>{
    
    const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')
    
    console.log('size',size)
    let cropped = source.thumbnail.crop(size)
    //cropped = source.thumbnail.resize({width:1920, height:1080})
    fs.writeFile(screenshotPath, cropped.toPNG(), (error) => {
    if (error) return console.log(error)
    //shell.openExternal(`file://${screenshotPath}`)  
    })
    console.log('send ', `file://${screenshotPath}`)
    ipcRenderer.send('extract-text', `${screenshotPath}`)
    ipcRenderer.on('extract-text', (event, rcvd) => {
        console.log('rcvd',rcvd);
       
        newWin.loadFile(path.join(__dirname,'showData.html'))
        remote.getCurrentWindow().close()
        
      })

    }
