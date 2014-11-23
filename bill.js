var BILL_ATTRIBUTES = [
    "uuid",
    "created",
    "modified",
	"partner_uuid",
    "total_amount",
	"month",
	"year",
	"bill_paid"
];

//Mustafa's transaction database
var TRANSACTION_ATTRIBUTES = [
    "uuid",
    "amount",
    "created",
    "offer_uuid",
    "coupon_code",
    "partner_uuid",
    "status",
	"store_name",
	"store_address",
    "user_uuid"
];

function readMonthlyBill(query, successCB, errorCB) {
	getSpecifiedEntities("bill", query, BILL_ATTRIBUTES, successCB, errorCB);
}
function readMonthlyTransactions(query, successCB, errorCB) {
	getSpecifiedEntities("transaction", query, TRANSACTION_ATTRIBUTES, successCB, errorCB);
}

function updatePaidBill(data, successCB, errorCB){
	//$("#m").append(data.bill_paid);
	modifyEntity(data, successCB, errorCB)
}
