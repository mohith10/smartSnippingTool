const { ipcRenderer, webContents, desktopCapturer, shell, remote } = require('electron');

function init (){
    ipcRenderer.send('send-text','hello')
    ipcRenderer.on('send-text', (event, rcvd) => {
    document.getElementById('data').innerText = rcvd
  })
}
init()