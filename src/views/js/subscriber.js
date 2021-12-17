// add credit report item by subscriber
async function add_report_item() {
    var consumer = document.getElementById("consumer").value;
    var item = [
        document.getElementById("date").value,
        document.getElementById("description").value,
        document.getElementById("amount").value,
        document.getElementById("balance").value,
        document.getElementById("limit").value,
        document.getElementById("paystatus").value
    ];
    console.log(item);
    console.log(web3._extend.utils);
    var result = await master.addConsumerItem(consumer, web3._extend.utils.toHex(item),{from: user_name, gas: 5000000});
    console.log(result);
    document.getElementById("date").value = "",
    document.getElementById("description").value = "",
    document.getElementById("amount").value = "0.00",
    document.getElementById("balance").value = "0.00",
    document.getElementById("limit").value = "0",
    document.getElementById("paystatus").value = ""
}
