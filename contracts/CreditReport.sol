// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CreditReport {
  bytes32 constant private ZERO_BYTES = bytes32(0);
  address constant private ZERO_ADDRESS = address(0);

  struct Item {
    string opendate;
    string  description;
    uint    amount;
    uint    balance;
    uint    limit;
    string  paystatus;
  }

  struct ReportItem {
    address subscriber;
    Item    item;
  }

  struct Inquiry {
    address subscriber;
    uint256 reqdate;
  }

  struct Dispute {
    uint index;
    address subscriber;
    address consumer;
    string  disputeDate;
    ReportItem item;
    string reason;
    string status;
  }

  mapping(address => ReportItem[]) private reports;
  mapping(address => uint256) private subscribers;

  mapping(address => uint256) private consumers;
  mapping(address => Inquiry[]) private inquiries;
  mapping(address => Dispute[]) private disputes;

  uint total_consumers = 0;

  mapping (address => string[]) message;

  mapping (bytes => address) private _owner;

  address private owner;

  event SubscriberAdded(address addr, string message);
  event SubscriberNotified(address addr, string message);
  event ConsumerNotified(address addr, string message);

  constructor()
  {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "access denied for owner");
    _;
  }

  modifier isOwner(address addr) {
    require(addr == owner, "not the owner");
    _;
  }

  modifier validSender() {
    require(msg.sender != ZERO_ADDRESS,"access denied for sender");
    _;
  }

  modifier onlySubscriber() {
    require(subscribers[msg.sender] != 0, "access denied for subscriber");
    _;
  }

  modifier onlyConsumer() {
    require(consumers[msg.sender] != 0, "access denied for consumer");
    _;
  }

  modifier requiresFee(uint fee) {
    require(msg.value < fee, "insufficient balance/amount");
    _;
  }

  /**
   * retrieves the owner
   */
  function getOwner()
    public
    view
    returns (address addr)
  {
    return owner;
  }

  /**
   * adds a new subscriber
   */
  function addSubscriber(address addr, uint256 _type)
  public
  onlyOwner
  {
    require(addr != ZERO_ADDRESS,"missing address");
    subscribers[addr] = _type;
    emit SubscriberAdded(addr, "subscriber added");
  }

  /**
   * adds an item to the consumer report by an existing subscriber, must contain the minimum:
   *    subscriber, open date, amount, description, balance, limit, payment status
   */
  function addConsumerItem(address consumer, bytes memory item)
    public
    payable
    onlySubscriber
  {
    if (consumers[consumer] == 0) {
      consumers[consumer] = 1;
      total_consumers++;
    }
    string memory _opendate;
    string memory _description;
    uint    _amount;
    uint    _balance;
    uint    _limit;
    string memory _paystatus;

    (_opendate, _description, _amount, _balance, _limit, _paystatus) = abi.decode(item, (string,string,uint,uint,uint,string));
    Item memory _item = Item(_opendate, _description, _amount, _balance, _limit, _paystatus);
    ReportItem memory ritem = ReportItem(msg.sender,_item);
    reports[consumer].push(ritem);
  }

  /**
   * retrieves consumer report by a subscriber, fee is paid to the owner
   */
  function getConsumerReport(address consumer, address payable to)
    public
    payable
    onlySubscriber
    isOwner(to)
    requiresFee(0.001 ether)
    returns (string memory)
  {
    to.transfer(msg.value);
    Inquiry memory inquiry = Inquiry(msg.sender, block.timestamp);
    inquiries[consumer].push(inquiry);
    return _report(consumer);
  }

  /**
   * retrieves consumer report by the consumer, no fees
   */
  function getCreditReport()
    public
    onlyConsumer
    returns (string memory)
  {
    Inquiry memory inquiry = Inquiry(msg.sender, block.timestamp);
    inquiries[msg.sender].push(inquiry);
    return _report(msg.sender);
  }

  function openDispute(uint index, string memory disputeDate,string memory reason)
    public
    onlyConsumer
  {
    ReportItem memory report = ReportItem(reports[msg.sender][index].subscriber,reports[msg.sender][index].item);
    Dispute memory dispute = Dispute(index, report.subscriber, msg.sender, disputeDate, report, reason, "");
    disputes[msg.sender].push(dispute);
    message[report.subscriber].push(
      string(
        abi.encodePacked(
          "Dispute Opened:",
          index,
          report.subscriber,
          msg.sender,
          disputeDate,
          report.item.opendate,
          report.item.description,
          report.item.amount,
          report.item.balance,
          report.item.limit,
          report.item.paystatus,
          reason
        )
      )
    );
    emit SubscriberNotified(report.subscriber, "new dispute opened");
  }

  function finalizeDispute(address consumer,uint index,string memory status, bool purge)
    public
    onlySubscriber
  {
    Dispute memory dispute = Dispute(
      index,
      disputes[consumer][index].subscriber,
      disputes[consumer][index].consumer,
      disputes[consumer][index].disputeDate,
      disputes[consumer][index].item,
      disputes[consumer][index].reason,
      status
    );

    if (purge) {
      delete disputes[consumer][index];
    } else {
      disputes[consumer][index] = dispute;
    }
    emit ConsumerNotified(consumer, "dispute finalized");
  }

  function getReportsByConsumer(address consumer)
    public
    view
    onlyOwner
    returns (string memory)
  {
    return _report(consumer);
  }

  /**
   * The contract owner will pull a list of disputes,
   * while iterating through each dispute,
   * convert the disputeDate from ISO string to an epoch timestamp and get current time in epoch timestamp,
   * check if the dispute is expired by more than 30 days from current time,
   * if dispute is expired, delete the dispute and notifiy consumer
   */
  function getDisputes(address consumer)
    public
    view
    onlyOwner
    returns (string memory)
  {
    string memory output = "";
    for (uint i = 0; i < disputes[consumer].length; i++) {
      Dispute memory _dispute = Dispute(
        disputes[consumer][i].index,
        disputes[consumer][i].subscriber,
        disputes[consumer][i].consumer,
        disputes[consumer][i].disputeDate,
        disputes[consumer][i].item,
        disputes[consumer][i].reason,
        disputes[consumer][i].status
      );
      output = string(
        abi.encodePacked(
          output,
          "[",
          _dispute.index,
          _dispute.subscriber,
          _dispute.consumer,
          _dispute.disputeDate,
          _dispute.reason,
          _dispute.status,
          "]"
        )
      );
    }
    return output;
  }

  /**
   * The disputeDate is in ISO and must be converted to epoch timestamp before checking current time
   * The currentTime is epoch timestamp provided by the caller
   */
  function checkExpiry(uint256 LastTimeStamp, uint256 currentTime)
   public
   pure
   returns(bool success)
  {
    if (LastTimeStamp + 30 days >= currentTime) {
      return true;
    } else {
      return false;
    }
  }

  function purgeDispute(address consumer, uint index)
    public
    onlyOwner
  {
    delete disputes[consumer][index];
    emit ConsumerNotified(consumer, "dispute deleted");
  }

  function sendMessage(address _recipient, string memory _message)
    public
  {
    message[_recipient].push(_message);
  }

  function readMessage()
    public
    view
    returns (string memory)
  {
    string memory output = "";
    for (uint i = 0; i < message[msg.sender].length; i++) {
      string memory _message = message[msg.sender][i];
      output = string(abi.encodePacked(output, "[", _message, "]"));
    }
    return output;
  }

  /**
   * Internal function to return credit report items by consumer
   */
  function _report(address consumer)
    internal
    view
    returns (string memory)
  {
    string memory output;
    for (uint i = 0; i < reports[consumer].length; i++) {
      output = string(abi.encodePacked(
        output, "[",
          reports[consumer][i].subscriber, ",",
          reports[consumer][i].item.opendate, ",",
          reports[consumer][i].item.description, ",",
          reports[consumer][i].item.amount, ",",
          reports[consumer][i].item.balance, ",",
          reports[consumer][i].item.limit, ",",
          reports[consumer][i].item.paystatus,
        "]"
      ));
    }
    return output;
  }
}
