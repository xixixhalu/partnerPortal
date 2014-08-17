
var USERNAME_EXISTS = false;

$(document).ready(function() {
    // Initializes the validator.
    jQuery.validator.setDefaults({
        debug:true,
        success:"valid",
        errorElement:"label",
        errorClass: "errorLabel"
    });

    // Binds a function to the username field of form_create_partner.
    // When focus leaves the username field, this checks the database to see
    // if the username is already in use.
    $("form[id='form_create_partner'] input[name='username']").bind ("blur", function (event) {
        checkUsername($("form[id='form_create_partner'] input[name='username']").val(), function(exists) {
            if (exists) {
                USERNAME_EXISTS = true;
                $("form[id='form_create_partner'] input[name='username']").valid();
            }
            else {
                USERNAME_EXISTS = false;
                $("form[id='form_create_partner'] input[name='username']").valid();
            }
        });
    });

    // Resets the global variable that keeps track of if the username is in use
    // (when the username field gets focus) so that when a new username is typed
    // the error message dissapears.
    $("form[id='form_create_partner'] input[name='username']").bind ("focus", function (event) {
        USERNAME_EXISTS = false;
    });

    // Adds a custom validator to check if the username exists in the database.
    jQuery.validator.addMethod("checkUsername", function(value, element) {
        return !USERNAME_EXISTS;
    }, "This username is already in use. Please choose another.");

    // Adds a custom validator to reject entries with spaces.
    jQuery.validator.addMethod("noSpace", function(value, element) { 
        return value.indexOf(" ") < 0 && value != ""; 
    }, "Spaces are not allowed in this field.");    

    // Defines and starts the validator for form_create_partner.
    $("#form_create_partner").validate({
        rules: {
            username: {
                required:true,
                rangelength:[6, 30],
                noSpace:true,
                checkUsername:true
            },
            password: {
                required:true,
                rangelength:[6, 30],
                noSpace:true
            },
            company_name: {
                required:true,
                rangelength:[3,100]
            },
            phone: {
                required:true,
                rangelength:[9, 15]
            },
            email: {
                required:true,
                email:true
            },
            address: {
                required:true,
                rangelength:[6, 100]
            }
        },
        messages: {
            email: {
                email:"Email must be in the form of name@domain.com"
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent().prev());
        }
    });
});

// partnerLoginClicked - when the login button is clicked, gets the info
// from the form and uses it to log in.
function partnerLoginClicked() {
    var loginData = $("#form_partner_login").serializeObject();
    partnerLogin(loginData, partnerLoginSuccessCB, partnerLoginErrorCB);
}

// createPartnerClicked - when the create partner button is clicked, gets the
// info from the form and performs one last validation, then creates the partner if
// the form is valid.
function createPartnerClicked() {
    var validator = $("#form_create_partner").validate();

    if(validator.form()) {
        var createPartnerData = $("#form_create_partner").serializeObject();
        postNewPartner(createPartnerData, createPartnerSuccessCB, createPartnerErrorCB);
    }
}

// partnerLogout - logs the partner out.
function partnerLogout() {
    doLogout();
    $.mobile.changePage("#page_partner_start");
}

// partnerLoginSuccessCB - a callback for use with partnerLogin.
function partnerLoginSuccessCB() {
    $.mobile.changePage("#page_partner_home");
    $("#form_partner_login").trigger("reset");
}

// partnerLoginErrorCB - a callback for use with partnerLogin.
function partnerLoginErrorCB() {
    $.mobile.changePage("#page_partner_login_error");
    $("#form_partner_login").trigger("reset");
}

// createPartnerSuccessCB - a callback for use with postNewPartner.
function createPartnerSuccessCB() {
    $.mobile.changePage("#page_create_partner_success");
    $("#form_create_partner").trigger("reset");
}

// createPartnerErrorCB - a callback for use with postNewPartner.
function createPartnerErrorCB() {
    $.mobile.changePage("#page_create_partner_error");
}

