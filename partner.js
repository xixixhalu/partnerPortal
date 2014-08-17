
var PARTNER_ATTRIBUTES = [
    "uuid",
    "created",
    "username",
    "password",
    "account_type"
];

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

function partnerLogin(loginObj, successCB, errorCB) {
    doPartnerLogin(loginObj, successCB, errorCB);
}

function createPartner(createPartnerObj, successCB, errorCB) {
    postNewPartner(createPartnerObj, successCB, errorCB);
}

