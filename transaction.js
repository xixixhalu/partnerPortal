var TRANSACTION_ATTRIBUTES = [
  "uuid",
  "amount",
  "created",
  "offer_uuid",
  "coupon_code",
  "partner_uuid",
  "status",
  "user_uuid"
];


//Mustafa's transaction database
//var TRANSACTION_ATTRIBUTES = [
//    "uuid",
//    "amount",
//    "created",
//    "offer_uuid",
//    "coupon_code",
//    "partner_uuid",
//    "status",
//	"store_name",
//	"store_address",
//    "user_uuid"
//];

function createTransaction(createTransactionObj, successCB, errorCB) {
    createTransactionObj.type = "transaction";
    postEntity(createTransactionObj, successCB, errorCB);
};

function readTransaction(uuid, successCB, errorCB) {
    getEntity("transaction", uuid, TRANSACTION_ATTRIBUTES, successCB, errorCB);
};

function readMultipleTransactions(attribute, value, successCB, errorCB) {
    getEntities("transaction", attribute, value, TRANSACTION_ATTRIBUTES, successCB, errorCB);
};

function updateTransaction(uuid, updateTransactionObj, successCB, errorCB) {

};

function deleteTransaction(uuid, successCB, errorCB) {
    deleteEntity("transaction", uuid, successCB, errorCB);
};
