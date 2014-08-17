
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
                equalTo: "#redeem_password"
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent().prev());
        }
    });

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
		    $('#coupon_image_canvas').attr('src', ev2.target.result);
	    };

	    fr.readAsDataURL(f);
    });
});

function createOfferClicked() {
    var validator = $("#form_create_offer").validate();

    if(validator.form()) {
        $("#button_create_offer").prop('disabled', true).addClass('ui-disabled');
        var offerObj = $("#form_create_offer").serializeObject();
        delete offerObj.coupon_image;
        delete offerObj.redeem_password_confirmed;

        var geofenceObj = {};
        geofenceObj.radius = offerObj.radius;
        geofenceObj.longitude = offerObj.longitude;
        geofenceObj.latitude = offerObj.latitude;
        delete offerObj.radius;
        delete offerObj.longitude;
        delete offerObj.latitude;

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
    // Nested function definition for the success callback that goes to readOffer().
    function viewOfferClickedSuccessCB(offer) {
        $("#div_view_offer_detail").empty();

        $("#div_view_offer_detail").append(
	        "<h1><center>"
            + offer.store_name
            + "</center></h1>"
            + "<br><br><b>Short Description:</b><br>"
	        + offer.short_desc
	        + "<br><br><b>Long Description:</b><br>"
	        + offer.long_desc
	        + "<br><br><b>Terms and Conditions:</b><br>"
	        + offer.terms
	        + "<br><br><b>Address:</b><br>"
	        + offer.store_address
	        + "<br><br><b>Phone Number:</b><br>"
	        + offer.store_phone
	        + "<br><br><b>Offer Start Date:</b><br>"
	        + offer.start_date
	        + "<br><br><b>Offer End Date:</b><br>"
	        + offer.end_date
	        + "<br><br><b>Discount:</b><br>"
	        + offer.discount
            + "<br><br></div>"
        );

        $.mobile.changePage("#page_view_offer_details");
    }

    // Nested function definition for the error callback that goes to readOffer().
    function viewOfferClickedErrorCB() {
        $.mobile.changePage("#page_view_partner_offers");
    }

    // Reads the offer.
    readOffer(uuid, viewOfferClickedSuccessCB, viewOfferClickedErrorCB);
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
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	// Get the data-URL formatted image
	// Firefox supports PNG and JPEG. You could check
	// img.src to guess the
	// original format, but be aware the using "image/jpg"
	// will re-encode the image.
	var dataURL = canvas.toDataURL("image/png");

	return dataURL.replace(
			/^data:image\/(png|jpg);base64,/, "");
}

/*
function gRead() {
    function gReadSuccessCB(coupon) {
        // Displays success message.
        $("#div_read_coupon").empty();
        $("#div_read_coupon").append(
	        "<b>UUID: </b>" + coupon.uuid + "<br>"
            + "<b>ImageType: </b>" + coupon.imageType + "<br>"
            + "<b>Description: </b>" + coupon.description + "<br>"
            + "<b>Place UUID: </b>" + coupon.place_uuid + "<br>"
            + "<img src='data:image/png;base64,"
            + coupon.imageData + "'/>"
	    );

        // Clears the input field.
        $("#input_uuid_for_read").val("");
    }

    function gReadErrorCB() {
        // Displays failure message.
        $("#div_read_coupon").empty();
        $("#div_read_coupon").append(
            "Failed to read the coupon."
        );
    }

    var uuid = $("#input_uuid_for_read").val();
    readCoupon(uuid, gReadSuccessCB, gReadErrorCB);
}
*/

