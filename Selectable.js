/* 
	######################
    ## Selectable Class ##
	######################
*/

// All params should be element ID's (#) except 'checkboxes' (.) - this will be your checkboxes class
var Selectable = function (createDeleteButton, editCancelButton, confirmButton, checkboxes, form, textbox, charCounter,  checkmark, list, charLimit) {

	 // Fields
	this.createDeleteButton = $(createDeleteButton); // Create or Delete button
	this.editCancelButton = $(editCancelButton); // Edit or Cancel button
	this.entryForm = $(form); // Form
	this.textbox = $(textbox); // Input
	this.charCounter = $(charCounter); // For Countable.js
	this.checkmark = $(checkmark); // This is for animating the confirm button
	this.confirmButton = $(confirmButton);
	this.checkboxes = $(checkboxes); // Checkbox containers
	this.checkbox = $(checkboxes + " :checkbox"); // Actual checkboxes
	this.list = $(list); // List of elements 
	this.charLimit = charLimit; // Limit of characters allowed for input (for Countable.js)
	this.startingListSize = $(list + ' li').size(); // Starting list size 
	this.items = []; // [Important - this is what you use to implement something server side] Array of selected elements 

	var THIS_INSTANCE = this; // Save correct context of "this" (JavaScript OOP)

    // Methods
    this.countSelected = function() {
        var selected = new Array();
		
		// See which categroies are selected
		var correctIndex = 0;
		this.checkbox.each(function(index) {
		  if ($(this).prop("checked")) { 
		  	var id = $(this).prop("id").substring(6);
		  	selected[correctIndex] = id;
		  	correctIndex++;
		  }
		  
		});

		// Keep track of selected
		this.items = selected;
		console.log("Items array: " + selected);
		return selected;
    };

    this.deleteSelected = function(_selected) {
    	for (i = 0; i < _selected.length; i++) {
			// Remove category
			$('#' + _selected[i]).slideUp(300, function(){ $('#' + _selected[i]).remove(); });
		}
		
		if (_selected.length > 0) {
			this.items = [];
			this.createDeleteButton.addClass('off').attr('disabled', true);
			//this.createDeleteButton.attr('disabled', true);

			// Reset checkboxes
			this.checkbox.attr('checked', false);
			// Clear this.items
			this.items = [];
		}
    };

    this.add = function(_txt) {
    	var elemID = this.startingListSize + 1;
		this.startingListSize++;
		var element = 
					'<li id="'+elemID+'">'
							+'<div class="checkbox">'
								+'<input type="checkbox" id="catID_'+elemID+'"class="selected" />'
								+'<label for="catID_'+elemID+'"></label>'
							+'</div>'
							+_txt
					+'</li>';
		console.log(element);
		this.list.append(element);
		$('#'+elemID).addClass('animated fadeInUp');
		return elemID;
    };

    this.showCheckboxes = function() {
    	$(checkboxes).removeClass('animated fadeOutLeft').show().addClass('animated fadeInLeft');
		//$(checkboxes).show().addClass('animated fadeInLeft');
    };

    this.hideCheckboxes = function() {
    	$(checkboxes).removeClass('animated fadeInLeft').addClass('animated fadeOutLeft');
		//$(checkboxes).addClass('animated fadeOutLeft');
		//Wait for animation to complete	
		setTimeout(function() {
			$(checkboxes).hide();
		}, 400);	
    };

    this.edit = function() {
    	// Display checkboxes and change "Edit" > "Cancel"
		
		this.editCancelButton.text('Cancel');
		this.showCheckboxes();
		this.createDeleteButton.text('Delete').addClass('off').attr('disabled', true); 
		
    };

    this.cancel = function() {

    	// Cancel "Create"
    	if (THIS_INSTANCE.confirmButton.is(":visible")) {
    		// Clear textbox
			this.textbox.val('');
			
			//  Reposition elements
			this.confirmButton.hide();
			this.createDeleteButton.show();
			this.entryForm.slideUp();
			this.editCancelButton.text('Edit');

			// Change button
			this.createDeleteButton.text('Create').removeClass('off').attr('disabled', false);
    	}
   		
   		// Cancel "Edit"
   		else if (THIS_INSTANCE.confirmButton.is(":visible") == false){
   			this.createDeleteButton.text('Create').removeClass('off').attr('disabled', false);
   			this.editCancelButton.text('Edit');
			
			// Reset checkboxes
			this.hideCheckboxes();
			this.checkbox.attr('checked', false);
			// Clear this.items
			this.items = [];
   		}

		
    };

    this.create = function() {
    	//Replace with form submission button
		this.createDeleteButton.hide();
		this.confirmButton.show();
		this.checkmark.show().addClass('animated bounceIn');
		this.entryForm.slideDown(240);
		this.textbox.focus();
		this.editCancelButton.text('Cancel');
			
		//Setup Char Counter object
		new Countable(this.textbox.get(0), function (counter) {
			// Setup live character counter with Countable.js
			var charsLeft = THIS_INSTANCE.charLimit - counter.all;
			THIS_INSTANCE.charCounter.text(charsLeft);   
		});
    };

    this.confirm = function() {
    	if($(this.confirmButton).is(":visible") == true) {
    		if(this.textbox.val() != "")
    		{
		    	// Ignore extra clicks
				this.confirmButton.attr('disabled', true);
				setTimeout(function() {
					THIS_INSTANCE.confirmButton.attr('disabled', false);
				}, 600);
				// Add the category
				var category = this.textbox.val();
				var elemID = this.add(category);
				// Reassign checks
				this.checkbox = $(checkboxes + " :checkbox");
				
				this.textbox.attr('readonly', true);
				// Rearrange
				this.checkmark.removeClass('animated bounceIn').addClass('animated bounceOut');
				//this.checkmark.addClass('animated bounceOut');
		
				setTimeout(function() {
							
					THIS_INSTANCE.checkmark.removeClass('animated bounceOut').hide();
					//this.checkmark;
					THIS_INSTANCE.confirmButton.hide();
					THIS_INSTANCE.createDeleteButton.fadeIn(300);			
					
					THIS_INSTANCE.entryForm.slideUp(300);	
					
					THIS_INSTANCE.createDeleteButton.removeClass('off').attr('disabled', false).text('Create');
					//this.createDeleteButton.attr('disabled', false);
					//this.createDeleteButton.text('Create');
					
					THIS_INSTANCE.editCancelButton.text('Edit');
					THIS_INSTANCE.textbox.val('').attr('readonly', false);
					//this.textbox.attr('readonly', false);
					
					// Enable checkboxes
					THIS_INSTANCE.checkboxes.removeClass('off').attr('disabled', false);
					//this.checkboxes.attr('disabled', false);
					
				}, 500);
			}
		}
    };

    // Events
    this.createDeleteButton.click(function() {
		// If button is "Create"
		if(THIS_INSTANCE.createDeleteButton.text() == "Create") 
			THIS_INSTANCE.create();	

		// If button is "Delete"
		else if(THIS_INSTANCE.createDeleteButton.text() == "Delete") 
			THIS_INSTANCE.deleteSelected(THIS_INSTANCE.countSelected());	
		
	});

	this.confirmButton.click(function() {
		THIS_INSTANCE.confirm();
	});

	this.editCancelButton.click(function() {
		// If button is "Edit"
		if (THIS_INSTANCE.confirmButton.is(":visible") == false){
			if (THIS_INSTANCE.editCancelButton.text() == "Edit")
				THIS_INSTANCE.edit();
			
			else if (THIS_INSTANCE.editCancelButton.text() == "Cancel") 
				THIS_INSTANCE.cancel();
		}
		
		// If button is "Cancel"
		else if (THIS_INSTANCE.confirmButton.is(":visible")) 
			THIS_INSTANCE.cancel();
		    	       
	});

	$(document).on("change", this.checkbox, function(event) {
		// Refresh selected array
		var selected = THIS_INSTANCE.countSelected();	
				
		// Toggle "Delete" Button
		if (selected.length > 0) {
			// Enable "Delete" Button
			THIS_INSTANCE.createDeleteButton.removeClass('off').attr('disabled', false);
		}
				
		else 
			THIS_INSTANCE.createDeleteButton.addClass('off').attr('disabled', true);
	});
	
};

