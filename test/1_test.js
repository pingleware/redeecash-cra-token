const { web } = require("web3");

const CreditReport = artifacts.require("CreditReport");

contract("CreditReport", accounts => {
    var _owner;

    it("should get the owner", () =>
    CreditReport.deployed()
        .then(function(instance){
            return instance.getOwner();
        })
        .then(owner => {
            _owner = owner;
            console.log(owner);
        })
        .catch(function(error){
            console.log(error);
        })
    )

    it("should add a new subscriber", async () => {
        CreditReport.deployed()
            .then(instance => instance.addSubscriber("0x58955168318799fdA412D7410c4560CE5cE31e54",{from: _owner}))
            .then(function(){
                console.log("added new subscriber successfully");
            })
            .catch(function(error){
                console.log(error);
            })
    })

    it("should add a new report item", async () => {
        var subscriber = "0x58955168318799fdA412D7410c4560CE5cE31e54";
        var item = {
            opendate: new Date().toISOString().split("T")[0],
            description: "new account",
            amount: 0,
            balance: 0,
            limit: 5000,
            paystatus: "pay as agreed"
        };
        var _item = web.abi.encode(JSON.stringify(item));
        CreditReport.deployed()
            .then(instance => instance.addConsumerItem("0xc6db7413b80fe70cc6c24f6e0e21c5a6b6e39aa5",_item))
            .then(function(){
                console.log("added new consumer item successfully");
            })        
            .catch(function(error){
                console.log(error);
            })
    })

    it("should get credit report with a fee", () => {
        CreditReport.deployed()
            .then(instance => instance.getConsumerReport("0xc6db7413b80fe70cc6c24f6e0e21c5a6b6e39aa5", owner))
            .then(function(report){
                console.log("report: ",report);
            })
            .catch(function(error){
                console.log(error);
            })
    })
});