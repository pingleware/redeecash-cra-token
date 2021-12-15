"use strict";

const CreditReport = require('../build/contracts/CreditReport.json');


//async () => {
    const Web3 = require('web3');
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:9545');
    //console.log(web3)

    web3.eth.getAccounts(function(accounts){
        console.log(accounts);

        var owner = '0x2287d5024c6ccfbbf2bf52927a444b5bc4e19722';
        var subscriber = '0x0b9abf01d0ceb7d57b97d6679ae619a44936cc36';
        var consumer = '0xc6db7413b80fe70cc6c24f6e0e21c5a6b6e39aa5';
    
    
        var Contract = require('web3-eth-contract');
        Contract.setProvider('ws://localhost:9545');
        
        const deployedNetwork = CreditReport.networks;
        var keys = Object.keys(deployedNetwork);
        var address = CreditReport.networks[keys[0]].address;
        console.log(address);
        
        var contract = new Contract(CreditReport.abi, address, {from: owner});
        console.log("Invoking getOwner");
    
        contract.methods.getOwner().call({from: owner}, function(results){
            console.log(results);
    
            console.log("Invoking addSubscriber");
            contract.methods.addSubscriber(subscriber,1).call({from: owner}, function(results){
                console.log("Invoking addConsumerItem");
                var item = {
                    subscriber: subscriber,
                    postdate: '2021-12-13',
                    description: 'new account opened',
                    balance: 0.00,
                    limit: 5000.0
                };
                contract.methods.addConsumerItem(consumer, JSON.stringify(item)).call({from: subscriber}, function(results){
                    console.log("Invoking getConsumerReport");
                    contract.methods.getConsumerReport().call({from: consumer}, function(report){
                        console.log(report);
                    });
                });
            });
        });
    });


    
//}
/*
    try {
        const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        const networkId = await web3.eth.net.getId();
        const instance = new web3.eth.Contract(CreditReport.abi, deployedNetwork && deployedNetwork.address);
        console.log(instance);
    } catch(error) {
        console.log(error);
    }
*/
