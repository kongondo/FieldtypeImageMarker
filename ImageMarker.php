<?php

/* @NOTE: WORK IN PROGRESS */

/**
 * An individual ImageMarker item to be part of an ImageMarkerArray for a Page
 *
 */
class ImageMarker extends WireData {

	/**
	 * We keep a copy of the $page that owns this ImageMarker so that we can follow
	 * its outputFormatting state and change our output per that state
	 *
	 */
	protected $page; 

	/**
	 * Construct a new ImageMarker
	 *
	 */
	public function __construct() {

		// define the fields that represent our ImageMarker (and their default/blank values)
		$this->set('info', 0); 
		$this->set('x', 0); 
		$this->set('y', 0); 
	}

	/**
	 * Set a value to the ImageMarker: date, location or notes
	 *
	 */
	public function set($key, $value) {

		if($key == 'page') {
			$this->page = $value; 
			return $this; 

		} 
		else if($key == 'info' || $key == 'x' || $key == 'y') {
			// int sanitizer
			$value = (int) $value; 
		}

		return parent::set($key, $value); 
	}

	/**
	 * Retrieve a value from the ImageMarker: date, location or notes
	 *
	 */
	public function get($key) {
		$value = parent::get($key); 

		// if the page's output formatting is on, then we'll return formatted values
		if($this->page && $this->page->of()) {
			// int sanitizer
			if($key == 'info' || $key == 'x' || $key == 'y') $value = (int) $value; 
		}

		return $value; 
	}


	/**
	 * Provide a default rendering for an ImageMarker
	 *
	 */
	public function renderImageMarker() {
		// remember page's output formatting state
		$of = $this->page->of();
		// @todo - return page title instead? (i.e. info)
		// turn on output formatting for our rendering (if it's not already on)
		if(!$of) $this->page->of(true);
		$out = "<p><strong>$this->info</strong><br /><em>$this->x</em><br />$this->y</p>";	
		if(!$of) $this->page->of(false); 
		return $out; 
	}

	/**
	 * Return a string representing this ImageMarker
	 *
	 */
	public function __toString() {
		return $this->renderImageMarker();
	}

}

