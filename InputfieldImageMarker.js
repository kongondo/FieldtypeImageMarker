/* @NOTE: WORK IN PROGRESS */
$(document).ready(function() {

	/*************************************************************/
	// FUNCTIONS

	// remove 'highlight' css class from given element
	removeClass = function (elem) {
	   $(elem).removeClass('highlighted');
	}

	/*************************************************************/
	// GLOBALS
	w = $('div.fieldContainer').width();
	h = $('div.fieldContainer').height();

});

// @rc (events fieldtype)
$(document).ready(function() {

	/* delete table rows */
	$(document).on("click", ".InputfieldImageMarkers a.ImageMarkerDel", function(e) {
		var $row = $(this).parents("tr.ImageMarker");
		if($row.size() == 0) {
			// delete all
			$(this).parents("thead").next("tbody").find('.ImageMarkerDel').click();
			return false;
		}
		var $input = $(this).next('input');
		if($input.val() == 1) {
			$input.val(0);
			$row.removeClass("ImageMarkerTBD");
			$row.removeClass('ui-state-error');
		} else {
			$input.val(1);
			$row.addClass("ImageMarkerTBD");
			$row.addClass('ui-state-error');
		}
		return false;
	});


});

// @hc with additional code from @kongondo
$(document).ready(function() {
	$('.marker').draggable({
		containment: '#marker_base_image',// restrict dragging to within the image area only
		drag: function(e) {
			removeClass('div');// remove highlight from previously highlighted marker div
			$(this).addClass('highlighted');
			var id = $(this).attr('id');
			// we use IDs to identify unique markers (divs) as well as their corresponding x/y input coordinates
			// the div ID is built as: 'marker_1234' where 1234 is the ID of the info page
			// each coordinate has a data attribute (data-marker) corresponding to its marker div
			// x-coordinate data-marker = 'marker_1234_x'
			// y-coordinate data-marker = 'marker_1234_y'

			$('input[data-marker="' + id +'_x"]').val(Math.floor($(this).position().left/w * 100));
			$('input[data-marker="' + id +'_y"]').val(Math.floor($(this).position().top/h * 100));
			//$('input[data-marker="' + id +'_x"]').val(Math.floor($(this).position().left));
			//$('input[data-marker="' + id +'_y"]').val(Math.floor($(this).position().top));

			var row = $('tr[data-marker="' + id + '"]');
			if(row) {
				removeClass('tr');// remove highlight from previous highlighted row
				row.addClass('highlighted');// highlight table row of current info pages + coordinates
			}
		}
	});
});

/* Highlight corresponding'marker' on click coordinates' table row */
$(document).ready(function () {
	$('tr').click(function (e) {
		var dm = $(this).attr('data-marker');
		var d = $('div#' + dm);// current marker div
		if(d) {
			removeClass('div');// remove highlight from previously highlighted marker div
			if($(this).hasClass('highlighted')) {
				$(this).removeClass('highlighted');
			}
			else {
				removeClass('tr');// remove highlight from previous highlighted row
				$(this).addClass('highlighted');// highlight current row
				d.addClass('highlighted');// highlight corresponding marker div
			}
		}
	});
});


/* Highlight corresponding coordinates' table row on 'marker' click */
$(document).ready(function () {
	$('div.marker').click(function (e) {
		var id = $(this).attr('id');
		var row = $('tr[data-marker="' + id + '"]');// current row
		if(row) {
			removeClass('tr');// remove highlight from previous highlighted row
			if($(this).hasClass('highlighted')) {
				$(this).removeClass('highlighted');
			}
			else {
				removeClass('div');// remove highlight from previously highlighted marker div ????
				$(this).addClass('highlighted');// highlight current marker div
				row.addClass('highlighted');// highlight correspodning row for this marker div
			}
		}
	});
});

/* marker tooltip */
$(document).ready(function() {
	$(document).tooltip();
});
