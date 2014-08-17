
var COUPON_ATTRIBUTES = [
    "uuid",
    "created",
    "offer_uuid",
    "image_type",
    "image_data",
    "short_desc"
];

function createCoupon(createCouponObj, successCB, errorCB) {
    createCouponObj.type = "coupon";
    postEntity(createCouponObj, successCB, errorCB);
}

function readCoupon(uuid, successCB, errorCB) {
    getEntity("coupon", uuid, COUPON_ATTRIBUTES, successCB, errorCB);
}

function readMultipleCoupons(attribute, value, successCB, errorCB) {
    getEntities("coupon", attribute, value, COUPON_ATTRIBUTES, successCB, errorCB);
}

function deleteCoupon(uuid, successCB, errorCB) {
    deleteEntity("coupon", uuid, successCB, errorCB);
}

function deleteCouponsForOffer(uuid, successCB, errorCB) {
    deleteEntities("coupon", "offer_uuid", uuid, successCB, errorCB);
}

//Bowen: Legacy
//function readCouponOfferUUID(query, successCB, errorCB) {
//    getSpecifiedEntities("coupon", query, ["uuid", "offer_uuid"], successCB, errorCB);
//};
