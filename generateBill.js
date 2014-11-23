var PARTNER_DETAIL_ATTRIBUTES = [
    "uuid",
    "created",
    "partner_uuid",
    "username",
    "email",
    "company_name",
    "phone",
    "address"
];


function generateMonthlyBill(query, successCB, errorCB) {
	getSpecifiedEntities("partner_detail", query, PARTNER_DETAIL_ATTRIBUTES, successCB, errorCB);
}

function createBill(createBillObj, successCB, errorCB)
{
	createBillObj.type = "bill";
	postEntity(createBillObj, successCB, errorCB);
}