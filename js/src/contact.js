// quick function to validate email addresses.
var valid_email = function ( email ) {
    var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return String( email ).search(filter) != -1;
}



// our function to override form submissions and send via our own
var contact_submit = function( form ) {

	// disable the submit button
	$( form ).find("input[type=submit]").attr("disabled", "disabled");;

	// store some variables with form values for validation
	// and eventual submission.
	var field = {
			name: $( form ).find( "input[name=name]" ).val(),
			email: $( form ).find( "input[name=email]" ).val(),
			phone: $( form ).find( "input[name=phone]" ).val(),
			friend_name: $( form ).find( "input[name='friend-name']" ).val(),
			friend_email: $( form ).find( "input[name='friend-email']" ).val(),
			friend_phone: $( form ).find( "input[name='friend-phone']" ).val(),
		},
		url_params = $.param( field ),
		errors = [],
		error_div = $( form ).find( ".error" );
	
	// check the names
	if ( field.name.length < 2 ) {
		errors.push( "Please provide a name." );
	}

	if ( field.friend_name.length < 2 ) {
		errors.push( "Please provide a friend's name." );
	}

	// check cu_name
	if ( !valid_email( field.email ) ) {
		errors.push( "Please provide a valid email address." );	
	}

	// check cu_name
	if ( !valid_email( field.friend_email ) ) {
		errors.push( "Please provide a valid friend's email address." );	
	}

	// if no errors
	if ( errors.length == 0 ) {

		// send form values to our PHP handler.
		$.post( "send.php", url_params, function( response ){
			
			console.log( response );

			if ( response === "success" ) {
				// if success is returned, redirect to thanks page.
				location.href = "/thanks.html";
			} else {
				// if other response, display basic error.
				error_div.html( "There was a problem submitting the form. Please call us for further assistance." ).slideDown( 400 );
			}

		});

	} else {

		// empty the error div.
		error_div.html( "" );

		// loop through our errors array
		$.each( errors, function( key, val ){
			if ( key===0 ) {
				// just dump the first record
				error_div.append( val );
			} else {
				// all subsequent ones get breaks before.
				error_div.append( "<br>"+val );
			}
		});

		// show the error div if it's hidden.
		if ( error_div.is(":hidden") ) {
			error_div.slideDown( 400 );
		}

		$( form ).find("input[type=submit]").removeAttr("disabled");

	}

	// return false just in case.
	return false;

}



// on load
$(document).ready(function(){

	// intercept form submissions, and check field values
	// before sending.
	$("form#contact").submit(function(e){

		// prevent the form from submitting normally
		e.preventDefault();

		// run our form submitter, passing in the form.
		contact_submit( this );

	});

});
