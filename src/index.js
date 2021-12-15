"use strict";

// Load build contract 
const CreditReport = require('../build/contracts/CreditReport.json');

// ABI description as JSON structure
let abi = CreditReport.abi;

// Get network id fom build contract
var network_id = Object.keys(CreditReport.networks)[0];
// Get the contract address    
var contract_address = CreditReport.networks[`${network_id}`].address;
console.log(contract_address); // 0x45A2419ff25988592778e551c88184A6a97F2664
// Connect to the blockchain
let Web3 = require('web3');
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:9545'));

// Create Contract proxy class
var Contract = require('web3-eth-contract');
// set provider for all later instances to use
Contract.setProvider('http://localhost:9545');

var contract = new Contract(abi, contract_address);
console.log(contract);

// Get the account list
var accounts;

web3.eth.getAccounts().then(
    function(acc){ 
        accounts = acc; 
        console.log("First account: " +accounts[0]);

        contract.methods.getOwner().send({from: accounts[0]},function(owner){
            console.log("Owner: " + owner);
        });

        contract.methods.addSubscriber(accounts[1], 1).send({from: accounts[0]},function(result){

            contract.methods.getSubscribers().send({from: accounts[0]},function(subscribers){
                console.log("Subscriber(s): " + subscribers);

                console.log(new Date().toISOString());

                if (subscribers) {
                    var item = {
                        subscriber: subscribers[0],
                        postdate: new Date().toISOString().split['T'][0],
                        description: 'new account opened',
                        balance: 0.00,
                        limit: 5000.0
                    };
                    contract.methods.addConsumerItem(accounts[2], JSON.stringify(item)).call({from: subscribers[0]}, function(results){
                        console.log("Invoking getConsumerReport");
                        contract.methods.getConsumerReport().call({from: accounts[2]}, function(report){
                            console.log(report);
                        });
                    });    
                }
            });
        });
        
    });
