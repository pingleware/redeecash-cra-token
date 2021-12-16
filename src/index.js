"use strict";
const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("path");

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 700,
      icon: "assets/ExchangeCurrency.png",
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, "preload.js")
      }
    });
  
    mainWindow.loadFile("views/index.html");
    mainWindow.on("closed", function () {
      mainWindow = null;
    });
    mainWindow.setMenu(null);
    mainWindow.setResizable(false);
}

app.on("ready", createWindow);
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});
app.on("activate", function () {
    if (mainWindow === null) createWindow();
});
ipcMain.on("error", function(evt, data){
   mainWindow.webContents.send("error", data);
});  

// Load build contract 
const CreditReport = require('../build/contracts/CreditReport.json');
const network_id = Object.keys(CreditReport.networks)[0];

ipcMain.on("abi", function(evt, data){
    // ABI description as JSON structure
    let abi = CreditReport.abi;
    mainWindow.webContents.send("abi", JSON.stringify(abi));
});

ipcMain.on("contract_address", function(evt, data){
    // Get network id fom build contract
    // Get the contract address    
    var contract_address = CreditReport.networks[`${network_id}`].address;
    mainWindow.webContents.send("contract_address", contract_address);
});