const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
var CreditReport = artifacts.require('./CreditReport');

module.exports = async function(deployer) {
    try {
        var instance = await CreditReport.deployed();
        var upgraded = await upgradeProxy(instance.address, CreditReport, { deployer });
        console.log("Upgraded", upgraded.address);    
    } catch(error) {
        var instance = await deployProxy(CreditReport, [], { deployer });
        console.log("Deployed", instance.address);    
    }    
}