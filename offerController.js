var redeemPassword = "0";
var couponImage = "0";
var editofferuuid = "0";

$(document).ready(function() {
    // Initializes the validator.
    jQuery.validator.setDefaults({
        debug:true,
        success:"valid",
        errorElement:"label",
        errorClass: "errorLabel"
    });  

    // Defines and starts the validator for form_create_offer.
    $("#form_create_offer").validate({
        rules: {
            long_desc: {
                required:true,
                rangelength:[1, 256]
            },
            short_desc: {
                required:true,
                rangelength:[1, 40]
            },
            terms: {
                required:true,
                rangelength:[1, 256]
            },
            store_name: {
                required:true,
                rangelength:[1, 256]
            },
            store_address: {
                required:true,
                rangelength:[1, 256]
            },
            store_phone: {
                required:true,
                rangelength:[9, 15]
            },
            start_date: {
                required:true,
                date:true,
                rangelength:[1, 32]
            },
            end_date: {
                required:true,
                date:true,
                rangelength:[1, 32]
            },
            discount: {
                required:true,
                rangelength:[1, 256]
            },
            redeem_password: {
                required: true,
                rangelength:[6, 15]
            },
            redeem_password_confirmed: {
                required: true,
                rangelength:[6, 15],
                equalTo: "#form_create_offer #redeem_password"
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent().prev());
        }
    });

    $("#form_edit_offer").validate({
        rules: {
            long_desc: {
                required:true,
                rangelength:[1, 256]
            },
            short_desc: {
                required:true,
                rangelength:[1, 40]
            },
            terms: {
                required:true,
                rangelength:[1, 256]
            },
            store_name: {
                required:true,
                rangelength:[1, 256]
            },
            store_address: {
                required:true,
                rangelength:[1, 256]
            },
            store_phone: {
                required:true,
                rangelength:[9, 15]
            },
            start_date: {
                required:true,
                date:true,
                rangelength:[1, 32]
            },
            end_date: {
                required:true,
                date:true,
                rangelength:[1, 32]
            },
            discount: {
                required:true,
                rangelength:[1, 256]
            },
            redeem_password: {
                required: true,
                rangelength:[6, 15]
            },
            redeem_password_confirmed: {
                required: true,
                rangelength:[6, 15],
                equalTo: "#form_edit_offer #redeem_password"
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent().prev());
        }
    });

    //add validate here for edit offer

    $("#page_view_partner_offers").bind("pagebeforeshow", function(event) {
        loadOffers();
    });
    $("form[id='form_create_offer'] input[name='start_date']").datepick();
    $("form[id='form_create_offer'] input[name='end_date']").datepick();
    $("#popup_delete_offer").popup();
    $("form[id='form_create_offer'] input[name='coupon_image']").on('change', function(ev) {
	    var f = ev.target.files[0];
	    var fr = new FileReader();

	    fr.onload = function(ev2) {
		    //console.dir(ev2);
		    $('#form_edit_offer #edit_coupon_image_canvas').attr('src', ev2.target.result);
	    };

	    fr.readAsDataURL(f);
    });
    $("form[id='form_edit_offer'] input[name='coupon_image']").on('change', function(ev) {

        var f = ev.target.files[0];
        var fr = new FileReader();

        fr.onload = function(ev2) {
            //console.dir(ev2);
            $('#form_edit_offer #edit_coupon_image_canvas').attr('src', ev2.target.result);
        };

        fr.readAsDataURL(f);
    });
});

function createOfferClicked() {
    var validator = $("#form_create_offer").validate();

    if(validator.form()) {
        $("#button_create_offer").prop('disabled', true).addClass('ui-disabled');
        var offerObj = $("#form_create_offer").serializeObject();
        //delete offerObj.coupon_image;
        //delete offerObj.redeem_password_confirmed;

        var geofenceObj = {};
        geofenceObj.radius = offerObj.radius;
        geofenceObj.longitude = offerObj.longitude;
        geofenceObj.latitude = offerObj.latitude;
        //delete offerObj.radius;
        //delete offerObj.longitude;
        //delete offerObj.latitude;

        //tested by linfeng
        offerObj.image_data = getBase64Image($('#coupon_image_canvas').get(0));
        //do we have to teset the type of image???
        offerObj.image_type = "jpg";

        createOffer(offerObj, function (result) {
            geofenceObj.offer_uuid = result._data.uuid;
            
            createGeofence(geofenceObj, function() {
                var couponObj = {};
                couponObj.image_data = getBase64Image($('#coupon_image_canvas').get(0));
                couponObj.short_desc = offerObj.short_desc;
                couponObj.image_type = "png";
                couponObj.offer_uuid = geofenceObj.offer_uuid;
                createCoupon(couponObj, function() {
                    $.mobile.changePage("#page_view_partner_offers");
                    $("#form_create_offer").trigger("reset");
                    $("#button_create_offer").prop('disabled', false).removeClass('ui-disabled');
                },
                function() {
                    $.mobile.changePage("#page_create_offer_error");
                    $("#button_create_offer").prop('disabled', false).removeClass('ui-disabled');
                });
            },
            function() {
                $.mobile.changePage("#page_create_offer_error");
                $("#button_create_offer").prop('disabled', false).removeClass('ui-disabled');
            });
        },
        function() {
            $.mobile.changePage("#page_create_offer_error");
            $("#button_create_offer").prop('disabled', false).removeClass('ui-disabled');
        });
    }
}

function editOfferStoreClicked() {
    var validator = $("#form_edit_offer").validate();

    if(validator.form()) {
        $("#button_edit_offer").prop('disabled', true).addClass('ui-disabled');
        var offerObj = $("#form_edit_offer").serializeObject();


        offerObj.image_data = getBase64Image($('#edit_coupon_image_canvas').get(0));

        offerObj.image_type = "jpg";

        offerObj.uuid = editofferuuid;

        updateOffer(offerObj.uuid,offerObj, function (result) {
            $.mobile.changePage("#page_view_partner_offers");
            $("#button_edit_offer").prop('disabled', false).removeClass('ui-disabled');
        },
        function() {
            $.mobile.changePage("#page_edit_offer_error");
            $("#button_edit_offer").prop('disabled', false).removeClass('ui-disabled');
        });
    }
}

function loadOffers() {
    // Nested function definition for the success callback that goes to readMultipleOffers().
    function loadOffersSuccessCB(offerList) {
        $("#list_view_partner_offers").empty();

        offerList.forEach( function(offer) {
            $("#list_view_partner_offers").append(
		        "<li>"
                + "<b>" + offer.store_name + "</b>"
                + "<p><i>" + offer.short_desc + "</i></p>"
                + "<div data-role='controlgroup' data-type='horizontal'>"
                + "<a href='#' data-role='button' data-icon='eye' data-mini='true'"
                + "onclick=\x22viewOfferClicked(\x27" + offer.uuid + "\x27);\x22>View Details</a>"
                + "<a href='#' data-role='button' data-icon='delete' data-mini='true'"
                + "onclick=\x22deleteOfferClickedUnconfirmed(\x27" + offer.uuid + "\x27);\x22>Delete</a>"
                //edit button
                
                + "<a href='#' data-role='button' data-icon='edit' data-mini='true'"
                + "onclick=\x22editOfferClicked(\x27" + offer.uuid + "\x27);\x22>Edit</a>"     

                //public end tag
                + "</div></li>"
		    );
        });

        $("#list_view_partner_offers").trigger("create");
        $("#list_view_partner_offers").listview("refresh");
    }

    // Nested function definition for the error callback that goes to readMultipleOffers().
    function loadOffersErrorCB() {
        // Does nothing on this error. It should be very unlikely that this error will occur.
        // Even if the partner has no offers it will not be an error, the database will just
        // send an array of zero length.
    }

    // Reads the offers.
    readMultipleOffers("partner_uuid", PARTNER_UUID, loadOffersSuccessCB, loadOffersErrorCB);
}

function viewOfferClicked(uuid) {
    $("#div_view_offer_detail").empty();
    $("#div_view_offer_title").empty();
    $("#div_view_offer_img").empty();

    // Nested function definition for the success callback that goes to readOffer().
     readOffer(uuid, function(offer) {
        $("#div_view_offer_title").append("<center>" + offer.store_name + "</center>");

        $("#div_view_offer_img").append(
            "<center><img width='40%' height='40%' src='data:image/jpeg;base64,"+ offer.image_data +"'/></center>");

        $("#div_view_offer_detail").append(
             "<table style='padding:0px 0px'>"
            + "<col width='22px' height='15px'><col height='15px'>"
            + "<tr>"
            + "<td><a class='ui-btn ui-corner-all ui-icon-location ui-btn-icon-notext' style='padding:0;border:none;background:none;'></a></td>"
            + "<td rowspan='2'>" + offer.store_address + "</td>"
            + "</tr>"
            + "<tr><td></td></tr>"
            + "<tr>"
            + "<td><a class='ui-btn ui-corner-all ui-icon-phone ui-btn-icon-notext' style='padding:0;border:none;background:none;'></a></td>"
            + "<td rowspan='2'>" + offer.store_phone + "</td>"
            + "</tr>"
            + "<tr><td></td></tr>"
            + "<tr>"
            + "<td><a class='ui-btn ui-corner-all ui-icon-info ui-btn-icon-notext' style='padding:0;border:none;background:none;'></a></td>"
            + "<td rowspan='2'>" + offer.long_desc + "</td>"
            + "</tr>"
            + "<tr><td></td></tr>"
            + "<tr>"
            + "<td></td>"
            + "<td>" + offer.terms + "</td>"
            + "</tr>"
            + "<tr>"
            + "<td><a class='ui-btn ui-corner-all ui-icon-clock ui-btn-icon-notext' style='padding:0;border:none;background:none;'></a></td>"
            + "<td>" + offer.start_date +" - " + offer.end_date +"</td>"
            + "</tr>"
            + "</table>"
            + "<br>"
        );
        $.mobile.changePage("#page_view_offer_details");
        //$("#popup_offer_details").popup("open");
    },
    function(){
        $("#div_offer_details").append("Unable to get offer details at this time.");
        //$("#popup_offer_details").popup("open");
    });
}

function deleteOfferClicked(uuid) {
    deleteOffer(uuid, function() {
        deleteCouponsForOffer(uuid, function() {
            deleteGeofencesForOffer(uuid, function() {
                loadOffers();
            },
            function() {
                loadOffers();
            });
        },
        function() {
            loadOffers();
        });
    },
    function() {
        loadOffers();
    });

    $("#popup_delete_offer").popup("close");
}

function deleteOfferClickedUnconfirmed(uuid) {
    $("#div_delete_offer_confirm").empty();

    $("#div_delete_offer_confirm").append(
        "<p>Are you sure you want to delete this offer?</p>"
        + "<button type='button' style='background-color:#EEEEEE; border-style:solid; border-color:#CCCCCC'; "
        + "onclick=\x22deleteOfferClicked(\x27" + uuid + "\x27);\x22>Yes, delete the offer.</button>"
        + "<button type='button' style='background-color:#EEEEEE; border-style:solid; border-color:#CCCCCC'; "
        + "onclick=\x22$('#popup_delete_offer').popup('close');\x22>No, do not delete.</button>"
    );

    $("#div_delete_offer_confirm").trigger("create");

    $("#popup_delete_offer").popup("open");
}

//Code taken from MatthewCrumley
// (http://stackoverflow.com/a/934925/298479)
function getBase64Image(img) {
	// Create an empty canvas element
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;

	// Copy the image contents to the canvas
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);

	// Get the data-URL formatted image
	// Firefox supports PNG and JPEG. You could check
	// img.src to guess the
	// original format, but be aware the using "image/jpg"
	// will re-encode the image.
	var dataURL = canvas.toDataURL("image/png");

	return dataURL.replace(
			/^data:image\/(png|jpg);base64,/, "");
}

//new function for edit offer
function editOfferClicked(uuid) {
    // Nested function definition for the success callback that goes to readOffer().
    function editOfferClickedSuccessCB(offer) {
        //$("#div_offer_edit").empty();
        $("#check_coupon").empty();
        $("#check_geofence").empty();

        $("#form_edit_offer input[name*='long_desc']").val(offer.long_desc);
        $("#form_edit_offer input[name*='short_desc']").val(offer.short_desc);
        $("#form_edit_offer input[name*='terms']").val(offer.terms);
        $("#form_edit_offer input[name*='store_name']").val(offer.store_name);
        $("#form_edit_offer input[name*='store_address']").val(offer.store_address);
        $("#form_edit_offer input[name*='store_phone']").val(offer.store_phone);
        $("#form_edit_offer input[name*='start_date']").val(offer.start_date);
        $("#form_edit_offer input[name*='end_date']").val(offer.end_date);
        $("#form_edit_offer input[name*='discount']").val(offer.discount);
        $("#form_edit_offer input[name*='latitude']").val(offer.latitude);
        $("#form_edit_offer input[name*='longitude']").val(offer.longitude);
        $("#form_edit_offer input[name*='radius']").val(offer.radius);
        $("#form_edit_offer input[name*='redeem_password']").val(offer.redeem_password);
        $("#form_edit_offer input[name*='redeem_password_confirmed']").val(offer.redeem_password_confirmed);
        //picture modifed needs improving

        $("#check_geofence").append(
            "<a href='#' data-role='button' class='ui-link ui-btn ui-shadow ui-corner-all' "
            + "onclick=\x22checkGeoClicked(\x27"
            + offer.latitude + "\x27,\x27" + offer.longitude + "\x27,\x27" + offer.radius
            + "\x27);\x22>Geofence Test</a>"
        );

        $("#check_coupon").append(
            "<a href='#' data-role='button' class='ui-link ui-btn ui-shadow ui-corner-all' "
            + "onclick=\x22passwordClicked(\x27"
            + offer.uuid
            + "\x27);\x22>Coupon Test</a>"
        );

        redeemPassword = offer.redeem_password;
        couponImage = offer.image_data;
        editofferuuid = offer.uuid;
        $.mobile.changePage("#offer_edit_page");
    }

    function editOfferClickedErrorCB() {
        $.mobile.changePage("#page_view_partner_offers");
    }

    // Reads the offer.
    readOffer(uuid, editOfferClickedSuccessCB, editOfferClickedErrorCB);
}

function getCouponClicked(offerID){
    // var for baecode generator
    TimeStamp = new Date().getTime();  // system time- how many minllion seconds
    MTimeStamp = parseInt(TimeStamp/(1000 * 60)); // how many minutes
    MTimeStampString = MTimeStamp.toString();
    myOfferID = offerID;
    CouponCode = MTimeStampString.concat(myOfferID.replace(/-/g,''));
    
    readOffer(offerID, function() {
        //display coupon
        $('#div_coupon_details').append('<img src="data:image/png;base64,' + couponImage + '" height="100%" width="100%" /><br>');
        $('#div_barcode').barcode(CouponCode, "code93",{barWidth:1, barHeight:50});
        $('#div_coupon_details').append('<h3>Store code: ' + window.globalID.couponEncode.substr(0,3)
        + window.globalID.couponEncode.slice(-3) + '</h3>')

        },
        function(){
        $('#div_coupon_details').append('Unable to get coupon at this time.');

        });
    $.mobile.changePage("#page_coupon_details");
}

function passwordClicked(uuid) {
    $("#div_password").empty();

    $("#div_password").append(
                              "<p>Please have a store employee enter the password to redeem your coupon!</p>"
                              + "<label align='left'>Partner code </label>"
                              + "<input type='password' name='password' id='offer_password' value='' placeholder='password' align='left'>"
                              + "<p align='left'>Please ask the shop for the code.</p>"
                              + "<button type='button' style='background-color:#EEEEEE; border-style:solid; border-color:#CCCCCC'; "
                              + "onclick=\x22passwordCheck(\x27" + uuid + "\x27);\x22>Get Coupon</button>"
                              + "<button type='button' style='background-color:#EEEEEE; border-style:solid; border-color:#CCCCCC'; "
                              + "onclick=\x22$('#popup_password').popup('close');\x22>Close</button>"
                              + "</div>"
                              );
    $("#popup_password").popup('open');
}


function passwordCheck(uuid){
    var inputPassword = document.getElementById("offer_password").value;
    if( inputPassword == redeemPassword){
        getCouponClicked(uuid);
    }
    else{
        alert("Wrong password, please try again");
    }
}


function checkGeoClicked(latitude, longitude, input_radius){

    if(!(latitude >= -90 && latitude <=90) || !(longitude >= -180 && longitude <= 180)){
        alert("Please input valid latitude and longitude!");
    }
    else{
        $("#googlemap_button").empty();
        $("#map-canvas").empty();
        initialize(latitude, longitude, input_radius);
        $("#googlemap_button").append(
            "<button type='button' style='background-color:#EEEEEE; border-style:solid; border-color:#CCCCCC'; "
            + "onclick=\x22$('#popup_googlemap').popup('close');\x22>Close</button>"
        );
        $("#popup_googlemap").popup("open");
    }
}

function initialize(latitude, longitude, input_radius) {
    var myLatlng = new google.maps.LatLng(latitude,longitude);
    var mapOptions = {
    zoom: 17,
    center: myLatlng,
    }
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var circleOptions = {
        map:map,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        center: myLatlng,
        radius: parseInt(input_radius)
    }
    cityCircle = new google.maps.Circle(circleOptions);

    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'My location'
    });
}
