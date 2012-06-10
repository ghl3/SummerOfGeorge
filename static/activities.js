


$(document).ready(function() {

    // Map the "SubmitActivity" button
    // to this Javascript function
    $('.SubmitActivity').live('click', function() {
	function SubmitActivity() {

	    // Get the html form by id,
	    // serialize it, 
	    // and send it to python
	    // using jquery/ajax
	    var ActivityJSON = $('#ActivityForm').serialize();

	    // Create a call-back function
	    // for debugging and logging
	    function successCallback(success) {
		if( success["result"]=="error" ) {
		    app.logger.error("Failed to add Activity");
		}
		else {
		    app.logger.debug("Successfully added Activity");
		}
	    };

	    // Submit the AJAX query
	    $.getJSON( "/SubmitActivity", ActivityJSON, successCallback(data) );

	    // Done!
	    return false;

	}
    });

}

