$(document).ready(function() {
    // Initializes the validator.
    jQuery.validator.setDefaults({
        debug:true,
        success:"valid",
        errorElement:"label",
        errorClass: "errorLabel"
    });  

});


function generateBillClicked() {

	function generateMonthlyBillsSuccessCB(partnerList) {
       
	   
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
	   
	   $("#div_view_generate_bill").empty();
		if(partnerList == "")
		{
			$("#div_view_generate_bill").append("<b>There are no partners to generate bills for");
		}
		
		
        partnerList.forEach( function(partner) {
			
			partner_uuid = partner.partner_uuid;
			
			var date = new Date();
			var month = date.getMonth();
			var year = date.getFullYear();
			var month_int = parseInt(month);
			var year_int = parseInt(year);
			
			
			$("#div_view_generate_bill").append("Generating bill for - " + partner.username + " for " + month_array[month_int] + ", " + year_int + "<br>");
			
			//Generate bill for partner
			generatePartnerBill(partner_uuid, month_int, year_int);
			
			$("#div_view_generate_bill").append("Bill generated for - " + partner.username + " for  " + month_array[month_int] + ", " + year_int + "<br>");
        });
		
		}
	
	
	
	function loadMonthlyBillsErrorCB() {
        // Does nothing on this error. It should be very unlikely that this error will occur.
        // Even if the partner has no offers it will not be an error, the database will just
        // send an array of zero length.
    }
	
	console.log("Alright! Ready to go... ");
	doGuestLogin();
	var query = "select *";
	generateMonthlyBill(query, generateMonthlyBillsSuccessCB, loadMonthlyBillsErrorCB);
		
		
}

function generatePartnerBill(partner_uuid, month, year)
{
	
    // Nested function definition for the success callback that goes to readMultipleOffers().
    function generateBillsSuccessCB(transactionList) {
        var month_array = new Array();
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
		month_array[12] = "December";

		if(transactionList == "")
		{
			$("#div_view_generate_bill").append("<b>There are no transactions for partner - " + partner_uuid + " in " + month_array[month] + ", " + year + "</b>");
			return;
		}
		
		var total_amount = 0;
		transactionList.forEach( function(transaction) {
		total_amount = total_amount + transaction.amount ;
				});
		
		var billObj = {};
		
		billObj.partner_uuid = partner_uuid;
		billObj.month = month;
		billObj.year = year;
		billObj.bill_paid = 0;
		billObj.total_amount = total_amount;
		
		function billCreateSuccessCB()
		{
		}
		
		function billCreateErrorCB()
		{}
		
		console.log("Inserting bill now");
		createBill(billObj, billCreateSuccessCB, billCreateErrorCB);
		
    }

    // Nested function definition for the error callback that goes to readMultipleOffers().
    function generateBillsErrorCB() {
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
		query = "select * where partner_uuid = " + partner_uuid + " and  created >= " + Date.parse(year + '-' + parseInt(month_int+1) + '-1')
				+ " and created <" + Date.parse(year + '-' + parseInt(month_int + 2) + '-1') + 
				" order by created desc";
	}
	else
	{
	query = "select * where partner_uuid = " + partner_uuid + " and  created >= " + Date.parse(year + '-' + month + '-1')
				+ " and created <" + Date.parse(year + '-' + parseInt(month_int+1) + '-1') + 
				" order by created desc";
	}
	
	//$("#list_view_bills").append(parseInt(month_int+1) + "<br> " + year + "<br>" + query);			
	readMonthlyTransactions(query, generateBillsSuccessCB, generateBillsErrorCB);
	
}