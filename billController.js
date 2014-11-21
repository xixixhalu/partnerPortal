$(document).ready(function() {
    // Initializes the validator.
    jQuery.validator.setDefaults({
        debug:true,
        success:"valid",
        errorElement:"label",
        errorClass: "errorLabel"
    });  

    // Defines and starts the validator for form_view_bill.
    $("#form_view_bill").validate({
        rules: {
            from_date: {
                required:true,
                date:true,
                rangelength:[1, 32]
            },
            to_date: {
                required:true,
                date:true,
                rangelength:[1, 32]
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent().prev());
        }
    });

    $("#page_view_bills").bind("pagebeforeshow", function(event) {
        // Reads current month bill
		if(MONTH == -1 && YEAR == -1)
		{
			date = new Date();
			MONTH = date.getMonth();
			YEAR = date.getFullYear();
		}
		
		loadMonthlyBill(MONTH, YEAR);
		loadCurrentMonthBillsFromTransaction(MONTH, YEAR);
    });
    $("form[id='form_view_bill'] input[name='from_date']").datepick();
    $("form[id='form_view_bill'] input[name='to_date']").datepick();
});

function loadCurrentMonthBillsFromTransaction(month, year) {

	var month_array = new Array();
		month_array[0] = "December";
		month_array[1] = "January";
		month_array[2] = "February";
		month_array[3] = "March";
		month_array[4] = "April";
		month_array[5] = "May";
		month_array[6] = "June";
		month_array[7] = "July";
		month_array[8] = "August";
		month_array[9] = "September";
		month_array[10] = "October";
		month_array[11] = "November";
		
	
    // Nested function definition for the success callback that goes to readMultipleOffers().
    function loadBillsSuccessCB(billList) {
        $("#list_view_bills").empty();
		var amount = 0;
		billList.forEach( function(bill) {
		amount = amount + bill.amount ;
				});
				
		$("#table_view_month_bill").empty();
		if(billList == "")
		{
			$("#list_view_bills").append("");
		}		
		else
		{
		$("#table_view_month_bill").append("<caption>Your transactions for " + month_array[month] + ", " + year +" </caption>");
		$("#table_view_month_bill").append(
		        "<tr>"
                + "<th>Store Name </th>"
                + "<th>Address</th>"
				+ "<th>Amount Due</th>"
				+ "<th>Timestamp</th>"
				+ "</tr>"
		    );
        }
		billList.forEach( function(bill) {
            //$("#list_view_bills").append(
		        //"<li>"
                //+ "Store Name: <b>" + bill.store_name + "</b>"
                //+ "<p><i>" + "Address: " + bill.store_address + "</i></p>"
				//+ "<p>" + "Amount Due: $"+bill.amount + "</p>"
				//+ "<p>" + "Date: " + new Date(bill.created).toLocaleString() + "</p>"
				//+ "</li>"
		    //);
			
			$("#table_view_month_bill").append(
		        "<tr>"
                + "<td>" + bill.store_name + "</td>"
                + "<td>" + bill.store_address + "</td>"
				+ "<td>$"+bill.amount + "</td>"
				+ "<td>" + new Date(bill.created).toLocaleString() + "</td>"
				+ "</tr>"
		    );
        });
    }

    // Nested function definition for the error callback that goes to readMultipleOffers().
    function loadBillsErrorCB() {
        // Does nothing on this error. It should be very unlikely that this error will occur.
        // Even if the partner has no offers it will not be an error, the database will just
        // send an array of zero length.
    }

    // Reads all the transactions from the transaction collection
    // This method is available in transaction.js file
	month_int = parseInt(month);
	var query = "";
	if(month_int == 0)
	{
		query = "select * where partner_uuid = " + PARTNER_UUID + " and  created >= " + Date.parse(year + '-' + parseInt(month_int+1) + '-1')
				+ " and created <" + Date.parse(year + '-' + parseInt(month_int + 2) + '-1') + 
				" order by created desc";
	}
	else
	{
	query = "select * where partner_uuid = " + PARTNER_UUID + " and  created >= " + Date.parse(year + '-' + month + '-1')
				+ " and created <" + Date.parse(year + '-' + parseInt(month_int+1) + '-1') + 
				" order by created desc";
	}			
	//$("#list_view_bills").append(parseInt(month_int+1) + "<br> " + year + "<br>" + query);			
	readMonthlyTransactions(query, loadBillsSuccessCB, loadBillsErrorCB);
}

function loadMonthlyBill(month, year) {
    // Nested function definition for the success callback that goes to readMultipleOffers().
    function loadMonthlyBillsSuccessCB(billList) {
       
		var month_array = new Array();
		month_array[0] = "December";
		month_array[1] = "January";
		month_array[2] = "February";
		month_array[3] = "March";
		month_array[4] = "April";
		month_array[5] = "May";
		month_array[6] = "June";
		month_array[7] = "July";
		month_array[8] = "August";
		month_array[9] = "September";
		month_array[10] = "October";
		month_array[11] = "November";

		$("#div_view_month_bill").empty();
		if(billList == "")
		{
			$("#div_view_month_bill").append("<b>There are no bills for " + month_array[month] + ", " + year + "</b>");
		}
		
		
        billList.forEach( function(bill) {
			
			if(bill.bill_paid == 1)
			{
			$("#div_view_month_bill").append("Your bill for " + month_array[month] + ", " + year + " is fully paid");
			return;
			}
			
			$("#div_view_month_bill").append("Your total balance for<b> " + month_array[bill.month] +"</b> is $" + bill.total_amount +
			"<form id=" + "\"checkout\" " + "onclick= window.close()" + "target=" + "\"paypal\" " + "action=" + "\"https://www.sandbox.paypal.com/cgi-bin/webscr\"" + " method=" + "\"post\"" + ">"
							//+ "<input type=" + "\"image\"" + "src=" + "\"http://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif\""  + "border=" + "\"0\"" + "name=" + "\"submit\"" + "alt=" + "\"Make payments with PayPal - it\'s fast, free and secure!\"" + ">"
							+ "<input type=" + "\"image\"" + "src=" + "\"btn_paynow_LG.gif\""  + "border=" + "\"0\"" + "name=" + "\"submit\"" + "alt=" + "\"Make payments with PayPal - it\'s fast, free and secure!\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"mustafakhimani@gmail.com\"" + "name=" + "\"business\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"Partner Portal Payment\"" + "name=" + "\"item_name\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value='" + bill.total_amount + "' name=" + "\"amount\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"0\"" + "name=" + "\"tax\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"USD\"" + "name=" + "\"currency_code\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"first_name\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"last_name\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"email\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"address1\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"\"" + "name=" + "\"city\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"US\"" + "name=" + "\"country\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"0\"" + "name=" + "\"address_override\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"http://cs-server.usc.edu:38069/updateBill.html?id=" + bill.uuid + "&pid=" + PARTNER_UUID + "&month=" + month + "&year=" + year + "\"" + "name=" + "\"return\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "partner.html#page_view_bills?pid=" + PARTNER_UUID + "&month=" + month + "&year=" + year + "name=" + "\"cancel_return\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"uniqu56\"" + "name=" + "\"invoice\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"sale\"" + "name=" + "\"paymentaction\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"_xclick\"" + "name=" + "\"cmd\"" + ">"
							+ "<input type=" + "\"hidden\"" + "value=" + "\"utf-8\"" + "name=" + "\"charset\"" + ">"
							+ "</form>"
							
			);
        });
    }

    // Nested function definition for the error callback that goes to readMultipleOffers().
    function loadMonthlyBillsErrorCB() {
        // Does nothing on this error. It should be very unlikely that this error will occur.
        // Even if the partner has no offers it will not be an error, the database will just
        // send an array of zero length.
    }

    var query = "select * where partner_uuid = " + PARTNER_UUID + " and month = " + month + " and year =  " + year + " order by created desc";
	//$("#div_view_month_bill").append(query);
	readMonthlyBill(query, loadMonthlyBillsSuccessCB, loadMonthlyBillsErrorCB);
}

function viewBillClicked() {

        var billObj = $("#form_view_bill_monthly").serializeObject();
        month = billObj.month;
        year = billObj.year;
		console.log(month); 
		console.log(year);
        if(month != "" && year != "")
		{
			loadCurrentMonthBillsFromTransaction(billObj.month, billObj.year);
			loadMonthlyBill(month, year);
		}
		else
		{
			$("#div_view_month_bill").empty();
			$("#div_view_month_bill").append("<b>Please input correct month and year</b>");
		
		}
		
		
}

function updateBill(id,pid,month,year)
{
	PARTNER_UUID = pid;
	function updateBillSuccessCB(){
		//$("#m").append("Done!");
		//console.log('Calsfsfasling = http://cs-server.usc.edu:38069/partner.html#page_view_bills');
		//$( "#m" ).load( "partner.html #page_view_bills" );
		//window.opener.location.reload();
		
		console.log(PARTNER_UUID);
		//window.opener.location.href = window.opener.location.href;
		window.location.replace("partner.html#page_view_bills?pid=" + PARTNER_UUID + "&month=" + month + "&year=" + year);
	}
	
	function updateBillErrorCB() {
		$("#m").append("Failed!");
		
	}
	var data = {'type':'bill',
			'uuid':id,
			'bill_paid':1
	};
	
	//$("#m").append(data.uuid);
	updatePaidBill(data, updateBillSuccessCB, updateBillErrorCB);
}
