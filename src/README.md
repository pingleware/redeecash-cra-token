# Interacting with the Smart Contract

## Truffle
You will start a truffle session,

    truffle develop

at the truffle prompt,

    truffle(develop)>

migrate your contract

    truffle(develop)> migrate

Now you need to deploy the contract,

    truffle(develop)> let instance = await CreditReport.deployed()
    null

To access the functions, prefix with

    instance

for example, to obtain the owner

    truffle(develop)> await instance.getOwner()
    '0x2287d5024c6cCfBBF2bF52927a444B5bC4e19722'

to obtain the list of accounts,

    truffle(develop)> accounts
    [
     '0x2287d5024c6cCfBBF2bF52927a444B5bC4e19722',
     '0x0B9aBf01d0CEb7D57B97D6679ae619a44936CC36',
     '0xC6Db7413B80FE70CC6c24f6e0e21c5a6b6e39AA5',
     '0x95E6cA71B57260C1f47f3f02091ee0400EDA6187',
     '0xc175C01106154E84e5d88c1d3F04E97525ADB10E',
     '0x28C4eAFe27142F46458E8A276240f989267fC7e4',
     '0xB06CB42186B32F56e0cD33E4723bC9C866a8b53e',
     '0xF5f10AD8e49CF38cc8d0588859D22e81B6550BbF',
     '0x0C4b13e38d2C35fc8eCF278Ef9156DADA0856Ae3',
     '0xF23e1dfa6Da2564b109E980E58c7c2C7878234d5'
    ]

the first account is the owner, the second acount is a subscriber, and third account is a consumer,

now add a subscriber,

    truffle(develop)> let subscribers = await instance.addSubscriber(accounts[1], 1)
    null

    {
        tx: '0x863dab796e234a259d7a13b66c611791105094122e0196c03fd4ea8924d9431d',
        receipt: {
            transactionHash: '0x863dab796e234a259d7a13b66c611791105094122e0196c03fd4ea8924d9431d',
            transactionIndex: 0,
            blockHash: '0xa56cc30c497f7921293e7e09cb1eb6578b30ffc89f1c7af9b2567d78f4f04ac5',  
            blockNumber: 59,
            from: '0x2287d5024c6ccfbbf2bf52927a444b5bc4e19722',
            to: '0x44266915af38c262e1903b4c8e72a3456670b5c8',
            gasUsed: 88174,
            cumulativeGasUsed: 88174,
            contractAddress: null,
            logs: [ [Object] ],
            status: true,
            logsBloom: '0x00000000000000000000020000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            rawLogs: [ [Object] ]
        },
        logs: [
            {
            logIndex: 0,
            transactionIndex: 0,
            transactionHash: '0x863dab796e234a259d7a13b66c611791105094122e0196c03fd4ea8924d9431d',
            blockHash: '0xa56cc30c497f7921293e7e09cb1eb6578b30ffc89f1c7af9b2567d78f4f04ac5',      blockNumber: 59,
            address: '0x44266915af38c262e1903b4c8e72A3456670b5c8',
            type: 'mined',
            id: 'log_a818ed54',
            event: 'SubscriberAdded',
            args: [Result]
            }
        ]
    }

we can verify our addition,

    truffle(develop)> subscribers = await instance.getSubscribers()
    undefined
    truffle(develop)> subscribers
    [
      '0x0B9aBf01d0CEb7D57B97D6679ae619a44936CC36'
    ]

now we can add a credit report item for the consumer (0xC6Db7413B80FE70CC6c24f6e0e21c5a6b6e39AA5)

this is the structure for a credit report item,

    string opendate;
    string  description;
    uint    amount;
    uint    balance;
    uint    limit;
    string  paystatus;

but we place the values in an array following the above order, we are going to create to a local variable first,

    truffle(develop)> let item = ["2021-12-15", "new account", 0, 0, 5000, "pay as agreed"]
    [ '2021-12-15', 'new account', 0, 0, 5000, 'pay as agreed' ]

we need to convert the array into bytes as the method parameter type is bytes,

    truffle(develop)> item = instance.addConsumerItem(accounts[2], web3.utils.toHex(item))
    ...Reason given: access denied for subscriber...

you will get the above error "access denied for subscriber" because you are invoking this method as the owner, but is restricted to subscriber only!


    truffle(develop)> let item = ["2021-12-15", "new account", 0, 0, 5000, "pay as agreed"]
    truffle(develop)> item = instance.addConsumerItem(accounts[2], web3.utils.toHex(item),{from: accounts[1], gas: 5000000})

    {
        tx: '0x888f4ec334ccbb90143d5a1d4cc1cf95a6d548b8dfef1dbdffd2e3f19afe8172',
        receipt: {
            transactionHash: '0x888f4ec334ccbb90143d5a1d4cc1cf95a6d548b8dfef1dbdffd2e3f19afe8172',
            transactionIndex: 0,
            blockHash: '0x9cbd01452b272bb5ca3f96e6d5bfcb015d2c0929ca87dace8c42b6d732dbfcd0',  
            blockNumber: 79,
            from: '0x0b9abf01d0ceb7d57b97d6679ae619a44936cc36',
            to: '0xfb1c96540d100eeb8396db49d83ef6035e70fdb6',
            gasUsed: 211953,
            cumulativeGasUsed: 211953,
            contractAddress: null,
            logs: [],
            status: true,
            logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            rawLogs: []
        },
        logs: []
    }    

to obtain the balance on any account,

    truffle(develop)> await web3.eth.getBalance(accounts[0])

    truffle(develop)> instance.getConsumers()
    [ '0xC6Db7413B80FE70CC6c24f6e0e21c5a6b6e39AA5' ]

to get a consumer report by a subscriber, which costs a fee,

        truffle(develop)> instance.getConsumerReport(accounts[2],accounts[0],{from: accounts[1], gas: 5000000})
        {
            tx: '0x168b0f686a0b1cacb9b68a6e8b3a746c531ff9e85b41257da8121627686c55eb',
            receipt: {
                transactionHash: '0x168b0f686a0b1cacb9b68a6e8b3a746c531ff9e85b41257da8121627686c55eb',
                transactionIndex: 0,
                blockHash: '0x0b6bf506085761d63c3bdaa7667021dabbca9cd9336d47cd3256ac9e02a2f5bf',  
                blockNumber: 80,
                from: '0x0b9abf01d0ceb7d57b97d6679ae619a44936cc36',
                to: '0xfb1c96540d100eeb8396db49d83ef6035e70fdb6',
                gasUsed: 97040,
                cumulativeGasUsed: 97040,
                contractAddress: null,
                logs: [],
                status: true,
                logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                rawLogs: []
            },
            logs: []
        }

        truffle(develop)> await web3.eth.getBalance(accounts[0])
        '99938340272000000000'

        truffle(develop)> instance.getCreditReport({from: accounts[2]})

        instance.openDispute(0, '2021-12-15', 'not my account',{from: accounts[2]})