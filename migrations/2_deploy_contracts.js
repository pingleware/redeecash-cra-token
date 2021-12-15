var CreditReport = artifacts.require('./CreditReport');

module.exports = function(deployer) {
    deployer.deploy(CreditReport);
}