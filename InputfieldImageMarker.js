$(document).ready(function() {

	/*************************************************************/
	// FUNCTIONS

	// remove 'highlight' css class from given element
	removeClass = function (elem) {
	   $(elem).removeClass('highlighted');
	}

	// function to set cookie to remember last select for number of rows to show in coordinates' table per pagination
	setCookie = function (key, value) {
		document.cookie = key + '=' + value + ';expires=0';
	}

	// function to get cookie about last select for number of rows to show in coordinates' table per pagination
	getCookie = function (key) {
		var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
		return keyValue ? keyValue[2] : null;
	}

	getMarkerPage = function(row) {
		var pages = $('span.page-number[data-first-row]');
		// if no pagination, return
		if(pages.length === 0) return;
		var pageNums = $(pages).filter(function () {
							return $(this).data('first-row') > row;
						});
		// get the first page whose first row is greater than the row we want
		// our row will be the first previous page to this one
		var markerPage = pageNums.first().prev(); 
		// if we did not get a marker page, it means our row is on the last page, so we grab the last page
		if(markerPage.length === 0) markerPage = pages.last();
		// if our row is already on the current page, we do nothing, else we click our row's page number
		if(!markerPage.hasClass('active')) markerPage.click();
	}


	paginateTable = function(numPerPage){

		// @ Original code by: Gabriele Romanato http://gabrieleromanato.name/jquery-easy-table-pagination/
		// @ Modified by Francis Otieno (Kongondo) for the ProcessWire Module InputfieldImageMarker

		if($('div.pager')) $('div.pager').remove();// remove last inserted pagination to avoid duplicates (.ready vs .change)

		$('table.InputfieldImageMarkers').each(function() {
		
			var $table = $(this);
			var currentPage = 0;
			// if not paginating, show whole table then return to avoid recursion error
			if(numPerPage == 0) {
				$table.find('tbody tr').show();
				return;
			}

			$table.bind('repaginate', function() {
				$table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
			});
			$table.trigger('repaginate');
			var numRows = $table.find('tbody tr').length;

			if(numRows <= numPerPage) return;// if only 1 page, no need to show pagination

			var numPages = Math.ceil(numRows / numPerPage);
			var $pager = $('<div class="pager"></div>');
			for (var page = 0; page < numPages; page++) {
				var lastRow = (page + 1) * numPerPage;// we need this for 'on click marker, show its page'
				var firstRow = (lastRow - numPerPage) + 1;// ditto
				$('<span class="page-number" data-first-row="' + firstRow + '"></span>').text(page + 1).bind('click', {
				newPage: page
				}, function(event) {
					currentPage = event.data['newPage'];
					$table.trigger('repaginate');
					$(this).addClass('active').siblings().removeClass('active');
				}).appendTo($pager).addClass('clickable');
			}// end for loop
			$pager.appendTo($('div.pagination_wrapper')).find('span.page-number:first').addClass('active');	

		});	

	};

	/*************************************************************/
	// GLOBALS
	w = $('div.fieldContainer').width();//@todo: doesn't work in IE (needs innerWidth)
	h = $('div.fieldContainer').height();// @todo: ditto
	numPerPage = 0;// number of rows per page in paginated coordinates' table	

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
		var dataRow = $(this).attr('data-row');
		var row = $('tr[data-marker="' + id + '"]');// current row
		if(row) {
			removeClass('tr');// remove highlight from previous highlighted row
			if($(this).hasClass('highlighted')) {
				$(this).removeClass('highlighted');
			}
			else {
				removeClass('div');// remove highlight from previously highlighted marker div
				$(this).addClass('highlighted');// highlight current marker div
				row.addClass('highlighted');// highlight correspodning row for this marker div
			}
		
			// if necessary, on click marker, jump to its page in a paginated coordinates' table
			getMarkerPage(dataRow);
		}
	});
});

/* marker tooltip */
$(document).ready(function() {
	$(document).tooltip();
});

/* coordinates' table pagination */
$(document).ready(function() {
	// on load pagination
	limit = $('#limit');
	var v = limit.val();
	setCookie('coordinatesTableRows', v);// what's currently selected in select for coordinates' table pagination control
	if(v === 'All') v = 0;
	numPerPage = v;	
	paginateTable(numPerPage);
	/* @note: to stop flash of 'long' non-paginated table before pagination kicks in here (table is initally hidden using css) */
	$("table.InputfieldImageMarkers").show();
	
	// on select change, repaginate
	limit.on('change', function(){
		numPerPage = limit.val();
		if(numPerPage === 'All') numPerPage = 0;
		setCookie('coordinatesTableRows', limit.val());
		paginateTable(numPerPage);
	});
});

/* disable selection of marker pages already in coordinates' table */
//

$(document).ready(function () {

	// get all IDs of marker pages already in coordinates' table
	var allSelected = $("table.InputfieldImageMarkers input.marker_info").map(function () {
		return $(this).val();
	}).get();

	// get all available marker pages options in asmSelect
	var allOptions = $("#marker_add_infopages option").map(function () {return $(this).val();
	}).get();     

	// in the marker pages asmSelect, specify as 'selected' (hence disabled [via asmSelect])
	// all marker pages that are already in coordinates table
	// comparison is by ID, hence foolproof
	// 'selected' attributed will make asmSelect display the <ol> list of already selected pages below the select
	// this is not desirable in our case. We remove the list after this (see below)
	$("#marker_add_infopages option:not(:selected):not([value='0'])").each(function () {
		if ($.inArray($(this).val(), allSelected) != -1) $(this).attr('selected', true);
		// @note: this will cause newly deleted items to be sent also as newly added since in $this, they will be marked as 'selected'
		// we deal with that server-side
	});

});

/* remove list of selected pages in ordered list in asmSelect */
// this works in conjuction with above
// @note: may not work in some (older) browsers
$(document).on('DOMNodeInserted', function(e) {
    if ($(e.target).is('#wrap_marker_add_infopages #asmList0')) {
       //element with #xxx was inserted.
       var asmOList = ($(e.target));// asmSelect ordered list of selected items
       //asmOList.children().addClass('hidden_lists');
       //asmOList.children().hide();       
       // fastest just to remove them @note: this doesn't affect new items being added
       asmOList.children().remove();
    }

});



