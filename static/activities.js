

function ClearActivityTable() {
    
    // Clear the "New Activity" table

    $( '#ActivityForm' ).each(function(){
	this.reset();
    });
}


$(document).ready(function() {
    console.log("Document Ready");
});


$(document).ready(function() {
    $('#SubmitActivity').live('click', function() {
	
	console.log("SubmitActivity() - Begin");
	
	// Get the html form by id,
	// serialize it, 
	// and send it to python
	// using jquery/ajax

	var ActivityForm = $('#ActivityForm');
	var ActivityArray = ActivityForm.serializeArray();

	// Create a javascript dict object out
	// of that encoded dict
	var ActivityJSON = {};
	for (i in ActivityArray) {
	    ActivityJSON[ActivityArray[i].name] = ActivityArray[i].value
	}
	console.log( JSON.stringify(ActivityJSON) );
	ActivityJSON = JSON.stringify( ActivityJSON );

	// Create a call-back function
	// for debugging and logging
	function successCallback(data) {
	    if( data["success"]=="error" ) {
		console.log("ERROR: Failed to add Activity");
	    }
	    else {
		console.log("Successfully added Activity");
		ClearActivityTable();
		RefreshActivityList();
	    }
	}
	
	// Submit the AJAX query
	$.post( "/SubmitActivity", {activity : ActivityJSON}, successCallback );
	//$.getJSON( "/SubmitActivity", {activity : ActivityJSON}, successCallback );

	console.log("SubmitActivity() - Submittted Activity AJAX request");

	return false;
	
    });

});


function RefreshActivityList() {

    // Send an AJAX request to the server,
    // get the html representing the list of
    // activities, and insert that into the
    // div: 'activity_list'


    // Define the callback function
    // This clears and repopulates the list
    function addActivitiesToHTML(data) {
	if( data["success"]=="error" ) {
	    console.log("ERROR: Failed to Refresh Activities");
	}
	else {
	    var activity_list_html = data["html"];
	    $("#activity_list").html( activity_list_html );
	    console.log("Successfully refreshed Activity List");
	}
	return false
    }

    // Make the AJAX request
    // Get the value of the number of activities select
    $.post( "/RefreshActivityList", 
	    {num_activities : $("#num_activities").val()}, 
	    addActivitiesToHTML );

}


$(document).ready(function() {
    $('#RefreshActivityList').live('click', RefreshActivityList);
});