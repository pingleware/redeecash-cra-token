// consumer inquiry by subscriber
async function consumer_inquiry() {
    var consumer = document.getElementById("consumer").value;
    var report = await master.getCreditReport();
    var option = new Option(report);
    document.getElementById("report-item").option.append(option);
    console.log(report);
}

// consumer requests own report
async function consumer_self_inquiry() {
    var report = master.getReportsByConsumer(user_name, {from: owner});
    console.log(report);
}

// consumer opens a dispute
async function openDispute() {

}
