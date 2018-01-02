/** 
 *
 * Javascript file for PW Module InputfieldImageMarker.
 *
 * @author Francis Otieno (Kongondo) <kongondo@gmail.com>. *
 * @author Helder Cervantes (heldercervantes).
 * 
 * https://github.com/kongondo/FieldtypeImageMarker.
 * Created March 2015, major update December 2017.
 *
 */

function InputfieldImageMarker($) { 
	
	/*************************************************************/
	// SCRIPT GLOBAL VARIABLES
	
	/*	@note:
		- global variables NOT prefixed with '$'.
		- function parameters and variables PREFIXED with '$'
	*/

	//var someVar, anotherVar;    


    /*************************************************************/
	// FUNCTIONS	
 
	/**
	 * Set cookie to remember last select for number of rows to show in coordinates' table per pagination.
	 * 
	 * @param string $key Cookie name.
	 * @param integer $value Value of cookie.
	 * 
	 */
	function setCookie($key, $value) {
		document.cookie = $key + '=' + $value + ';expires=0';
	}
 
	/**
	 * Retrieve cookie about last select for number of rows to show in coordinates' table per pagination.
	 * 
	 * @param string $key The name of the cookie to get.
	 * 
	 */
	function getCookie ($key) {
		var $keyValue = document.cookie.match('(^|;) ?' + $key + '=([^;]*)(;|$)');
		return $keyValue ? $keyValue[2] : null;
	}
 
	/**
	 * Get the corresponding page of a marker.
	 * 
	 * @param object $row Row in the table where marker lives.
	 * @param integer $rowNumber Row number in the table where marker lives.
	 * 
	 */
	function getMarkerPage($row, $rowNumber) {		
		var $parent = $row.parents('div.image_marker_main_wrapper');
		// row number (corresponding to this $dataMarker)
		var $pages = $parent.find('li.page-number[data-first-row]');
		// if no pagination, return
		if ($pages.length === 0) return;
		// get the first page whose first row is greater than the row we want
		var $pageNums = $($pages).filter(function () {
			return $(this).data('first-row') > $rowNumber;
		});		
		// our row will be the first previous page to this one
		var $markerPage = $pageNums.first().prev(); 
		// if we did not get a marker page, it means our row is on the last page, so we grab the last page
		if($markerPage.length === 0) $markerPage = $pages.last();
		// if our row is already on the current page, we do nothing, else we click our row's page number
		if (!$markerPage.hasClass('MarkupPagerNavOn')) $markerPage.click();
	}
 
	/**
	 * Paginate a HTML Table on the fly.
	 * 
	 * Used to paginate table that lists markers.
	 * 
	 * @param object|null $t Table to paginate.
	 * 
	 */
	function paginateTable($t = null) {

		// @ Original code by: Gabriele Romanato http://gabrieleromanato.name/jquery-easy-table-pagination/
		// @ Modified by Francis Otieno (Kongondo) for the ProcessWire Module InputfieldImageMarker

		var $tables = $t ? $t : $('table.InputfieldImageMarkers');

		$tables.each(function () {

			var $table = $(this);
			var $parent = $table.parents('div.image_marker_main_wrapper');
			
			var $limit = $parent.find('select.limit');
			var $limitValue = $limit.val();				
			$cookieName = $table.attr('id');		
			
			// sete cookie to remember (server-side) pagination limit
			setCookie($cookieName, $limitValue);
			var $numPerPage = $limitValue;
			
			// remove last inserted pagination to avoid duplicates (.ready vs .change)
			$parent.find('ul.pager').remove();
			
			$table.show();
			
			var $currentPage = 0;
			// if not paginating, show whole table then return to avoid recursion error
			if($numPerPage == 0) {
				$table.find('tbody tr').show();
				return;
			}			

			$table.bind('repaginate', function() {
				$table.find('tbody tr').hide().slice($currentPage * $numPerPage, ($currentPage + 1) * $numPerPage).show();
			});
			$table.trigger('repaginate');
			var $numRows = $table.find('tbody tr').length;

			if($numRows <= $numPerPage) return;// if only 1 page, no need to show pagination

			var $numPages = Math.ceil($numRows / $numPerPage);
			var $pager = $('<ul class="pager uk-pagination MarkupPagerNav"></ul>');
			
			for (var $page = 0; $page < $numPages; $page++) {
				var $lastRow = ($page + 1) * $numPerPage;// we need this for 'on click marker, show its page'
				var $firstRow = ($lastRow - $numPerPage) + 1;// ditto
				var $innerText = $('<span></span>').text($page + 1);
				var $outterText = $('<a href="#"></a>').append($innerText);
				$('<li class="page-number" data-first-row="' + $firstRow + '"></li>')
					.html($outterText)
					.bind('click', {
						newPage: $page
					},
					function (event) {
						$currentPage = event.data['newPage'];
						$table.trigger('repaginate');
						$(this).addClass('uk-active MarkupPagerNavOn ').siblings().removeClass('uk-active MarkupPagerNavOn');
					}).appendTo($pager);
			}// end for loop
			
			// mark active
			var $paginationWrapper = $parent.find('div.pagination_wrapper');
			$pager.appendTo($paginationWrapper).find('li:first').addClass('uk-active MarkupPagerNavOn');			

		});	
 
	}

	/**
	 * Initialise coordinates' table pagination.
	 * 
	 */
	function coordinatesTablePagination() {
		// on load pagination
		paginateTable();
		// on change pagination (on select change, repaginate)
		$('div.image_marker_main_wrapper').on("change", "select.limit", function(){
			var $parent = $(this).parents('div.image_marker_main_wrapper');
			var $table = $parent.find('table.InputfieldImageMarkers');
			paginateTable($table);
		});
	}

	/**
	 * Delete a row in the table listing markers.
	 * 
	 * Adapted from @rc FieldtypeEvents.
	 * 
	 * @param object $a The anchor trash icon.
	 * 
	 */
	function deleteTableRows($a) {
		
		var $row = $a.parents("tr.ImageMarker");
		if ($row.size() == 0) {
			// delete all			
			var $table = $a.parents("table.InputfieldImageMarkers");
			$table.find('tbody a.ImageMarkerDel').click();
			return false;
		}

		var $input = $a.next('input');
		if($input.val() == 1) {
			$input.val(0);			
			$row.removeClass('NoticeError uk-alert-danger');
		}
		else {
			$input.val(1);
			$row.addClass("NoticeError uk-alert-danger");
			
		}
		
		return false;
		
	}

	/**
	 * Disable selection of marker pages already in coordinates' table.
	 * 
	 * Page selector is an Asm select.
	 * 
	 */
	function disableMarkerPagesSelection() {

		var $imCoordinatesTables = $('div.image_marker_main_wrapper table.InputfieldImageMarkers');
		
		$imCoordinatesTables.each(function () {

			var $table = $(this);
			var $parent = $table.parents('div.image_marker_main_wrapper');
			var $allSelected = $table.find("input.marker_info").map(function () {
				return $(this).val();
			}).get();

			$parent.find(".marker_add_infopages option:not(:selected):not([value='0'])").each(function () {
				if ($.inArray($(this).val(), $allSelected) != -1) $(this).attr('selected', true);
				// @note: this will cause newly deleted items to be sent also as newly added since in $this, they will be marked as 'selected'
				// we deal with that server-side
			});
		
		});


	}

	/**
	 * Remove list of selected pages in ordered list in asmSelect.
	 * 
	 * @param event $e Event triggered in DOMNodeInserted.
	 * 
	 */
	function removeAsmList($e) {
		if ($($e.target).is('div.image_marker_main_wrapper li.InputfieldAsmSelect ol.asmList')) {
			// element with #xxx was inserted.
			var $asmOList = ($($e.target));// asmSelect ordered list of selected items
			// fastest just to remove them @note: this doesn't affect new items being added
			$asmOList.children().remove();
		}		
	}

	/**
	 * Init sortable table of coordinates.
	 * 
	 * Includes fixed-width table fix.
	 * @credits: https://paulund.co.uk/fixed-width-sortable-tables
	 * 
	 */
	function initSortableCoordinatesTable() {

		$('table.sortable tbody').sortable({
			containment: 'parent',
			helper: fixWidthHelper
		}).disableSelection();

		// fixed width solution
		function fixWidthHelper(e, ui) {
			ui.children().each(function() {
				$(this).width($(this).width());			
			});
			return ui;
		}
				
	}

	/**
	 * initialise draggable on  markers.
	 * 
	 */
	function initDraggable() {
		
		// @hc with additional code from @kongondo	

		var $wrappers = $('div.image_marker_main_wrapper');

		$wrappers.each(function () {
			
			var $parent = $(this);
			var $fieldContainer = $parent.find('div.fieldContainer');
			var $containment = $fieldContainer.find('img.marker_base_image');
			var $markers = $parent.find('div.marker');

			$($markers).draggable({
				// restrict dragging to within the image area only
				containment: $containment,				
				drag: function (e) {
					var $w = $fieldContainer.width();
					var $h = $fieldContainer.height();
					// remove highlight from previously highlighted marker div			
					$markers				
						.filter('.highlighted')
						.removeClass('highlighted');
	
					// highlight marker being dragged
					$(this).addClass('highlighted');
					var $id = $(this).attr('id');
	
					/*	we use IDs to identify unique markers (divs) as well as their corresponding x/y input coordinates
						the div ID is built as: 'marker_1234' where 1234 is the ID of the info page
						each coordinate has a data attribute (data-marker) corresponding to its marker div
						x-coordinate data-marker = 'marker_1234_x'
						y-coordinate data-marker = 'marker_1234_y'
					*/
	
					$parent.find('input[data-marker="' + $id +'_x"]').val(Math.floor($(this).position().left/$w * 100));
					$parent.find('input[data-marker="' + $id +'_y"]').val(Math.floor($(this).position().top/$h * 100));
					//$('input[data-marker="' + $id +'_x"]').val(Math.floor($(this).position().left));
					//$('input[data-marker="' + $id +'_y"]').val(Math.floor($(this).position().top));
	
					var $dataRow = $parent.find('table.InputfieldImageMarkers tbody tr[data-marker="' + $id + '"]');
					if ($dataRow) {			
						// remove highlight from previous highlighted row
						var $prevDataRow = $parent.find('table.InputfieldImageMarkers tbody tr.ImageMarker.uk-alert-primary');
						$prevDataRow.removeClass('NoticeMessage uk-alert-primary');
						// highlight table row of current info pages + coordinates
						$dataRow.addClass('NoticeMessage uk-alert-primary');
					}	
				},// end drag:				
			});// end draggable
	
		});// end $wrappers.each()

	}

	/**
	 * Highlight corresponding coordinates' table row on 'marker' click.
	 * 
	 * @param object $dataMarker The div representing a marker that has been clicked.
	 * 
	 */
	function highlightRow($dataMarker) {
		
		var $parent = $dataMarker.parents('div.image_marker_main_wrapper');

		var $id = $dataMarker.attr('id');
		
		// row number (corresponding to this $dataMarker)
		var $rowNumber = $dataMarker.attr('data-row');
		
		// current row (object)
		var $dataRow = $parent.find('table.InputfieldImageMarkers tbody tr[data-marker="' + $id + '"]');
	
		if ($dataRow) {			
			// remove highlight from previous highlighted row
			var $prevDataRow = $parent.find('table.InputfieldImageMarkers tbody tr.ImageMarker.uk-alert-primary');
			$prevDataRow.removeClass('NoticeMessage uk-alert-primary');
			
			if ($dataMarker.hasClass('highlighted')) $dataMarker.removeClass('highlighted');
			else {
				$parent.find('div.marker.highlighted').removeClass('highlighted');				
				// highlight current marker div
				$dataMarker.addClass('highlighted');
				// highlight correspodning row for this marker div
				$dataRow.addClass('NoticeMessage uk-alert-primary');
			}
		
			// if necessary, on click marker, jump to its page in a paginated coordinates' table
			getMarkerPage($dataRow, $rowNumber);

		}

	}

	/**
	 * Highlight corresponding 'marker' on click coordinates' table row.
	 * 
	 * @param object $dataRow The row in the table that has been clicked.
	 * 
	 */
	function highlightMarker($dataRow) {
		
		var $parent = $dataRow.parents('div.image_marker_main_wrapper');
		
		// current marker div
		var $dataMarkerID = $dataRow.attr('data-marker');
		var $dataMarker = $parent.find('div#'+ $dataMarkerID);
		if($dataMarker) {
			// remove highlight from previously highlighted marker div
			var $prevDataMarker = $parent.find('div.marker.highlighted');
			$prevDataMarker.removeClass('highlighted');
			if($dataRow.hasClass('uk-alert-primary')) $dataRow.removeClass('NoticeMessage uk-alert-primary');
			else {
				// remove highlight from previous highlighted row
				var $prevDataRow = $parent.find('table.InputfieldImageMarkers tbody tr.ImageMarker.uk-alert-primary');
				$prevDataRow.removeClass('NoticeMessage uk-alert-primary');
				// highlight current row
				$dataRow.addClass('NoticeMessage uk-alert-primary');
				// highlight corresponding marker div
				$dataMarker.addClass('highlighted');
			}
		}

	}

	/**
	 * Initialise this script.
	 *
	 */
	function init() {
		
		
		/* delete table rows */
		$(document).on("click", ".InputfieldImageMarkers a.ImageMarkerDel", function (e) {
			e.preventDefault();
			e.stopPropagation();
			deleteTableRows($(this))
		});

		/* initialise draggable on markers */
		initDraggable();
		
		/* Highlight corresponding coordinates' table row on 'marker' click */
		$(document).on("click", ".fieldContainer div.marker", function (e) {highlightRow($(this))});
		/* Highlight corresponding'marker' on click coordinates' table row */
		$(document).on("click", ".InputfieldImageMarkers tbody tr", function (e) { highlightMarker($(this)) });
		
		/* marker tooltip */
		$('div.fieldContainer div.marker').tooltip();

		/* coordinates' table pagination */
		coordinatesTablePagination();
		$('div.image_marker_main_wrapper').on("click", "div.pagination_wrapper ul.MarkupPagerNav li a", function (e) {
			e.preventDefault();
			e.stopPropagation();
		});

		/* disable selection of marker pages already in coordinates' table */
		disableMarkerPagesSelection();

		/* remove list of selected pages in ordered list in asmSelect */
		// this works in conjuction with above
		// @note: may not work in some (older) browsers
		$(document).on('DOMNodeInserted', function (e) { removeAsmList(e) });
		
		/* sortable table of coordinates */
		initSortableCoordinatesTable();

	}

	// initialise script 
	init();

	// @TODO?...WIP...INIT FOR REPEATERS; CURRENTLY DOESN'T WORK ON REPEATER OPEN
	/* $(document).on('loaded reloaded opened openReady repeateradd', function () {
		// give repeater item time to load
		setTimeout(function(){
			init();
		},700);
	}); */

}// END InputfieldImageMarker()


/*************************************************************/
// READY

jQuery(document).ready(function($) {
	InputfieldImageMarker($);
});


