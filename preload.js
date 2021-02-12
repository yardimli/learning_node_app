//const { remote } = require('electron');
const {ipcRenderer} = require('electron');
console.log("PRE LOADER");
//let currWindow = remote.BrowserWindow.getFocusedWindow();

window.sendSyncCmd = function(cmd1,cmd2){
	return ipcRenderer.sendSync(cmd1,cmd2);
}