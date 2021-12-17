async function getOwner(master) {
    return await master.getOwner();
}

async function getSubscriberDisputes(master) {
    var user_name = document.getElementById("userName").value;
    var owner = getOwner();
    var consumer = document.getElementById("consumer").value;
    var disputes = await master.getDisputes(consumer, {from: owner});
    console.log(disputes);
    disputes.forEach(function(dispute){
        if (dispute.subscriber == user_name) {
            document.getElementById('subscriber-disputes').value += dispute.item + "\n";
        }
    });
}

// add new subscriber
async function addNewSubscriber(master) {
    var result = master.addSubscriber(document.getElementById("new-subscriber").value, 1);
    document.getElementById('subscribers').value = master.getSubscribers();
    console.log(result);
    document.getElementById("new-subscriber").value = "";
}
