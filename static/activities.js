
$(document).ready(function() {
    console.log("Document Ready");
});


// NEW ACTIVITIES

$(document).ready(function() {
    // Upon loading, we hide the "ActivityForm"
    // and show the button to create the form.
    $("#NewActivityDiv").hide();
});

$(document).ready(function() {
    // Set the new activity / cancel buttons
    // They toggle the "ActivityForm", and
    // canceling also clears it
    $('#AddNewActivity').live('click', ShowAddNewActivity );
    $('#CancelNewActivity').live('click', function(){
	HideAddNewActivity();
	ClearActivityTable();
    });
});

function ShowAddNewActivity() {
    $("#AddNewActivity").hide();
    $("#NewActivityDiv").show();
}
function HideAddNewActivity() {
    $("#AddNewActivity").show();
    $("#NewActivityDiv").hide();
}

function ClearActivityTable() {
    // Clear the "New Activity" table
    $( '#ActivityForm' ).each(function(){
	this.reset();
    });
}

// SUBMIT ACTIVITY

function UpdateDatabaseFromForm( form ) {

    var ActivityArray = form.serializeArray();

    // Create a javascript dict object out
    // of that encoded dict
    var ActivityJSON = {};
    for (i in ActivityArray) {
	ActivityJSON[ActivityArray[i].name] = ActivityArray[i].value
    }

    console.log("Submitting activity to database:");
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

}



$(document).ready(function() {
    $('#SubmitActivity').live('click', function() {
	
	console.log("SubmitActivity() - Begin");
	
	// Get the html form by id,
	// serialize it, 
	// and send it to python
	// using jquery/ajax

	var ActivityForm = $('#ActivityForm');
	UpdateDatabaseFromForm( ActivityForm );
	HideAddNewActivity();
	return false;

	/*
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
	*/
    });

});


// BUILD/REFRESH ACTIVITIES

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
	    $(".edit_activity_button").show();
	    $(".update_activity_button").hide();
	    console.log("Successfully Updated hidden attributes");
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


// EDIT ACTIVITIES

function EditActivity() {
    // Turn an html table into an editable FORM

    var fieldset = $(this).parent();
    var form = fieldset.parent();
    
    console.log( $(this).attr("id") );
    console.log( form.attr("id") );

    // Set all the children readonly to false
    fieldset.children().map(function() {
	var child = $(this);

	// Ignore buttons
	if (child.is(":button")) return;

	// Get the input with type==text
	// and turn off readonly
	if (child.is(":input")) {
	    if( child.attr("type") != "text" ) return;
	    this.removeAttribute("readonly",0);
	}
	return null;
    });

    // Hide the 'edit' button
    fieldset.children(".edit_activity_button").hide();
    fieldset.children(".update_activity_button").show();


    return false;
}

function UpdateActivity() {


    var fieldset = $(this).parent();
    var form = fieldset.parent();
    
    // Come up with a smart way to cancel
    // Probably have to clone the form, and
    // possibly store that clone in a dictionary
    // Updating or Canceling delete the entry from that
    // dictionary, and Canceling restores it before deleting it...
    // var old_form = form.clone();

    console.log( $(this).attr("id") );
    console.log( form.attr("id") );

    UpdateDatabaseFromForm( form );

    // Hide the 'edit' button
    fieldset.children(".edit_activity_button").show();
    fieldset.children(".update_activity_button").hide();
    fieldset.children(".cancel_activity_button").hide();

    return false;

}


$(document).ready(function() {
    $('.edit_activity_button').live('click', EditActivity);
});


$(document).ready(function() {
    $('.update_activity_button').hide();
    $('.cancel_activity_button').hide();
    $('.update_activity_button').live('click', UpdateActivity);
});

