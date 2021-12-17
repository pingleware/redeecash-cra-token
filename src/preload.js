const {contextBridge, ipcRenderer} = require("electron");

let validChannels = [
  "error", "abi", "contract_address"
];

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, function(event, args) {
        func(channel, event, args)
      });
    }
  }
});

var pjson = require('./package.json');
localStorage.setItem('version', pjson.version);