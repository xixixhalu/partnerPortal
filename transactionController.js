//Bowen: adding transaction controller
$(document).ready(function() {

    $("#page_view_trans").bind("pagebeforeshow", function(event) {
        loadTransactions();
    });
});


function loadTransactions() {
    $("#list_view_trans").empty();
    $("#list_view_trans").append("<div>Loading Transactions...</div>");
	var amount = 0;
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
						amount = amount + trans.amount;
                    }
                    
                });
            });
				
				$("#list_view_trans").append("Your total balance is $" + amount);
				$("#list_view_trans").append("<form id=" + "\"checkout\" " + "target=" + "\"paypal\" " + "action=" + "\"https://www.sandbox.paypal.com/cgi-bin/webscr\"" + " method=" + "\"post\"" + ">"
							+ "<input type=" + "\"image\"" + "src=" + "\"http://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif\""  + "border=" + "\"0\"" + "name=" + "\"submit\"" + "alt=" + "\"Make payments with PayPal - it\'s fast, free and secure!\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"mustafakhimani@gmail.com\"" + "name=" + "\"business\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"Partner Portal Payment\"" + "name=" + "\"item_name\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value='" + amount + "' name=" + "\"amount\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"0\"" + "name=" + "\"tax\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"USD\"" + "name=" + "\"currency_code\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"first_name\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"last_name\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"email\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"address1\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"city\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"US\"" + "name=" + "\"country\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"0\"" + "name=" + "\"address_override\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"https://www.google.com/?gws_rd=ssl\"" + "name=" + "\"return\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"https://www.yahoo.com/\"" + "name=" + "\"cancel_return\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"uniqu56\"" + "name=" + "\"invoice\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"sale\"" + "name=" + "\"paymentaction\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"_xclick\"" + "name=" + "\"cmd\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"utf-8\"" + "name=" + "\"charset\"" + ">"
							+ "</form>");
				
					
            transList.forEach( function(trans) {
                offerList.forEach( function(offer) {
                    if(trans.offer_uuid == offer.uuid)
                    { 
                        $("#list_view_trans").append(
                            "<li>"
                            + "<b>Amount:</b> "
                            + "$" + trans.amount + "<br>"
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
							//+
							//"<form action="+ "'https://www.paypal.com/cgi-bin/webscr'" + "method=" + "'post'" + "target="+"'_top'" +">"
								//+ "<input type=" + "'hidden'" + "name=" + "'cmd'" + "value=" + "'_s-xclick'" + ">"
								//+ "<input type=" + "'hidden'" + "name=" + "'hosted_button_id'" + "value=" + "'8HYHVGP3TMNW4'" + ">"
								//+ "<input type=" + "'image'"  + "src=" + "'https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif'" + "border=" + "'0'" + "name=" + "'submit'" + "alt=" + "'PayPal - The safer, easier way to pay online!'" + ">"
								//+ "<img alt="+ "''" + "border=" + "'0'" + "src=" + "'https://www.paypalobjects.com/en_US/i/scr/pixel.gif'" +  "width=" + "'1'" + "height=" + "'1'" + ">"
								//+ "</form>"
							//+
							//"<form id=" + "\"checkout\" " + "target=" + "\"paypal\" " + "action=" + "\"https://www.sandbox.paypal.com/cgi-bin/webscr\"" + " method=" + "\"post\"" + ">"
							//+ "<input type=" + "\"image\"" + "src=" + "\"http://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif\""  + "border=" + "\"0\"" + "name=" + "\"submit\"" + "alt=" + "\"Make payments with PayPal - it\'s fast, free and secure!\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"mustafakhimani@gmail.com\"" + "name=" + "\"business\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"Partner Portal Payment\"" + "name=" + "\"item_name\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value='" + 0.1 + "' name=" + "\"amount\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"0\"" + "name=" + "\"tax\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"USD\"" + "name=" + "\"currency_code\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"first_name\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"last_name\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"email\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"address1\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"city\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"US\"" + "name=" + "\"country\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"0\"" + "name=" + "\"address_override\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"https://www.google.com/?gws_rd=ssl\"" + "name=" + "\"return\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"https://www.yahoo.com/\"" + "name=" + "\"cancel_return\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"uniqu56\"" + "name=" + "\"invoice\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"sale\"" + "name=" + "\"paymentaction\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"_xclick\"" + "name=" + "\"cmd\"" + ">"
							//+ "<input type=" + "\"hidden\"" + "value=" + "\"utf-8\"" + "name=" + "\"charset\"" + ">"
							//+ "</form>"
								
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