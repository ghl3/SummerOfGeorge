

$(document).ready(function() {

    console.log("DocumentReady");

    // Map the "SubmitActivity" button
    // to this Javascript function
    $('#SubmitActivity').live('click', function() {
	
	console.log("SubmitActivity() - Begin");
	
	// Get the html form by id,
	// serialize it, 
	// and send it to python
	// using jquery/ajax

	var ActivityForm = $('#ActivityForm');
	
	// var ActivityJSON = ActivityForm.serialize();

	// Make an (oddly) encoded dictionary out
	// of the FORM
	//var ActivityArrayString = JSON.stringify(ActivityForm.serializeArray());
	var ActivityArray = ActivityForm.serializeArray();

	// Create a javascript dict object out
	// of that encoded dict
	var ActivityJSON = {};
	for (i in ActivityArray) {
	    console.log( ActivityArray[i] );
	    ActivityJSON[ActivityArray[i].name] = ActivityArray[i].value
	}
	console.log( JSON.stringify(ActivityJSON) );
	ActivityJSON = JSON.stringify( ActivityJSON );
	


	//var ActivityJSON = $('#ActivityForm').serialize();

	//var ActivityJSON = $('#ActivityForm').serializeArray();
	//var ActivityJSON = JSON.stringify( $('#ActivityForm').serializeArray() );

	console.log("SubmitActivity() - About to submit activity:");
	console.log( ActivityJSON );

	// Create a call-back function
	// for debugging and logging
	function successCallback(success) {
	    if( success["result"]=="error" ) {
		console.log("ERROR: Failed to add Activity");
	    }
	    else {
		console.log("Successfully added Activity");
	    }
	}
	
	// Submit the AJAX query
	//$.getJSON( "/SubmitActivity", {activity : ActivityJSON}, successCallback );
	$.post( "/SubmitActivity", {activity : ActivityJSON}, successCallback );

	console.log("SubmitActivity() - Submittted Activity AJAX request");

	// Done!
	return false;
	
    });

});
 
/*


}

*/