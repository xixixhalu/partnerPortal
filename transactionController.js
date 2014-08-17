//Bowen: adding transaction controller
$(document).ready(function() {

    $("#page_view_trans").bind("pagebeforeshow", function(event) {
        loadTransactions();
    });
});


function loadTransactions() {
    $("#list_view_trans").empty();
    $("#list_view_trans").append("<div>Loading Transactions...</div>");
    function viewTransSuccessCB(transList) {
      
        var offerUUIDs = new Object;
        transList.forEach ( function(trans){
            offerUUIDs[trans.offer_uuid] = true;
        });
        
        var str = "";
        for(var k in offerUUIDs)
        {
            if(offerUUIDs.hasOwnProperty(k))
                str += " or uuid=" + k;
        }
        
        function loadOfferInfoSuccessCB(offerList) {
            $("#list_view_trans").empty();
            transList.forEach( function(trans) {
                offerList.forEach( function(offer) {
                    if(trans.offer_uuid == offer.uuid)
                    { 
                        $("#list_view_trans").append(
                            "<li>"
                            + "<b>Amount:</b> "
                            + trans.amount + "<br>"
                            + "<b>Date:</b> "
                            + new Date(trans.created).toLocaleString() + "<br>"
                            + "<b>Store Name:</b> "
                            + offer.store_name + "<br>"
                            + "<b>Store Address:</b> "
                            + offer.store_address  + "<br>"
                            + "<b>Coupon Code:</b> "
                            + trans.coupon_code + "<br>"
                            + "<b>Status:</b> "
                            + trans.status + "<br>"
                            + "</li>"
                        ).listview("refresh"); 
                        return;
                    }
                    
                });
            });  
        }
        
        function loadOfferInfoErrorCB() {
        }
        
        var query = "select * where " + str.substring(4) + " order by created desc";
        readSpecifiedOffers(query,
                               loadOfferInfoSuccessCB,
                               loadOfferInfoErrorCB);
    }
    
    function viewTransErrorCB() {
        // TODO: Deal with this error.
    }
    
    readMultipleTransactions("partner_uuid", PARTNER_UUID, viewTransSuccessCB, viewTransErrorCB);
}

//End of adding transaction controller